import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/lib/prisma';
import { VerifyToken } from '@/utils/VerifyToken';

/**
 * GET  /api/integrations/logs?integrationId=X  — sync logs + webhook logs
 * Shows last 50 sync events and last 20 webhook events
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') return res.status(405).end();

    const user = await VerifyToken(req, res, 'integrations');
    if (res.writableEnded) return;

    const businessId = (user as any).business as number;
    const integrationId = req.query.integrationId
        ? parseInt(req.query.integrationId as string)
        : undefined;

    const where = integrationId
        ? { business_id: businessId, integration_id: integrationId }
        : { business_id: businessId };

    const [syncLogs, webhookLogs] = await Promise.all([
        prisma.syncLog.findMany({
            where,
            orderBy: { started_at: 'desc' },
            take: 50,
        }),
        prisma.webhookLog.findMany({
            where: integrationId ? { integration_id: integrationId, business_id: user.business_id as number } : { business_id: user.business_id as number },
            orderBy: { received_at: 'desc' },
            take: 20,
            select: {
                id: true, provider: true, event_type: true,
                signature_valid: true, processed: true,
                received_at: true, processed_at: true, error: true,
            },
        }),
    ]);

    return res.status(200).json({ syncLogs, webhookLogs });
}
