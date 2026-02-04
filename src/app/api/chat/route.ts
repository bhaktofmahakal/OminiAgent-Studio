import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { routeChat, ChatRequest } from '@/lib/ai-router'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { emitWebhookEvent } from '@/lib/webhooks'

const chatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string(),
  })).min(1),
  model: z.string(),
  stream: z.boolean().optional(),
  conversationId: z.string().nullable().optional(),
  agentId: z.string().nullable().optional(),
  enableTools: z.boolean().optional(),
  approvedToolCallId: z.string().optional(),
  temperature: z.number().optional(),
  maxTokens: z.number().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const json = await req.json()
    const result = chatSchema.safeParse(json)

    if (!result.success) {
      console.error('Chat validation failed:', result.error.format());
      return NextResponse.json({
        error: 'Invalid request data',
        details: result.error.format()
      }, { status: 400 })
    }

    const body = result.data
    const chatConfig: any = { ...body }

    // If agentId is provided, fetch agent specialized configuration
    if (body.agentId) {
      const { data: agent, error: agentError } = await supabaseAdmin
        .from('agents')
        .select('*')
        .eq('id', body.agentId)
        .single()

      if (!agentError && agent) {
        // Override with agent settings
        chatConfig.model = agent.models?.[0] || agent.model || body.model
        chatConfig.temperature = agent.temperature ?? body.temperature
        chatConfig.maxTokens = agent.max_tokens ?? body.maxTokens
        chatConfig.enableTools = (agent.tools && agent.tools.length > 0)
        chatConfig.requiresApprovalTools = agent.requires_approval_tools || []

        // Prepend system prompt if it exists and isn't already there
        if (agent.system_prompt && !chatConfig.messages.some((m: any) => m.role === 'system')) {
          chatConfig.messages = [
            { role: 'system', content: agent.system_prompt },
            ...chatConfig.messages
          ]
        }
      }
    }

    // Check for streaming request
    if (chatConfig.stream) {
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        async start(controller) {
          try {
            const response = await routeChat(
              { ...chatConfig, stream: true, userId },
              (text) => {
                const data = JSON.stringify({ text })
                controller.enqueue(encoder.encode(`data: ${data}\n\n`))
              }
            )

            // If approval is required, send it as a special metadata frame
            if (response.approvalRequired) {
              const approvalFrame = JSON.stringify({
                approvalRequired: response.approvalRequired,
                steps: response.steps
              })
              controller.enqueue(encoder.encode(`data: ${approvalFrame}\n\n`))
              controller.close()
              return
            }

            const metadata = JSON.stringify({
              done: true,
              usage: response.usage,
              latency: response.latency,
              cost: response.cost,
              steps: response.steps,
              conversationId: response.conversationId
            })
            controller.enqueue(encoder.encode(`data: ${metadata}\n\n`))

            // Save session to DB
            await supabaseAdmin.from('chat_sessions').upsert({
              id: response.conversationId,
              agent_id: chatConfig.agentId || null,
              user_id: userId,
              messages: [...chatConfig.messages, { role: 'assistant', content: response.content }],
              model_used: chatConfig.model,
              total_tokens: response.usage.total_tokens,
              total_latency: response.latency,
              created_at: new Date().toISOString()
            }, { onConflict: 'id' })

            controller.close()
          } catch (e) {
            controller.error(e)
          }
        }
      })

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    }

    // Non-streaming response
    const response = await routeChat({ ...chatConfig, userId })

    // Emit webhook event for chat completion
    if (chatConfig.agentId) {
      emitWebhookEvent({
        type: 'chat.completed',
        agentId: chatConfig.agentId,
        userId,
        timestamp: new Date().toISOString(),
        data: {
          message: response.content,
          model: chatConfig.model,
          usage: response.usage,
          latency: response.latency,
          cost: response.cost,
          conversationId: response.conversationId
        }
      }).catch(err => console.error('Webhook emission failed:', err));
    }

    // Save session to DB
    await supabaseAdmin.from('chat_sessions').upsert({
      id: response.conversationId,
      agent_id: chatConfig.agentId || null,
      user_id: userId,
      messages: [...chatConfig.messages, { role: 'assistant', content: response.content }],
      model_used: chatConfig.model,
      total_tokens: response.usage.total_tokens,
      total_latency: response.latency,
      created_at: new Date().toISOString()
    }, { onConflict: 'id' })

    return NextResponse.json({
      message: response.content,
      model: chatConfig.model,
      usage: response.usage,
      latency: response.latency,
      cost: response.cost,
      steps: response.steps,
      approvalRequired: response.approvalRequired, // Pass this to UI
      conversationId: response.conversationId || `conv_${Date.now()}`
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Chat API is running',
    models: [
      'gpt-4o',
      'gpt-4o-mini',
      'claude-3-5-sonnet',
      'gemini-1.5-pro',
      'llama-3.1-70b'
    ]
  })
}