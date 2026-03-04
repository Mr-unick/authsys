import { activityEmitter } from "@/utils/activityEmitter";
import { VerifyToken } from "@/utils/VerifyToken";
import prisma from "@/app/lib/prisma";

export default async function handler(req: any, res: any) {
    if (req.method !== 'GET') {
        return res.status(405).end();
    }

    const user = await VerifyToken(req, res, null);
    if (res.writableEnded) return;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Keep track of notified reminders in this session to avoid duplicates
    const notifiedReminders = new Set<string>();

    // Helper to check for upcoming reminders
    const checkReminders = async () => {
        try {
            const now = new Date();
            const inOneHour = new Date(now.getTime() + 65 * 60 * 1000); // 65 mins buffer

            const upcomingLeads = await prisma.lead.findMany({
                where: {
                    deleted_at: null,
                    nextFollowUp: {
                        gt: now,
                        lte: inOneHour
                    },
                    leadUsers: {
                        some: {
                            user_id: user.id
                        }
                    }
                }
            });

            for (const lead of upcomingLeads) {
                const reminderKey = `${lead.id}-${lead.nextFollowUp?.getTime()}`;
                if (!notifiedReminders.has(reminderKey)) {
                    const notification = {
                        id: Math.random(), // Virtual ID for SSE
                        message: `Reminder: Follow-up with ${lead.name} at ${lead.nextFollowUp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                        url: `/leads/details/${lead.id}`,
                        user_id: user.id,
                        created_at: new Date(),
                        sseType: 'notification'
                    };
                    res.write(`data: ${JSON.stringify(notification)}\n\n`);
                    notifiedReminders.add(reminderKey);
                }
            }
        } catch (error) {
            console.error("Reminder check failed:", error);
        }
    };

    // Run initial check and then every 5 minutes
    checkReminders();
    const reminderInterval = setInterval(checkReminders, 5 * 60 * 1000);

    // Keep connection alive with heartbeat
    const heartbeat = setInterval(() => {
        res.write(': heartbeat\n\n');
    }, 15000);

    const onActivity = (activity: any) => {
        // ... filter logic ...
        const isSuperAdmin = (user.role === 'Admin' || user.role === 'Super Admin' || user.role === 'SUPER_ADMIN') && !user.business;
        const isBusinessAdmin = (user.role === 'Admin' || user.role === 'Business Admin' || user.role === 'Buisness Admin' || user.role === 'TENANT_ADMIN' || user.role === 'Tenant Admin') && user.business;

        let shouldSend = false;

        if (isSuperAdmin) {
            shouldSend = true;
        } else if (isBusinessAdmin) {
            const activityBusinessId = activity.user?.business_id || activity.lead?.business_id;
            if (activityBusinessId === user.business) {
                shouldSend = true;
            }
        } else {
            if (activity.user_id === user.id) {
                shouldSend = true;
            }
        }

        if (shouldSend) {
            res.write(`data: ${JSON.stringify({ ...activity, sseType: 'activity' })}\n\n`);
        }
    };

    const onNotification = (notification: any) => {
        if (notification.user_id === user.id) {
            res.write(`data: ${JSON.stringify({ ...notification, sseType: 'notification' })}\n\n`);
        }
    };

    activityEmitter.on('newActivity', onActivity);
    activityEmitter.on('newNotification', onNotification);

    // Clean up on close
    req.on('close', () => {
        clearInterval(heartbeat);
        clearInterval(reminderInterval);
        activityEmitter.off('newActivity', onActivity);
        activityEmitter.off('newNotification', onNotification);
        res.end();
    });
}
