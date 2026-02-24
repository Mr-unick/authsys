import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import prisma from '@/app/lib/prisma';
import { getAccessToken } from '@/services/tokenService';
import { processLead } from '@/services/leadProcessor';

/**
 * POST /api/integrations/poll/linkedin?integrationId=X
 *
 * Polls the LinkedIn Marketing API for new lead gen form submissions since
 * the last sync timestamp. Designed to be called by a cron job (Vercel Cron,
 * GitHub Actions, or an external scheduler) every 15 minutes.
 *
 * Also accepts an internal secret header for security.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    // Basic security guard — only internal callers allowed
    const internalSecret = req.headers['x-internal-secret'];
    if (internalSecret !== (process.env.INTERNAL_SECRET ?? 'internal')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const integrationId = req.query.integrationId
        ? parseInt(req.query.integrationId as string)
        : null;

    // Find all active LinkedIn integrations (or a specific one)
    const integrations = await prisma.integration.findMany({
        where: {
            provider: 'linkedin',
            status: 'connected',
            ...(integrationId ? { id: integrationId } : {}),
        },
    });

    if (integrations.length === 0) {
        return res.status(200).json({ message: 'No active LinkedIn integrations' });
    }

    const results: Record<string, any> = {};

    for (const integration of integrations) {
        const logStart = new Date();
        let leadsImported = 0;
        let leadsFailed = 0;
        let leadsDuplicate = 0;

        try {
            const accessToken = await getAccessToken(integration.id, integration.business_id, 'linkedin');
            if (!accessToken) {
                results[integration.id] = { error: 'No access token' };
                continue;
            }

            // LinkedIn Marketing API — list all lead gen forms for the account
            // https://learn.microsoft.com/en-us/linkedin/marketing/integrations/lead-gen/lead-gen-forms-response-api
            const sinceMs = integration.last_sync
                ? new Date(integration.last_sync).getTime()
                : Date.now() - 7 * 24 * 60 * 60 * 1000; // default: last 7 days

            // Step 1: Get ad accounts accessible to this member
            const adAccountsRes = await axios.get(
                'https://api.linkedin.com/v2/adAccountsV2?q=search&search.status.values[0]=ACTIVE',
                { headers: { Authorization: `Bearer ${accessToken}`, 'LinkedIn-Version': '202301' } }
            );

            const adAccounts: any[] = adAccountsRes.data?.elements ?? [];

            for (const account of adAccounts) {
                const accountUrn = account.id; // e.g. "urn:li:sponsoredAccount:123"

                // Step 2: Get all lead gen forms for the account
                const formsRes = await axios.get(
                    `https://api.linkedin.com/v2/leadGenForms?q=owner&owner=${encodeURIComponent(accountUrn)}`,
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                );

                const forms: any[] = formsRes.data?.elements ?? [];

                for (const form of forms) {
                    const formUrn = form.id;

                    // Step 3: Fetch responses for each form since last sync
                    const responsesRes = await axios.get(
                        `https://api.linkedin.com/v2/leadGenFormResponses?q=owner&owner=${encodeURIComponent(formUrn)}&submittedAfter=${sinceMs}`,
                        { headers: { Authorization: `Bearer ${accessToken}` } }
                    );

                    const responses: any[] = responsesRes.data?.elements ?? [];

                    for (const response of responses) {
                        // Build flat payload from LinkedIn's field answer structure
                        const rawPayload: Record<string, string> = {};
                        for (const field of response.fieldAnswers ?? []) {
                            rawPayload[field.fieldId] = field.values?.[0] ?? '';
                        }
                        // Also map common LinkedIn field IDs to readable keys
                        const fieldAliases: Record<string, string> = {
                            'firstName': 'first_name',
                            'lastName': 'last_name',
                            'emailAddress': 'email',
                            'phoneNumber': 'phone',
                            'company': 'company',
                            'title': 'job_title',
                        };
                        for (const [liKey, ourKey] of Object.entries(fieldAliases)) {
                            if (rawPayload[liKey]) rawPayload[ourKey] = rawPayload[liKey];
                        }

                        try {
                            const result = await processLead({
                                integrationId: integration.id,
                                businessId: integration.business_id,
                                provider: 'linkedin',
                                externalLeadId: response.id,
                                rawPayload,
                                campaignId: form.name ?? formUrn,
                            });

                            if (result.status === 'imported') leadsImported++;
                            else if (result.status === 'duplicate') leadsDuplicate++;
                        } catch (leadErr: any) {
                            console.error('[LinkedIn Poll] Lead processing error:', leadErr.message);
                            leadsFailed++;
                        }
                    }
                }
            }

            // Update last_sync timestamp
            await prisma.integration.update({
                where: { id: integration.id },
                data: {
                    last_sync: new Date(),
                    last_sync_status: leadsFailed === 0 ? 'success' : 'partial',
                },
            });

            // Write sync log
            await prisma.syncLog.create({
                data: {
                    integration_id: integration.id,
                    business_id: integration.business_id,
                    sync_type: 'poll',
                    status: leadsFailed === 0 ? 'success' : 'partial',
                    leads_imported: leadsImported,
                    leads_failed: leadsFailed,
                    leads_duplicate: leadsDuplicate,
                    started_at: logStart,
                    finished_at: new Date(),
                },
            });

            results[integration.id] = { leadsImported, leadsFailed, leadsDuplicate };
        } catch (err: any) {
            console.error(`[LinkedIn Poll] Integration ${integration.id} error:`, err.response?.data ?? err.message);

            await prisma.integration.update({
                where: { id: integration.id },
                data: { last_sync_status: 'failed' },
            }).catch(() => { });

            await prisma.syncLog.create({
                data: {
                    integration_id: integration.id,
                    business_id: integration.business_id,
                    sync_type: 'poll',
                    status: 'failed',
                    leads_imported: leadsImported,
                    leads_failed: leadsFailed,
                    leads_duplicate: leadsDuplicate,
                    error_message: err.message,
                    started_at: logStart,
                    finished_at: new Date(),
                },
            }).catch(() => { });

            results[integration.id] = { error: err.message };
        }
    }

    return res.status(200).json({ results });
}
