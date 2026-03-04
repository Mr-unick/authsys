import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/lib/prisma';
import { VerifyToken } from '@/utils/VerifyToken';

// Deployment Sync: 2024-03-04-15-10

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const user = await VerifyToken(req, res, null);
    if (res.writableEnded) return;

    // Strict Super Admin Check
    const rawRole = (typeof user.role === 'string' ? user.role : (user.role?.name || 'USER'));
    const role = rawRole.trim().toUpperCase().replace(/\s+/g, '_');
    if (!role.includes('SUPER')) {
        return res.status(403).json({ message: 'Forbidden: Super Admin access required' });
    }

    if (req.method === 'GET') {
        try {
            const integrations = await prisma.integration.findMany({
                include: {
                    business: {
                        select: {
                            id: true,
                            business_name: true,
                            email: true
                        }
                    },
                    syncLogs: {
                        orderBy: { started_at: 'desc' },
                        take: 1
                    }
                },
                orderBy: { created_at: 'desc' }
            });

            // Count leads per integration today
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
                        business_name: intg.business?.business_name,
                        business_id: intg.business?.id,
                        provider: intg.provider,
                        display_name: intg.display_name,
                        status: intg.status,
                        leads_today: leadsToday,
                        last_sync: lastSync?.finished_at ?? null,
                        last_sync_status: lastSync?.status ?? null,
                        created_at: intg?.created_at
                    };
                })
            );

            return res.status(200).json({ data: enriched });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    if (req.method === 'DELETE') {
        try {
            const { id } = req.query;
            if (!id) return res.status(400).json({ message: 'ID is required' });

            await prisma.integration.delete({
                where: { id: parseInt(id as string) }
            });

            return res.status(200).json({ message: 'Integration revoked successfully' });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
