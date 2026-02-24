import prisma from "@/app/lib/prisma";
import { VerifyToken } from "@/utils/VerifyToken";

export default async function getNotifications(req: any, res: any) {
    const user = await VerifyToken(req, res, null);
    if (res.writableEnded) return;

    try {
        const notifications = await prisma.notification.findMany({
            where: {
                user_id: user.id
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        return res.status(200).json({
            status: 200,
            data: notifications
        });
    } catch (error: any) {
        return res.status(500).json({
            status: 500,
            message: error.message
        });
    }
}
