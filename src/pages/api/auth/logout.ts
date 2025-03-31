import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { redirect } from 'next/navigation';
import { VerifyToken } from '@/utils/VerifyToken';

export default async function handler(req, res) {

    try {

        const user = VerifyToken(req, res, null);

        if (!user) {
            return res.status(401).json({
                message: 'Unauthorized',
            });
        }

        const serializedCookie = serialize('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(0), // Expires immediately
            path: '/',
        });

        res.setHeader('Set-Cookie', serializedCookie);


        return res.status(200).json({
            message: 'Logged out successfully',
        });

    } catch (error) {

        return res.status(500).json({
            message: 'Logout unsuccessful',
            error: error.message,
        });
    }
}
