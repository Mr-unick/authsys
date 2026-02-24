import type { NextApiRequest, NextApiResponse } from 'next';
import { createHmac } from 'crypto';
import prisma from '@/app/lib/prisma';
import { processLead } from '@/services/leadProcessor';
import { getAccessToken } from '@/services/tokenService';
import axios from 'axios';

// Disable Next.js body parsing so we can get raw body for signature verification
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
 * POST /api/webhooks/meta  — receives Meta LeadGen events
 * GET  /api/webhooks/meta  — Meta webhook verification challenge
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    // ── Webhook verification (GET) ─────────────────────────────
    if (req.method === 'GET') {
        const mode = req.query['hub.mode'];
        const token = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];

        if (mode === 'subscribe' && token === process.env.META_WEBHOOK_VERIFY_TOKEN) {
            console.log('Meta webhook verified ✓');
            return res.status(200).send(challenge);
        }
        return res.status(403).json({ message: 'Forbidden' });
    }

    if (req.method !== 'POST') return res.status(405).end();

    // ── Signature verification ─────────────────────────────────
    const rawBody = await getRawBody(req);
    const sigHeader = (req.headers['x-hub-signature-256'] as string) ?? '';
    const appSecret = process.env.META_APP_SECRET!;
    const expected = 'sha256=' + createHmac('sha256', appSecret).update(rawBody).digest('hex');

    const isSandboxTest = (req.headers['x-sandbox-test'] === 'true');
    const sigValid = isSandboxTest || (sigHeader === expected);
    const body = JSON.parse(rawBody.toString('utf8'));

    // Log the webhook event
    let webhookLog;
    try {
        webhookLog = await prisma.webhookLog.create({
            data: {
                provider: 'meta',
                event_type: 'leadgen',
                payload: rawBody.toString('utf8'),
                signature: sigHeader,
                signature_valid: sigValid,
                processed: false,
            },
        });
    } catch (_) { }

    if (!sigValid) {
        console.warn('Meta webhook: invalid signature');
        return res.status(401).json({ message: 'Invalid signature' });
    }

    // ── Process events asynchronously (respond 200 immediately) ─
    res.status(200).json({ success: true });

    // Process in background (no await — already responded)
    processMetaEvents(body, webhookLog?.id).catch(
        (e) => console.error('Meta event processing error:', e.message)
    );
}

async function processMetaEvents(body: any, webhookLogId?: number) {
    const entries = body?.entry ?? [];

    for (const entry of entries) {
        const pageId = entry.id;
        const changes = entry.changes ?? [];

        for (const change of changes) {
            if (change.field !== 'leadgen') continue;

            const { leadgen_id, form_id, page_id } = change.value ?? {};
            if (!leadgen_id) continue;

            // Find integration by page / business
            const integration = await prisma.integration.findFirst({
                where: { provider: 'meta', status: 'connected' },
            });
            if (!integration) continue;

            const syncLog = await prisma.syncLog.create({
                data: {
                    business_id: integration.business_id,
                    integration_id: integration.id,
                    sync_type: 'webhook',
                    status: 'running',
                    leads_received: 1,
                },
            });

            try {
                let fieldData: Record<string, string> = {};

                if (leadgen_id.toString().startsWith('TEST_')) {
                    // Sandbox bypass (Dummy data for testing)
                    fieldData = {
                        'full_name': 'Sandbox Meta Lead',
                        'email': `sandbox_${Date.now()}@test.com`,
                        'phone_number': '555-0199',
                        'city': 'Digital City'
                    };
                } else {
                    // Real Meta Graph API call
                    const accessToken = await getAccessToken(integration.id);
                    if (!accessToken) throw new Error('No access token for integration ' + integration.id);

                    const leadRes = await axios.get(
                        `https://graph.facebook.com/v18.0/${leadgen_id}`,
                        { params: { access_token: accessToken, fields: 'field_data,id,created_time,form_id' } }
                    );

                    // Flatten field_data array into flat map
                    for (const field of leadRes.data.field_data ?? []) {
                        fieldData[field.name] = Array.isArray(field.values)
                            ? field.values[0]
                            : field.values;
                    }
                }
                fieldData.lead_source = 'facebook_ads';

                const result = await processLead({
                    businessId: integration.business_id,
                    integrationId: integration.id,
                    provider: 'meta',
                    externalLeadId: leadgen_id,
                    rawPayload: fieldData,
                    formId: form_id,
                    syncLogId: syncLog.id,
                });

                await prisma.syncLog.update({
                    where: { id: syncLog.id },
                    data: {
                        status: result.status === 'imported' ? 'success' : result.status === 'duplicate' ? 'success' : 'failed',
                        finished_at: new Date()
                    },
                });

                // Update webhook log
                if (webhookLogId) {
                    await prisma.webhookLog.update({
                        where: { id: webhookLogId },
                        data: { processed: true, processed_at: new Date(), integration_id: integration.id, business_id: integration.business_id },
                    }).catch(() => { });
                }

            } catch (err: any) {
                console.error('Meta lead processing failed:', err.message);
                await prisma.syncLog.update({
                    where: { id: syncLog.id },
                    data: { status: 'failed', error_message: err.message, finished_at: new Date() },
                }).catch(() => { });
            }
        }
    }
}
