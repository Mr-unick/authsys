import prisma from "@/app/lib/prisma";

export default async function handler(req: any, res: any) {
    if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

    try {
        const config = await prisma.globalConfig.findUnique({
            where: { key: 'pricing_matrix' }
        });

        if (!config) {
            return res.status(200).json({ data: null, status: 200 });
        }

        return res.status(200).json({ data: config.value, status: 200 });
    } catch (e: any) {
        return res.status(500).json({ message: e.message, status: 500 });
    }
}
