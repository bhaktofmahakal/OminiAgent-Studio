export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { hasPermission } from '@/lib/permissions';
import { randomBytes } from 'crypto';

// GET /api/teams/[id]/invitations - List pending invitations
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
        // Check permission
        const canInvite = await hasPermission(teamId, userId, 'canInviteMembers');
        if (!canInvite) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        const { data: invitations, error } = await supabaseAdmin
            .from('team_invitations')
            .select('*')
            .eq('team_id', teamId)
            .is('accepted_at', null) // Only pending invitations
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json(invitations);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/teams/[id]/invitations - Create invitation
export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { userId } = await auth();
    const { id: teamId } = await context.params;

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { email, role } = body;

        if (!email || !role) {
            return NextResponse.json({ error: 'Email and role required' }, { status: 400 });
        }

        // Validate role
        if (!['admin', 'developer', 'viewer'].includes(role)) {
            return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
        }

        // Check permission
        const canInvite = await hasPermission(teamId, userId, 'canInviteMembers');
        if (!canInvite) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        // Check if user is already a member
        const { data: existingMember } = await supabaseAdmin
            .from('team_members')
            .select('id')
            .eq('team_id', teamId)
            .eq('user_id', email) // This won't work perfectly, need to check by email
            .single();

        if (existingMember) {
            return NextResponse.json({ error: 'User is already a team member' }, { status: 400 });
        }

        // Check if invitation already exists
        const { data: existingInvitation } = await supabaseAdmin
            .from('team_invitations')
            .select('id')
            .eq('team_id', teamId)
            .eq('email', email.toLowerCase())
            .is('accepted_at', null)
            .single();

        if (existingInvitation) {
            return NextResponse.json({ error: 'Invitation already sent to this email' }, { status: 400 });
        }

        // Generate unique token
        const token = randomBytes(32).toString('hex');

        // Set expiration (7 days from now)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const { data: invitation, error } = await supabaseAdmin
            .from('team_invitations')
            .insert({
                team_id: teamId,
                email: email.toLowerCase(),
                role,
                invited_by: userId,
                token,
                expires_at: expiresAt.toISOString()
            })
            .select()
            .single();

        if (error) throw error;

        // TODO: Send invitation email
        // For now, return the invitation link
        const invitationLink = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${token}`;

        return NextResponse.json({
            ...invitation,
            invitation_link: invitationLink
        }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE /api/teams/[id]/invitations/[invitationId] - Cancel invitation
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
        const searchParams = req.nextUrl.searchParams;
        const invitationId = searchParams.get('invitationId');

        if (!invitationId) {
            return NextResponse.json({ error: 'Invitation ID required' }, { status: 400 });
        }

        // Check permission
        const canInvite = await hasPermission(teamId, userId, 'canInviteMembers');
        if (!canInvite) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        const { error } = await supabaseAdmin
            .from('team_invitations')
            .delete()
            .eq('id', invitationId)
            .eq('team_id', teamId);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
