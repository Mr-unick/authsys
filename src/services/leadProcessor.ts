import prisma from '@/app/lib/prisma';
import { applyFieldMappings } from './mappingService';
import { resolveAssignedUser } from './assignmentService';

export interface ProcessLeadPayload {
    businessId: number;
    integrationId: number;
    provider: string;
    externalLeadId: string;
    rawPayload: Record<string, any>;
    formId?: string | null;
    campaignId?: string | null;   // optional label — stored in lead_source
    syncLogId?: number;
}

export interface ProcessLeadResult {
    status: 'imported' | 'duplicate' | 'failed' | 'created';
    crmLeadId?: number;
    assignedUserId?: number | null;
    error?: string;
}

/**
 * Core lead import pipeline:
 *  1. Duplicate guard
 *  2. Persist raw payload
 *  3. Apply field mappings
 *  4. Create CRM lead (with optional stage)
 *  5. Auto-assign to user (round-robin / least-loaded / specific)
 *  6. Activity log + mark external_lead imported
 *  7. Send in-app notification to assigned user
 */
export async function processLead(p: ProcessLeadPayload): Promise<ProcessLeadResult> {
    try {
        // ── 1. Duplicate guard ────────────────────────────────────
        const existing = await prisma.externalLead.findUnique({
            where: {
                business_id_provider_external_lead_id: {
                    business_id: p.businessId,
                    provider: p.provider,
                    external_lead_id: p.externalLeadId,
                },
            },
        });

        if (existing?.status === 'imported') {
            await incrementSyncCount(p.syncLogId, 'duplicate');
            return { status: 'duplicate' };
        }

        // ── 2. Persist raw payload ────────────────────────────────
        const extLead = existing
            ? await prisma.externalLead.update({
                where: { id: existing.id },
                data: { raw_payload: JSON.stringify(p.rawPayload), status: 'raw' },
            })
            : await prisma.externalLead.create({
                data: {
                    business_id: p.businessId,
                    integration_id: p.integrationId,
                    provider: p.provider,
                    external_lead_id: p.externalLeadId,
                    raw_payload: JSON.stringify(p.rawPayload),
                    status: 'raw',
                },
            });

        // ── 3. Field mappings ─────────────────────────────────────
        const mapped = await applyFieldMappings(
            p.businessId, p.integrationId, p.rawPayload, p.formId,
        );

        if (!mapped.name && !mapped.email && !mapped.phone) {
            throw new Error('Mapped lead has no name, email or phone — skipping');
        }

        // ── 4. Resolve assignment rule (stage + user) ─────────────
        const rule = await prisma.integrationAssignmentRule.findFirst({
            where: {
                business_id: p.businessId,
                integration_id: p.integrationId,
                is_active: true,
            },
        });
        const stageId = rule?.stage_id ?? null;

        // ── 5. Create CRM lead ────────────────────────────────────
        const lead = await prisma.lead.create({
            data: {
                name: mapped.name ?? 'Unknown',
                email: mapped.email ?? '',
                phone: mapped.phone ?? null,
                address: mapped.address ?? null,
                notes: mapped.notes ?? null,
                lead_source: mapped.lead_source ?? p.campaignId ?? p.provider,
                status: 'active',
                business_id: p.businessId,
                stage_id: stageId,
            },
        });

        // ── 6. Auto-assign user ───────────────────────────────────
        let assignedUserId: number | null = null;
        try {
            assignedUserId = await resolveAssignedUser(
                p.businessId, p.integrationId, p.formId,
            );

            if (assignedUserId) {
                await prisma.leadUser.create({
                    data: { lead_id: lead.id, user_id: assignedUserId },
                });
            }
        } catch (assignErr: any) {
            // Non-fatal — log and continue
            console.warn('[processLead] Assignment failed:', assignErr.message);
        }

        // ── 7. Activity log ───────────────────────────────────────
        await prisma.activity.create({
            data: {
                type: 'lead_imported',
                description: `Lead imported from ${p.provider}${p.campaignId ? ` (${p.campaignId})` : ''}: ${lead.name}`,
                lead_id: lead.id,
                user_id: assignedUserId ?? null,
            },
        });

        // ── 8. Mark external lead imported ────────────────────────
        await prisma.externalLead.update({
            where: { id: extLead.id },
            data: {
                status: 'imported',
                crm_lead_id: lead.id,
                mapped_payload: JSON.stringify(mapped),
                imported_at: new Date(),
            },
        });

        // ── 9. In-app notification to assigned user ───────────────
        if (assignedUserId) {
            await prisma.notification.create({
                data: {
                    user_id: assignedUserId,
                    message: `New lead assigned to you: ${lead.name} (from ${p.provider})`,
                    url: `/leads/newleads`,
                    status: 'unread',
                },
            }).catch(() => {/* non-critical */ });
        }

        // ── 10. WhatsApp Lead Greeting ────────────────────────────
        try {
            const { sendWhatsAppNotification } = await import('./whatsappService');
            await sendWhatsAppNotification({
                businessId: p.businessId,
                phone: lead.phone ?? '',
                leadName: lead.name
            });
        } catch (waErr: any) {
            console.warn('[processLead] WhatsApp greeting failed:', waErr.message);
        }

        await incrementSyncCount(p.syncLogId, 'imported');
        return { status: 'imported', crmLeadId: lead.id, assignedUserId };

    } catch (err: any) {
        await incrementSyncCount(p.syncLogId, 'failed');

        await prisma.externalLead.updateMany({
            where: {
                business_id: p.businessId,
                provider: p.provider,
                external_lead_id: p.externalLeadId,
            },
            data: { status: 'failed', error_message: err.message },
        }).catch(() => { });

        return { status: 'failed', error: err.message };
    }
}

async function incrementSyncCount(
    syncLogId: number | undefined,
    field: 'imported' | 'failed' | 'duplicate',
) {
    if (!syncLogId) return;
    const col = field === 'imported' ? { leads_imported: { increment: 1 } }
        : field === 'failed' ? { leads_failed: { increment: 1 } }
            : { leads_duplicate: { increment: 1 } };
    await prisma.syncLog.update({ where: { id: syncLogId }, data: col }).catch(() => { });
}
