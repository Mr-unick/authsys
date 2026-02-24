/**
 * Application constants — permissions, authorization gates, and lead stages.
 * This is the single source of truth for route-permission mappings (E10).
 */

// ---------- Permissions ----------
export const permissions = [
    'view_dashboard',
    'view_settings',
    'view_about',
    'view_contact',
    'view_nested_dashboard',
    'create_post',
    'posts_edit',
    'view_user',
    'view_notifications',
] as const;

export type Permission = (typeof permissions)[number];

// ---------- Authorization Gates (single source of truth) ----------
export interface Gate {
    route: string;
    permissionRequired: string;
}

export const Gates: Gate[] = [
    { route: '/', permissionRequired: 'view_dashboard' },
    { route: 'boardleads', permissionRequired: 'view_dashboard' },
    { route: 'tableleads', permissionRequired: 'view_nested_dashboard' },
    { route: 'users', permissionRequired: 'view_contact' },
    { route: 'branches', permissionRequired: 'view_branches' },
    { route: 'leadstages', permissionRequired: 'view_leadstages' },
    { route: 'settings', permissionRequired: 'view_settings' },
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
