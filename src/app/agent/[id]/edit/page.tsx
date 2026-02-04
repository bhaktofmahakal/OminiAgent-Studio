"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Bot, Save, Play, Wand2, Code, Globe, Calculator, Search, Settings, Terminal, Cpu, Zap, Hash, Layers, ChevronLeft, Plus, Network, Loader2, FileText, Trash2, Database, Shield, Users } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ModelSelector } from "@/components/agent/model-selector"
import { toast } from "sonner"
import { motion } from "framer-motion"

export default function EditAgentPage() {
    const params = useParams()
    const router = useRouter()
    const agentId = params.id as string

    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const [agentName, setAgentName] = useState("")
    const [agentDescription, setAgentDescription] = useState("")
    const [systemPrompt, setSystemPrompt] = useState("")
    const [selectedModel, setSelectedModel] = useState("gpt-4o")
    const [temperature, setTemperature] = useState("0.7")
    const [maxTokens, setMaxTokens] = useState("2048")
    const [visibility, setVisibility] = useState("private")

    const [tools, setTools] = useState({
        webSearch: false,
        codeExecution: false,
        mathSolver: false,
        imageGeneration: false
    })

    const [hitlTools, setHitlTools] = useState<string[]>([])
    const [memoryEnabled, setMemoryEnabled] = useState(false)

    // Team integration
    const [teams, setTeams] = useState<{ id: string, name: string, role: string }[]>([])
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)

    const [documents, setDocuments] = useState<any[]>([])
    const [isUploading, setIsUploading] = useState(false)

    useEffect(() => {
        async function loadAgent() {
            try {
                const response = await fetch(`/api/agent/${agentId}`)
                if (!response.ok) throw new Error('LOAD_FAILURE')
                const data = await response.json()

                // ... same as before ...
                setAgentName(data.name || "")
                setAgentDescription(data.description === 'NULL' ? "" : (data.description || ""))
                setSystemPrompt(data.system_prompt || "")
                if (data.models && Array.isArray(data.models) && data.models.length > 0) {
                    setSelectedModel(data.models[0])
                } else if (data.model) {
                    setSelectedModel(data.model)
                }
                setTemperature(data.temperature?.toString() || "0.7")
                setMaxTokens(data.max_tokens?.toString() || "2048")
                setVisibility(data.visibility || "private")
                if (data.tools && Array.isArray(data.tools)) {
                    setTools({
                        webSearch: data.tools.includes('webSearch'),
                        codeExecution: data.tools.includes('codeExecution'),
                        mathSolver: data.tools.includes('mathSolver'),
                        imageGeneration: data.tools.includes('imageGeneration')
                    })
                }
                setHitlTools(data.requires_approval_tools || [])
                setMemoryEnabled(data.memory_enabled || false)
                setSelectedTeamId(data.team_id || null)
            } catch (error) {
                console.error('Error loading agent:', error)
                toast.error('INITIALIZATION_FAILED')
            } finally {
                setIsLoading(false)
            }
        }

        async function loadDocuments() {
            try {
                const res = await fetch(`/api/agent/${agentId}/documents`)
                if (res.ok) setDocuments(await res.json())
            } catch (e) { console.error(e) }
        }

        async function loadTeams() {
            try {
                const res = await fetch('/api/teams')
                if (res.ok) setTeams(await res.json())
            } catch (e) { console.error(e) }
        }

        if (agentId) {
            loadAgent()
            loadDocuments()
            loadTeams()
        }
    }, [agentId])

    const onDrop = async (acceptedFiles: File[]) => {
        setIsUploading(true)
        const toastId = toast.loading('UPLOADING_TO_QUANTUM_STORAGE...')

        try {
            for (const file of acceptedFiles) {
                const content = await file.text()
                const res = await fetch(`/api/agent/${agentId}/documents`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content, filename: file.name })
                })
                if (!res.ok) throw new Error(`UPLOAD_FAILED_${file.name}`)
            }

            toast.success('DATA_INGESTION_COMPLETE', { id: toastId })
            // Reload docs
            const res = await fetch(`/api/agent/${agentId}/documents`)
            if (res.ok) setDocuments(await res.json())
        } catch (e: any) {
            toast.error(e.message, { id: toastId })
        } finally {
            setIsUploading(false)
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'text/plain': ['.txt'], 'application/pdf': ['.pdf'], 'text/markdown': ['.md'] },
        maxSize: 10 * 1024 * 1024 // 10MB
    })

    const toggleTool = (tool: keyof typeof tools) => {
        setTools(prev => ({ ...prev, [tool]: !prev[tool] }))
    }

    const handleDeleteDocument = async (docId: string) => {
        const toastId = toast.loading('WIPING_DATA_NODE...')
        try {
            const res = await fetch(`/api/agent/${agentId}/documents?docId=${docId}`, {
                method: 'DELETE'
            })
            if (res.ok) {
                setDocuments(prev => prev.filter(d => d.id !== docId))
                toast.success('NODE_PURGED', { id: toastId })
            } else {
                toast.error('WIPE_FAILED', { id: toastId })
            }
        } catch (e) {
            toast.error('NETWORK_FAILURE', { id: toastId })
        }
    }

    const handleSave = async () => {
        if (!agentName.trim() || !systemPrompt.trim()) {
            toast.error('VALIDATION_ERROR', { description: 'CRITICAL_FIELDS_MISSING' })
            return
        }

        setIsSaving(true)
        const toastId = toast.loading('SYNCHRONIZING_CORE...')

        try {
            const response = await fetch(`/api/agent/${agentId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: agentName,
                    description: agentDescription || 'NULL',
                    system_prompt: systemPrompt,
                    models: [selectedModel],
                    tools: Object.entries(tools).filter(([_, enabled]) => enabled).map(([tool]) => tool),
                    temperature: parseFloat(temperature),
                    max_tokens: parseInt(maxTokens),
                    visibility,
                    requires_approval_tools: hitlTools,
                    memory_enabled: memoryEnabled,
                    team_id: selectedTeamId
                })
            })

            if (response.ok) {
                toast.success(`PATCH_COMPLETE: ${agentId.slice(0, 8)}`, { id: toastId })
                router.push(`/agent/${agentId}`)
            } else {
                const err = await response.json()
                toast.error(`PATCH_FAILED: ${err.error || 'UNKNOWN'}`, { id: toastId })
            }
        } catch (error) {
            toast.error('NETWORK_CRITICAL_FAILURE', { id: toastId })
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <div className="text-[10px] font-black uppercase tracking-[0.5em] text-primary animate-pulse italic">
                    DECRYPTING_AGENT_DATA...
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-body selection:bg-primary selection:text-black pb-40">
            <div className="scanlines fixed inset-0 opacity-10 pointer-events-none" />

            <nav className="sticky top-0 z-50 h-16 flex justify-between items-center border-b-[1px] border-white/10 bg-black/80 backdrop-blur-xl px-6 lg:px-10">
                <Link href={`/agent/${agentId}`} className="flex items-center gap-4 group">
                    <div className="w-8 h-8 border-[1px] border-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                        <ChevronLeft className="w-4 h-4" />
                    </div>
                    <span className="font-black text-[9px] uppercase tracking-widest italic group-hover:text-primary transition-all">/ CANCEL_EDIT /</span>
                </Link>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="brutal-btn force-bg-primary force-visible-black font-black flex items-center gap-3 hover:scale-105 active:scale-95 py-1.5 px-6 text-[9px]"
                >
                    {isSaving ? 'UPD_COMMITTING...' : 'UPDATE_CORE // SAVE'} <Save className="w-3.5 h-3.5 force-visible-black" />
                </button>
            </nav>

            <div className="container mx-auto px-6 lg:px-20 max-w-7xl mt-16">
                <header className="mb-12">
                    <h1 className="text-3xl lg:text-4xl font-heading font-black italic tracking-tighter leading-none mb-2">
                        AGENT_<span className="acid-text">MODIFICATION</span>
                    </h1>
                    <div className="module-tag italic text-[9px] py-1 px-3">CORE_ID: {agentId.toUpperCase()}</div>
                </header>

                <div className="grid lg:grid-cols-12 gap-16">
                    {/* CONFIGURATION COLUMN */}
                    <div className="lg:col-span-8 space-y-20">

                        <section className="space-y-8">
                            <div className="flex items-center gap-3 text-[#ccff00] font-black uppercase text-sm">
                                <Hash className="w-4 h-4 text-[#ccff00]" /> 01 // IDENTITY_REMAP
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

                                <div className="flex items-center justify-between p-6 border-4 border-dashed border-white/10 bg-black/40">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-primary">Access_Level</Label>
                                        <p className="text-[8px] font-black text-white/40 uppercase">Global_Visibility_Protocol</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`text-[10px] font-black uppercase ${visibility === 'public' ? 'text-primary' : 'text-white/60'}`}>
                                            {visibility === 'public' ? 'FORCE_PUBLIC' : 'STRICT_PRIVATE'}
                                        </span>
                                        <Switch
                                            checked={visibility === 'public'}
                                            onCheckedChange={(checked) => setVisibility(checked ? 'public' : 'private')}
                                            className="data-[state=checked]:bg-primary"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-6 border-4 border-dashed border-primary/20 bg-primary/5">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-[#ccff00]">Neural_Recall</Label>
                                        <p className="text-[7px] font-black text-white/40 uppercase">Enable_Long_Term_Memory</p>
                                    </div>
                                    <Switch
                                        checked={memoryEnabled}
                                        onCheckedChange={setMemoryEnabled}
                                        className="data-[state=checked]:bg-primary h-4 w-8"
                                    />
                                </div>

                                {/* Team Selector */}
                                {teams.length > 0 && (
                                    <div className="p-6 border-4 border-dashed border-blue-500/20 bg-blue-500/5">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Users className="w-4 h-4 text-blue-400" />
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-blue-400">Team_Assignment</Label>
                                        </div>
                                        <p className="text-[7px] font-black text-white/40 uppercase mb-4">Assign this agent to a team workspace</p>
                                        <select
                                            value={selectedTeamId || ''}
                                            onChange={(e) => setSelectedTeamId(e.target.value || null)}
                                            className="w-full bg-black border-2 border-white/20 p-3 text-white font-black text-[10px] uppercase focus:border-blue-500 transition-all"
                                        >
                                            <option value="">PERSONAL_WORKSPACE</option>
                                            {teams.map((team) => (
                                                <option key={team.id} value={team.id}>
                                                    {team.name} [{team.role.toUpperCase()}]
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-[7px] font-black text-white/30 uppercase mt-2">
                                            {selectedTeamId ? 'This agent will be shared with team members' : 'Only you can access this agent'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="space-y-8">
                            <div className="flex items-center gap-3 text-[#ccff00] font-black uppercase text-sm">
                                <Terminal className="w-4 h-4 text-[#ccff00]" /> 02 // PROMPT_ARCH_UDO
                            </div>
                            <div className="border-l-8 border-white/10 pl-10">
                                <Textarea
                                    value={systemPrompt}
                                    onChange={(e) => setSystemPrompt(e.target.value)}
                                    placeholder="INJECT NEW INSTRUCTIONS HERE."
                                    className="bg-black border border-white/20 p-6 font-bold text-[10px] min-h-[350px] rounded-none focus:border-primary transition-all leading-tight placeholder:opacity-5 uppercase"
                                />
                                <div className="mt-4 flex justify-between font-black text-[9px] text-white/40 tracking-[0.5em] italic uppercase">
                                    <span>CHAR_UPD_BUFFER: {systemPrompt.length}</span>
                                    <span className="force-visible-primary animate-pulse">MOD_PENDING_COMMIT</span>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-8">
                            <div className="flex items-center gap-3 text-[#ccff00] font-black uppercase text-sm">
                                <Layers className="w-4 h-4 text-[#ccff00]" /> 03 // ENTROPY_RECALIBRATE
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

                        <section className="space-y-8 pb-20">
                            <div className="flex items-center gap-3 text-[#ccff00] font-black uppercase text-sm">
                                <Database className="w-4 h-4 text-[#ccff00]" /> 04 // KNOWLEDGE_CORE (RAG)
                            </div>
                            <div className="border-l-8 border-white/10 pl-10 space-y-8">
                                <div
                                    {...getRootProps()}
                                    className={`p-12 border-4 border-dashed transition-all flex flex-col items-center justify-center gap-4 cursor-pointer ${isDragActive ? 'border-primary bg-primary/10' : 'border-white/10 hover:border-white/30 bg-white/5'}`}
                                >
                                    <input {...getInputProps()} />
                                    <div className="w-16 h-16 bg-white/5 flex items-center justify-center border border-white/10">
                                        {isUploading ? <Loader2 className="w-8 h-8 animate-spin text-primary" /> : <FileText className="w-8 h-8 text-white/40" />}
                                    </div>
                                    <div className="text-center space-y-1">
                                        <div className="text-[10px] font-black uppercase tracking-widest">
                                            {isDragActive ? 'RELEASE_TO_INFUSE' : 'DRAG_FILES_OR_CLICK_TO_INGEST'}
                                        </div>
                                        <div className="text-[7px] font-black text-white/20 uppercase tracking-[0.2em]">MAX_SIZE: 10MB // FORMAT: .TXT, .MD, .PDF</div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="text-[10px] font-black uppercase text-white/40 italic">INGESTED_BLOCKS ({documents.length})</div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {documents.map((doc, idx) => (
                                            <div key={doc.id} className="p-4 border border-white/10 bg-white/[0.02] flex items-center justify-between group">
                                                <div className="flex items-center gap-4 min-w-0">
                                                    <div className="text-[10px] font-black text-white/20">#{idx + 1}</div>
                                                    <div className="truncate">
                                                        <div className="text-[9px] font-black uppercase truncate">{doc.metadata?.filename || 'UNKNOWN_DATA_NODE'}</div>
                                                        <div className="text-[7px] font-black text-white/40 uppercase">{doc.content.slice(0, 30)}...</div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteDocument(doc.id)}
                                                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 text-red-500/40 hover:text-red-500 transition-all"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* SIDEBAR CAPABILITIES */}
                    <div className="lg:col-span-4 h-fit lg:sticky lg:top-32 space-y-12">

                        <section className="p-8 border border-white/5 bg-white/[0.02] space-y-6">
                            <div className="flex items-center gap-3 text-primary italic font-black uppercase text-[10px] tracking-widest">
                                <Network className="w-3 h-3" /> Synthesis_Status
                            </div>
                            <div className="relative h-24 border border-white/10 flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.1)_0,transparent_70%)]" />
                                <div className="flex gap-4 items-center">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                                    <div className="w-12 h-[1px] bg-primary/20 relative">
                                        <div className="absolute top-0 left-0 w-1.5 h-[1px] bg-primary animate-[move_2s_linear_infinite]" />
                                    </div>
                                    <div className="text-[9px] font-black italic">ACTIVE_SYNS</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-[7px] font-black text-white/60 italic uppercase">
                                <div>[ID] {agentId.slice(0, 16)}...</div>
                                <div>[TS] {new Date().getTime()}</div>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <div className="flex items-center gap-3 text-[#ccff00] font-black uppercase text-sm">
                                <Zap className="w-4 h-4 text-[#ccff00]" /> MODULE_MAPPING
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

                                        {tools[tool.id as keyof typeof tools] && (
                                            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Shield className="w-2.5 h-2.5 text-primary" />
                                                    <span className="text-[7px] font-black uppercase text-white/40 italic">REQ_APPROVAL</span>
                                                </div>
                                                <Switch
                                                    checked={hitlTools.includes(tool.id)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) setHitlTools([...hitlTools, tool.id])
                                                        else setHitlTools(hitlTools.filter(t => t !== tool.id))
                                                    }}
                                                    className="data-[state=checked]:bg-primary h-3 w-6"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="p-8 bg-white text-black font-black uppercase italic overflow-hidden relative">
                            <div className="relative z-10 text-center space-y-4">
                                <div className="text-[9px] tracking-[0.3em] text-black">MODIFICATION_SUMMARY</div>
                                <div className="text-xl tracking-tighter leading-none border-y-[1px] border-black py-2">
                                    CONFIRM_<br />DATA_WRITE
                                </div>
                                <button
                                    onClick={handleSave}
                                    className="w-full h-14 bg-black border border-black text-white text-[10px] font-black mt-4 hover:bg-[#ccff00] hover:text-black hover:border-[#ccff00] transition-all flex items-center justify-center gap-3 active:scale-95"
                                >
                                    SET_OVERWRITE <Plus className="w-3 h-3 rotate-45" />
                                </button>
                            </div>
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
        </div >
    )
}
