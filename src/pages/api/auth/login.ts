import prisma from "@/app/lib/prisma";
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import bcrypt from 'bcryptjs';
import { env } from '@/config/env';
import { AUTH_COOKIE_NAME, AUTH_COOKIE_MAX_AGE_SECONDS, JWT_EXPIRATION } from '@/config/constants';
import { activityLog } from "@/utils/activityLogs";
import { ActivityType } from "@/utils/activityTypes";


export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed', status: 405 });
    }

    try {
        const { email, password } = req.body;

        // Input validation
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required',
                status: 400,
            });
        }

        let user: any = await prisma.user.findUnique({
            where: { email },
            include: {
                role: {
                    include: {
                        rolePermissions: {
                            include: {
                                permission: true
                            }
                        }
                    }
                },
                business: true
            }
        });

        let isSuperAdmin = false;
        if (!user) {
            user = await prisma.superAdmin.findUnique({
                where: { email }
            });
            if (user) {
                isSuperAdmin = true;
            }
        }

        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password',
                status: 401,
            });
        }

        console.log(`Checking password for ${email}`);
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        console.log(`Password valid: ${isPasswordValid}`);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Incorrect password',
                status: 401,
            });
        }

        // Extract permissions
        const permissions = isSuperAdmin
            ? ['*'] // Super admin has all permissions
            : (user.role?.rolePermissions?.map((p: any) => p.permission?.permission).filter(Boolean) || []);

        // Build token payload (exclude password)
        const tokenPayload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: isSuperAdmin ? 'SUPER_ADMIN' : (user.is_branch_admin ? 'BRANCH_ADMIN' : (user.role?.name || 'USER')),
            business: isSuperAdmin ? null : user.business_id,
            branch: isSuperAdmin ? null : (user.branch_id || null),
            is_branch_admin: isSuperAdmin ? false : (user.is_branch_admin || false),
            permissions,
        };

        // Use environment-sourced JWT secret
        const token = jwt.sign(tokenPayload, env.JWT_SECRET, { expiresIn: JWT_EXPIRATION });

        // Cookie maxAge aligned with JWT expiration
        const serializedCookie = serialize(AUTH_COOKIE_NAME, token, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            maxAge: AUTH_COOKIE_MAX_AGE_SECONDS,
            path: '/',
            sameSite: 'strict',
        });

        res.setHeader('Set-Cookie', serializedCookie);

        // turbo
        if (isSuperAdmin) {
            await activityLog(ActivityType.LOGIN, `${user.name} logged in`, undefined, undefined, user.id);
        } else {
            await activityLog(ActivityType.LOGIN, `${user.name} logged in`, user.id);
        }

        return res.status(200).json({
            message: 'Login successful',
            status: 200,
        });
    } catch (error: any) {
        console.error("[Login API Error]:", error);
        // Include stack trace only in dev for security
        return res.status(500).json({
            message: 'Login unsuccessful',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            status: 500,
        });
    }
}
