'use client'

import Link from 'next/link'
import {
    RiArrowLeftLine,
    RiUser3Fill,
    RiMailFill,
    RiCalendarFill,
    RiShieldFlashFill,
    RiKey2Fill,
    RiNotification3Fill,
    RiFlashlightFill,
    RiTerminalBoxFill,
    RiSettings4Fill,
    RiDatabase2Fill,
    RiPulseFill
} from 'react-icons/ri'
import { useUser } from '@clerk/nextjs'
import { Badge } from '@/components/ui/badge'

export default function ProfilePage() {
    const { user, isLoaded } = useUser()

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-[#080808] flex items-center justify-center">
                <RiPulseFill className="w-10 h-10 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white font-body p-8 lg:p-12 space-y-12 relative">

            {/* Header Telemetry */}
            <div className="border-b-2 border-white/10 pb-8 flex justify-between items-end">
                <div className="flex flex-col">
                    <div className="text-[10px] font-black force-visible-primary uppercase tracking-[0.4em] mb-2 italic flex items-center gap-2">
                        <RiUser3Fill /> / OPERATOR_X_09
                    </div>
                    <h1 className="text-4xl font-heading font-black italic tracking-tighter uppercase leading-none force-visible-white">
                        ACCOUNT_SETTINGS
                    </h1>
                </div>
                <div className="text-[8px] font-black force-visible-white uppercase tracking-[0.5em] italic hidden md:block">
                    LAST_SYNC: {new Date().toLocaleTimeString()}<br />
                    NODE_STABILITY: NOMINAL
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-12">
                {/* PRIMARY SETTINGS */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Account Identity */}
                    <div className="border-2 border-white/10 bg-white/[0.02] overflow-hidden">
                        <div className="px-6 py-3 border-b border-white/10 bg-white/5 flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] italic flex items-center gap-2 force-visible-white">
                                <RiTerminalBoxFill className="force-visible-primary" /> CORE_IDENTITY
                            </span>
                        </div>
                        <div className="p-8 grid md:grid-cols-2 gap-10">
                            <div className="space-y-2">
                                <div className="text-[9px] font-black text-white/40 uppercase tracking-widest">USERNAME</div>
                                <div className="text-sm font-black italic uppercase tracking-tight force-visible-white">{user?.username || user?.firstName || 'DEFAULT_OP'}</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-[9px] font-black text-white/40 uppercase tracking-widest">ENCRYPTED_EMAIL</div>
                                <div className="text-sm font-black italic uppercase tracking-tight flex items-center gap-3 force-visible-white">
                                    <RiMailFill className="force-visible-primary" /> {user?.primaryEmailAddress?.emailAddress}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-[9px] font-black text-white/40 uppercase tracking-widest">COMMISSION_DATE</div>
                                <div className="text-sm font-black italic uppercase tracking-tight flex items-center gap-3 force-visible-white">
                                    <RiCalendarFill className="force-visible-primary" /> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'UNKNOWN'}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-[9px] font-black text-white/40 uppercase tracking-widest">AUTH_GATEWAY</div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 force-bg-primary animate-pulse" />
                                    <span className="text-xs font-black italic uppercase tracking-widest force-visible-primary">SECURE_ACTIVE</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* API ACCESS */}
                    <div className="border-2 border-white/10 bg-white/[0.02] overflow-hidden">
                        <div className="px-6 py-3 border-b border-white/10 bg-white/5 flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] italic flex items-center gap-2 force-visible-white">
                                <RiKey2Fill className="force-visible-primary" /> CRYPTO_TOKEN_GEN
                            </span>
                            <button className="text-[10px] font-black uppercase italic force-bg-primary force-visible-black px-6 h-10 shadow-[4px_4px_0px_rgba(255,255,255,0.2)] transform active:scale-95 transition-all">
                                GEN_NEW_KEY
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="bg-black/60 border border-white/10 p-5 font-mono text-[10px] relative overflow-hidden group">
                                <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform" />
                                <div className="flex items-center justify-between">
                                    <span className="text-white/60 tracking-widest uppercase italic font-black">X_TOKEN_UPLINK_LIVE_••••••••291A</span>
                                    <Badge className="bg-[#ccff00]/10 force-visible-primary border border-[#ccff00]/20 text-[8px] font-black italic">ACTIVE_PRIMARY</Badge>
                                </div>
                            </div>
                            <p className="text-[8px] font-black uppercase tracking-[0.3em] opacity-20 leading-loose">
                                WARNING: DO NOT EXPOSE ACCESS TOKENS. ALL REQUESTS SIGNED WITH THIS HASH WILL BE CHARGED TO YOUR ACCOUNT_LEDGER.
                            </p>
                        </div>
                    </div>
                </div>

                {/* SIDEBAR TELEMETRY */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="p-8 border-2 border-white/5 bg-white/[0.01] space-y-8">
                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 italic border-b border-white/10 pb-4">
                            QUOTA_LOGS
                        </div>
                        <div className="space-y-6">
                            {[
                                { label: 'AGENT_UPTIME', value: '42.1h', icon: RiPulseFill },
                                { label: 'DATALINK_USAGE', value: '8.4 GB', icon: RiDatabase2Fill },
                                { label: 'COMPUTE_BURN', value: '$124.9', icon: RiFlashlightFill }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4 text-white/60 group-hover:force-visible-primary transition-colors">
                                        <item.icon className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                                    </div>
                                    <span className="text-xs font-black italic tracking-tighter force-visible-white">{item.value}</span>
                                </div>
                            ))}
                        </div>
                        <button className="w-full border border-white/20 py-3 text-[10px] font-black uppercase italic hover:bg-white hover:text-black transition-all">
                            PRINT_FULL_LEDGER
                        </button>
                    </div>

                    <div className="p-8 border-2 border-red-500/20 bg-red-500/[0.02] space-y-6">
                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500/60 italic">
                            DANGER_ZONE
                        </div>
                        <button className="w-full h-12 bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-black uppercase italic hover:bg-red-500 hover:text-white transition-all">
                            INITIATE_WIPE_PROTOCOL
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}
