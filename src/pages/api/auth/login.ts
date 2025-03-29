import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { redirect } from 'next/navigation';

export default async function handler(req, res) {

   
    try {
        const user = {
            id: '1',
            buisness_id :1,
            username: 'John Doe',
            email: 'john@example.com',
            role: 'Buisness Admin',
            policy: 'admin',
            permissions: [
                'view_dashboard', 'update_settings', 'view_leadstages', 'view_freshleads', "view_branches", "update_branches", "create_branches", "delete_branches", 'view_users', 'view_area_of_operation', "view_leads", 'update_business', 'view_business',
            ]
        };

        const token = jwt.sign(user, 'your_secret_key', { expiresIn: '24h' });

        const serializedCookie = serialize('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 60 * 24,
            path: '/',
            sameSite: 'strict',
        });

        res.setHeader('Set-Cookie', serializedCookie);

        return res.status(200).json({
            message: 'Login successful',
        });

    } catch (error) {

        return res.status(500).json({
            message: 'Login unsuccessful',
            error: error.message,
        });
    }
}
