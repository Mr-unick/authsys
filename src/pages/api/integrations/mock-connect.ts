import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/lib/prisma';
import { VerifyToken } from '@/utils/VerifyToken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    const user = await VerifyToken(req, res, 'integrations');
    if (res.writableEnded) return;

    const { provider } = req.body;
    if (!['meta', 'linkedin'].includes(provider)) {
        return res.status(400).json({ message: 'Invalid provider for mock connect' });
    }

    const businessId = (user as any).business;
    if (!businessId) return res.status(403).json({ message: 'No business associated' });

    // Create or update integration to 'connected'
    let integration = await prisma.integration.findFirst({
        where: { business_id: businessId, provider: provider }
    });

    if (integration) {
        integration = await prisma.integration.update({
            where: { id: integration.id },
            data: {
                status: 'connected',
                access_token: 'mock_token_' + Math.random().toString(36).substring(7),
                token_expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
            }
        });
    } else {
        integration = await prisma.integration.create({
            data: {
                business_id: businessId,
                provider: provider,
                status: 'connected',
                access_token: 'mock_token_' + Math.random().toString(36).substring(7),
                token_expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
            }
        });
    }

    return res.status(200).json({ message: 'Mock integration connected', data: integration });
}
