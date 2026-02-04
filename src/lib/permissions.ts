import { supabaseAdmin } from './supabase-admin';

// Role types
export type TeamRole = 'owner' | 'admin' | 'developer' | 'viewer';

// Permission definitions
export interface Permissions {
    // Agent permissions
    canCreateAgent: boolean;
    canEditAgent: boolean;
    canDeleteAgent: boolean;
    canViewAgent: boolean;

    // Member permissions
    canInviteMembers: boolean;
    canRemoveMembers: boolean;
    canChangeRoles: boolean;

    // Team permissions
    canEditTeam: boolean;
    canDeleteTeam: boolean;
    canManageBilling: boolean;

    // Resource permissions
    canCreateApiKey: boolean;
    canDeleteApiKey: boolean;
    canCreateWebhook: boolean;
    canDeleteWebhook: boolean;

    // Analytics permissions
    canViewAnalytics: boolean;
    canExportData: boolean;
}

// Role-based permissions matrix
export const ROLE_PERMISSIONS: Record<TeamRole, Permissions> = {
    owner: {
        canCreateAgent: true,
        canEditAgent: true,
        canDeleteAgent: true,
        canViewAgent: true,
        canInviteMembers: true,
        canRemoveMembers: true,
        canChangeRoles: true,
        canEditTeam: true,
        canDeleteTeam: true,
        canManageBilling: true,
        canCreateApiKey: true,
        canDeleteApiKey: true,
        canCreateWebhook: true,
        canDeleteWebhook: true,
        canViewAnalytics: true,
        canExportData: true,
    },
    admin: {
        canCreateAgent: true,
        canEditAgent: true,
        canDeleteAgent: true,
        canViewAgent: true,
        canInviteMembers: true,
        canRemoveMembers: true,
        canChangeRoles: false, // Cannot change roles
        canEditTeam: true,
        canDeleteTeam: false, // Cannot delete team
        canManageBilling: false, // Cannot manage billing
        canCreateApiKey: true,
        canDeleteApiKey: true,
        canCreateWebhook: true,
        canDeleteWebhook: true,
        canViewAnalytics: true,
        canExportData: true,
    },
    developer: {
        canCreateAgent: true,
        canEditAgent: true,
        canDeleteAgent: false, // Cannot delete agents
        canViewAgent: true,
        canInviteMembers: false,
        canRemoveMembers: false,
        canChangeRoles: false,
        canEditTeam: false,
        canDeleteTeam: false,
        canManageBilling: false,
        canCreateApiKey: true,
        canDeleteApiKey: false, // Cannot delete API keys
        canCreateWebhook: true,
        canDeleteWebhook: false, // Cannot delete webhooks
        canViewAnalytics: true,
        canExportData: false,
    },
    viewer: {
        canCreateAgent: false,
        canEditAgent: false,
        canDeleteAgent: false,
        canViewAgent: true, // Read-only access
        canInviteMembers: false,
        canRemoveMembers: false,
        canChangeRoles: false,
        canEditTeam: false,
        canDeleteTeam: false,
        canManageBilling: false,
        canCreateApiKey: false,
        canDeleteApiKey: false,
        canCreateWebhook: false,
        canDeleteWebhook: false,
        canViewAnalytics: true, // Can view analytics
        canExportData: false,
    },
};

/**
 * Get user's role in a team
 */
export async function getUserTeamRole(
    teamId: string,
    userId: string
): Promise<TeamRole | null> {
    const { data, error } = await supabaseAdmin
        .from('team_members')
        .select('role')
        .eq('team_id', teamId)
        .eq('user_id', userId)
        .single();

    if (error || !data) return null;
    return data.role as TeamRole;
}

/**
 * Get user's permissions in a team
 */
export async function getUserPermissions(
    teamId: string,
    userId: string
): Promise<Permissions | null> {
    const role = await getUserTeamRole(teamId, userId);
    if (!role) return null;
    return ROLE_PERMISSIONS[role];
}

/**
 * Check if user has a specific permission
 */
export async function hasPermission(
    teamId: string,
    userId: string,
    permission: keyof Permissions
): Promise<boolean> {
    const permissions = await getUserPermissions(teamId, userId);
    if (!permissions) return false;
    return permissions[permission];
}

/**
 * Check if user is team owner
 */
export async function isTeamOwner(
    teamId: string,
    userId: string
): Promise<boolean> {
    const role = await getUserTeamRole(teamId, userId);
    return role === 'owner';
}

/**
 * Check if user is team admin or owner
 */
export async function isTeamAdminOrOwner(
    teamId: string,
    userId: string
): Promise<boolean> {
    const role = await getUserTeamRole(teamId, userId);
    return role === 'owner' || role === 'admin';
}

/**
 * Get all teams for a user
 */
export async function getUserTeams(userId: string) {
    const { data, error } = await supabaseAdmin
        .from('team_members')
        .select('team_id, role, teams(*)')
        .eq('user_id', userId);

    if (error) throw error;
    return data;
}

/**
 * Get team members with their details
 */
export async function getTeamMembers(teamId: string) {
    const { data, error } = await supabaseAdmin
        .from('team_members')
        .select('*')
        .eq('team_id', teamId)
        .order('joined_at', { ascending: true });

    if (error) throw error;
    return data;
}

/**
 * Validate team slug (for URL-friendly team names)
 */
export function validateTeamSlug(slug: string): boolean {
    // Must be lowercase, alphanumeric, and hyphens only
    // 3-50 characters
    const slugRegex = /^[a-z0-9-]{3,50}$/;
    return slugRegex.test(slug);
}

/**
 * Generate a unique team slug from name
 */
export function generateTeamSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 50);
}
