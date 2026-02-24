import prisma from "@/app/lib/prisma";
import { VerifyToken } from "@/utils/VerifyToken";

export default async function getActivities(req: any, res: any) {
    const user = await VerifyToken(req, res, null);
    if (res.writableEnded) return;

    try {
        const whereClause: any = {};

        // Role-based filtering
        if (user.role === 'Admin' || user.role === 'Buisness Admin' || user.role === 'Super Admin') {
            if (user.business) {
                // Business Admin: See all activities in their business
                whereClause.OR = [
                    { user: { business_id: user.business } },
                    { lead: { business_id: user.business } }
                ];
            }
            // else: Super Admin - see everything (empty whereClause)
        } else {
            // Regular User: See their own activities
            whereClause.user_id = user.id;
        }

        const activities = await prisma.activity.findMany({
            where: whereClause,
            include: {
                user: true,
                lead: true
            },
            orderBy: {
                timestamp: "desc"
            },
            take: 20
        });

        return res.status(200).json({
            status: 200,
            data: activities,
            message: "Activities fetched successfully"
        });
    } catch (error: any) {
        return res.status(500).json({
            status: 500,
            message: error.message
        });
    }
}
