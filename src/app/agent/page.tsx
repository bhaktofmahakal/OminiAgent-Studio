'use client'

import Link from 'next/link'
import { ArrowLeft, Plus, Bot, Zap, Shield, Globe, Clock, TrendingUp } from 'lucide-react'
import { useState } from 'react'

interface Agent {
    id: string
    name: string
    description: string
    model: string
    visibility: 'public' | 'private'
    requests: number
    latency: number
    status: 'active' | 'inactive'
}

export default function AgentsPage() {
    const [agents] = useState<Agent[]>([
        {
            id: 'template-support',
            name: 'SUPPORT_UNIT_ALPHA',
            description: 'Advanced reasoning agent optimized for multi-language technical support and documentation retrieval.',
            model: 'Claude 3.5 Sonnet',
            visibility: 'public',
            requests: 12450,
            latency: 156,
            status: 'active'
        },
        {
            id: 'template-code',
            name: 'DEBUGGER_CORE_X',
            description: 'Specialized coding assistant with real-time PR analysis and security vulnerability detection.',
            model: 'GPT-4o',
            visibility: 'private',
            requests: 8920,
            latency: 89,
            status: 'active'
        },
        {
            id: 'template-data',
            name: 'ANALYTICS_PUMP_v2',
            description: 'High-throughput data extraction and synthesis engine with native CSV/JSON processing.',
            model: 'Gemini 1.5 Pro',
            visibility: 'public',
            requests: 5670,
            latency: 203,
            status: 'active'
        }
    ])

    return (
        <main className="min-h-screen bg-[#080808] text-white">
            {/* Industrial Header */}
            <nav className="fixed top-0 left-0 w-full z-[100] px-6 lg:px-20 flex justify-between items-center bg-[#080808]/80 backdrop-blur-xl border-b-2 border-white/5 h-20">
                <Link href="/" className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-white/40 hover:text-primary transition-colors">
                    <ArrowLeft className="w-4 h-4" /> [EXIT_AGENTS]
                </Link>

                <Link href="/dashboard" className="brutal-btn py-2 px-6 bg-primary text-black font-black uppercase italic hover:bg-white transition-all text-xs flex items-center gap-2">
                    <Plus className="w-3 h-3" /> NEW_AGENT
                </Link>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 lg:px-20 border-b-8 border-white/5">
                <div className="container mx-auto">
                    <div className="module-tag mb-6 font-black scale-90 uppercase">PHASE_04: AGENT_FLEET</div>
                    <h1 className="text-5xl lg:text-7xl font-heading font-black italic tracking-tighter uppercase leading-none mb-8 text-white">
                        DEPLOYED_<span className="text-primary">AGENTS</span>
                    </h1>
                    <p className="text-sm font-body font-bold opacity-40 max-w-2xl uppercase tracking-[0.2em] leading-relaxed">
                        MANAGE YOUR AUTONOMOUS AI AGENTS. MONITOR PERFORMANCE, CONFIGURE MODELS, AND SCALE YOUR INFRASTRUCTURE.
                    </p>
                </div>
            </section>

            {/* Stats Grid */}
            <section className="py-12 px-6 lg:px-20 bg-white text-black border-b-8 border-black">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { label: 'TOTAL_AGENTS', value: agents.length, icon: Bot },
                            { label: 'ACTIVE_NOW', value: agents.filter(a => a.status === 'active').length, icon: Zap },
                            { label: 'PUBLIC_AGENTS', value: agents.filter(a => a.visibility === 'public').length, icon: Globe },
                            { label: 'PRIVATE_AGENTS', value: agents.filter(a => a.visibility === 'private').length, icon: Shield }
                        ].map((stat, i) => (
                            <div key={i} className="border-2 border-black bg-white hover:bg-[#080808] transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none translate-x-[-3px] translate-y-[-3px] hover:translate-x-0 hover:translate-y-0 group p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-black/40 group-hover:text-white/40">{stat.label}</span>
                                    <stat.icon className="w-5 h-5 text-black/20 group-hover:text-primary transition-colors" />
                                </div>
                                <div className="text-4xl font-heading font-black group-hover:text-white">{stat.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Agents List */}
            <section className="py-20 px-6 lg:px-20">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-heading font-black italic tracking-tighter uppercase mb-12 text-white">
                        ACTIVE_<span className="text-primary">UNITS</span>
                    </h2>

                    <div className="grid gap-6">
                        {agents.map((agent) => (
                            <div key={agent.id} className="border-2 border-white/10 bg-white/[0.02] hover:border-primary/40 transition-all group">
                                {/* Agent Header */}
                                <div className="flex justify-between items-center px-6 py-3 border-b-2 border-white/10 bg-white/[0.02]">
                                    <div className="flex items-center gap-4">
                                        <Bot className="w-5 h-5 text-primary" />
                                        <span className="font-heading font-black text-sm text-white uppercase tracking-widest">{agent.name}</span>
                                        <span className={`px-3 py-1 text-[8px] font-black uppercase ${agent.visibility === 'public'
                                            ? 'bg-primary/20 text-primary border border-primary/40'
                                            : 'bg-white/5 text-white/40 border border-white/10'
                                            }`}>
                                            {agent.visibility}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-primary animate-pulse' : 'bg-white/20'}`} />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{agent.status}</span>
                                    </div>
                                </div>

                                {/* Agent Body */}
                                <div className="p-8">
                                    <p className="text-sm font-body font-bold text-white/60 uppercase mb-6 leading-relaxed">
                                        {agent.description}
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">MODEL</div>
                                            <div className="text-sm font-black text-white">{agent.model}</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">REQUESTS</div>
                                            <div className="text-sm font-black text-primary flex items-center gap-2">
                                                <TrendingUp className="w-3 h-3" />
                                                {agent.requests.toLocaleString()}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">AVG_LATENCY</div>
                                            <div className="text-sm font-black text-white flex items-center gap-2">
                                                <Clock className="w-3 h-3" />
                                                {agent.latency}ms
                                            </div>
                                        </div>
                                        <div className="flex items-end">
                                            <Link
                                                href={`/agent/${agent.id}`}
                                                className="brutal-btn py-2 px-6 bg-primary text-black font-black uppercase italic hover:bg-white transition-all text-xs w-full text-center"
                                            >
                                                MANAGE
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-6 lg:px-20 border-t-8 border-white/5 bg-black">
                <div className="container mx-auto text-center">
                    <div className="text-xs font-black uppercase tracking-[0.4em] opacity-30 italic mb-4">{"// READY_TO_SCALE"}</div>
                    <Link
                        href="/dashboard"
                        className="inline-block brutal-btn py-6 px-16 bg-primary text-black font-black uppercase italic hover:bg-white transition-all"
                    >
                        CREATE_NEW_AGENT
                    </Link>
                </div>
            </section>
        </main>
    )
}
