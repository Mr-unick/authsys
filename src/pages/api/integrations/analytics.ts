import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/lib/prisma';
import { VerifyToken } from '@/utils/VerifyToken';

/**
 * GET /api/integrations/analytics?days=30
 *
 * Returns lead source analytics for the authenticated business:
 * - Leads per provider / integration over time
 * - Import success / failure rates
 * - Top performing source
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') return res.status(405).end();

    const user = await VerifyToken(req, res, 'integrations');
    if (res.writableEnded) return;

    const businessId = (user as any).business as number;
    const days = Math.min(parseInt((req.query.days as string) ?? '30'), 90);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // 1. Sync logs summary grouped by integration + status
    const syncSummary = await prisma.syncLog.groupBy({
        by: ['integration_id', 'status'],
        where: { business_id: businessId, started_at: { gte: since } },
        _sum: { leads_imported: true, leads_failed: true, leads_duplicate: true },
        _count: { id: true },
    });

    // 2. External leads by provider
    const byProvider = await prisma.externalLead.groupBy({
        by: ['provider', 'status'],
        where: { business_id: businessId, received_at: { gte: since } },
        _count: { id: true },
    });

    // 3. Daily import trend — raw query for date-bucketing
    const dailyTrend: Array<{ day: string; provider: string; count: number }> =
        await prisma.$queryRaw`
            SELECT
                DATE(received_at)  AS day,
                provider,
                COUNT(*)           AS count
            FROM external_leads
            WHERE
                business_id = ${businessId}
                AND status  = 'imported'
                AND received_at >= ${since}
            GROUP BY DATE(received_at), provider
            ORDER BY day ASC
        `;

    // 4. Integration list with account names
    const integrations = await prisma.integration.findMany({
        where: { business_id: businessId },
        select: { id: true, provider: true, account_name: true, display_name: true, status: true },
    });

    // Build enriched sync summary with integration labels
    const intgMap = Object.fromEntries(integrations.map((i) => [i.id, i]));
    const enrichedSync = syncSummary.map((row) => ({
        ...row,
        integration: intgMap[row.integration_id] ?? null,
    }));

    return res.status(200).json({
        windowDays: days,
        syncSummary: enrichedSync,
        byProvider,
        dailyTrend: dailyTrend.map((r) => ({
            day: typeof r.day === 'object' ? (r.day as Date).toISOString().slice(0, 10) : r.day,
            provider: r.provider,
            count: Number(r.count),
        })),
        integrations,
    });
}
