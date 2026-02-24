import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import prisma from '@/app/lib/prisma';
import { saveToken } from '@/services/tokenService';

/**
 * GET /api/integrations/callback/meta?code=xxx&state=xxx
 * Meta redirects back here after user grants permission.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') return res.status(405).end();

    const { code, state, error, error_description } = req.query as Record<string, string>;

    if (error) {
        console.error('Meta OAuth error:', error, error_description);
        return res.redirect(`/integrations?error=${encodeURIComponent(error_description ?? error)}`);
    }

    if (!code || !state) {
        return res.status(400).json({ message: 'Missing code or state' });
    }

    // Decode businessId from state
    const businessId = parseInt(Buffer.from(state, 'base64').toString('utf8'), 10);
    if (isNaN(businessId)) return res.status(400).json({ message: 'Invalid state' });

    try {
        // Exchange code for short-lived token
        const tokenRes = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
            params: {
                client_id: process.env.META_APP_ID,
                client_secret: process.env.META_APP_SECRET,
                redirect_uri: `${process.env.BASEURL}/api/integrations/callback/meta`,
                code,
            },
        });

        const shortToken: string = tokenRes.data.access_token;

        // Exchange for long-lived token (60 days)
        const longTokenRes = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
            params: {
                grant_type: 'fb_exchange_token',
                client_id: process.env.META_APP_ID,
                client_secret: process.env.META_APP_SECRET,
                fb_exchange_token: shortToken,
            },
        });

        const { access_token, expires_in } = longTokenRes.data;

        // Find or create Integration record
        let integration = await prisma.integration.findFirst({
            where: { business_id: businessId, provider: 'meta' },
        });

        if (integration) {
            integration = await prisma.integration.update({
                where: { id: integration.id },
                data: { status: 'connected', display_name: 'Facebook & Instagram Ads' },
            });
        } else {
            integration = await prisma.integration.create({
                data: {
                    business_id: businessId,
                    provider: 'meta',
                    display_name: 'Facebook & Instagram Ads',
                    status: 'connected',
                    webhook_secret: process.env.META_WEBHOOK_VERIFY_TOKEN,
                },
            });
        }

        // Save encrypted token
        await saveToken({
            businessId,
            integrationId: integration.id,
            provider: 'meta',
            accessToken: access_token,
            expiresIn: expires_in ?? 5183944, // ~60 days
            scopes: ['leads_retrieval', 'pages_manage_ads'],
        });

        // Register webhook subscription (best-effort)
        await registerMetaWebhook(access_token, integration.id, businessId).catch(
            (err) => console.warn('Meta webhook subscription failed:', err.message)
        );

        return res.redirect('/integrations?success=meta_connected');

    } catch (err: any) {
        console.error('Meta callback error:', err.response?.data ?? err.message);

        // Mark as error
        await prisma.integration.updateMany({
            where: { business_id: businessId, provider: 'meta' },
            data: { status: 'error' },
        }).catch(() => { });

        return res.redirect(`/integrations?error=${encodeURIComponent('Meta connection failed')}`);
    }
}

async function registerMetaWebhook(accessToken: string, integrationId: number, businessId: number) {
    // Get all pages the user manages
    const pagesRes = await axios.get('https://graph.facebook.com/v18.0/me/accounts', {
        params: { access_token: accessToken, fields: 'id,name,access_token' },
    });

    const pages: any[] = pagesRes.data?.data ?? [];
    const webhookUrl = `${process.env.BASEURL}/api/webhooks/meta`;

    for (const page of pages) {
        // Subscribe this page's app to leadgen events
        await axios.post(
            `https://graph.facebook.com/v18.0/${page.id}/subscribed_apps`,
            null,
            {
                params: {
                    subscribed_fields: 'leadgen',
                    access_token: page.access_token,
                },
            }
        ).catch((e) => console.warn(`Page ${page.id} subscription failed:`, e.message));
    }

    console.log(`Registered Meta webhooks for ${pages.length} page(s), integration ${integrationId}`);
}
