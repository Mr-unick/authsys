import prisma from '@/app/lib/prisma';

export interface MappedLead {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    lead_source?: string;
    notes?: string;
    [key: string]: any;
}

const TRANSFORM_FNS: Record<string, (v: string) => string> = {
    trim: (v) => v.trim(),
    lowercase: (v) => v.toLowerCase(),
    uppercase: (v) => v.toUpperCase(),
    split_name: (v) => v.split(' ')[0], // take first name only
};

/**
 * Apply LeadSourceMappings for a given integration + form to a raw payload.
 * Falls back to direct-field copy for unmapped but same-named fields.
 */
export async function applyFieldMappings(
    businessId: number,
    integrationId: number,
    rawPayload: Record<string, any>,
    formId?: string | null
): Promise<MappedLead> {
    const mappings = await prisma.leadSourceMapping.findMany({
        where: {
            business_id: businessId,
            integration_id: integrationId,
            is_active: true,
            ...(formId ? { form_id: formId } : {}),
        },
    });

    const result: MappedLead = {};

    // Apply explicit mappings
    for (const m of mappings) {
        let value = rawPayload[m.external_field];
        if (value === undefined || value === null) continue;
        value = String(value);
        if (m.transform && TRANSFORM_FNS[m.transform]) {
            value = TRANSFORM_FNS[m.transform](value);
        }
        result[m.crm_field] = value;
    }

    // Fallback: copy known CRM fields if they exist in payload AND not already mapped
    const fallbackFields = ['name', 'email', 'phone', 'address', 'notes', 'lead_source'];
    for (const f of fallbackFields) {
        if (!result[f] && rawPayload[f]) {
            result[f] = String(rawPayload[f]).trim();
        }
    }

    return result;
}

/**
 * Seed default mappings for Meta lead ads (common field names).
 */
export async function seedMetaDefaultMappings(
    businessId: number,
    integrationId: number,
    formId?: string,
    formName?: string
) {
    const defaults = [
        { external_field: 'full_name', crm_field: 'name', transform: 'trim' },
        { external_field: 'email', crm_field: 'email', transform: 'lowercase' },
        { external_field: 'phone_number', crm_field: 'phone', transform: 'trim' },
        { external_field: 'street_address', crm_field: 'address', transform: 'trim' },
    ];

    for (const d of defaults) {
        await prisma.leadSourceMapping.upsert({
            where: {
                // no unique constraint on all these fields, so use findFirst + create
                id: -1, // force create path via catch
            },
            update: {},
            create: {
                business_id: businessId,
                integration_id: integrationId,
                form_id: formId ?? null,
                form_name: formName ?? null,
                external_field: d.external_field,
                crm_field: d.crm_field,
                transform: d.transform,
            },
        }).catch(() =>
            prisma.leadSourceMapping.create({
                data: {
                    business_id: businessId,
                    integration_id: integrationId,
                    form_id: formId ?? null,
                    form_name: formName ?? null,
                    external_field: d.external_field,
                    crm_field: d.crm_field,
                    transform: d.transform,
                },
            }).catch(() => null) // already exists — ignore
        );
    }
}
