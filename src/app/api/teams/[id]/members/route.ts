export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { hasPermission, getUserTeamRole } from '@/lib/permissions';

// GET /api/teams/[id]/members - List team members
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
        const role = await getUserTeamRole(teamId, userId);
        if (!role) {
            return NextResponse.json({ error: 'Not a team member' }, { status: 403 });
        }

        const { data: members, error } = await supabaseAdmin
            .from('team_members')
            .select('*')
            .eq('team_id', teamId)
            .order('joined_at', { ascending: true });

        if (error) throw error;

        // 3. Batch fetch user details from Clerk manually (O(1) request instead of O(N))
        const client = await clerkClient();
        const userIds = members.map(m => m.user_id);

        let clerkUsers: any[] = [];
        if (userIds.length > 0) {
            const userList = await client.users.getUserList({
                userId: userIds,
                limit: userIds.length
            });
            clerkUsers = userList.data;
        }

        const membersWithDetails = members.map((member) => {
            const user = clerkUsers.find(u => u.id === member.user_id);
            return {
                ...member,
                email: user?.emailAddresses[0]?.emailAddress || 'Unknown',
                name: user ? (user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.username || 'Unknown') : 'Unknown User',
                avatar: user?.imageUrl || null
            };
        });

        return NextResponse.json(membersWithDetails);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE /api/teams/[id]/members/[memberId] - Remove team member
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
        const memberIdToRemove = searchParams.get('memberId');

        if (!memberIdToRemove) {
            return NextResponse.json({ error: 'Member ID required' }, { status: 400 });
        }

        // Check if user can remove members or is removing themselves
        const canRemove = await hasPermission(teamId, userId, 'canRemoveMembers');
        const isSelf = memberIdToRemove === userId;

        if (!canRemove && !isSelf) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        // Cannot remove the owner
        const { data: memberToRemove } = await supabaseAdmin
            .from('team_members')
            .select('role')
            .eq('team_id', teamId)
            .eq('user_id', memberIdToRemove)
            .single();

        if (memberToRemove?.role === 'owner') {
            return NextResponse.json({ error: 'Cannot remove team owner' }, { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from('team_members')
            .delete()
            .eq('team_id', teamId)
            .eq('user_id', memberIdToRemove);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH /api/teams/[id]/members/[memberId] - Update member role
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
        const body = await req.json();
        const { memberId, role } = body;

        if (!memberId || !role) {
            return NextResponse.json({ error: 'Member ID and role required' }, { status: 400 });
        }

        // Check permission
        const canChangeRoles = await hasPermission(teamId, userId, 'canChangeRoles');
        if (!canChangeRoles) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        // Cannot change owner role
        const { data: memberToUpdate } = await supabaseAdmin
            .from('team_members')
            .select('role')
            .eq('team_id', teamId)
            .eq('user_id', memberId)
            .single();

        if (memberToUpdate?.role === 'owner') {
            return NextResponse.json({ error: 'Cannot change owner role' }, { status: 400 });
        }

        const { data: member, error } = await supabaseAdmin
            .from('team_members')
            .update({ role })
            .eq('team_id', teamId)
            .eq('user_id', memberId)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(member);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
