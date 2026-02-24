import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import prisma from '@/app/lib/prisma';
import { saveToken } from '@/services/tokenService';

/**
 * GET /api/integrations/callback/linkedin
 * Handles LinkedIn OAuth authorization code callback.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') return res.status(405).end();

    const { code, state, error, error_description } = req.query as Record<string, string>;

    if (error) {
        console.error('[LinkedIn OAuth] Error:', error, error_description);
        return res.redirect(`/integrations?error=${encodeURIComponent(error_description ?? error)}`);
    }

    if (!code || !state) {
        return res.status(400).json({ message: 'Missing code or state' });
    }

    // Decode state
    let businessId: number;
    let integrationId: number;
    try {
        const decoded = JSON.parse(Buffer.from(state, 'base64').toString('utf8'));
        businessId = decoded.businessId;
        integrationId = decoded.integrationId;
    } catch {
        return res.status(400).json({ message: 'Invalid state parameter' });
    }

    const callbackUrl = `${process.env.BASEURL}/api/integrations/callback/linkedin`;

    try {
        // Exchange authorization code for access token
        const tokenRes = await axios.post(
            'https://www.linkedin.com/oauth/v2/accessToken',
            new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: callbackUrl,
                client_id: process.env.LINKEDIN_CLIENT_ID!,
                client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
            }).toString(),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }
        );

        const {
            access_token,
            expires_in,         // seconds — typically 5183944 (~60 days)
            refresh_token,
            refresh_token_expires_in,
        } = tokenRes.data;

        const expiresAt = new Date(Date.now() + expires_in * 1000);

        // Save encrypted token
        await saveToken({
            integrationId,
            businessId,
            provider: 'linkedin',
            accessToken: access_token,
            refreshToken: refresh_token ?? null,
            expiresAt,
        });

        // Fetch LinkedIn member profile to get account name
        let accountName = 'LinkedIn Account';
        try {
            const profileRes = await axios.get('https://api.linkedin.com/v2/me', {
                headers: { Authorization: `Bearer ${access_token}` },
            });
            const { localizedFirstName, localizedLastName } = profileRes.data;
            accountName = `${localizedFirstName} ${localizedLastName}`.trim();
        } catch (profileErr) {
            console.warn('[LinkedIn] Could not fetch profile:', profileErr);
        }

        // Mark integration as connected
        await prisma.integration.update({
            where: { id: integrationId },
            data: {
                status: 'connected',
                account_name: accountName,
                last_sync: new Date(),
                last_sync_status: 'pending',
            },
        });

        // Trigger an immediate poll in the background
        fetch(`${process.env.BASEURL}/api/integrations/poll/linkedin?integrationId=${integrationId}`, {
            method: 'POST',
            headers: { 'x-internal-secret': process.env.INTERNAL_SECRET ?? 'internal' },
        }).catch(() => {/* non-critical */ });

        return res.redirect('/integrations?connected=linkedin');
    } catch (err: any) {
        console.error('[LinkedIn OAuth] Token exchange failed:', err.response?.data ?? err.message);

        await prisma.integration.update({
            where: { id: integrationId },
            data: { status: 'error' },
        }).catch(() => { });

        return res.redirect(`/integrations?error=${encodeURIComponent('LinkedIn token exchange failed')}`);
    }
}
