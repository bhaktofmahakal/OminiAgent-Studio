"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import {
  RiSendPlane2Fill,
  RiRobot2Line,
  RiUserFill,
  RiFlashlightFill,
  RiBrainFill,
  RiSparklingFill,
  RiRocket2Fill,
  RiArrowLeftLine,
  RiSettings4Line,
  RiShareForwardFill,
  RiFileCopy2Fill,
  RiLoader4Line,
  RiTerminalBoxFill,
  RiDatabase2Fill,
  RiPulseFill
} from "react-icons/ri"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { models } from "@/components/agent/model-selector"
import { SimpleModelSelector } from "@/components/agent/simple-model-selector"
import { cn, formatTime } from "@/lib/utils"
import { useAuth, UserButton, RedirectToSignIn } from '@clerk/nextjs'

interface Message {
  id: string
  content: string
  role: "user" | "assistant" | "system"
  model?: string
  timestamp: Date
  latency?: number
  isStreaming?: boolean
}

const modelIcons: Record<string, React.ReactNode> = {
  "gpt-4o": <RiBrainFill className="w-4 h-4" />,
  "claude-3-haiku": <RiSparklingFill className="w-4 h-4" />,
  "gemini-1.5-pro": <RiFlashlightFill className="w-4 h-4" />,
  "groq-mixtral": <RiRocket2Fill className="w-4 h-4" />
}

