"use client"

import { useState, useEffect } from "react"
import {
    RiKey2Fill,
    RiAddLine,
    RiDeleteBin6Line,
    RiTerminalBoxFill,
    RiShareForwardBoxLine,
    RiFileCopyLine,
    RiCheckDoubleLine,
    RiCommandLine,
    RiCodeSSlashLine,
    RiBookReadLine
} from "react-icons/ri"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

interface ApiKey {
    id: string
    name: string
    key_prefix: string
    key_secret?: string
    last_used_at: string | null
    created_at: string
}

export default function DevPage() {
    const [keys, setKeys] = useState<ApiKey[]>([])
    const [newKeyName, setNewKeyName] = useState("")
    const [isCreating, setIsCreating] = useState(false)
    const [copiedId, setCopiedId] = useState<string | null>(null)

    useEffect(() => {
        fetchKeys()
    }, [])

    async function fetchKeys() {
        const res = await fetch('/api/user/keys')
        if (res.ok) setKeys(await res.json())
    }

    async function createKey() {
        if (!newKeyName) return
        setIsCreating(true)
        try {
            const res = await fetch('/api/user/keys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newKeyName })
            })
            if (res.ok) {
                const newKey = await res.json()
                setKeys([newKey, ...keys])
                setNewKeyName("")
                toast.success("ACCESS_KEY_GENERATED", {
                    description: "SECURE_KEY_DEPLOYED. COPY NOW."
                })
            }
        } finally {
            setIsCreating(false)
        }
    }

    async function deleteKey(id: string) {
        toast.error("PROTOCOL_REVOKE", {
            description: "TERMINATE THIS ACCESS STREAM?",
            action: {
                label: "CONFIRM_WIPE",
                onClick: async () => {
                    const res = await fetch(`/api/user/keys/${id}`, { method: 'DELETE' })
                    if (res.ok) {
                        setKeys(prev => prev.filter(k => k.id !== id))
                        toast.success("NODE_DEACTIVATED")
                    } else {
                        toast.error("WIPE_FAILED")
                    }
                }
            }
        })
    }

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
        toast.info("HASH_COPIED")
    }

    return (
        <div className="min-h-screen bg-[#080808] text-white font-body selection:bg-primary selection:text-black mt-20 lg:mt-0">
            {/* COMPACT TOP HEADER */}
            <nav className="sticky top-0 z-40 bg-black border-b border-white/10 px-6 lg:px-12 py-4 flex justify-between items-center">
                <div className="flex flex-col">
                    <h1 className="text-sm font-black tracking-[0.2em] uppercase text-primary italic">
                        / API_GATEWAY_CONTROL
                    </h1>
                    <div className="text-[8px] font-black text-white/40 tracking-[0.4em] mt-1 uppercase">SECURE_CREDENTIAL_ORCHESTRATOR</div>
                </div>
            </nav>

            <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-10 space-y-12">

                <section className="grid lg:grid-cols-12 gap-12">
                    {/* KEY MANAGEMENT PANEL */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="space-y-6 bg-white/[0.02] border border-white/10 p-8 shadow-[8px_8px_0px_rgba(255,255,255,0.02)]">
                            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                                <RiAddLine className="text-primary w-5 h-5" />
                                <h3 className="text-xs font-black uppercase tracking-widest italic">GENERATE_NEW_ENDPOINT_TOKEN</h3>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <input
                                    placeholder="IDENTIFIER_TAG (E.G. PROD_BOT_01)"
                                    className="flex-1 bg-black border-2 border-white/10 p-4 font-black text-[11px] uppercase outline-none focus:border-primary/50 focus:bg-white/[0.03] transition-all italic text-white"
                                    value={newKeyName}
                                    onChange={(e) => setNewKeyName(e.target.value)}
                                />
                                <button
                                    onClick={createKey}
                                    disabled={isCreating || !newKeyName}
                                    className="bg-primary text-black font-black px-10 py-4 uppercase text-[11px] italic hover:bg-white transition-all disabled:opacity-30 disabled:grayscale shadow-[4px_4px_0px_#fff]"
                                >
                                    {isCreating ? 'PROCESS...' : 'INITIATE'}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <div className="flex items-center gap-3">
                                    <RiTerminalBoxFill className="text-primary w-5 h-5" />
                                    <h3 className="text-xs font-black uppercase tracking-widest italic">ACTIVE_ACCESS_MATRICES</h3>
                                </div>
                                <span className="text-[9px] font-black text-white/40 uppercase">{keys.length} NODES_ONLINE</span>
                            </div>

                            <div className="grid gap-4">
                                <AnimatePresence mode="popLayout">
                                    {keys.map(key => (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            key={key.id}
                                            className="group border border-white/10 bg-white/[0.03] p-6 hover:border-primary/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                                        >
                                            <div className="space-y-3 min-w-0 flex-1">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                                    <div className="text-sm font-black uppercase italic tracking-tighter truncate">{key.name}</div>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-4 font-mono text-[9px] text-white/40 uppercase tracking-widest">
                                                    <span className="bg-white/5 px-2 py-1 border border-white/10">PRE: {key.key_prefix}</span>
                                                    <span>STAMP: {new Date(key.created_at).toLocaleDateString()}</span>
                                                </div>

                                                {key.key_secret && (
                                                    <div className="mt-4 flex items-center gap-3 bg-primary/5 border border-primary/20 p-4 overflow-hidden">
                                                        <code className="text-primary text-[10px] font-black truncate flex-1">{key.key_secret}</code>
                                                        <button
                                                            onClick={() => copyToClipboard(key.key_secret!, key.id)}
                                                            className="text-primary hover:text-white transition-all p-2 bg-white/5 border border-white/10"
                                                        >
                                                            {copiedId === key.id ? <RiCheckDoubleLine className="w-4 h-4" /> : <RiFileCopyLine className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => deleteKey(key.id)}
                                                className="sm:opacity-0 group-hover:opacity-100 p-3 hover:bg-red-500/20 text-red-500/40 hover:text-red-500 transition-all border border-transparent hover:border-red-500/40"
                                            >
                                                <RiDeleteBin6Line className="w-5 h-5" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {keys.length === 0 && (
                                    <div className="py-20 text-center border border-dashed border-white/10 bg-white/[0.01]">
                                        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">NO_ACTIVE_CREDENTIALS_FOUND</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* DOCUMENTATION PANEL */}
                    <div className="lg:col-span-5 space-y-8">
                        <section className="bg-black border border-white/10 overflow-hidden shadow-[8px_8px_0px_rgba(204,255,0,0.05)]">
                            <div className="p-6 border-b border-white/10 flex items-center gap-3 bg-white/[0.02]">
                                <RiBookReadLine className="text-primary w-5 h-5" />
                                <h3 className="text-xs font-black uppercase tracking-widest italic">INTEGRATION_PROTOCOLS</h3>
                            </div>

                            <div className="p-8 space-y-10 font-mono text-[10px] uppercase leading-relaxed text-white/60">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-white/10 px-2 py-0.5 text-white font-black">POST</span>
                                        <span className="text-white font-black tracking-tight underline">/api/v1/agent/[agent_id]/chat</span>
                                    </div>
                                    <div className="p-4 bg-white/5 border-l-2 border-primary text-[9px] space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-primary italic">X-API-KEY</span>
                                            <span className="text-white">[SECURE_TOKEN]</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-primary italic">CONTENT-TYPE</span>
                                            <span className="text-white">APPLICATION/JSON</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-white font-black mb-2">
                                        <RiCodeSSlashLine className="text-primary" /> PAYLOAD_SCHEMA
                                    </div>
                                    <pre className="p-5 bg-[#0c0c0c] border border-white/5 text-white/40 overflow-x-auto text-[9px] leading-tight selection:bg-primary/20">
                                        {`{
  "messages": [
    { 
      "role": "user", 
      "content": "QUERY_STRING" 
    }
  ],
  "stream": true
}`}
                                    </pre>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-white font-black mb-2">
                                        <RiCommandLine className="text-primary" /> TERMINAL_TEST
                                    </div>
                                    <div className="relative group">
                                        <div className="p-5 bg-black border border-[#ccff00]/20 text-white/40 break-all text-[9px] leading-relaxed select-all">
                                            {`curl -X POST https://omniagent.studio/api/v1/agent/ID/chat \\
-H "x-api-key: YOUR_KEY" \\
-H "Content-Type: application/json" \\
-d '{"messages": [{"role": "user", "content": "HELO"}]}'`}
                                        </div>
                                        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <RiFileCopyLine className="w-3 h-3 text-primary animate-pulse" />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-3 text-primary/40 italic font-black text-[8px]">
                                        <div className="w-1 h-1 bg-primary/40 rounded-full" />
                                        WEBHOOK_RELAY_ACTIVE_v4.1
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </section>
            </div>
        </div>
    )
}
