import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/lib/prisma';
import { VerifyToken } from '@/utils/VerifyToken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const user = await VerifyToken(req, res, null);
        if (!user) return; // VerifyToken already sent a 401 response

        const { subscription } = req.body;
        if (!subscription || !subscription.endpoint) {
            return res.status(400).json({ message: 'Invalid subscription' });
        }

        const { endpoint, keys } = subscription;
        const userId = (user as any).id as number;

        await prisma.pushSubscription.upsert({
            where: { endpoint },
            update: {
                user_id: userId,
                p256dh: keys.p256dh,
                auth: keys.auth,
            },
            create: {
                endpoint,
                p256dh: keys.p256dh,
                auth: keys.auth,
                user_id: userId,
            },
        });

        return res.status(200).json({ message: 'Subscription saved successfully' });
    } catch (error: any) {
        console.error('Subscription error:', error?.message || error);
        return res.status(500).json({ message: 'Internal server error', detail: error?.message });
    }
}
