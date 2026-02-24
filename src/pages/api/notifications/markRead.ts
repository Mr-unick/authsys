import prisma from "@/app/lib/prisma";
import { VerifyToken } from "@/utils/VerifyToken";

export default async function markRead(req: any, res: any) {
    const user = await VerifyToken(req, res, null);
    if (res.writableEnded) return;

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { id, all } = req.body;

        if (all) {
            await prisma.notification.updateMany({
                where: {
                    user_id: user.id,
                    status: 'unread'
                },
                data: {
                    status: 'read'
                }
            });
        } else if (id) {
            await prisma.notification.update({
                where: {
                    id: Number(id),
                    user_id: user.id
                },
                data: {
                    status: 'read'
                }
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'Notifications updated successfully'
        });
    } catch (error: any) {
        return res.status(500).json({
            status: 500,
            message: error.message
        });
    }
}
