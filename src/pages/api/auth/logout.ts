import { serialize } from 'cookie';
import { AUTH_COOKIE_NAME } from '@/config/constants';
import { env } from '@/config/env';
import { jwtVerify } from 'jose';
import { activityLog } from "@/utils/activityLogs";
import { ActivityType } from "@/utils/activityTypes";

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const serializedCookie = serialize(AUTH_COOKIE_NAME, '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(0), // Expires immediately
            path: '/',
        });

        // Try to get user for logging, but don't fail if token is missing/invalid
        const token = req.cookies[AUTH_COOKIE_NAME];
        let user: any = null;
        if (token) {
            try {
                const secretKey = new TextEncoder().encode(env.JWT_SECRET);
                const { payload } = await jwtVerify(token, secretKey);
                user = payload;
            } catch (err) {
                // Token invalid/expired, ignore for logout
            }
        }

        if (user) {
            await activityLog(ActivityType.LOGOUT, `${user.name} logged out`, user.id);
        }

        res.setHeader('Set-Cookie', serializedCookie);

        return res.status(200).json({
            message: 'Logged out successfully',
        });
    } catch (error: any) {
        return res.status(500).json({
            message: 'Logout unsuccessful',
            error: error.message,
        });
    }
}
