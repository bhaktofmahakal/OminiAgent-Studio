import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

/**
 * GET /api/conversations/[id] - Fetch a specific conversation
 */
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth()
        const { id } = await context.params

        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { data, error } = await supabaseAdmin
            .from('chat_sessions')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .single()

        if (error || !data) {
            return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
        }

        return NextResponse.json(data)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

/**
 * PATCH /api/conversations/[id] - Update conversation (e.g. rename)
 */
export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth()
        const { id } = await context.params

        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const body = await req.json()
        const { title, metadata } = body

        const { data, error } = await supabaseAdmin
            .from('chat_sessions')
            .update({
                title,
                metadata: metadata ? { ...metadata } : undefined,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

/**
 * DELETE /api/conversations/[id] - Delete a conversation
 */
export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth()
        const { id } = await context.params

        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { error } = await supabaseAdmin
            .from('chat_sessions')
            .delete()
            .eq('id', id)
            .eq('user_id', userId)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
