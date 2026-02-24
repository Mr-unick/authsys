import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/lib/prisma';
import { VerifyToken } from '@/utils/VerifyToken';
import { randomBytes } from 'crypto';

/**
 * POST /api/integrations/create-custom
 * Creates a new custom (API-key-based) integration for the authenticated business.
 * If one already exists, returns the existing one.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    const user = await VerifyToken(req, res, 'integrations');
    if (res.writableEnded) return;

    const businessId = user.business as number;

    try {
        // Count existing custom integrations to give it a numbered name
        const count = await prisma.integration.count({
            where: { business_id: businessId, provider: 'custom' },
        });

        // Generate a secure API key
        const apiKey = `crm_${randomBytes(24).toString('hex')}`;

        const integration = await prisma.integration.create({
            data: {
                business_id: businessId,
                provider: 'custom',
                display_name: `Custom Webhook ${count + 1}`,
                account_name: `Custom API Integration #${count + 1}`,
                status: 'connected',
                api_key: apiKey,
            },
        });

        return res.status(201).json(integration);
    } catch (err: any) {
        console.error('[create-custom]', err.message);
        return res.status(500).json({ message: err.message });
    }
}
