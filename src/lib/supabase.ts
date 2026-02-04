import { createClient } from '@supabase/supabase-js'

function getEnv(name: string, fallback: string): string {
  const val = process.env[name]
  if (!val || val === 'undefined' || val === 'null' || val === '') return fallback
  return val
}

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://placeholder.supabase.co')
const supabaseAnonKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'placeholder')
const supabaseServiceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY', getEnv('NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY', 'placeholder'))

// Lazy client creation to avoid build-time initialization errors
let _supabase: any = null
export const supabase = new Proxy({} as any, {
  get(target, prop) {
    if (!_supabase) {
      _supabase = createClient(supabaseUrl, supabaseAnonKey)
    }
    const val = _supabase[prop]
    return typeof val === 'function' ? val.bind(_supabase) : val
  }
})

let _supabaseAdmin: any = null
export const supabaseAdmin = new Proxy({} as any, {
  get(target, prop) {
    if (!_supabaseAdmin) {
      _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      })
    }
    const val = _supabaseAdmin[prop]
    return typeof val === 'function' ? val.bind(_supabaseAdmin) : val
  }
})

// Database types
export interface User {
  id: string
  email: string
  name: string
  created_at: string
}

export interface Agent {
  id: string
  user_id: string
  name: string
  description: string
  system_prompt: string
  models: string[]
  tools: string[]
  temperature: number
  max_tokens: number
  visibility: 'private' | 'public'
  created_at: string
  updated_at: string
}

export interface ChatSession {
  id: string
  agent_id: string
  user_id?: string
  messages: ChatMessage[]
  model_used: string
  total_tokens: number
  total_latency: number
  created_at: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  model?: string
  tokens?: number
  latency?: number
  timestamp: string
}

export interface Metric {
  id: string
  agent_id: string
  model: string
  latency: number
  input_tokens: number
  output_tokens: number
  cost: number
  success: boolean
  error?: string
  timestamp: string
}

// Helper functions (use clients normally)
export async function getAgentsByUser(userId: string) {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data as Agent[]
}

export async function getAgentById(id: string) {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Agent
}

export async function createAgent(agent: Omit<Agent, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('agents')
    .insert(agent)
    .select()
    .single()

  if (error) throw error
  return data as Agent
}

export async function updateAgent(id: string, updates: Partial<Agent>) {
  const { data, error } = await supabase
    .from('agents')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Agent
}

export async function deleteAgent(id: string, userId: string) {
  const { error } = await supabase
    .from('agents')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw error
}

export async function createChatSession(session: Omit<ChatSession, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert(session)
    .select()
    .single()

  if (error) throw error
  return data as ChatSession
}

export async function logMetric(metric: Omit<Metric, 'id' | 'timestamp'>) {
  // Use Admin client for logging if on server to bypass RLS
  let client = supabase
  if (typeof window === 'undefined') {
    client = supabaseAdmin
  }

  const { data, error } = await client
    .from('metrics')
    .insert({ ...metric, timestamp: new Date().toISOString() })
    .select()
    .single()

  if (error) throw error
  return data as Metric
}
