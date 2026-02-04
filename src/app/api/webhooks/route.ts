export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import crypto from 'crypto';

// GET /api/webhooks - List all webhooks for the current user
export async function GET() {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { data: webhooks, error } = await supabaseAdmin
            .from('webhooks')
            .select('*, agents(name)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json(webhooks);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/webhooks - Create a new webhook
export async function POST(req: NextRequest) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, url, events, agent_id, retry_count, timeout_ms } = body;

        // Validation
        if (!name || !url || !events || !Array.isArray(events) || events.length === 0) {
            return NextResponse.json(
                { error: 'Missing required fields: name, url, events' },
                { status: 400 }
            );
        }

        // Validate URL format
        try {
            new URL(url);
        } catch {
            return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
        }

        // Validate event types
        const validEvents = [
            'chat.started',
            'chat.completed',
            'tool.executed',
            'approval.requested',
            'approval.granted',
            'approval.denied',
            'memory.stored',
            'document.uploaded',
            'error.occurred'
        ];

        const invalidEvents = events.filter((e: string) => !validEvents.includes(e));
        if (invalidEvents.length > 0) {
            return NextResponse.json(
                { error: `Invalid event types: ${invalidEvents.join(', ')}` },
                { status: 400 }
            );
        }

        // Generate a secure secret for HMAC signatures
        const secret = crypto.randomBytes(32).toString('hex');

        const { data: webhook, error } = await supabaseAdmin
            .from('webhooks')
            .insert({
                user_id: userId,
                name,
                url,
                events,
                agent_id: agent_id || null,
                secret,
                retry_count: retry_count || 3,
                timeout_ms: timeout_ms || 5000,
                is_active: true
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(webhook, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
