
import prisma from "@/app/lib/prisma";
import { VerifyToken } from "@/utils/VerifyToken";

export default async function UserDetails(req: any, res: any) {
    let user = await VerifyToken(req, res, null);
    if (res.writableEnded) return;

    try {
        const { query: { id } } = req;

        if (!user || !user.business) {
            return res.status(400).json({
                message: "Business ID not found in user data",
                data: []
            });
        }

        const userData = await prisma.user.findFirst({
            where: {
                id: Number(id),
                business_id: user.business
            },
            include: {
                activities: {
                    include: {
                        lead: true
                    },
                    orderBy: {
                        timestamp: 'desc'
                    }
                },
                leadUsers: { include: { lead: true } },
                role: true
            }
        });

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(userData);
    } catch (error: any) {
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
}
