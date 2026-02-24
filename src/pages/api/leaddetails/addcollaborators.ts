import prisma from "@/app/lib/prisma";
import { ResponseInstance } from "@/utils/instances";
import { VerifyToken } from "@/utils/VerifyToken";
import { activityLog } from "@/utils/activityLogs";
import { ActivityType } from "@/utils/activityTypes";

export default async function addCollaborators(req: any, res: any) {
    try {
        await VerifyToken(req, res, null);
        if (res.writableEnded) return;

        const { leads, salespersons } = req.body;
        const leadId = leads[0];

        if (!leadId) {
            return res.status(400).json({ message: "Lead ID is required" });
        }

        await prisma.leadUser.createMany({
            data: salespersons.map((id: number) => ({
                lead_id: Number(leadId),
                user_id: Number(id)
            })),
            skipDuplicates: true
        });

        const description = `Added ${salespersons.length} collaborators to lead`;
        const user = await VerifyToken(req, res, null); // We need the user metadata
        await activityLog(ActivityType.ASSIGN, description, user.id, Number(leadId));

        const response: ResponseInstance = {
            message: "Collaborators added successfully",
            data: [],
            status: 200
        }

        res.json(response);
    } catch (error: any) {
        console.error("[addCollaborators]", error);
        const response: ResponseInstance = {
            message: "Something went wrong",
            data: [error.message],
            status: 500
        }

        res.status(500).json(response);
    }
}
