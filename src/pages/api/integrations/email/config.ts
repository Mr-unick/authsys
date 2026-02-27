import prisma from "@/app/lib/prisma";
import { VerifyToken } from "@/utils/VerifyToken";

export default async function handler(req: any, res: any) {
    const user = await VerifyToken(req, res, 'integrations');
    if (res.writableEnded) return;

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const businessId = user.business_id;
    const config = req.body;

    if (!config) {
        return res.status(400).json({ message: 'Missing configuration' });
    }

    try {
        // Find existing email integration or create new one
        const existing = await prisma.integration.findFirst({
            where: { business_id: businessId, provider: 'email' }
        });

        const data = {
            business_id: businessId,
            provider: 'email',
            display_name: 'Bulk Email (SMTP)',
            status: config.is_active ? 'connected' : 'disconnected',
            config: config as any,
        };

        if (existing) {
            await prisma.integration.update({
                where: { id: existing.id },
                data
            });
        } else {
            await prisma.integration.create({
                data
            });
        }

        return res.status(200).json({ message: 'Email configuration saved' });
    } catch (error: any) {
        console.error('[email-config] Error:', error);
        return res.status(500).json({ message: error.message });
    }
}
