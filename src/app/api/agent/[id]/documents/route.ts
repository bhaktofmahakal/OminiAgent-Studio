import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { chunkText, getEmbedding } from '@/lib/embeddings'

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth()
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { id: agentId } = await context.params

        const { data, error } = await supabaseAdmin
            .from('documents')
            .select('id, content, metadata, created_at')
            .eq('agent_id', agentId)
            .order('created_at', { ascending: false })

        if (error) throw error

        return NextResponse.json(data)
    } catch (error: any) {
        console.error('Error fetching documents:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth()
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { id: agentId } = await context.params
        const { content, filename } = await req.json()

        if (!content) return NextResponse.json({ error: 'Content required' }, { status: 400 })

        // 1. Chunk text
        const chunks = chunkText(content)
        
        // 2. Process each chunk
        for (const chunk of chunks) {
            const embedding = await getEmbedding(chunk)
            
            const { error } = await supabaseAdmin
                .from('documents')
                .insert({
                    agent_id: agentId,
                    content: chunk,
                    embedding,
                    metadata: {
                        filename,
                        original_length: content.length,
                        chunk_index: chunks.indexOf(chunk)
                    }
                })

            if (error) throw error
        }

        return NextResponse.json({ success: true, chunks: chunks.length })
    } catch (error: any) {
        console.error('Error uploading document:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth()
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { searchParams } = new URL(req.url)
        const docId = searchParams.get('docId')

        if (!docId) return NextResponse.json({ error: 'docId required' }, { status: 400 })

        const { error } = await supabaseAdmin
            .from('documents')
            .delete()
            .eq('id', docId)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Error deleting document:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
