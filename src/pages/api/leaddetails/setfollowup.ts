import prisma from "@/app/lib/prisma";
import { VerifyToken } from "@/utils/VerifyToken";

export default async function handler(req: any, res: any) {
    const user = await VerifyToken(req, res, 'leaddetails');
    if (res.writableEnded) return;

    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const { id } = req.query;
        const { follow_up_date, follow_up_time } = req.body;

        if (!id || !follow_up_date || !follow_up_time) {
            return res.status(400).json({ message: "Lead ID, date and time are required" });
        }

        // Combine date and time
        const followUpDateTime = new Date(`${follow_up_date}T${follow_up_time}`);

        if (isNaN(followUpDateTime.getTime())) {
            return res.status(400).json({ message: "Invalid date or time format" });
        }

        const updatedLead = await prisma.lead.update({
            where: { id: Number(id) },
            data: {
                nextFollowUp: followUpDateTime
            }
        });

        // Add an activity log
        await prisma.activity.create({
            data: {
                type: 'FOLLOW_UP_SCHEDULED',
                description: `Scheduled a follow-up for ${followUpDateTime.toLocaleString()}`,
                user_id: user.id,
                lead_id: Number(id)
            }
        });

        return res.status(200).json({
            message: "Follow-up scheduled successfully",
            data: updatedLead,
            status: 200
        });

    } catch (error: any) {
        console.error("[setfollowup ERROR]", error);
        return res.status(500).json({ message: "Internal server error", data: error.message });
    }
}
