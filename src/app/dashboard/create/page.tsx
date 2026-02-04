"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Bot, Save, Play, Wand2, Code, Globe, Calculator, Search, Settings, Terminal, Cpu, Zap, Hash, Layers, ChevronLeft, Plus, Network } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ModelSelector } from "@/components/agent/model-selector"
import { toast } from "sonner"
import { motion } from "framer-motion"

export default function CreateAgentPage() {
  const [agentName, setAgentName] = useState("")
  const [agentDescription, setAgentDescription] = useState("")
  const [systemPrompt, setSystemPrompt] = useState("")
  const [selectedModel, setSelectedModel] = useState("gpt-4o")
  const [temperature, setTemperature] = useState("0.7")
  const [maxTokens, setMaxTokens] = useState("2048")
  const [isSaving, setIsSaving] = useState(false)

  const [tools, setTools] = useState({
    webSearch: false,
    codeExecution: false,
    mathSolver: false,
    imageGeneration: false
  })

  const toggleTool = (tool: keyof typeof tools) => {
    setTools(prev => ({ ...prev, [tool]: !prev[tool] }))
  }

  const handleSave = async () => {
    if (!agentName.trim() || !systemPrompt.trim()) {
      toast.error('VALIDATION_ERROR', { description: 'CRITICAL_FIELDS_MISSING' })
      return
    }

    setIsSaving(true)
    const toastId = toast.loading('WRITING_TO_CORE...')

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: agentName,
          description: agentDescription || 'NULL',
          system_prompt: systemPrompt,
          models: [selectedModel],
          tools: Object.entries(tools).filter(([_, enabled]) => enabled).map(([tool]) => tool),
          temperature: parseFloat(temperature),
          max_tokens: parseInt(maxTokens),
          visibility: 'private'
        })
      })

      const data = await response.json()
      if (response.ok) {
        toast.success(`WRITE_COMPLETE: ${data.id.slice(0, 8)}`, { id: toastId })
        window.location.href = `/agent/${data.id}`
      } else {
        toast.error(`WRITE_FAILED`, { id: toastId })
      }
    } catch (error) {
      toast.error('NETWORK_CRITICAL_FAILURE', { id: toastId })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-body selection:bg-primary selection:text-black pb-40">
      <div className="scanlines fixed inset-0 opacity-10 pointer-events-none" />

      <nav className="sticky top-0 z-50 h-16 flex justify-between items-center border-b-[1px] border-white/10 bg-black/80 backdrop-blur-xl px-6 lg:px-10">
        <Link href="/dashboard" className="flex items-center gap-4 group">
          <div className="w-8 h-8 border-[1px] border-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
            <ChevronLeft className="w-4 h-4" />
          </div>
          <span className="font-black text-[9px] uppercase tracking-widest italic group-hover:text-primary transition-all">/ RET_TO_CONSOLE /</span>
        </Link>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="brutal-btn force-bg-primary force-visible-black font-black flex items-center gap-3 hover:scale-105 active:scale-95 py-1.5 px-6 text-[9px]"
        >
          {isSaving ? 'COMMITTING...' : 'COMMIT_CHANGES // SAVE'} <Plus className="w-3.5 h-3.5 force-visible-black" />
        </button>
      </nav>

      <div className="container mx-auto px-6 lg:px-20 max-w-7xl mt-16">
        <header className="mb-12">
          <h1 className="text-3xl lg:text-4xl font-heading font-black italic tracking-tighter leading-none mb-2">
            AGENT_<span className="acid-text">GENESIS</span>
          </h1>
          <div className="module-tag italic text-[9px] py-1 px-3">PHASE_02: CONFIGURATION</div>
        </header>

        <div className="grid lg:grid-cols-12 gap-16">
          {/* CONFIGURATION COLUMN */}
          <div className="lg:col-span-8 space-y-20">

            <section className="space-y-8">
              <div className="flex items-center gap-3 text-[#ccff00] font-black uppercase text-sm">
                <Hash className="w-4 h-4 text-[#ccff00]" /> 01 // IDENTITY_LOGIC
              </div>
              <div className="space-y-10 border-l-8 border-white/10 pl-10">
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 italic">Process_Name_Slug*</Label>
                  <Input
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="ENTER_NAME..."
                    className="bg-transparent border-b border-white/40 border-t-0 border-l-0 border-r-0 rounded-none h-12 text-xl lg:text-2xl font-heading font-black focus:border-[#ccff00] transition-all focus:ring-0 uppercase placeholder:text-white/10 force-visible-white"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 italic">Context_Description</Label>
                    <Textarea
                      value={agentDescription}
                      onChange={(e) => setAgentDescription(e.target.value)}
                      placeholder="BRIEF_USE_CASE..."
                      className="bg-white/5 border border-white/10 p-6 rounded-none font-bold text-xs uppercase tracking-widest min-h-[120px] focus:border-[#ccff00] transition-all force-visible-white"
                    />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 italic">Logic_Backbone*</Label>
                    <ModelSelector
                      selectedModel={selectedModel}
                      onModelSelect={setSelectedModel}
                      showLatency={false}
                      className="bg-black/60 border-white/10 rounded-none h-14"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-6 mt-6 font-mono text-[7px] uppercase tracking-widest italic text-white">
                  <span>{"// PARAMS: "}{agentName.length > 0 ? 'VALID' : 'MISSING'}</span>
                  <div className="w-1 h-1 bg-white" />
                  <span>{"// UID_GEN: SYNCED"}</span>
                  <div className="w-1 h-1 bg-white" />
                  <span>{"// VECTOR_MAP: READY"}</span>
                </div>
              </div>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-3 text-[#ccff00] font-black uppercase text-sm">
                <Terminal className="w-4 h-4 text-[#ccff00]" /> 02 // PROMPT_ARCHITECTURE
              </div>
              <div className="border-l-8 border-white/10 pl-10">
                <Textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="YOU ARE A HIGH-CONTRAST LOGIC UNIT... INJECT INSTRUCTIONS HERE."
                  className="bg-black border border-white/20 p-6 font-bold text-[10px] min-h-[350px] rounded-none focus:border-primary transition-all leading-tight placeholder:opacity-5 uppercase"
                />
                <div className="mt-4 flex justify-between font-black text-[9px] text-white/40 tracking-[0.5em] italic uppercase">
                  <span>CHAR_BUFFER: {systemPrompt.length}</span>
                  <span className="force-visible-primary animate-pulse">READY_FOR_COMMITTING</span>
                </div>
              </div>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-3 text-[#ccff00] font-black uppercase text-sm">
                <Layers className="w-4 h-4 text-[#ccff00]" /> 03 // ENTROPY_CONTROL
              </div>
              <div className="grid md:grid-cols-2 gap-10 border-l-8 border-white/10 pl-10">
                <div className="p-10 border-4 border-white/10 space-y-10">
                  <div className="flex justify-between items-end italic">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Temperature_Spike</span>
                    <span className="text-xl font-heading font-black">{temperature}</span>
                  </div>
                  <Slider
                    min={0}
                    max={2}
                    step={0.1}
                    value={[parseFloat(temperature)]}
                    onValueChange={(vals) => setTemperature(vals[0].toString())}
                    className="w-full"
                  />
                  <div className="flex justify-between font-black text-[8px] text-white uppercase italic tracking-widest">
                    <span>Linear_Mode</span>
                    <span>Chaos_Mode</span>
                  </div>
                </div>
                <div className="p-10 border-4 border-white/10 space-y-10">
                  <div className="flex justify-between items-end italic">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Token_Allocation</span>
                    <span className="text-xl font-heading font-black">{maxTokens}</span>
                  </div>
                  <Input
                    type="number" value={maxTokens} onChange={(e) => setMaxTokens(e.target.value)}
                    className="bg-transparent border-b border-white border-t-0 border-l-0 border-r-0 rounded-none h-10 text-lg font-heading font-black focus:ring-0 focus:border-primary uppercase"
                  />
                </div>
              </div>
            </section>

          </div>

          {/* SIDEBAR CAPABILITIES */}
          <div className="lg:col-span-4 h-fit lg:sticky lg:top-32 space-y-12">

            {/* NEW: NEURAL PATHWAY PREVIEW */}
            <section className="p-8 border border-white/5 bg-white/[0.02] space-y-6">
              <div className="flex items-center gap-3 text-primary italic font-black uppercase text-[10px] tracking-widest">
                <Network className="w-3 h-3" /> Neural_Pathway_Map
              </div>
              <div className="relative h-24 border border-white/10 flex items-center justify-center overflow-hidden">
                {/* STYLIZED CONNECTING LINES MOCK */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.1)_0,transparent_70%)]" />
                <div className="flex gap-4 items-center">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                  <div className="w-12 h-[1px] bg-primary/20 relative">
                    <div className="absolute top-0 left-0 w-1.5 h-[1px] bg-primary animate-[move_2s_linear_infinite]" />
                  </div>
                  <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                  <div className="w-12 h-[1px] bg-white/10" />
                  <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-[7px] font-black text-white/60 italic uppercase">
                <div>[L0] INGRESS_POOL: 2KB</div>
                <div>[L1] SYNAPSE_REPLAY: ON</div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3 text-[#ccff00] font-black uppercase text-sm">
                <Zap className="w-4 h-4 text-[#ccff00]" /> MODULES
              </div>
              <div className="grid gap-4">
                {[
                  { id: "webSearch", label: "WEB_OSINT", desc: "EXTERNAL_REALTIME_FCH", icon: Globe },
                  { id: "codeExecution", label: "SCR_COMPILER", desc: "INTERNAL_NODE_RUNNER", icon: Code },
                  { id: "mathSolver", label: "NUM_RESOLVER", desc: "MATRIX_CALCULATIONS", icon: Calculator },
                  { id: "imageGeneration", label: "VIS_SYNTH", desc: "LATENT_DIFFUSION_X", icon: Wand2 }
                ].map(tool => (
                  <div key={tool.id} className={`p-4 border transition-all flex flex-col gap-4 ${tools[tool.id as keyof typeof tools] ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/[0.02]'}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <div className={`w-8 h-8 flex items-center justify-center border ${tools[tool.id as keyof typeof tools] ? 'border-primary text-primary' : 'border-white/10 text-white/40'}`}>
                          <tool.icon className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs font-heading font-black group-hover:text-primary">{tool.label}</div>
                          <div className="text-[7px] font-black text-white/60 italic">{tool.desc}</div>
                        </div>
                      </div>
                      <Switch
                        checked={tools[tool.id as keyof typeof tools]}
                        onCheckedChange={() => toggleTool(tool.id as keyof typeof tools)}
                        className="data-[state=checked]:bg-primary h-4 w-8"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="p-8 bg-white text-black font-black uppercase italic overflow-hidden relative">
              <div className="relative z-10 text-center space-y-4">
                <div className="text-[9px] tracking-[0.3em] text-black">SYSTEM_OVERVIEW</div>
                <div className="text-xl tracking-tighter leading-none border-y-[1px] border-black py-2">
                  READY_TO_<br />INITIALIZE
                </div>
                <button
                  onClick={handleSave}
                  className="w-full h-14 bg-black border border-black text-white text-[10px] font-black mt-4 hover:bg-[#ccff00] hover:text-black hover:border-[#ccff00] transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  EXE_GENESIS <Zap className="w-3 h-3 fill-current" />
                </button>
              </div>
              {/* BRUTALIST DECORATION */}
              <div className="absolute top-0 left-0 w-full h-2 bg-black opacity-10" />
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .acid-text { color: #facc15; }
        .module-tag { font-size: 11px; padding: 4px 12px; background: #ccff00; color: #000; font-weight: 900; }
        @keyframes move {
          from { left: 0; }
          to { left: 100%; }
        }
      `}</style>
    </div>
  )
}