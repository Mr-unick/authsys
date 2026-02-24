import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/lib/prisma';
import { VerifyToken } from '@/utils/VerifyToken';

/**
 * GET  /api/integrations/[id]/assignment  — get assignment rule for an integration
 * POST /api/integrations/[id]/assignment  — create/update assignment rule
 * DELETE /api/integrations/[id]/assignment — disable (soft-delete) the rule
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const user = await VerifyToken(req, res, 'integrations');
    if (res.writableEnded) return;

    const businessId = (user as any).business as number;
    const integrationId = parseInt(req.query.id as string);

    // Verify ownership
    const integration = await prisma.integration.findFirst({
        where: { id: integrationId, business_id: businessId },
    });
    if (!integration) return res.status(404).json({ message: 'Integration not found' });

    // ── GET ─────────────────────────────────────────────────────
    if (req.method === 'GET') {
        const rule = await prisma.integrationAssignmentRule.findFirst({
            where: { integration_id: integrationId, business_id: businessId },
            include: { rr_state: true },
        });

        // Also fetch available users for this business to populate the selector
        const users = await prisma.user.findMany({
            where: { business_id: businessId, deleted_at: null },
            select: { id: true, name: true, email: true, role: { select: { name: true } } },
            orderBy: { name: 'asc' },
        });

        const stages = await prisma.leadStage.findMany({
            where: { business_id: businessId, deleted_at: null },
            select: { id: true, stage_name: true, colour: true },
            orderBy: { stage_name: 'asc' },
        });

        return res.status(200).json({ rule, users, stages });
    }

    // ── POST — create/update ─────────────────────────────────────
    if (req.method === 'POST') {
        const { strategy, user_ids, stage_id, form_id, is_active } = req.body as {
            strategy: 'round_robin' | 'specific_user' | 'least_loaded';
            user_ids: number[];
            stage_id?: number | null;
            form_id?: string | null;
            is_active?: boolean;
        };

        if (!strategy || !Array.isArray(user_ids) || user_ids.length === 0) {
            return res.status(400).json({ message: 'strategy and user_ids are required' });
        }

        // Since Prisma upsert is picky about nulls in composite unique keys,
        // we manually check and then update or create.
        const existingRule = await prisma.integrationAssignmentRule.findFirst({
            where: {
                business_id: businessId,
                integration_id: integrationId,
                form_id: form_id || null
            }
        });

        let rule;
        if (existingRule) {
            rule = await prisma.integrationAssignmentRule.update({
                where: { id: existingRule.id },
                data: {
                    strategy,
                    user_ids: JSON.stringify(user_ids),
                    stage_id: stage_id ?? null,
                    is_active: is_active ?? true,
                },
            });
        } else {
            rule = await prisma.integrationAssignmentRule.create({
                data: {
                    business_id: businessId,
                    integration_id: integrationId,
                    strategy,
                    user_ids: JSON.stringify(user_ids),
                    stage_id: stage_id ?? null,
                    form_id: form_id || null,
                    is_active: is_active ?? true,
                },
            });
        }

        return res.status(200).json({ message: 'Assignment rule saved', rule });
    }

    // ── DELETE — disable ─────────────────────────────────────────
    if (req.method === 'DELETE') {
        await prisma.integrationAssignmentRule.updateMany({
            where: { integration_id: integrationId, business_id: businessId },
            data: { is_active: false },
        });
        return res.status(200).json({ message: 'Assignment rule disabled' });
    }

    return res.status(405).end();
}
