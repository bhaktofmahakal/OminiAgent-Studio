import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { routeChat, ChatRequest } from '@/lib/ai-router'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id: agentId } = await context.params
        const apiKey = req.headers.get('x-api-key')

        if (!apiKey) {
            return NextResponse.json({ error: 'API Key missing (x-api-key header)' }, { status: 401 })
        }

        // 1. Validate API Key
        const { data: keyData, error: keyError } = await supabaseAdmin
            .from('api_keys')
            .select('user_id')
            .eq('key_secret', apiKey)
            .single()

        if (keyError || !keyData) {
            return NextResponse.json({ error: 'Invalid API Key' }, { status: 401 })
        }

        const userId = keyData.user_id

        // 2. Fetch Agent Config
        const { data: agent, error: agentError } = await supabaseAdmin
            .from('agents')
            .select('*')
            .eq('id', agentId)
            .single()

        if (agentError || !agent) {
            return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
        }

        // 3. Update last used at
        await supabaseAdmin
            .from('api_keys')
            .update({ last_used_at: new Date().toISOString() })
            .eq('key_secret', apiKey)

        // 4. Parse request body
        const body = await req.json()

        // Construct configuration similar to the internal chat API
        const chatConfig: ChatRequest = {
            messages: body.messages,
            model: agent.models?.[0] || agent.model || 'gpt-4o-mini',
            temperature: agent.temperature,
            maxTokens: agent.max_tokens,
            agentId: agentId,
            userId: userId,
            enableTools: agent.tools && agent.tools.length > 0,
            stream: false // External API currently non-streaming for simplicity
        }

        // Apply agent system prompt if not present
        if (agent.system_prompt && !chatConfig.messages.some(m => m.role === 'system')) {
            chatConfig.messages.unshift({ role: 'system', content: agent.system_prompt })
        }

        // 5. Route to AI
        const response = await routeChat(chatConfig)

        return NextResponse.json({
            choices: [{
                message: {
                    role: 'assistant',
                    content: response.content
                }
            }],
            usage: response.usage,
            latency: response.latency,
            cost: response.cost,
            trace: response.steps // Include traceability for developers
        })

    } catch (error: any) {
        console.error('V1 Public API Error:', error)
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
    }
}
