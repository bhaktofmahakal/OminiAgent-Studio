'use client'

import Link from 'next/link'
import { ArrowLeft, Book, Code, Terminal, Zap, FileText, Cpu, Shield } from 'lucide-react'

export default function DocsPage() {
    return (
        <main className="min-h-screen bg-[#080808] text-white">
            {/* Industrial Header */}
            <nav className="fixed top-0 left-0 w-full z-[100] px-6 lg:px-20 flex justify-between items-center bg-[#080808]/80 backdrop-blur-xl border-b-2 border-white/5 h-20">
                <Link href="/" className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-white/40 hover:text-primary transition-colors">
                    <ArrowLeft className="w-4 h-4" /> [EXIT_DOCS]
                </Link>

                <div className="flex gap-10 font-body text-[9px] font-black uppercase tracking-widest opacity-20 italic">
                    <div className="flex items-center gap-2"><Book className="w-3 h-3 text-primary" /> DOCUMENTATION</div>
                    <div className="flex items-center gap-2"><Terminal className="w-3 h-3 text-primary" /> API_V2</div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 lg:px-20 border-b-8 border-white/5">
                <div className="container mx-auto">
                    <div className="module-tag mb-6 font-black scale-90 uppercase">PHASE_02: DOCUMENTATION</div>
                    <h1 className="text-5xl lg:text-7xl font-heading font-black italic tracking-tighter uppercase leading-none mb-8 text-white">
                        SYSTEM_<span className="text-primary">DOCS</span>
                    </h1>
                    <p className="text-sm font-body font-bold opacity-40 max-w-2xl uppercase tracking-[0.2em] leading-relaxed">
                        COMPREHENSIVE TECHNICAL DOCUMENTATION FOR MULTI-MODEL AI ORCHESTRATION. BUILD, DEPLOY, AND SCALE AUTONOMOUS AGENTS.
                    </p>
                </div>
            </section>

            {/* Quick Start Grid */}
            <section className="py-20 px-6 lg:px-20 bg-white text-black border-b-8 border-black">
                <div className="container mx-auto">
                    <h2 className="text-3xl lg:text-4xl font-heading font-black italic tracking-tighter uppercase mb-12">QUICK_START</h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Quick Start Card */}
                        <div className="border-2 border-black bg-white hover:bg-[#080808] transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none translate-x-[-4px] translate-y-[-4px] hover:translate-x-0 hover:translate-y-0 group">
                            <div className="flex justify-between items-center px-6 py-3 border-b-2 border-black bg-black group-hover:bg-primary transition-colors">
                                <span className="font-heading font-black text-xs text-white group-hover:text-black italic tracking-widest uppercase flex items-center gap-2">
                                    <Zap className="w-4 h-4" /> INIT_AGENT
                                </span>
                            </div>
                            <div className="p-8 group-hover:text-white">
                                <ol className="space-y-4 font-body text-sm font-black uppercase">
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary">01.</span> CREATE_ACCOUNT
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary">02.</span> NAVIGATE_DASHBOARD
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary">03.</span> CLICK_NEW_AGENT
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary">04.</span> CONFIGURE_MODELS
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary">05.</span> DEPLOY_EXECUTE
                                    </li>
                                </ol>
                            </div>
                        </div>

                        {/* API Reference Card */}
                        <div className="border-2 border-black bg-white hover:bg-[#080808] transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none translate-x-[-4px] translate-y-[-4px] hover:translate-x-0 hover:translate-y-0 group">
                            <div className="flex justify-between items-center px-6 py-3 border-b-2 border-black bg-black group-hover:bg-primary transition-colors">
                                <span className="font-heading font-black text-xs text-white group-hover:text-black italic tracking-widest uppercase flex items-center gap-2">
                                    <Terminal className="w-4 h-4" /> API_ACCESS
                                </span>
                            </div>
                            <div className="p-8 group-hover:text-white">
                                <div className="bg-black/5 group-hover:bg-white/5 p-4 font-mono text-xs mb-4 border border-black/10 group-hover:border-white/10">
                                    POST /api/agent/&#123;id&#125;/chat
                                </div>
                                <p className="font-body text-xs font-black uppercase opacity-60 group-hover:opacity-100 leading-relaxed">
                                    PROGRAMMATIC ACCESS TO DEPLOYED AGENTS VIA REST API. REAL-TIME STREAMING SUPPORTED.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Integration Guide */}
            <section className="py-20 px-6 lg:px-20 bg-[#080808]">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="text-3xl lg:text-4xl font-heading font-black italic tracking-tighter uppercase mb-12 text-white">
                        INTEGRATION_<span className="text-primary">PROTOCOL</span>
                    </h2>

                    <div className="space-y-12">
                        {/* Embedding Section */}
                        <div className="border-l-4 border-primary pl-8">
                            <h3 className="text-xl font-heading font-black uppercase mb-4 text-white">EMBED_AGENTS</h3>
                            <p className="text-sm font-body opacity-60 mb-6 leading-relaxed">
                                Deploy agents directly into your web applications using iframe integration. Zero configuration required.
                            </p>
                            <div className="bg-white/5 p-6 font-mono text-xs border border-white/10 overflow-x-auto">
                                <pre className="text-primary">{`<iframe 
  src="https://omniagent.studio/embed/agent/YOUR_AGENT_ID" 
  width="400" 
  height="600" 
  frameborder="0"
></iframe>`}</pre>
                            </div>
                        </div>

                        {/* Authentication Section */}
                        <div className="border-l-4 border-primary pl-8">
                            <h3 className="text-xl font-heading font-black uppercase mb-4 text-white">AUTH_PROTOCOL</h3>
                            <p className="text-sm font-body opacity-60 mb-6 leading-relaxed">
                                Private agents require API key authentication via Authorization header. Access keys available in Settings → API Keys.
                            </p>
                            <div className="bg-white/5 p-6 font-mono text-xs border border-white/10">
                                <pre className="text-primary">{`Authorization: Bearer YOUR_API_KEY`}</pre>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-16 px-6 lg:px-20 border-t-8 border-white/5 bg-black">
                <div className="container mx-auto text-center">
                    <div className="text-xs font-black uppercase tracking-[0.4em] opacity-30 italic mb-4">{"// READY_TO_BUILD"}</div>
                    <Link
                        href="/dashboard"
                        className="inline-block brutal-btn py-6 px-16 bg-primary text-black font-black uppercase italic hover:bg-white transition-all"
                    >
                        ACCESS_DASHBOARD
                    </Link>
                </div>
            </section>
        </main>
    )
}
