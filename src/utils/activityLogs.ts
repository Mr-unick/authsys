import prisma from "@/app/lib/prisma";

/**
 * Creates and saves an activity log entry using Prisma.
 *
 * @param type - Activity type (string or enum equivalent)
 * @param description - Human-readable description of the activity
 * @param userId - ID of the user who performed the action (optional)
 * @param leadId - ID of the related lead (optional)
 */
export const activityLog = async (
    type: string,
    description: string,
    userId?: number,
    leadId?: number
): Promise<void> => {
    try {
        const newActivity = await prisma.activity.create({
            data: {
                type,
                description,
                user_id: userId,
                lead_id: leadId,
                timestamp: new Date()
            },
            include: {
                user: true,
                lead: true
            }
        });

        // Emit for real-time updates
        const { activityEmitter } = await import("./activityEmitter");
        activityEmitter.emit('newActivity', newActivity);

    } catch (error: any) {
        console.error("[ActivityLog] Failed to create activity log:", error.message);
    }
};
