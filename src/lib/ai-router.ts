import { OpenAI } from 'openai'
import { logMetric } from './supabase'
import { TOOLS, getToolDefinitions } from './tools'
import { getEmbedding } from './embeddings'
import { supabaseAdmin } from './supabase-admin'

// Model configurations - Latest Premium Models
export const MODELS = {
  // === FLAGSHIP PREMIUM MODELS ===
  'claude-3-5-sonnet-latest': {
    provider: 'anthropic',
    id: 'anthropic/claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet 👑',
    description: 'Anthropic\'s most advanced model - Superior reasoning and analysis',
    color: 'from-amber-600 to-orange-600',
    maxTokens: 200000,
    inputCost: 0.003,
    outputCost: 0.015,
    tier: 'flagship',
  },
  'openai-o1': {
    provider: 'openai',
    id: 'openai/o1-preview',
    name: 'OpenAI o1-preview 🚀',
    description: 'New reasoning model specialized for complex logic and math',
    color: 'from-purple-600 to-pink-600',
    maxTokens: 128000,
    inputCost: 0.015,
    outputCost: 0.060,
    tier: 'flagship',
  },
  'gemini-1-5-pro-latest': {
    provider: 'google',
    id: 'google/gemini-1.5-pro-latest',
    name: 'Gemini 1.5 Pro 🎯💎',
    description: 'Google\'s massive 2M context model with enhanced reasoning',
    color: 'from-indigo-600 to-blue-600',
    maxTokens: 2000000,
    inputCost: 0.00125,
    outputCost: 0.005,
    tier: 'flagship',
  },
  'gpt-4o': {
    provider: 'openai',
    id: 'openai/gpt-4o',
    name: 'GPT-4o 💥',
    description: 'Most capable multimodal model with fast response times',
    color: 'from-orange-500 to-red-500',
    maxTokens: 128000,
    inputCost: 0.0025,
    outputCost: 0.010,
    tier: 'flagship',
  },

  // === HIGH-PERFORMANCE MODELS ===
  'claude-3-5-haiku': {
    provider: 'anthropic',
    id: 'anthropic/claude-3-5-haiku-20241022',
    name: 'Claude 3.5 Haiku ⚡',
    description: 'Fastest Claude model with great performance',
    color: 'from-teal-500 to-cyan-500',
    maxTokens: 200000,
    inputCost: 0.0008,
    outputCost: 0.004,
    tier: 'premium',
  },


  // === GROQ ULTRA-FAST MODELS ===
  'llama-3.3-70b-groq': {
    provider: 'groq',
    id: 'llama-3.3-70b-versatile',
    name: 'Llama 3.3 70B (Groq) 🚄',
    description: 'Ultra-fast 70B parameter model with excellent reasoning',
    color: 'from-green-500 to-emerald-500',
    maxTokens: 131072,
    inputCost: 0.0006,
    outputCost: 0.0006,
    tier: 'fast',
  },
  'llama-3.1-405b-groq': {
    provider: 'groq',
    id: 'llama-3.1-405b-reasoning',
    name: 'Llama 3.1 405B (Groq) 💪',
    description: 'Largest open-source model with incredible capabilities',
    color: 'from-emerald-500 to-green-600',
    maxTokens: 131072,
    inputCost: 0.0035,
    outputCost: 0.0035,
    tier: 'premium',
  },
  'llama-3.1-8b-groq': {
    provider: 'groq',
    id: 'llama-3.1-8b-instant',
    name: 'Llama 3.1 8B (Groq) ⚡',
    description: 'Lightning-fast 8B model for instant responses',
    color: 'from-lime-500 to-green-500',
    maxTokens: 131072,
    inputCost: 0.00005,
    outputCost: 0.00008,
    tier: 'fast',
  },
  'gemma-2-9b-groq': {
    provider: 'groq',
    id: 'gemma2-9b-it',
    name: 'Gemma 2 9B (Groq) 🌊',
    description: 'Google\'s efficient open model with excellent performance',
    color: 'from-cyan-500 to-blue-500',
    maxTokens: 8192,
    inputCost: 0.0002,
    outputCost: 0.0002,
    tier: 'fast',
  },
  'mixtral-8x7b-groq': {
    provider: 'groq',
    id: 'mixtral-8x7b-32768',
    name: 'Mixtral 8x7B (Groq) 🌪️',
    description: 'High-performance MoE model running at lightspeed',
    color: 'from-orange-500 to-yellow-500',
    maxTokens: 32768,
    inputCost: 0.00027,
    outputCost: 0.00027,
    tier: 'fast',
  },

  // === EFFICIENT MODELS ===
  'gpt-4o-mini': {
    provider: 'openai',
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    description: 'Most cost-effective GPT model',
    color: 'from-orange-400 to-red-400',
    maxTokens: 128000,
    inputCost: 0.00015,
    outputCost: 0.0006,
    tier: 'efficient',
  },
  'gemini-1.5-flash': {
    provider: 'google',
    id: 'google/gemini-flash-1.5',
    name: 'Gemini 1.5 Flash ⚡',
    description: 'Fast and efficient with large context',
    color: 'from-blue-400 to-cyan-400',
    maxTokens: 1000000,
    inputCost: 0.000075,
    outputCost: 0.0003,
    tier: 'efficient',
  },
  'gemini-2.0-flash-free': {
    provider: 'google',
    id: 'google/gemini-2.0-flash-exp:free',
    name: 'Gemini 2.0 Flash (Free) 🆓',
    description: 'Experimental fast model - Free tier via OpenRouter',
    color: 'from-blue-500 to-indigo-500',
    maxTokens: 1000000,
    inputCost: 0,
    outputCost: 0,
    tier: 'efficient',
  },
  'claude-3-haiku': {
    provider: 'anthropic',
    id: 'anthropic/claude-3-haiku',
    name: 'Claude 3 Haiku',
    description: 'Fast and affordable Claude model',
    color: 'from-teal-400 to-cyan-400',
    maxTokens: 200000,
    inputCost: 0.00025,
    outputCost: 0.00125,
    tier: 'efficient',
  },

  // === SPECIALIZED MODELS ===
  'deepseek-r1': {
    provider: 'deepseek',
    id: 'deepseek/deepseek-r1',
    name: 'DeepSeek R1 🧮',
    description: 'Advanced reasoning model with chain-of-thought',
    color: 'from-purple-500 to-indigo-500',
    maxTokens: 65536,
    inputCost: 0.0014,
    outputCost: 0.0028,
    tier: 'specialized',
  },
  'qwen-2.5-coder': {
    provider: 'alibaba',
    id: 'qwen/qwen-2.5-coder-32b-instruct',
    name: 'Qwen 2.5 Coder 👨‍💻',
    description: 'Specialized coding model with exceptional programming skills',
    color: 'from-slate-500 to-gray-600',
    maxTokens: 131072,
    inputCost: 0.0002,
    outputCost: 0.0006,
    tier: 'specialized',
  },
}

