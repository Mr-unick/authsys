import prisma from "@/app/lib/prisma";
import { VerifyToken } from "@/utils/VerifyToken";

export default async function handler(req: any, res: any) {
    const user = await VerifyToken(req, res, null);
    if (res.writableEnded) return;

    // Only SUPER_ADMIN can manage global configuration
    const rawRole = (typeof user.role === 'string' ? user.role : (user.role?.name || 'USER'));
    const role = rawRole.trim().toUpperCase().replace(/\s+/g, '_');

    if (role !== 'SUPER_ADMIN') {
        return res.status(403).json({ message: "Forbidden: Super Admin access required", status: 403 });
    }

    if (req.method === "GET") {
        try {
            const { key } = req.query;
            if (key) {
                const config = await prisma.globalConfig.findUnique({
                    where: { key: String(key) }
                });
                return res.status(200).json({ data: config, status: 200 });
            }

            const configs = await prisma.globalConfig.findMany();
            return res.status(200).json({ data: configs, status: 200 });
        } catch (e: any) {
            return res.status(500).json({ message: e.message, status: 500 });
        }
    }

    if (req.method === "POST" || req.method === "PUT") {
        try {
            const { key, value } = req.body;
            if (!key) return res.status(400).json({ message: "Key is required", status: 400 });

            const config = await prisma.globalConfig.upsert({
                where: { key },
                update: { value },
                create: { key, value }
            });

            return res.status(200).json({ message: "Configuration updated", data: config, status: 200 });
        } catch (e: any) {
            return res.status(500).json({ message: e.message, status: 500 });
        }
    }

    return res.status(405).json({ message: "Method not allowed", status: 405 });
}