export default function ChatPage() {
  const { isSignedIn, isLoaded } = useAuth()

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "SESSION_INITIALIZED // OMN_CORE_RELAY ACTIVE. READY FOR MULTI-MODEL ORCHESTRATION.",
      role: "assistant",
      model: "gpt-4o",
      timestamp: new Date(),
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [selectedModel, setSelectedModel] = useState("gpt-4o")
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [autoScroll, setAutoScroll] = useState(true)
  const [toolsEnabled, setToolsEnabled] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback((force = false) => {
    if (autoScroll || force) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [autoScroll])

  useEffect(() => {
    if (autoScroll) scrollToBottom()
  }, [messages, autoScroll, scrollToBottom])

  if (!isLoaded) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <RiLoader4Line className="w-10 h-10 animate-spin text-primary" />
    </div>
  )

  if (!isSignedIn) return <RedirectToSignIn />

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          model: selectedModel,
          stream: true,
          conversationId,
          enableTools: toolsEnabled
        })
      })

      if (!response.ok) throw new Error('Failed to send message')

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "",
        role: "assistant",
        model: selectedModel,
        timestamp: new Date(),
        isStreaming: true
      }

      setMessages(prev => [...prev, assistantMessage])

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let accumulatedContent = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))
                if (data.text) {
                  accumulatedContent += data.text
                  setMessages(prev => prev.map(msg => msg.id === assistantMessage.id ? { ...msg, content: accumulatedContent } : msg))
                }
                if (data.done) {
                  setMessages(prev => prev.map(msg => msg.id === assistantMessage.id ? { ...msg, isStreaming: false, latency: data.latency } : msg))
                }
              } catch (e) { }
            }
          }
        }
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: "CRITICAL_ERROR // UPLINK_FAILED. RE-INITIALIZE CONNECTION.",
        role: "assistant",
        model: selectedModel,
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-black font-body overflow-hidden">
      {/* SOLID HEADER */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black z-20 mt-20 lg:mt-0">
        <div className="flex items-center gap-4">
          <RiTerminalBoxFill className="w-5 h-5 text-primary" />
          <div className="flex flex-col">
            <h1 className="text-xs font-black uppercase tracking-[0.2em] force-visible-white italic">CHAT_STUDIO_v4.0</h1>
            <span className="text-[7px] font-black force-visible-white uppercase tracking-[0.4em] mt-1">OPERATIONAL_MODE: MULTI_ORCHESTRATOR</span>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="text-[9px] font-black uppercase text-white hover:text-primary transition-all border border-dashed border-white/20 px-4 py-1.5 focus:bg-white/10">
            CLEAR_HISTORY
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* LEFT PANEL - STATS & SELECTION */}
        <aside className="hidden lg:flex w-80 border-r border-white/10 bg-[#0a0a0a] p-8 flex-col gap-10 overflow-y-auto shrink-0">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">
              <RiRobot2Line /> SELECT_ENGINE
            </div>
            <SimpleModelSelector
              selectedModel={selectedModel}
              onModelSelect={setSelectedModel}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em] text-white italic">
              <span className="flex items-center gap-2"><RiFlashlightFill className="text-primary" /> NEURAL_LINK</span>
              <div
                onClick={() => setToolsEnabled(!toolsEnabled)}
                className={`w-10 h-5 border-2 transition-all cursor-pointer relative ${toolsEnabled ? 'border-primary bg-primary/20' : 'border-white/10 bg-white/5'}`}
              >
                <div className={`absolute top-0.5 bottom-0.5 w-3 transition-all ${toolsEnabled ? 'right-0.5 bg-primary' : 'left-0.5 bg-white/20'}`} />
              </div>
            </div>
            <p className="text-[7px] font-black uppercase tracking-widest text-white/40 italic">Enable real-time tools: Web Search, Math, and Logic modules.</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white italic">
              <RiPulseFill /> ENGINE_METRICS
            </div>
            <div className="space-y-2">
              {models.slice(0, 4).map(model => (
                <div key={model.id} className="border border-white/10 bg-white/5 p-3 flex items-center justify-between transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-white/5 border border-white/10 text-white">
                      {modelIcons[model.id] || <RiBrainFill className="w-3 h-3" />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-tight text-white">{model.name}</span>
                  </div>
                  <Badge variant="outline" className="text-[8px] font-black border-white/10 text-white/40">
                    {model.latency}MS
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 border border-primary/20 bg-primary/5 space-y-4">
            <div className="text-[9px] font-black uppercase tracking-widest text-primary italic">USAGE_MONITOR</div>
            <div className="flex justify-between items-baseline">
              <span className="text-[7px] font-black text-white uppercase">TOTAL_TOKENS</span>
              <span className="text-sm font-black italic tracking-tighter text-white">1,402,291</span>
            </div>
            <div className="w-full h-1 bg-white/10">
              <div className="bg-primary h-full w-[45%]" />
            </div>
          </div>
        </aside>

        {/* MAIN CHAT AREA */}
        <div className="flex-1 flex flex-col relative z-10">
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-hide bg-[#0b0b0b]/50"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex flex-col gap-4",
                  message.role === "user" ? "items-end" : "items-start"
                )}
              >
                <div className="flex items-center gap-4">
                  {message.role === "assistant" ? (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                        {message.model && modelIcons[message.model] || <RiRobot2Line className="w-4 h-4" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">{message.model?.toUpperCase()}</span>
                        <span className="text-[7px] font-black text-white uppercase tracking-[0.1em]">{formatTime(message.timestamp)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col text-right">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white italic">OPERATOR</span>
                        <span className="text-[7px] font-black text-white uppercase tracking-[0.1em]">{formatTime(message.timestamp)}</span>
                      </div>
                      <div className="w-8 h-8 bg-white/10 border border-white/20 flex items-center justify-center text-white">
                        <RiUserFill className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className={cn(
                    "max-w-4xl p-6 border-2 transition-all font-mono text-[11px] leading-relaxed",
                    message.role === "user"
                      ? "bg-white/5 border-white/20 rounded-l-xl rounded-tr-xl"
                      : "bg-[#111111] border-white/10 rounded-r-xl rounded-tl-xl shadow-xl"
                  )}
                >
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                      code: ({ children, className, ...props }) => {
                        const isInline = !className?.includes('language-');
                        return isInline ?
                          <code className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] text-primary" {...props}>{children}</code> :
                          <pre className="bg-black/40 p-4 border border-white/5 rounded-none overflow-x-auto my-6"><code className="text-[10px] text-white/70">{children}</code></pre>
                      }
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                  {message.isStreaming && <span className="inline-block w-1.5 h-4 bg-primary animate-pulse ml-2" />}
                </div>

                {message.latency && (
                  <div className="text-[7px] font-black text-white uppercase tracking-widest italic">
                    COMPUTE_TIME: {message.latency}ms // STATUS: OK
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT STATION */}
          <div className="p-8 border-t-2 border-white/10 bg-[#080808]/95">
            <div className="max-w-5xl mx-auto relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="TRANSMIT_INSTRUCTIONS..."
                className="w-full bg-white/[0.03] border-2 border-white/10 focus:border-primary/40 focus:bg-white/[0.05] outline-none p-6 pb-16 min-h-[140px] font-mono text-[11px] uppercase resize-none transition-all"
                disabled={isLoading}
              />
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-[8px] font-black text-white uppercase tracking-[0.4em]">
                    <RiDatabase2Fill /> MEMORY: ON
                  </div>
                  <div className="flex items-center gap-2 text-[8px] font-black text-white uppercase tracking-[0.4em]">
                    <RiTerminalBoxFill /> STREAM: v2
                  </div>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="force-bg-primary force-visible-black font-black uppercase italic text-xs px-10 h-10 flex items-center gap-3 hover:bg-white transition-all transform active:scale-95 shadow-[4px_4px_0px_#fff]"
                >
                  {isLoading ? (
                    <RiLoader4Line className="animate-spin w-4 h-4" />
                  ) : (
                    <>TRANSMIT <RiSendPlane2Fill className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
