import prisma from '@/app/lib/prisma';

/**
 * Resolves the next assigned user for a newly imported lead, based on the
 * IntegrationAssignmentRule for the given integration (and optionally form).
 *
 * Strategies:
 *  - round_robin     → cycles through user_ids in order, persisting position
 *  - specific_user   → always assigns to user_ids[0]
 *  - least_loaded    → assigns to the user with the fewest active leads
 *
 * Returns null if no active rule exists.
 */
export async function resolveAssignedUser(
    businessId: number,
    integrationId: number,
    formId?: string | null,
): Promise<number | null> {
    // Prefer form-specific rule, fall back to integration-wide rule
    const rule = await prisma.integrationAssignmentRule.findFirst({
        where: {
            business_id: businessId,
            integration_id: integrationId,
            is_active: true,
            OR: formId
                ? [{ form_id: formId }, { form_id: null }]
                : [{ form_id: null }],
        },
        orderBy: { form_id: 'desc' }, // form-specific first
        include: { rr_state: true },
    });

    if (!rule) return null;

    let userIds: number[];
    try {
        userIds = JSON.parse(rule.user_ids);
    } catch {
        return null;
    }

    if (!userIds.length) return null;

    switch (rule.strategy) {
        case 'specific_user':
            return userIds[0];

        case 'least_loaded': {
            // Count active leads per user
            const counts = await Promise.all(
                userIds.map(async (uid) => {
                    const count = await prisma.leadUser.count({
                        where: {
                            user_id: uid,
                            lead: { business_id: businessId, status: 'active' },
                        },
                    });
                    return { uid, count };
                })
            );
            counts.sort((a, b) => a.count - b.count);
            return counts[0].uid;
        }

        case 'round_robin':
        default: {
            const currentIndex = rule.rr_state?.current_index ?? 0;
            const assignedUserId = userIds[currentIndex % userIds.length];
            const nextIndex = (currentIndex + 1) % userIds.length;

            // Update RR state atomically
            if (rule.rr_state) {
                await prisma.assignmentRoundRobinState.update({
                    where: { rule_id: rule.id },
                    data: { current_index: nextIndex },
                });
            } else {
                await prisma.assignmentRoundRobinState.create({
                    data: { rule_id: rule.id, current_index: nextIndex },
                });
            }

            return assignedUserId;
        }
    }
}