// Lazy clients to prevent build-time failures when keys are missing
const getOpenRouter = () => new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || 'placeholder',
})

const getGroq = () => new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY || 'placeholder',
})

const getGoogleAI = () => new OpenAI({
  baseURL: "https://generativelanguage.googleapis.com/v1beta",
  apiKey: process.env.GOOGLE_AI_API_KEY || 'placeholder',
})

const getOpenAI = () => new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'placeholder',
})

export interface ChatRequest {
  messages: Array<{
    role: 'user' | 'assistant' | 'system'
    content: string
  }>
  model: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
  agentId?: string
  userId?: string
  conversationId?: string
  enableTools?: boolean
  requiresApprovalTools?: string[] // HITL support
  approvedToolCallId?: string // HITL support
}

export interface ExecutionStep {
  type: 'thought' | 'tool_call' | 'tool_result' | 'error'
  content: string
  timestamp: string
  metadata?: any
}

export interface ChatResponse {
  content: string
  model: string
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  latency: number
  cost: number
  steps?: ExecutionStep[]
  conversationId?: string
  approvalRequired?: {
    tool_call_id: string
    tool_name: string
    args: any
  }
}

export async function routeChat(
  request: ChatRequest,
  onDelta?: (delta: string) => void
): Promise<ChatResponse> {
  const startTime = Date.now()
  const modelConfig = MODELS[request.model as keyof typeof MODELS]

  if (!modelConfig) {
    throw new Error(`Unsupported model: ${request.model}`)
  }

  let client: OpenAI
  let modelId: string
  const steps: ExecutionStep[] = []

  // === RAG: KNOWLEDGE RETRIEVAL ===
  if (request.agentId) {
    try {
      const lastUserMessage = request.messages.findLast(m => m.role === 'user')?.content
      if (lastUserMessage) {
        steps.push({
          type: 'thought',
          content: 'SEARCHING_INTERNAL_KNOWLEDGE_BASE...',
          timestamp: new Date().toISOString()
        })

        const queryEmbedding = await getEmbedding(lastUserMessage)

        const { data: documents, error: ragError } = await supabaseAdmin.rpc('match_documents', {
          query_embedding: queryEmbedding,
          match_threshold: 0.3, // Lower threshold for better recall
          match_count: 5,
          p_agent_id: request.agentId
        })

        if (!ragError && documents && documents.length > 0) {
          const contextText = documents.map((doc: any) => doc.content).join('\n---\n')

          steps.push({
            type: 'tool_result',
            content: `FOUND_${documents.length}_RELEVANT_DOCUMENTS`,
            timestamp: new Date().toISOString(),
            metadata: { count: documents.length }
          })

          // Inject context into the prompt
          const contextPrompt = {
            role: 'system' as const,
            content: `KNOWLEDGE_CONTEXT_FOUND:\n${contextText}\n\nINSTRUCTION: Use the above context to provide accurate answers. If the information isn't there, rely on your base knowledge but prioritize the context.`
          }

          // Insert after initial system prompt if current index 0 is system
          if (request.messages[0].role === 'system') {
            request.messages.splice(1, 0, contextPrompt)
          } else {
            request.messages.unshift(contextPrompt)
          }
        }
      }
    } catch (ragErr) {
      console.warn('RAG retrieval failed:', ragErr)
    }
  }

  // === LONG-TERM MEMORY RECALL ===
  if (request.agentId && request.userId) {
    try {
      const lastUserMessage = request.messages.findLast(m => m.role === 'user')?.content
      if (lastUserMessage) {
        const queryEmbedding = await getEmbedding(lastUserMessage)
        const { data: memories, error: memError } = await supabaseAdmin.rpc('match_memories', {
          query_embedding: queryEmbedding,
          match_threshold: 0.5,
          match_count: 3,
          p_agent_id: request.agentId,
          p_user_id: request.userId
        })

        if (!memError && memories && memories.length > 0) {
          const memoryText = memories.map((m: any) => m.content).join('\n')
          steps.push({
            type: 'thought',
            content: `RECALLING_${memories.length}_PAST_FACTS`,
            timestamp: new Date().toISOString()
          })

          request.messages.unshift({
            role: 'system',
            content: `LONG_TERM_MEMORY_RECALLED:\n${memoryText}\n\nINSTRUCTION: The above are facts you previously memorized about this user or project. Use them to maintain continuity.`
          })
        }
      }
    } catch (memErr) {
      console.warn('Memory retrieval failed:', memErr)
    }
  }

  // Route to appropriate client
  switch (modelConfig.provider) {
    case 'groq':
      client = getGroq()
      modelId = modelConfig.id
      break
    case 'openai':
      client = getOpenAI()
      modelId = modelConfig.id
      break
    case 'anthropic':
      client = getOpenRouter() // Anthropic models are routed via OpenRouter
      modelId = modelConfig.id  // Already includes anthropic/ prefix
      break
    case 'google':
      // Try Google Direct API first for Gemini 2.0, fallback to OpenRouter
      if (modelConfig.id.includes('gemini-2.0') && process.env.GOOGLE_AI_API_KEY) {
        client = getGoogleAI()
        modelId = modelConfig.id.replace('google/', '')
      } else {
        client = getOpenRouter()
        modelId = modelConfig.id  // Already has google/ prefix
      }
      break
    case 'deepseek':
    case 'alibaba':
    default:
      // Use OpenRouter for all other providers
      client = getOpenRouter()
      modelId = modelConfig.id
      break
  }

  try {
    const isStreaming = !!onDelta;
    const response = await client.chat.completions.create({
      model: modelId,
      messages: request.messages,
      temperature: request.temperature || 0.7,
      max_tokens: request.maxTokens || 1000,
      stream: isStreaming,
      tools: request.enableTools ? (getToolDefinitions() as any) : undefined,
      tool_choice: request.enableTools ? 'auto' : undefined,
    })

    let finalContent = ""
    let toolCalls: any[] = []
    let usage: any = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }

    if (isStreaming && (response as any)[Symbol.asyncIterator]) {
      for await (const chunk of response as any) {
        const delta = chunk.choices[0]?.delta
        if (delta?.content) {
          finalContent += delta.content
          onDelta(delta.content)
        }
        if (delta?.tool_calls) {
          for (const tc of delta.tool_calls) {
            const idx = tc.index ?? 0
            if (!toolCalls[idx]) {
              toolCalls[idx] = { id: tc.id, function: { name: "", arguments: "" } }
            }
            if (tc.id) toolCalls[idx].id = tc.id
            if (tc.function?.name) toolCalls[idx].function.name += tc.function.name
            if (tc.function?.arguments) toolCalls[idx].function.arguments += tc.function.arguments
          }
        }
        if (chunk.usage) {
          usage = chunk.usage
        }
      }
    } else {
      const completion = response as any
      finalContent = completion.choices[0].message.content || ""
      toolCalls = completion.choices[0].message.tool_calls || []
      usage = completion.usage || usage
    }

    const finalMessage = {
      role: 'assistant',
      content: finalContent,
      tool_calls: toolCalls.length > 0 ? toolCalls : undefined
    }

    // Handle tool calls if they exist
    if (toolCalls.length > 0) {
      console.log(`Detected ${toolCalls.length} tool calls`);

      const toolMessages: any[] = [...request.messages, finalMessage];
      let pausedForApproval = false;
      let approvalData: any = null;

      for (const toolCall of toolCalls) {
        const toolName = toolCall.function?.name;
        const toolArgs = JSON.parse(toolCall.function?.arguments || '{}');
        const toolId = toolCall.id;

        // HITL Check
        const toolNeedsApproval = request.requiresApprovalTools?.includes(toolName);
        const isAlreadyApproved = request.approvedToolCallId === toolId;

        if (toolNeedsApproval && !isAlreadyApproved) {
          pausedForApproval = true;
          approvalData = { tool_call_id: toolId, tool_name: toolName, args: toolArgs };
          steps.push({
            type: 'thought',
            content: `WAITING_FOR_PERMISSION_TO_EXECUTE_${toolName.toUpperCase()}`,
            timestamp: new Date().toISOString(),
            metadata: { tool: toolName, args: toolArgs }
          });
          break;
        }

        steps.push({
          type: 'tool_call',
          content: `Invoking ${toolName}`,
          timestamp: new Date().toISOString(),
          metadata: { tool: toolName, args: toolArgs }
        });

        const tool = TOOLS[toolName];
        if (tool) {
          const result = await tool.execute(toolArgs, {
            agentId: request.agentId || '',
            userId: request.userId || ''
          });

          steps.push({
            type: 'tool_result',
            content: `Received result from ${toolName}`,
            timestamp: new Date().toISOString(),
            metadata: { tool: toolName, result: typeof result === 'string' ? result.slice(0, 500) : result }
          });

          toolMessages.push({
            role: 'tool',
            tool_call_id: toolId,
            name: toolName,
            content: typeof result === 'string' ? result : JSON.stringify(result),
          });
        }
      }

      if (pausedForApproval) {
        const latency = Date.now() - startTime
        return {
          content: "I need your permission to proceed with this action.",
          model: request.model,
          usage,
          latency,
          cost: 0,
          steps,
          approvalRequired: approvalData,
          conversationId: request.conversationId || `conv_${Date.now()}`
        }
      }

      // Recursive call with tool results
      return routeChat({
        ...request,
        messages: toolMessages
      }, onDelta);
    }

    const latency = Date.now() - startTime

    // Calculate cost
    const inputCost = (usage.prompt_tokens / 1000) * modelConfig.inputCost
    const outputCost = (usage.completion_tokens / 1000) * modelConfig.outputCost
    const totalCost = inputCost + outputCost

    const chatResponse: ChatResponse = {
      content: finalContent,
      model: request.model,
      usage,
      latency,
      cost: totalCost,
      steps: steps.length > 0 ? steps : undefined,
      conversationId: request.conversationId || `conv_${Date.now()}`
    }

    // Log metrics
    if (request.agentId) {
      await logMetric({
        agent_id: request.agentId,
        model: request.model,
        latency,
        input_tokens: usage.prompt_tokens,
        output_tokens: usage.completion_tokens,
        cost: totalCost,
        success: true,
      }).catch(console.error)
    }

    return chatResponse

  } catch (error: any) {
    // Automatic Fallback for Payment/Quota issues
    if ((error.status === 402 || error.status === 404 || error.status === 429) && modelId !== 'llama-3.1-8b-instant') {
      console.warn(`Primary model ${modelId} failed (${error.status}). Falling back to Groq Llama 3.1...`);
      try {
        const fallbackResponse = await getGroq().chat.completions.create({
          model: 'llama-3.1-8b-instant',
          messages: request.messages,
          temperature: request.temperature || 0.7,
          max_tokens: request.maxTokens || 1000,
          stream: false,
        });

        const fallbackMessage = fallbackResponse.choices[0].message;
        const latency = Date.now() - startTime;

        if (request.agentId) {
          await logMetric({
            agent_id: request.agentId,
            model: 'llama-3.1-8b-groq',
            latency,
            input_tokens: fallbackResponse.usage?.prompt_tokens || 0,
            output_tokens: fallbackResponse.usage?.completion_tokens || 0,
            cost: 0,
            success: true,
          }).catch(console.error);
        }

        return {
          content: fallbackMessage.content || '',
          model: 'llama-3.1-8b-groq',
          usage: {
            prompt_tokens: fallbackResponse.usage?.prompt_tokens || 0,
            completion_tokens: fallbackResponse.usage?.completion_tokens || 0,
            total_tokens: fallbackResponse.usage?.total_tokens || 0,
          },
          latency,
          cost: 0,
          conversationId: request.conversationId || `conv_${Date.now()}`
        };
      } catch (fallbackError) {
        console.error('Groq fallback also failed:', fallbackError);
      }
    }

    const latency = Date.now() - startTime
    if (request.agentId) {
      await logMetric({
        agent_id: request.agentId,
        model: request.model,
        latency,
        input_tokens: 0,
        output_tokens: 0,
        cost: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }).catch(console.error)
    }
    throw error
  }
}

