/**
 * Authorization utilities — permission checking and route-permission mapping.
 * This module imports Gates from config/constants.ts (single source of truth).
 */

import { Gates } from '@/config/constants';

export interface UserInstance {
    role: string;
    permissions: string[];
}

/**
 * Checks if a user has a specific permission.
 * Admin users bypass all permission checks.
 */
export const haspermission = (user: any, requiredPermission: string): boolean => {
    const rawRole = typeof user?.role === 'string' ? user.role : (user?.role?.name || '');
    const role = rawRole.toString().toLowerCase().replace(/\s+/g, '_');

    const authLog = `[${new Date().toISOString()}] AUTH_CHECK: Role: "${role}", Permission: "${requiredPermission}"\n`;
    try { 
        const fs = require('fs');
        const path = require('path');
        fs.appendFileSync(path.join(process.cwd(), 'api_debug.log'), authLog); 
    } catch (e) {}

    console.log(`[AUTH_CHECK] Role: "${role}", Permission: "${requiredPermission}"`);

    // Super Admin bypass
    if (['super_admin', 'superadmin'].includes(role)) return true;

    // Business/Tenant Admin bypass - Usually they have full access in their business
    if (['admin', 'tenant_admin', 'business_admin', 'buisness_admin'].includes(role)) {
        return true;
    }

    // Branch Admin bypass - They have full access but scoped to their branch (scoping is handled in API whereClause)
    if (['branch_admin'].includes(role)) {
        return true;
    }

    // Check specific permissions for other roles (e.g., Sales, Manager)
    return user?.permissions?.includes(requiredPermission) ?? false;
};


/**
 * Checks if a user has permission to access a specific route.
 * Uses the unified Gates array from config/constants.ts.
 */
export const hasroutepermission = (user: UserInstance, route: string): boolean => {
    // Admin users have access to all routes
    const rawRole = typeof user?.role === 'string' ? user?.role : (user?.role as any)?.name || '';
    const role = rawRole.toString().toLowerCase().replace(/\s+/g, '_');
    if (['admin', 'tenant_admin', 'business_admin', 'buisness_admin', 'branch_admin', 'super_admin', 'superadmin'].includes(role)) {
        return true;
    }

    // Find the required permission for the route
    const gate = Gates.find((g) => g.route === route);

    // If the route is not found in Gates, deny access
    if (!gate) {
        return false;
    }

    // Check if the user has the required permission
    return user.permissions.includes(gate.permissionRequired);
};
