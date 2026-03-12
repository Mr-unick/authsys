import { ResponseInstance } from '@/utils/instances';
import { jwtVerify } from 'jose';
import { env } from '@/config/env';
import fs from 'fs';
import path from 'path';

export default async function handler(req: any, res: any) {
    console.log('API REQUEST (isauth):', req.method, req.url, 'TOKEN:', !!req.cookies?.token);
    try {
        const token = req.cookies?.token;

        if (!token) {
            const response: ResponseInstance = {
                data: [],
                message: "Unauthorized — missing token",
                status: 401,
            };
            return res.status(401).json(response);
        }

        const secretKey = new TextEncoder().encode(env.JWT_SECRET);
        console.log('JWT_SECRET length:', env.JWT_SECRET.length);
        const { payload } = await jwtVerify(token, secretKey);

        const response: ResponseInstance = {
            data: payload,
            message: "Authenticated",
            status: 200,
        };
        return res.status(200).json(response);
    } catch (error: any) {
        console.log('AUTH FAILED:', error.message);
        const logMsg = `[${new Date().toISOString()}] ISAUTH FAILED: ${error.message}\n`;
        try { fs.appendFileSync(path.join(process.cwd(), 'auth_debug.log'), logMsg); } catch (e) { }

        const response: ResponseInstance = {
            data: [],
            message: `Authentication failed: ${error.message}`,
            status: 401,
        };
        return res.status(401).json(response);
    }
}