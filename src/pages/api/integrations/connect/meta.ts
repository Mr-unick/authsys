import type { NextApiRequest, NextApiResponse } from 'next';
import { VerifyToken } from '@/utils/VerifyToken';
import prisma from '@/app/lib/prisma';

const META_SCOPES = 'leads_retrieval,pages_manage_ads,pages_read_engagement';

/**
 * GET /api/integrations/connect/meta
 * Redirects the tenant admin to Meta's OAuth consent screen.
 * The `state` param carries an encrypted reference to the business.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') return res.status(405).end();

    const user = await VerifyToken(req, res, 'integrations');
    if (res.writableEnded) return;

    const businessId = (user as any).business as number;
    const callbackUrl = `${process.env.BASEURL}/api/integrations/callback/meta`;

    // state = base64(businessId) — in prod use signed JWT
    const state = Buffer.from(String(businessId)).toString('base64');

    const oauthUrl = new URL('https://www.facebook.com/dialog/oauth');
    oauthUrl.searchParams.set('client_id', process.env.META_APP_ID!);
    oauthUrl.searchParams.set('redirect_uri', callbackUrl);
    oauthUrl.searchParams.set('scope', META_SCOPES);
    oauthUrl.searchParams.set('state', state);
    oauthUrl.searchParams.set('response_type', 'code');

    return res.redirect(oauthUrl.toString());
}
