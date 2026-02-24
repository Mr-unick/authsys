import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/lib/prisma';
import { VerifyToken } from '@/utils/VerifyToken';

/**
 * GET  /api/integrations/[id]/mappings  — fetch field mappings for an integration
 * POST /api/integrations/[id]/mappings  — save (replace) field mappings
 *
 * These are handled separately from [id]/[action].ts to keep concerns clean.
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

    // ── GET — list mappings ─────────────────────────────────────
    if (req.method === 'GET') {
        const mappings = await prisma.leadSourceMapping.findMany({
            where: { integration_id: integrationId, business_id: businessId },
            orderBy: { id: 'asc' },
        });
        return res.status(200).json({ data: mappings });
    }

    // ── POST — replace all mappings ─────────────────────────────
    if (req.method === 'POST') {
        const { mappings } = req.body as {
            mappings: Array<{
                external_field: string;
                crm_field: string;
                transform?: string;
                form_id?: string;
                form_name?: string;
            }>;
        };

        if (!Array.isArray(mappings)) {
            return res.status(400).json({ message: '`mappings` must be an array' });
        }

        // Replace — delete existing rows then insert new ones
        await prisma.$transaction([
            prisma.leadSourceMapping.deleteMany({
                where: { integration_id: integrationId, business_id: businessId },
            }),
            prisma.leadSourceMapping.createMany({
                data: mappings.map((m) => ({
                    integration_id: integrationId,
                    business_id: businessId,
                    external_field: m.external_field,
                    crm_field: m.crm_field,
                    transform: m.transform ?? null,
                    form_id: m.form_id ?? null,
                    form_name: m.form_name ?? null,
                })),
            }),
        ]);

        const updated = await prisma.leadSourceMapping.findMany({
            where: { integration_id: integrationId, business_id: businessId },
            orderBy: { id: 'asc' },
        });
        return res.status(200).json({ message: 'Mappings saved', data: updated });
    }

    return res.status(405).end();
}