// Smart model selection based on task type and performance
export function selectOptimalModel(prompt: string, taskType?: string, priority: 'speed' | 'quality' | 'cost' = 'quality'): string {
  if (taskType) {
    switch (taskType) {
      case 'reasoning':
        return priority === 'speed' ? 'claude-3-5-haiku' : 'claude-3-5-sonnet-latest'
      case 'coding':
        return priority === 'speed' ? 'llama-3.1-8b-groq' : 'qwen-2.5-coder'
      case 'fast':
        return 'llama-3.1-8b-groq'  // Ultra-fast responses
      case 'creative':
        return priority === 'quality' ? 'claude-3-5-sonnet-latest' : 'gpt-4o'
      case 'analysis':
        return priority === 'speed' ? 'gemini-1.5-flash' : 'gemini-1-5-pro-latest'
      case 'multimodal':
        return priority === 'quality' ? 'gemini-1-5-pro-latest' : 'gpt-4o'
      case 'flagship':
        return 'claude-3-5-sonnet-latest'  // Most advanced reasoning
      case 'math':
        return 'deepseek-r1'  // Best for mathematical reasoning
      default:
        return priority === 'cost' ? 'gemini-1.5-flash' : 'gpt-4o-mini'
    }
  }

  // Advanced heuristics based on prompt content and priority
  const lowerPrompt = prompt.toLowerCase()

  // Coding tasks
  if (lowerPrompt.includes('code') || lowerPrompt.includes('program') || lowerPrompt.includes('debug')) {
    return priority === 'speed' ? 'llama-3.1-8b-groq' : 'qwen-2.5-coder'
  }

  // Mathematical/reasoning tasks
  if (lowerPrompt.includes('math') || lowerPrompt.includes('calculate') || lowerPrompt.includes('solve')) {
    return priority === 'speed' ? 'llama-3.3-70b-groq' : 'deepseek-r1'
  }

  // Analysis and reasoning
  if (lowerPrompt.includes('analyze') || lowerPrompt.includes('reason') || lowerPrompt.includes('explain')) {
    return priority === 'speed' ? 'claude-3-5-haiku' : 'claude-3-5-sonnet-latest'
  }

  // Speed priority
  if (lowerPrompt.includes('quick') || lowerPrompt.includes('fast') || prompt.length < 100 || priority === 'speed') {
    return 'llama-3.1-8b-groq'  // Fastest model
  }

  // Creative writing
  if (lowerPrompt.includes('creative') || lowerPrompt.includes('story') || lowerPrompt.includes('write')) {
    return priority === 'quality' ? 'claude-3-5-sonnet-latest' : 'gpt-4o'
  }

  // Multimodal content
  if (lowerPrompt.includes('image') || lowerPrompt.includes('visual') || lowerPrompt.includes('picture')) {
    return priority === 'quality' ? 'gemini-1-5-pro-latest' : 'gpt-4o'
  }

  // Cost-conscious default
  if (priority === 'cost') {
    return 'gemini-1.5-flash'
  }

  // Quality default
  return 'gpt-4o-mini' // Best balance of quality and cost
}

