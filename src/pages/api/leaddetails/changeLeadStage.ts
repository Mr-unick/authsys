import prisma from "@/app/lib/prisma";
import { ResponseInstance } from "@/utils/instances";
import { VerifyToken } from "@/utils/VerifyToken";
import { activityLog } from "@/utils/activityLogs";
import { ActivityType } from "@/utils/activityTypes";

export default async function changeLeadStage(req: any, res: any) {
    try {
        let user = await VerifyToken(req, res, 'stages');
        if (res.writableEnded) return;

        const { stage, reason } = req.body;
        const leadId = Number(req.query.id);

        if (!leadId) {
            return res.status(400).json({ message: "Lead ID is required" });
        }

        if (!stage) {
            return res.status(400).json({ message: "Stage ID is required" });
        }

        await prisma.$transaction(async (tx) => {
            // Update the lead's current stage
            await tx.lead.update({
                where: { id: leadId },
                data: {
                    stage_id: Number(stage)
                }
            });

            // Create stage change history
            await tx.stageChangeHistory.create({
                data: {
                    stage_id: Number(stage),
                    lead_id: leadId,
                    user_id: user.id,
                    changed_at: new Date(),
                    reason: reason || "Stage changed"
                }
            });
        });

        const description = `Changed lead stage to ${stage}`;
        await activityLog(ActivityType.STAGE_CHANGE, description, user.id, leadId);

        const response: ResponseInstance = {
            message: "Stage changed successfully",
            data: [],
            status: 200
        }

        res.json(response);
    } catch (error: any) {
        console.error("[changeLeadStage]", error);
        const response: ResponseInstance = {
            message: "Something went wrong",
            data: [error.message],
            status: 500
        }

        res.status(500).json(response);
    }
}
