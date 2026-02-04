"use client"

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import {
  Loader2, Bot, Share2, ArrowLeft, Terminal, Activity, Hash, Layers, Command, ChevronLeft, ChevronDown, ChevronUp, Eye, Zap, Shield, Monitor, Box
} from 'lucide-react'
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

interface Agent {
  id: string
  name: string
  description: string
  models: string[]
  visibility: string
  created_at: string
  user_id?: string
  system_prompt?: string
  model?: string
  temperature?: number
  max_tokens?: number
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  model?: string
  latency?: number
  steps?: any[]
}

function SystemOverlays() {
  return (
    <>
      <div className="noise-overlay" />
      <div className="scanlines fixed inset-0 opacity-10 pointer-events-none" />
    </>
  )
}

function ExecutionTrace({ steps }: { steps: any[] }) {
  const [isOpen, setIsOpen] = useState(false)

  if (!steps || steps.length === 0) return null

  return (
    <div className="mt-4 border-2 border-black/10 bg-black overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 text-[8px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-primary transition-all bg-white/5"
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-3 h-3" />
          EXECUTION_TRACE [{steps.length}_STEPS]
        </div>
        {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4 font-mono text-[9px] border-t border-white/5">
              {steps.map((step, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center gap-2 text-[#ccff00] italic">
                    <Box className="w-2.5 h-2.5" />
                    <span>{step.type.toUpperCase()}</span>
                    <span className="text-white/20 text-[7px] truncate">{step.timestamp}</span>
                  </div>
                  <div className="pl-4 text-white/60 border-l-2 border-white/10 ml-1 py-1">
                    {step.content}
                    {step.metadata && (
                      <div className="mt-2 p-2 bg-white/5 text-[7px] text-white/30 break-all select-all hover:text-white/60 transition-all">
                        {JSON.stringify(step.metadata)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function AgentDetailPage() {
  const params = useParams()
  const agentId = params.id as string
  const { userId } = useAuth()
  const scrollRef = useRef<HTMLDivElement>(null)

  const [agent, setAgent] = useState<Agent | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isAgentLoading, setIsAgentLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [pendingApproval, setPendingApproval] = useState<any>(null)

  useEffect(() => {
    async function loadAgent() {
      try {
        const res = await fetch(`/api/agent/${agentId}`)
        if (!res.ok) throw new Error('ERR')
        const data = await res.json()
        setAgent(data)
        if (userId && data.user_id === userId) setIsOwner(true)
        setMessages([{
          role: 'assistant',
          content: `SESSION_INITIALIZED // AGENT: ${data.name.toUpperCase()} // READY_FOR_INPUT`,
          timestamp: new Date().toISOString()
        }])
      } catch (e) { toast.error("AGENT_OFFLINE") }
      finally { setIsAgentLoading(false) }
    }
    if (agentId) loadAgent()
  }, [agentId, userId])

  const [mounted, setMounted] = useState(false);
  const [sessionSig, setSessionSig] = useState('--------');
  const [sessionTime, setSessionTime] = useState('--:--:--');

  useEffect(() => {
    setMounted(true);
    setSessionSig(Math.random().toString(16).slice(2, 10).toUpperCase());
    setSessionTime(new Date().toLocaleTimeString());
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return
    const msg = { role: 'user' as const, content: input, timestamp: new Date().toISOString() }
    setMessages(prev => [...prev, msg])
    setInput('')
    setIsLoading(true)

    try {
      const start = Date.now()
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, msg].map(m => ({ role: m.role, content: m.content })),
          model: agent?.model || 'gpt-4o',
          agentId
        })
      })
      const data = await res.json()

      if (data.approvalRequired) {
        setPendingApproval(data.approvalRequired)
      }

      const content = data.message || data.response
      if (content) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content,
          timestamp: new Date().toISOString(),
          model: agent?.model || data.model,
          latency: Date.now() - start,
          steps: data.steps
        }])
      }
    } catch (e) { toast.error("COMMS_FAILURE") }
    finally { setIsLoading(false) }
  }

  const handleApprove = async (toolCallId: string) => {
    setIsLoading(true)
    setPendingApproval(null)
    const toastId = toast.loading('EXECUTING_APPROVED_ACTION...')

    try {
      const start = Date.now()
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          model: agent?.model || 'gpt-4o',
          agentId,
          approvedToolCallId: toolCallId
        })
      })

      const data = await res.json()

      if (data.approvalRequired) {
        setPendingApproval(data.approvalRequired)
      }

      const content = data.message || data.response
      if (content) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content,
          timestamp: new Date().toISOString(),
          model: agent?.model || data.model,
          latency: Date.now() - start,
          steps: data.steps
        }])
        toast.success('ACTION_SUCCESSFUL', { id: toastId })
      }
    } catch (e) {
      toast.error("COMMS_FAILURE", { id: toastId })
    } finally {
      setIsLoading(false)
    }
  }

  if (isAgentLoading) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center font-heading text-6xl font-black italic opacity-20 italic">
      LOADING...
    </div>
  )

  if (!agent) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-20 text-center">
      <h1 className="text-[10vw] font-black italic tracking-tighter opacity-10 leading-none">VOID_404</h1>
      <Link href="/dashboard">
        <button className="brutal-btn bg-primary text-black font-black mt-16 text-xs px-12">RTB_CONSOLE</button>
      </Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#080808] text-white font-body selection:bg-primary selection:text-black">
      <SystemOverlays />

      {/* HEADERBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b-4 border-white p-4 lg:px-10 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="group">
            <div className="w-10 h-10 border-2 border-white flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all">
              <ChevronLeft className="w-5 h-5" />
            </div>
          </Link>
          <div className="space-y-1">
            <h1 className="text-2xl font-heading font-black italic leading-none tracking-tighter uppercase">{agent.name}</h1>
            <div className="text-[9px] font-black opacity-40 uppercase tracking-[0.4em] italic flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary animate-pulse" /> LIVE_PROTO_X9 // STABLE // {sessionTime}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-4 text-[8px] font-black uppercase tracking-[0.2em] opacity-30 italic mr-8 border-x border-white/10 px-6 h-8">
            <span>LATENCY: 42MS</span>
            <span className="w-1 h-1 bg-white" />
            <span>MODEL: {agent.model?.toUpperCase()}</span>
          </div>
          {isOwner && (
            <Link href={`/agent/${agentId}/edit`}>
              <button className="brutal-btn py-1.5 px-6 text-[9px] bg-white text-black font-black">EDIT_PROC</button>
            </Link>
          )}
        </div>
      </nav>

      <div className="flex pt-[104px] h-screen overflow-hidden">

        {/* SIDEBAR STATUS */}
        <aside className="hidden lg:flex flex-col w-[350px] border-r-4 border-white bg-black p-10 space-y-20 overflow-y-auto">

          <section className="space-y-8">
            <div className="flex items-center gap-4 text-primary italic font-black uppercase text-xs tracking-[0.3em]">
              <Activity className="w-4 h-4" /> PROC_HEALTH
            </div>
            <div className="space-y-4">
              {[
                { label: 'Uptime', val: '100%' },
                { label: 'Load', val: '0.002' },
                { label: 'Protocol', val: 'Secure_v2' }
              ].map((s, i) => (
                <div key={i} className="flex justify-between items-baseline border-b border-white/5 pb-3">
                  <span className="text-[9px] font-black opacity-30 uppercase">{s.label}</span>
                  <span className="text-xs font-black italic">{s.val}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-8">
            <div className="flex items-center gap-4 text-primary italic font-black uppercase text-xs tracking-[0.3em]">
              <Layers className="w-4 h-4" /> CORE_SPEC
            </div>
            <div className="p-6 border-2 border-white/5 bg-white/[0.02] space-y-6">
              <div className="space-y-2">
                <div className="text-[9px] font-black opacity-40 uppercase tracking-widest italic flex items-center justify-between">
                  Entropy <span>{agent.temperature}</span>
                </div>
                <div className="h-1 bg-white/10">
                  <div className="h-full bg-primary" style={{ width: `${(agent.temperature || 0.7) * 50}%` }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[8px] font-black opacity-40 uppercase tracking-widest italic">Allocated_Buffer</div>
                <div className="text-lg font-heading font-black">{agent.max_tokens} TKNS</div>
              </div>
              {/* NEW: SIDEBAR METRIC ADDITION */}
              <div className="pt-4 border-t border-white/10 space-y-4">
                <div className="flex justify-between text-[8px] font-black opacity-20 uppercase tracking-widest">
                  <span>IO_Bandwidth</span>
                  <span>1.2gb/s</span>
                </div>
                <div className="flex justify-between text-[8px] font-black opacity-20 uppercase tracking-widest">
                  <span>Thread_Pool</span>
                  <span>Active_08</span>
                </div>
              </div>
            </div>
          </section>

          {/* NEW: NEURAL VISUALIZATION */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 text-primary italic font-black uppercase text-xs tracking-[0.3em]">
              <Monitor className="w-4 h-4" /> Neural_Activity
            </div>
            <div className="h-32 bg-white/5 border border-white/10 relative flex items-center justify-around px-10">
              {[40, 70, 30, 90, 50].map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse', delay: i * 0.1 }}
                  className="w-2 bg-primary/20 hover:bg-primary transition-colors cursor-pointer"
                />
              ))}
              <div className="absolute inset-x-0 bottom-0 h-[1px] bg-white/10" />
            </div>
          </section>

          <div className="flex-1 flex flex-col justify-end gap-6">
            <div className="p-4 border border-white/5 bg-white/[0.01] text-[7px] font-mono opacity-20 uppercase leading-relaxed italic">
              ID: {agent.id}<br />
              MOD: {agent.models?.[0]?.toUpperCase()}<br />
              SIG: {sessionSig}
            </div>
            <div className="module-tag italic text-center w-full">CONSOLE_STABLE_READY</div>
          </div>
        </aside>

        {/* MAIN CHAT INTERFACE */}
        <main className="flex-1 flex flex-col bg-white text-black relative">

          {/* MESSAGES FEED */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 lg:p-20 space-y-20 scrollbar-thin">
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: m.role === 'user' ? 40 : -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] lg:max-w-2xl space-y-2`}>
                    <div className={`flex items-center gap-4 uppercase font-black text-[8px] tracking-[0.4em] italic ${m.role === 'user' ? 'flex-row-reverse' : ''} opacity-30`}>
                      <span>{m.role === 'user' ? 'OPERATOR' : 'AGENT_CORE'}</span>
                      <div className="h-[1px] flex-1 bg-black" />
                    </div>
                    <div className={`p-6 border-2 border-black text-sm font-bold leading-relaxed ${m.role === 'user' ? 'bg-black text-white' : 'bg-primary text-black'}`}>
                      <p className="whitespace-pre-wrap">{m.content}</p>
                      {m.latency && (
                        <div className="mt-4 pt-4 border-t border-black/10 flex justify-between font-black text-[7px] tracking-[0.2em] italic uppercase opacity-50">
                          <span>RTT: {m.latency}ms</span>
                          <span>{m.model?.toUpperCase()}</span>
                        </div>
                      )}

                      {m.steps && <ExecutionTrace steps={m.steps} />}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-6 p-8 italic">
                <span className="text-4xl font-heading font-black opacity-5 animate-pulse">COMPUTING_RESPONSE...</span>
              </motion.div>
            )}
          </div>

          <AnimatePresence>
            {pendingApproval && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="absolute bottom-32 left-8 right-8 z-[60] bg-primary border-4 border-black p-8 shadow-[12px_12px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center justify-between gap-8"
              >
                <div className="flex gap-6 items-center">
                  <div className="w-16 h-16 border-4 border-black flex items-center justify-center bg-white animate-pulse">
                    <Shield className="w-8 h-8 text-black" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-black uppercase text-black italic bg-white inline-block px-2">MANUAL_INTERVENTION_REQUIRED</div>
                    <h3 className="text-xl font-heading font-black text-black uppercase leading-none">ACTION: {pendingApproval.tool_name}</h3>
                    <div className="text-[10px] font-black text-black/60 font-mono break-all">{JSON.stringify(pendingApproval.args)}</div>
                  </div>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                  <button
                    onClick={() => setPendingApproval(null)}
                    className="flex-1 md:flex-none px-8 py-3 border-2 border-black font-black text-[10px] uppercase hover:bg-black hover:text-white transition-all"
                  >
                    DECLINE_REQ
                  </button>
                  <button
                    onClick={() => handleApprove(pendingApproval.tool_call_id)}
                    className="flex-1 md:flex-none px-12 py-3 bg-black text-white font-black text-[10px] uppercase hover:bg-white hover:text-black transition-all"
                  >
                    APPROVE_CORE_ACTION
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* INPUT SECTION */}
          <div className="p-4 lg:p-8 border-t-4 border-black bg-black">
            <div className="container mx-auto flex gap-4 lg:gap-8 items-end">
              <div className="flex-1 space-y-2">
                <div className="text-[8px] font-black text-primary uppercase tracking-[0.4em] italic">/ Command_Input_Field</div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                  placeholder="ENTER_CMD_STRING..."
                  className="w-full bg-transparent border-none text-white text-lg lg:text-xl font-heading font-bold outline-none resize-none h-16 placeholder:opacity-10 uppercase"
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="w-16 h-16 bg-primary text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all group"
              >
                <Command className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
              </button>
            </div>
          </div>
        </main>
      </div>

      <style jsx global>{`
        .acid-text { color: #facc15; }
        .module-tag { font-size: 11px; padding: 4px 12px; background: #ccff00; color: #000; font-weight: 900; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #fff; }
      `}</style>
    </div>
  )
}