export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET /api/webhooks/[id] - Get webhook details
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { userId } = await auth();
    const { id } = await context.params;

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { data: webhook, error } = await supabaseAdmin
            .from('webhooks')
            .select('*, agents(name)')
            .eq('id', id)
            .eq('user_id', userId)
            .single();

        if (error || !webhook) {
            return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
        }

        return NextResponse.json(webhook);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH /api/webhooks/[id] - Update webhook
export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { userId } = await auth();
    const { id } = await context.params;

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, url, events, is_active, retry_count, timeout_ms } = body;

        // Verify ownership
        const { data: existing } = await supabaseAdmin
            .from('webhooks')
            .select('id')
            .eq('id', id)
            .eq('user_id', userId)
            .single();

        if (!existing) {
            return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
        }

        const updates: any = {};
        if (name !== undefined) updates.name = name;
        if (url !== undefined) {
            try {
                new URL(url);
                updates.url = url;
            } catch {
                return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
            }
        }
        if (events !== undefined) updates.events = events;
        if (is_active !== undefined) updates.is_active = is_active;
        if (retry_count !== undefined) updates.retry_count = retry_count;
        if (timeout_ms !== undefined) updates.timeout_ms = timeout_ms;

        const { data: webhook, error } = await supabaseAdmin
            .from('webhooks')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(webhook);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE /api/webhooks/[id] - Delete webhook
export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { userId } = await auth();
    const { id } = await context.params;

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { error } = await supabaseAdmin
            .from('webhooks')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
