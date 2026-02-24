import type { NextApiRequest, NextApiResponse } from 'next';
import { createHmac } from 'crypto';
import prisma from '@/app/lib/prisma';
import { processLead } from '@/services/leadProcessor';

export const config = { api: { bodyParser: false } };

async function getRawBody(req: NextApiRequest): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        req.on('data', (c: Buffer) => chunks.push(c));
        req.on('end', () => resolve(Buffer.concat(chunks)));
        req.on('error', reject);
    });
}

/**
 * POST /api/webhooks/custom/[tenantId]/[integrationId]
 *
 * Generic webhook receiver for third-party lead sources.
 * Authenticate with X-API-Key header matching integration.api_key.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    const { tenantId, integrationId } = req.query as Record<string, string>;
    const apiKey = req.headers['x-api-key'] as string;

    if (!tenantId || !integrationId || !apiKey) {
        return res.status(400).json({ message: 'Missing tenantId, integrationId, or X-API-Key header' });
    }

    const rawBody = await getRawBody(req);
    let body: Record<string, any>;
    try {
        body = JSON.parse(rawBody.toString('utf8'));
    } catch {
        return res.status(400).json({ message: 'Invalid JSON body' });
    }

    // Validate API key
    const integration = await prisma.integration.findFirst({
        where: {
            id: parseInt(integrationId),
            business_id: parseInt(tenantId),
            provider: 'custom',
        },
    });

    const keyValid = integration?.api_key === apiKey;

    // Log always
    await prisma.webhookLog.create({
        data: {
            business_id: parseInt(tenantId),
            integration_id: integration?.id ?? null,
            provider: 'custom',
            event_type: 'lead',
            payload: rawBody.toString('utf8'),
            signature: apiKey,
            signature_valid: keyValid,
        },
    }).catch(() => { });

    if (!keyValid || !integration) {
        return res.status(401).json({ message: 'Invalid API key or integration not found' });
    }

    // Respond immediately — process async
    res.status(200).json({ success: true, message: 'Lead received' });

    // Extract lead ID — support common field names
    const externalId = String(
        body.id ?? body.lead_id ?? body.external_id ?? body.record_id ?? Date.now()
    );

    const syncLog = await prisma.syncLog.create({
        data: {
            business_id: integration.business_id,
            integration_id: integration.id,
            sync_type: 'webhook',
            status: 'running',
            leads_received: 1,
        },
    }).catch(() => null);

    const result = await processLead({
        businessId: integration.business_id,
        integrationId: integration.id,
        provider: 'custom',
        externalLeadId: externalId,
        rawPayload: { ...body, lead_source: 'custom_webhook' },
        syncLogId: syncLog?.id,
    }).catch((e) => ({ status: 'failed' as const, error: e.message }));

    if (syncLog) {
        await prisma.syncLog.update({
            where: { id: syncLog.id },
            data: {
                status: result.status === 'imported' ? 'success' : result.status === 'duplicate' ? 'success' : 'failed',
                finished_at: new Date(),
            },
        }).catch(() => { });
    }
}
