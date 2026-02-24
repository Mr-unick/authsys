import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/lib/prisma';
import { VerifyToken } from '@/utils/VerifyToken';
import { randomBytes } from 'crypto';

/**
 * PUT  /api/integrations/[id]/disconnect   — disconnect an integration
 * POST /api/integrations/[id]/regenerate-key — regenerate API key (custom only)
 * GET  /api/integrations/[id]/mappings      — get field mappings
 * POST /api/integrations/[id]/mappings      — save field mappings
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const user = await VerifyToken(req, res, 'integrations');
    if (res.writableEnded) return;

    const { id, action } = req.query as Record<string, string>;
    const integrationId = parseInt(id);
    const businessId = (user as any).business as number;

    // Verify ownership
    const integration = await prisma.integration.findFirst({
        where: { id: integrationId, business_id: businessId },
    });
    if (!integration) return res.status(404).json({ message: 'Integration not found' });

    // ── Disconnect ──────────────────────────────────────────────
    if (action === 'disconnect' && req.method === 'PUT') {
        await prisma.integrationToken.deleteMany({ where: { integration_id: integrationId } });
        await prisma.integration.update({
            where: { id: integrationId },
            data: { status: 'disconnected' },
        });
        return res.status(200).json({ message: 'Disconnected' });
    }

    // ── Regenerate API key (custom integrations) ────────────────
    if (action === 'regenerate-key' && req.method === 'POST') {
        if (integration.provider !== 'custom') {
            return res.status(400).json({ message: 'Only custom integrations support API key regeneration' });
        }
        const newKey = randomBytes(32).toString('hex');
        await prisma.integration.update({
            where: { id: integrationId },
            data: { api_key: newKey },
        });
        return res.status(200).json({ api_key: newKey });
    }

    // ── Get field mappings ──────────────────────────────────────
    if (action === 'mappings' && req.method === 'GET') {
        const mappings = await prisma.leadSourceMapping.findMany({
            where: { integration_id: integrationId, business_id: businessId },
            orderBy: { id: 'asc' },
        });
        return res.status(200).json({ data: mappings });
    }

    // ── Save field mappings ─────────────────────────────────────
    if (action === 'mappings' && req.method === 'POST') {
        const { mappings } = req.body as {
            mappings: Array<{
                id?: number;
                form_id?: string;
                form_name?: string;
                external_field: string;
                crm_field: string;
                transform?: string;
                is_active?: boolean;
            }>;
        };

        if (!Array.isArray(mappings)) {
            return res.status(400).json({ message: 'mappings must be an array' });
        }

        // Delete existing + recreate (simple strategy)
        await prisma.leadSourceMapping.deleteMany({
            where: { integration_id: integrationId, business_id: businessId },
        });

        const created = await prisma.leadSourceMapping.createMany({
            data: mappings.map((m) => ({
                business_id: businessId,
                integration_id: integrationId,
                form_id: m.form_id ?? null,
                form_name: m.form_name ?? null,
                external_field: m.external_field,
                crm_field: m.crm_field,
                transform: m.transform ?? null,
                is_active: m.is_active ?? true,
            })),
        });

        return res.status(200).json({ created: created.count });
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
