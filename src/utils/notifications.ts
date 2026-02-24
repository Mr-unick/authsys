import prisma from "@/app/lib/prisma";
import activityEmitter from "./activityEmitter";

/**
 * Creates a notification for a specific user.
 * 
 * @param userId - ID of the user to receive the notification
 * @param message - The notification message
 */
export const createNotification = async (userId: number, message: string, url?: string) => {
    try {
        const notification = await prisma.notification.create({
            data: {
                user_id: userId,
                message: message,
                url: url,
                status: "unread",
                created_at: new Date()
            }
        });

        // Emit for real-time updates if needed
        activityEmitter.emit('newNotification', notification);

        // Send push notification to user's devices
        const { sendPushNotification } = require("./pushNotification");
        sendPushNotification(userId, "New Notification", message, url);

        return notification;
    } catch (error: any) {
        console.error("[CreateNotification] Error:", error.message);
    }
}
