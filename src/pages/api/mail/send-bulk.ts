import { sendBulkMail } from "@/services/mailService";
import { VerifyToken } from "@/utils/VerifyToken";

export default async function handler(req: any, res: any) {
    const user = await VerifyToken(req, res, 'integrations');
    if (res.writableEnded) return;

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { subject, body, recipients } = req.body;

    if (!subject || !body || !recipients || !Array.isArray(recipients)) {
        return res.status(400).json({ message: 'Missing required fields: subject, body, recipients(array)' });
    }

    try {
        const result = await sendBulkMail({
            businessId: user.business_id,
            subject,
            body,
            recipients
        });

        return res.status(200).json({
            message: 'Bulk mail process completed',
            data: result
        });
    } catch (error: any) {
        console.error('[bulk-mail-send] Error:', error);
        return res.status(500).json({ message: error.message });
    }
}
