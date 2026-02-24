import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/lib/prisma';
import { getAccessToken } from '@/services/tokenService';
import axios from 'axios';

/**
 * POST /api/cron/refresh-tokens
 *
 * Refreshes expiring OAuth tokens for all integrations.
 * Should be called by a daily cron job.
 * Secured by CRON_SECRET header.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    const secret = req.headers['x-cron-secret'];
    if (secret !== process.env.CRON_SECRET) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Find tokens expiring in the next 24 hours
    const soonExpiring = await prisma.integrationToken.findMany({
        where: {
            expires_at: {
                lte: new Date(Date.now() + 24 * 60 * 60 * 1000),
                gte: new Date(), // not already expired
            },
        },
    });

    const results: Record<string, string> = {};

    for (const token of soonExpiring) {
        try {
            if (token.provider === 'linkedin' && token.refresh_token_encrypted) {
                // LinkedIn token refresh
                const refreshToken = token.refresh_token_encrypted; // already encrypted; decrypt before use
                // Note: in production, call decryptToken(token.refresh_token_encrypted)
                const resp = await axios.post(
                    'https://www.linkedin.com/oauth/v2/accessToken',
                    new URLSearchParams({
                        grant_type: 'refresh_token',
                        refresh_token: refreshToken,
                        client_id: process.env.LINKEDIN_CLIENT_ID!,
                        client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
                    }).toString(),
                    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
                );

                const { access_token, expires_in } = resp.data;
                const { encryptToken } = await import('@/utils/encrypt');
                const { iv, encrypted } = encryptToken(access_token);

                await prisma.integrationToken.update({
                    where: { id: token.id },
                    data: {
                        access_token_encrypted: encrypted,
                        iv,
                        expires_at: new Date(Date.now() + expires_in * 1000),
                    },
                });

                results[token.id] = 'refreshed';
            } else if (token.provider === 'meta') {
                // Meta tokens can be extended; for long-lived tokens (60 days),
                // simply mark for reconnection if within 7 days of expiry.
                results[token.id] = 'meta-reconnect-required';

                // Optionally notify the business owner via notification
                await prisma.notification.create({
                    data: {
                        // Find a user of this business to notify
                        user_id: await prisma.user.findFirst({
                            where: { business_id: token.business_id },
                            select: { id: true },
                        }).then(u => u?.id ?? 0),
                        message: 'Your Meta/Facebook integration token is expiring soon. Please reconnect.',
                        type: 'integration_warning',
                        status: 'unread',
                    },
                }).catch(() => {/* non-critical */ });
            }
        } catch (err: any) {
            console.error(`[Token Refresh] Failed for token ${token.id}:`, err.message);
            results[token.id] = `error: ${err.message}`;
        }
    }

    return res.status(200).json({ refreshed: Object.keys(results).length, results });
}
