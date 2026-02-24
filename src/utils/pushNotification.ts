import webpush from 'web-push';
import prisma from '@/app/lib/prisma';

const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
const privateKey = process.env.VAPID_PRIVATE_KEY || '';

if (publicKey && privateKey) {
    webpush.setVapidDetails(
        'mailto:noreply.leadmanager@gmail.com',
        publicKey,
        privateKey
    );
}

export const sendPushNotification = async (userId: number, title: string, body: string, url: string = '/') => {
    try {
        const subscriptions = await prisma.pushSubscription.findMany({
            where: { user_id: userId }
        });

        if (!subscriptions || subscriptions.length === 0) return;

        const payload = JSON.stringify({
            title,
            body,
            url,
            icon: '/icon-192x192.png'
        });

        const promises = subscriptions.map(async (sub) => {
            const pushConfig = {
                endpoint: sub.endpoint,
                keys: {
                    auth: sub.auth,
                    p256dh: sub.p256dh
                }
            };
            try {
                await webpush.sendNotification(pushConfig, payload);
            } catch (err: any) {
                if (err.statusCode === 404 || err.statusCode === 410) {
                    // Subscription expired — remove it
                    await prisma.pushSubscription.delete({ where: { id: sub.id } });
                } else {
                    console.error('Error sending push notification:', err.message);
                }
            }
        });

        await Promise.all(promises);
    } catch (error: any) {
        console.error('Error in sendPushNotification:', error?.message || error);
    }
};
