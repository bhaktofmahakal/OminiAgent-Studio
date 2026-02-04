import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { auth } from '@clerk/nextjs/server'
import { getAgentsByUser } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    // Validate required fields
    const requiredFields = ['name', 'description', 'system_prompt', 'models']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    const agentData = {
      user_id: userId,
      name: body.name,
      description: body.description,
      system_prompt: body.system_prompt,
      models: Array.isArray(body.models) ? body.models : [body.models],
      tools: body.tools || [],
      temperature: body.temperature || 0.7,
      max_tokens: body.max_tokens || 1000,
      visibility: body.visibility || 'private',
    }

    try {
      // Use Admin client to insert (bypassing RLS since we validated userId above)
      const { data, error } = await supabaseAdmin
        .from('agents')
        .insert(agentData)
        .select()
        .single()

      if (error) throw error

      return NextResponse.json(data, { status: 201 })
    } catch (dbErr: any) {
      console.error('Database agent creation failed:', dbErr.message);
      return NextResponse.json(
        { error: 'Database Error: ' + dbErr.message },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Create agent error:', error)

    return NextResponse.json(
      { error: 'Failed to create agent' },
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

    try {
      const agents = await getAgentsByUser(userId)
      return NextResponse.json(agents)
    } catch (err: any) {
      return NextResponse.json([]);
    }

  } catch (error) {
    console.error('Get agents error:', error)

    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    )
  }
}