import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { auth } from '@clerk/nextjs/server'
import { createChatSession } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { agentId, messages, modelUsed, totalTokens, totalLatency } = body

        // Save conversation to database
        const session = await createChatSession({
            agent_id: agentId,
            user_id: userId,
            messages: messages || [],
            model_used: modelUsed,
            total_tokens: totalTokens || 0,
            total_latency: totalLatency || 0,
        })

        return NextResponse.json(session, { status: 201 })

    } catch (error: any) {
        console.error('Save conversation error:', error)

        return NextResponse.json(
            { error: error.message || 'Failed to save conversation' },
            { status: 500 }
        )
    }
}

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const agentId = searchParams.get('agentId')
        const limit = parseInt(searchParams.get('limit') || '50')

        let query = supabaseAdmin
            .from('chat_sessions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit)

        if (agentId) {
            query = query.eq('agent_id', agentId)
        }

        const { data: sessions, error } = await query

        if (error) throw error
        return NextResponse.json(sessions)

    } catch (error: any) {
        console.error('Get conversations error:', error)

        return NextResponse.json(
            { error: error.message || 'Failed to fetch conversations' },
            { status: 500 }
        )
    }
}
