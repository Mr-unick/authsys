import { ResponseInstance } from '@/utils/instances';
import { jwtVerify } from 'jose';
import { env } from '@/config/env';

export default async function handler(req: any, res: any) {
    try {
        const token = req.cookies.token;

        if (!token) {
            const response: ResponseInstance = {
                data: [],
                message: "Unauthorized",
                status: 401,
            };
            return res.status(401).json(response);
        }

        const secretKey = new TextEncoder().encode(env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secretKey);

        const response: ResponseInstance = {
            data: payload,
            message: "Authenticated",
            status: 200,
        };
        return res.status(200).json(response);
    } catch (error: any) {
        const response: ResponseInstance = {
            data: [],
            message: "Authentication failed",
            status: 401,
        };
        return res.status(401).json(response);
    }
}