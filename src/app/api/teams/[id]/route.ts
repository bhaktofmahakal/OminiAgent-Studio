export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { hasPermission, isTeamOwner } from '@/lib/permissions';

// GET /api/teams/[id] - Get team details
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { userId } = await auth();
    const { id: teamId } = await context.params;

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Check if user is a member
        const { data: membership } = await supabaseAdmin
            .from('team_members')
            .select('role')
            .eq('team_id', teamId)
            .eq('user_id', userId)
            .single();

        if (!membership) {
            return NextResponse.json({ error: 'Not a team member' }, { status: 403 });
        }

        const { data: team, error } = await supabaseAdmin
            .from('teams')
            .select('*')
            .eq('id', teamId)
            .single();

        if (error || !team) {
            return NextResponse.json({ error: 'Team not found' }, { status: 404 });
        }

        return NextResponse.json({ ...team, role: membership.role });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH /api/teams/[id] - Update team
export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { userId } = await auth();
    const { id: teamId } = await context.params;

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Check permission
        const canEdit = await hasPermission(teamId, userId, 'canEditTeam');
        if (!canEdit) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        const body = await req.json();
        const { name, avatar_url } = body;

        const updates: any = {};
        if (name !== undefined) updates.name = name;
        if (avatar_url !== undefined) updates.avatar_url = avatar_url;

        const { data: team, error } = await supabaseAdmin
            .from('teams')
            .update(updates)
            .eq('id', teamId)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(team);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE /api/teams/[id] - Delete team
export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { userId } = await auth();
    const { id: teamId } = await context.params;

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Only owner can delete
        const isOwner = await isTeamOwner(teamId, userId);
        if (!isOwner) {
            return NextResponse.json({ error: 'Only team owner can delete team' }, { status: 403 });
        }

        const { error } = await supabaseAdmin
            .from('teams')
            .delete()
            .eq('id', teamId);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
