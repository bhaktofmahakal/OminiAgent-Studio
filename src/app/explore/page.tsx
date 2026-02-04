"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
    RiSearchEyeLine,
    RiGlobalLine,
    RiRobot2Line,
    RiArrowRightSLine,
    RiCompass3Fill,
    RiTerminalBoxFill,
    RiPulseFill,
    RiBarChartFill
} from "react-icons/ri"
import { motion, AnimatePresence } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"

interface Agent {
    id: string
    name: string
    description: string
    models: string[]
    visibility: 'private' | 'public'
    created_at: string
}

export default function ExplorePage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [agents, setAgents] = useState<Agent[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function loadPublicAgents() {
            try {
                const res = await fetch('/api/agent/public')
                if (res.ok) {
                    setAgents(await res.json())
                }
            } catch (e) {
                console.error(e)
            } finally {
                setIsLoading(false)
            }
        }
        loadPublicAgents()
    }, [])

    const filteredAgents = agents.filter(a =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-body selection:bg-primary selection:text-black">
            <div className="scanlines fixed inset-0 opacity-10 pointer-events-none" />

            {/* HEADER */}
            <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10 px-6 lg:px-12 py-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <RiCompass3Fill className="w-8 h-8 text-primary animate-spin-slow" />
                    <div className="flex flex-col">
                        <h1 className="text-xl font-heading font-black italic tracking-tighter uppercase text-white">
                            EXPLORE_<span className="text-primary">GALAXY</span>
                        </h1>
                        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/40">PUBLIC_AGENTS_INDEX_LIVE</span>
                    </div>
                </div>

                <div className="relative hidden md:block">
                    <input
                        placeholder="SEARCH_UNIVERSE..."
                        className="bg-white/5 border border-white/10 focus:border-primary outline-none font-black text-[10px] uppercase px-10 h-12 w-80 transition-all italic"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <RiSearchEyeLine className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                </div>
            </nav>

            <main className="container mx-auto px-6 lg:px-12 py-12">
                <div className="grid lg:grid-cols-12 gap-12">

                    {/* LEFT: FILTERS & TAGS */}
                    <aside className="lg:col-span-3 space-y-10">
                        <section className="space-y-4">
                            <div className="text-[10px] font-black uppercase tracking-widest text-primary italic border-b border-white/10 pb-2">
                                CATEGORIES
                            </div>
                            <div className="flex flex-col gap-2">
                                {['All_Agents', 'Productivity', 'Creative', 'Coding', 'Research'].map(tag => (
                                    <button key={tag} className="text-left text-[11px] font-black uppercase tracking-wider text-white/40 hover:text-primary transition-all flex items-center justify-between group">
                                        {tag} <RiArrowRightSLine className="opacity-0 group-hover:opacity-100 transition-all" />
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section className="p-6 border border-white/10 bg-white/[0.02] space-y-4">
                            <div className="text-[9px] font-black text-white/40 uppercase">LIVE_STATS</div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <div className="text-lg font-heading font-black">{agents.length}</div>
                                    <div className="text-[7px] font-black uppercase opacity-40">ACTIVE_NODES</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-lg font-heading font-black">99.9%</div>
                                    <div className="text-[7px] font-black uppercase opacity-40">UPTIME_SYN</div>
                                </div>
                            </div>
                        </section>
                    </aside>

                    {/* RIGHT: AGENT GRID */}
                    <div className="lg:col-span-9 space-y-8">
                        {isLoading ? (
                            <div className="grid md:grid-cols-2 gap-6">
                                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48 bg-white/5 border border-white/10" />)}
                            </div>
                        ) : filteredAgents.length > 0 ? (
                            <div className="grid md:grid-cols-2 gap-6">
                                {filteredAgents.map((agent) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={agent.id}
                                        className="group border border-white/10 bg-white/5 p-8 space-y-6 hover:border-primary/60 transition-all relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all" />

                                        <div className="flex justify-between items-start">
                                            <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary transition-all">
                                                <RiRobot2Line className="w-6 h-6 group-hover:text-black" />
                                            </div>
                                            <div className="flex items-center gap-2 text-[8px] font-black text-primary uppercase italic">
                                                <RiPulseFill className="animate-pulse" /> SYNC_OK
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="text-xl font-heading font-black uppercase text-white group-hover:text-primary transition-all">{agent.name}</h3>
                                            <p className="text-[10px] font-bold text-white/40 leading-relaxed uppercase tracking-widest line-clamp-2">
                                                {agent.description}
                                            </p>
                                        </div>

                                        <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                                            <div className="flex flex-col">
                                                <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.3em]">Runtime</span>
                                                <span className="text-[9px] font-black text-primary uppercase italic">{agent.models?.[0]?.toUpperCase() || 'GPT-4O'}</span>
                                            </div>
                                            <Link href={`/agent/${agent.id}`}>
                                                <button className="brutal-btn bg-white text-black font-black text-[10px] py-1.5 px-6 uppercase hover:bg-primary transition-all">
                                                    FORK_&_CHAT
                                                </button>
                                            </Link>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-40 text-center border border-dashed border-white/10">
                                <div className="text-2xl font-heading font-black italic uppercase text-white/20 tracking-widest">
                                    NO_ENTITIES_FOUND_IN_THIS_SECTOR
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <style jsx global>{`
        .scanlines {
          background: linear-gradient(
            to bottom,
            transparent 50%,
            rgba(0, 0, 0, 0.5) 51%,
            transparent 100%
          );
          background-size: 100% 4px;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
        </div>
    )
}
