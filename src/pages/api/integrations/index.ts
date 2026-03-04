import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/lib/prisma';
import { VerifyToken } from '@/utils/VerifyToken';

// Deployment Sync: 2024-03-04-14-55

/** GET /api/integrations — list all integrations for the authenticated business */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const user = await VerifyToken(req, res, 'integrations');
    if (res.writableEnded) return;

    const businessId = (user as any).business as number;

    if (req.method === 'GET') {
        const integrations = await prisma.integration.findMany({
            where: { business_id: businessId },
            include: {
                syncLogs: {
                    orderBy: { started_at: 'desc' },
                    take: 1,
                },
            },
        });

        // Count leads today per integration
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const enriched = await Promise.all(
            integrations.map(async (intg) => {
                const leadsToday = await prisma.externalLead.count({
                    where: {
                        integration_id: intg.id,
                        status: 'imported',
                        imported_at: { gte: today },
                    },
                });
                const lastSync = intg.syncLogs[0] ?? null;
                return {
                    id: intg.id,
                    provider: intg.provider,
                    display_name: intg.display_name,
                    status: intg.status,
                    leads_today: leadsToday,
                    last_sync: lastSync?.finished_at ?? null,
                    last_sync_status: lastSync?.status ?? null,
                    api_key: intg.provider === 'custom' ? intg.api_key : undefined,
                };
            })
        );

        return res.status(200).json({ data: enriched });
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
