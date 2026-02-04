export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { generateTeamSlug, validateTeamSlug } from '@/lib/permissions';
import crypto from 'crypto';

// GET /api/teams - List all teams for current user
export async function GET() {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { data: memberships, error } = await supabaseAdmin
            .from('team_members')
            .select('role, teams(*)')
            .eq('user_id', userId);

        if (error) throw error;

        const teams = memberships?.map(m => ({
            ...m.teams,
            role: m.role
        })) || [];

        return NextResponse.json(teams);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/teams - Create a new team
export async function POST(req: NextRequest) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, slug: customSlug } = body;

        if (!name || name.trim().length < 3) {
            return NextResponse.json(
                { error: 'Team name must be at least 3 characters' },
                { status: 400 }
            );
        }

        // Generate or validate slug
        let slug = customSlug || generateTeamSlug(name);

        if (!validateTeamSlug(slug)) {
            return NextResponse.json(
                { error: 'Invalid team slug. Use lowercase letters, numbers, and hyphens only.' },
                { status: 400 }
            );
        }

        // Check if slug is already taken
        const { data: existing } = await supabaseAdmin
            .from('teams')
            .select('id')
            .eq('slug', slug)
            .single();

        if (existing) {
            // Add random suffix if slug is taken
            slug = `${slug}-${crypto.randomBytes(3).toString('hex')}`;
        }

        // Create team
        const { data: team, error } = await supabaseAdmin
            .from('teams')
            .insert({
                name: name.trim(),
                slug,
                owner_id: userId,
                plan: 'free'
            })
            .select()
            .single();

        if (error) throw error;

        // Team owner membership is created automatically by trigger

        return NextResponse.json(team, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
