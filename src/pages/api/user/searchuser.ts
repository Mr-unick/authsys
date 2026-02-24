import prisma from "@/app/lib/prisma";
import { VerifyToken } from "@/utils/VerifyToken";

export default async function searchUsers(req: any, res: any) {
    let user = await VerifyToken(req, res, null);
    if (res.writableEnded) return;

    try {
        const query = req.query.q as string;

        if (!user || !user.business) {
            return res.status(400).json({
                message: "Business ID not found in user data",
                data: []
            });
        }

        const users = await prisma.user.findMany({
            where: {
                business_id: user.business,
                ...(query ? {
                    name: {
                        contains: query,
                    }
                } : {})
            },
            take: 10
        });

        res.json(users);
    } catch (error: any) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
}
