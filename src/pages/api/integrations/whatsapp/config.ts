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
        // Find existing whatsapp integration or create new one
        const existing = await prisma.integration.findFirst({
            where: { business_id: businessId, provider: 'whatsapp' }
        });

        if (existing) {
            await prisma.integration.update({
                where: { id: existing.id },
                data: {
                    config: config as any,
                    status: config.is_active ? 'connected' : 'disconnected',
                    display_name: 'WhatsApp Notifications',
                }
            });
        } else {
            await prisma.integration.create({
                data: {
                    business_id: businessId,
                    provider: 'whatsapp',
                    display_name: 'WhatsApp Notifications',
                    status: config.is_active ? 'connected' : 'disconnected',
                    config: config as any,
                }
            });
        }

        return res.status(200).json({ message: 'WhatsApp configuration saved' });
    } catch (error: any) {
        console.error('[whatsapp-config] Error:', error);
        return res.status(500).json({ message: error.message });
    }
}
