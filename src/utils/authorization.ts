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
    const role = (user?.role || '').toString().toLowerCase().replace(/\s+/g, '_');
    if (['admin', 'tenant_admin', 'business_admin', 'buisness_admin', 'super_admin', 'superadmin'].includes(role)) {
        return true;
    }

    return user?.permissions?.includes(requiredPermission) ?? false;
};

/**
 * Checks if a user has permission to access a specific route.
 * Uses the unified Gates array from config/constants.ts.
 */
export const hasroutepermission = (user: UserInstance, route: string): boolean => {
    // Admin users have access to all routes
    const role = (user.role || '').toString().toLowerCase().replace(/\s+/g, '_');
    if (['admin', 'tenant_admin', 'business_admin', 'buisness_admin', 'super_admin', 'superadmin'].includes(role)) {
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
