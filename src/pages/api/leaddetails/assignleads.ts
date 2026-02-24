import prisma from "@/app/lib/prisma";
import { ResponseInstance } from "@/utils/instances";
import { VerifyToken } from "@/utils/VerifyToken";
import { activityLog } from "@/utils/activityLogs";
import { ActivityType } from "@/utils/activityTypes";
import { createNotification } from "@/utils/notifications";

export default async function assignLeads(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    let user = await VerifyToken(req, res, null);
    if (res.writableEnded) return;

    try {
        const { leads, salespersons } = req.body;

        if (!leads || !salespersons || !Array.isArray(leads) || !Array.isArray(salespersons)) {
            return res.status(400).json({ message: 'Invalid request body' });
        }

        // Get the first stage for the business
        const firstStage = await prisma.leadStage.findFirst({
            where: { business_id: Number(user.business) },
            orderBy: { created_at: 'asc' }
        });

        await prisma.$transaction(async (tx) => {
            for (const leadId of leads) {
                // Assign each lead to each salesperson
                for (const userId of salespersons) {
                    await tx.leadUser.upsert({
                        where: {
                            lead_id_user_id: {
                                lead_id: Number(leadId),
                                user_id: Number(userId)
                            }
                        },
                        create: {
                            lead_id: Number(leadId),
                            user_id: Number(userId)
                        },
                        update: {}
                    });
                }

                // Set lead stage to the first stage
                if (firstStage) {
                    await tx.lead.update({
                        where: { id: Number(leadId) },
                        data: { stage_id: firstStage.id }
                    });
                }

                // Add the initial stage comment requested by the user
                await tx.comment.create({
                    data: {
                        lead_id: Number(leadId),
                        user_id: Number(user.id),
                        comment: `( initial stage ,assigned by ${user.name} )`
                    }
                });
            }
        });

        const description = `Assigned ${leads.length} leads to ${salespersons.length} salespersons`;
        await activityLog(ActivityType.ASSIGN, description, user.id);

        // Notify salespersons
        const firstLeadId = leads[0];
        const lead = await prisma.lead.findUnique({ where: { id: Number(firstLeadId) } });
        for (const userId of salespersons) {
            await createNotification(
                Number(userId),
                `You have been assigned ${leads.length} new lead(s) including ${lead?.email || `#${firstLeadId}`} by ${user.name}`,
                leads.length === 1 ? `/leads/details/${firstLeadId}` : '/leads/tableleads'
            );
        }

        const response: ResponseInstance = {
            message: 'Leads assigned successfully',
            data: [],
            status: 200
        }
        return res.json(response);
    } catch (error: any) {
        const response: ResponseInstance = {
            message: 'Leads assigned failed',
            data: [error.message],
            status: 500
        }
        return res.status(500).json(response);
    }
}