// Utility functions for model management
export function getModelsByTier(tier: 'flagship' | 'premium' | 'fast' | 'efficient' | 'specialized') {
  return Object.entries(MODELS)
    .filter(([_, config]) => config.tier === tier)
    .map(([key, config]) => ({ key, ...config }))
}

export function getModelsByProvider(provider: string) {
  return Object.entries(MODELS)
    .filter(([_, config]) => config.provider === provider)
    .map(([key, config]) => ({ key, ...config }))
}

export function getFastestModels(limit: number = 5) {
  return Object.entries(MODELS)
    .filter(([_, config]) => config.tier === 'fast')
    .sort((a, b) => a[1].inputCost - b[1].inputCost)
    .slice(0, limit)
    .map(([key, config]) => ({ key, ...config }))
}

export function getCheapestModels(limit: number = 5) {
  return Object.entries(MODELS)
    .sort((a, b) => a[1].inputCost - b[1].inputCost)
    .slice(0, limit)
    .map(([key, config]) => ({ key, ...config }))
}

// Helicone proxy wrapper (optional for enhanced analytics)
export function createHeliconeProxy() {
  return new OpenAI({
    baseURL: "https://oai.hconeai.com/v1",
    apiKey: process.env.OPENAI_API_KEY,
    defaultHeaders: {
      "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
    },
  })
}