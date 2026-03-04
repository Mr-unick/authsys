import prisma from "@/app/lib/prisma";
import { VerifyToken } from "@/utils/VerifyToken";
import fs from 'fs';

export default async function getActivities(req: any, res: any) {
    const user = await VerifyToken(req, res, null);
    if (res.writableEnded) return;

    try {
        const rawRole = (typeof user.role === 'string' ? user.role : (user.role?.name || 'USER'));
        const role = rawRole.trim().toUpperCase().replace(/\s+/g, '_');
        const businessId = user.business;
        const permissions = user.permissions || [];

        // Identify if this is a platform-level administrator
        const isPortalAdmin = role.includes('SUPER') ||
            (role.includes('ADMIN') && (!businessId || businessId === 0)) ||
            permissions.includes('*');

        const whereClause: any = {};

        if (isPortalAdmin) {
            // Portal Admin: See activities marked for platform staff management
            whereClause.super_admin_id = { not: null };
        } else if (businessId) {
            // Tenant Users: See activities within their business shard
            whereClause.OR = [
                { user: { business_id: businessId } },
                { lead: { business_id: businessId } }
            ];

            // If they aren't an admin, further restrict to their own ID
            const isTenantAdmin = role === 'BUSINESS_ADMIN' || role === 'BUISNESS_ADMIN' || role === 'ADMIN' || role === 'TENANT_ADMIN';
            if (!isTenantAdmin) {
                whereClause.user_id = user.id;
            }
        } else {
            // Fallback for isolated users
            whereClause.user_id = user.id;
        }

        const includeObj: any = {
            user: true,
            lead: true
        };

        // Dynamically check if superAdmin relation exists in this client build
        // to prevent "Unknown field" errors if schema and client are out of sync
        const activityModel = (prisma as any)._baseDmmf?.modelMap?.Activity ||
            (prisma as any)._dmmf?.modelMap?.Activity;

        if (activityModel?.fields?.some((f: any) => f.name === 'superAdmin')) {
            includeObj.superAdmin = true;
        }

        const activities = await (prisma as any).activity.findMany({
            where: whereClause,
            include: includeObj,
            orderBy: {
                timestamp: "desc"
            },
            take: 30
        });

        return res.status(200).json({
            status: 200,
            data: activities,
            message: "Activities fetched successfully"
        });
    } catch (error: any) {
        fs.appendFileSync('activity_error.txt', `\n[${new Date().toISOString()}] ACTIVITY API ERROR: ${error.stack || error.message}\n`);
        console.error("[getActivities ERROR]", error);
        return res.status(500).json({
            status: 500,
            message: error.message
        });
    }
}
