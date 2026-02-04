'use client'

import Link from 'next/link'
import { ArrowLeft, Code, Copy, Check, ExternalLink } from 'lucide-react'
import { useState } from 'react'

export default function EmbedPage() {
    const [copied, setCopied] = useState(false)
    const [agentId] = useState('demo_agent_001')

    const embedCode = `<iframe 
  src="https://omniagent.studio/embed/agent/${agentId}" 
  width="400" 
  height="600" 
  frameborder="0"
  style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
></iframe>`

    const handleCopy = () => {
        navigator.clipboard.writeText(embedCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <main className="min-h-screen bg-[#080808] text-white">
            {/* Industrial Header */}
            <nav className="fixed top-0 left-0 w-full z-[100] px-6 lg:px-20 flex justify-between items-center bg-[#080808]/80 backdrop-blur-xl border-b-2 border-white/5 h-20">
                <Link href="/" className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-white/40 hover:text-primary transition-colors">
                    <ArrowLeft className="w-4 h-4" /> [EXIT_EMBED]
                </Link>

                <div className="flex gap-10 font-body text-[9px] font-black uppercase tracking-widest opacity-20 italic">
                    <div className="flex items-center gap-2"><Code className="w-3 h-3 text-primary" /> SDK_V2</div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 lg:px-20 border-b-8 border-white/5">
                <div className="container mx-auto">
                    <div className="module-tag mb-6 font-black scale-90 uppercase">PHASE_05: EMBED_SDK</div>
                    <h1 className="text-5xl lg:text-7xl font-heading font-black italic tracking-tighter uppercase leading-none mb-8 text-white">
                        EMBED_<span className="text-primary">PROTOCOL</span>
                    </h1>
                    <p className="text-sm font-body font-bold opacity-40 max-w-2xl uppercase tracking-[0.2em] leading-relaxed">
                        INTEGRATE AI AGENTS DIRECTLY INTO YOUR WEB APPLICATIONS. ZERO CONFIGURATION. INSTANT DEPLOYMENT.
                    </p>
                </div>
            </section>

            {/* Embed Code Section */}
            <section className="py-20 px-6 lg:px-20">
                <div className="container mx-auto max-w-4xl">
                    <div className="border-2 border-white/10 bg-white/[0.02] overflow-hidden">
                        <div className="flex justify-between items-center px-6 py-3 border-b-2 border-white/10 bg-white/[0.02]">
                            <span className="font-heading font-black text-xs text-white uppercase tracking-widest flex items-center gap-2">
                                <Code className="w-4 h-4 text-primary" /> EMBED_CODE
                            </span>
                            <button
                                onClick={handleCopy}
                                className="brutal-btn py-2 px-6 bg-primary text-black font-black uppercase italic hover:bg-white transition-all text-xs flex items-center gap-2"
                            >
                                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                {copied ? 'COPIED' : 'COPY'}
                            </button>
                        </div>
                        <div className="p-8">
                            <pre className="font-mono text-xs text-primary leading-relaxed overflow-x-auto">
                                {embedCode}
                            </pre>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="mt-12">
                        <h2 className="text-2xl font-heading font-black uppercase mb-6 text-white">LIVE_<span className="text-primary">PREVIEW</span></h2>
                        <div className="border-2 border-white/10 bg-black/60 p-1 w-full max-w-sm rounded-xl shadow-2xl relative group">
                            <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5">
                                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                                <div className="w-2 h-2 rounded-full bg-green-500/50" />
                                <div className="ml-auto text-[8px] font-black uppercase text-white/20 tracking-widest italic">OMN_EMBED_v2.0</div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="space-y-1">
                                    <div className="text-[7px] font-black text-primary uppercase tracking-[0.4em]">AGENT_UPLINK</div>
                                    <div className="h-6 bg-white/5 flex items-center px-3 text-[9px] text-white/40 italic">READY_FOR_HANDSHAKE...</div>
                                </div>
                                <div className="h-32 border-2 border-dashed border-white/5 flex items-center justify-center relative overflow-hidden">
                                    <div className="text-center space-y-2 relative z-10">
                                        <ExternalLink className="w-6 h-6 text-primary/40 mx-auto" />
                                        <p className="text-[9px] font-black uppercase tracking-widest text-primary/60 animate-pulse">ACTIVE_RECEPTOR_TUNNEL</p>
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/10 to-transparent opacity-50" />
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1 h-8 bg-white/5 border border-white/10" />
                                    <div className="w-8 h-8 bg-primary/20" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Configuration Options */}
                    <div className="mt-12 grid md:grid-cols-2 gap-6">
                        <div className="border-l-4 border-primary pl-6">
                            <h3 className="text-lg font-heading font-black uppercase mb-4 text-white">CUSTOMIZATION</h3>
                            <ul className="space-y-3 text-sm font-body text-white/60">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span> Adjust width and height parameters
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span> Custom color schemes
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span> Branding options
                                </li>
                            </ul>
                        </div>

                        <div className="border-l-4 border-primary pl-6">
                            <h3 className="text-lg font-heading font-black uppercase mb-4 text-white">SECURITY</h3>
                            <ul className="space-y-3 text-sm font-body text-white/60">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span> CORS configuration
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span> Domain whitelisting
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span> Rate limiting controls
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-6 lg:px-20 border-t-8 border-white/5 bg-black">
                <div className="container mx-auto text-center">
                    <div className="text-xs font-black uppercase tracking-[0.4em] opacity-30 italic mb-4">{"// READY_TO_INTEGRATE"}</div>
                    <Link
                        href="/docs"
                        className="inline-block brutal-btn py-6 px-16 bg-primary text-black font-black uppercase italic hover:bg-white transition-all"
                    >
                        VIEW_DOCUMENTATION
                    </Link>
                </div>
            </section>
        </main>
    )
}
