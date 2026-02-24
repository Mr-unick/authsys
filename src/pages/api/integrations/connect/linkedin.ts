import type { NextApiRequest, NextApiResponse } from 'next';
import { VerifyToken } from '@/utils/VerifyToken';
import prisma from '@/app/lib/prisma';

const LINKEDIN_SCOPES = 'r_liteprofile r_emailaddress r_ads_leadgen_automation';

/**
 * GET /api/integrations/connect/linkedin
 * Initiates LinkedIn OAuth flow — redirects to LinkedIn authorization URL.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') return res.status(405).end();

    const user = await VerifyToken(req, res, 'integrations');
    if (res.writableEnded) return;

    const businessId = (user as any).business as number;
    const callbackUrl = `${process.env.BASEURL}/api/integrations/callback/linkedin`;

    // Find or create a pending integration record so we can track it
    let integration = await prisma.integration.findFirst({
        where: { business_id: businessId, provider: 'linkedin' },
    });

    if (integration) {
        integration = await prisma.integration.update({
            where: { id: integration.id },
            data: { status: 'pending' },
        });
    } else {
        integration = await prisma.integration.create({
            data: {
                business_id: businessId,
                provider: 'linkedin',
                status: 'pending',
            },
        });
    }

    // State carries businessId:integrationId — base64 encoded
    const state = Buffer.from(JSON.stringify({ businessId, integrationId: integration.id })).toString('base64');

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: process.env.LINKEDIN_CLIENT_ID!,
        redirect_uri: callbackUrl,
        state,
        scope: LINKEDIN_SCOPES,
    });

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
    return res.redirect(authUrl);
}
