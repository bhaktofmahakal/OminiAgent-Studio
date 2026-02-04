export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// POST /api/teams/accept-invitation - Accept team invitation
export async function POST(req: NextRequest) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { token } = body;

        if (!token) {
            return NextResponse.json({ error: 'Invitation token required' }, { status: 400 });
        }

        // Find invitation
        const { data: invitation, error: inviteError } = await supabaseAdmin
            .from('team_invitations')
            .select('*, teams(name)')
            .eq('token', token)
            .is('accepted_at', null)
            .single();

        if (inviteError || !invitation) {
            return NextResponse.json({ error: 'Invalid or expired invitation' }, { status: 404 });
        }

        // Check if invitation has expired
        if (new Date(invitation.expires_at) < new Date()) {
            return NextResponse.json({ error: 'Invitation has expired' }, { status: 400 });
        }

        // Check if user is already a member
        const { data: existingMember } = await supabaseAdmin
            .from('team_members')
            .select('id')
            .eq('team_id', invitation.team_id)
            .eq('user_id', userId)
            .single();

        if (existingMember) {
            return NextResponse.json({ error: 'Already a team member' }, { status: 400 });
        }

        // Add user to team
        const { data: member, error: memberError } = await supabaseAdmin
            .from('team_members')
            .insert({
                team_id: invitation.team_id,
                user_id: userId,
                role: invitation.role,
                invited_by: invitation.invited_by
            })
            .select()
            .single();

        if (memberError) throw memberError;

        // Mark invitation as accepted
        await supabaseAdmin
            .from('team_invitations')
            .update({ accepted_at: new Date().toISOString() })
            .eq('id', invitation.id);

        return NextResponse.json({
            success: true,
            team: invitation.teams,
            member
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// GET /api/teams/accept-invitation?token=xxx - Get invitation details (before accepting)
export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json({ error: 'Token required' }, { status: 400 });
        }

        const { data: invitation, error } = await supabaseAdmin
            .from('team_invitations')
            .select('email, role, teams(name, slug), created_at, expires_at')
            .eq('token', token)
            .is('accepted_at', null)
            .single();

        if (error || !invitation) {
            return NextResponse.json({ error: 'Invalid invitation' }, { status: 404 });
        }

        // Check if expired
        if (new Date(invitation.expires_at) < new Date()) {
            return NextResponse.json({ error: 'Invitation has expired' }, { status: 400 });
        }

        return NextResponse.json(invitation);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
