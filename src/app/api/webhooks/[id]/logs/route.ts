export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET /api/webhooks/[id]/logs - Get webhook delivery logs
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
        // Verify webhook ownership
        const { data: webhook } = await supabaseAdmin
            .from('webhooks')
            .select('id')
            .eq('id', id)
            .eq('user_id', userId)
            .single();

        if (!webhook) {
            return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
        }

        // Get query parameters for filtering
        const searchParams = req.nextUrl.searchParams;
        const limit = parseInt(searchParams.get('limit') || '50');
        const status = searchParams.get('status'); // 'success', 'failed', 'retrying'

        let query = supabaseAdmin
            .from('webhook_logs')
            .select('*')
            .eq('webhook_id', id)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (status) {
            query = query.eq('status', status);
        }

        const { data: logs, error } = await query;

        if (error) throw error;

        return NextResponse.json(logs);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
