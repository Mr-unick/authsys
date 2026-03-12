/**
 * Application constants — permissions, authorization gates, and lead stages.
 * This is the single source of truth for route-permission mappings (E10).
 */

// ---------- Permissions ----------
export const permissions = [
    'view_dashboard',
    'view_leads',
    'create_lead',
    'edit_lead',
    'delete_lead',
    'assign_leads',
    'import_leads',
    'view_lead_details',
    'view_users',
    'create_user',
    'edit_user',
    'delete_user',
    'view_branches',
    'create_branch',
    'edit_branch',
    'delete_branch',
    'view_roles',
    'create_role',
    'edit_role',
    'delete_role',
    'view_stages',
    'create_stage',
    'edit_stage',
    'delete_stage',
    'view_integrations',
    'manage_integrations',
    'view_settings',
    'update_settings',
    'view_area_of_operation',
    'create_area_of_operation',
    'edit_area_of_operation',
    'delete_area_of_operation',
] as const;

export type Permission = (typeof permissions)[number];

// ---------- Authorization Gates (single source of truth) ----------
export interface Gate {
    route: string;
    permissionRequired: string;
}

export const Gates: Gate[] = [
    { route: '/', permissionRequired: 'view_dashboard' },
    { route: 'boardleads', permissionRequired: 'view_leads' },
    { route: 'tableleads', permissionRequired: 'view_leads' },
    { route: 'leaddetails', permissionRequired: 'view_lead_details' },
    { route: 'users', permissionRequired: 'view_users' },
    { route: 'branches', permissionRequired: 'view_branches' },
    { route: 'leadstages', permissionRequired: 'view_stages' },
    { route: 'roles', permissionRequired: 'view_roles' },
    { route: 'settings', permissionRequired: 'view_settings' },
    { route: 'integrations', permissionRequired: 'view_integrations' },
    { route: 'areaofsales', permissionRequired: 'view_area_of_operation' },
];


// ---------- Lead Stages (default stage definitions) ----------
export const DefaultStages = [
    { stage: 'Prospecting', colour: '#3B82F6' },
    { stage: 'Qualification', colour: '#10B981' },
    { stage: 'NeedsAnalysis', colour: '#14B8A6' },
    { stage: 'ProposalSent', colour: '#F59E0B' },
    { stage: 'Negotiation', colour: '#FB923C' },
    { stage: 'ClosedWon', colour: '#8B5CF6' },
    { stage: 'ClosedLost', colour: '#EF4444' },
    { stage: 'FollowUp', colour: '#6B7280' },
] as const;

// ---------- Auth cookie config ----------
export const AUTH_COOKIE_NAME = 'token';
export const AUTH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24; // 24 hours — aligned with JWT expiration
export const JWT_EXPIRATION = '24h';
