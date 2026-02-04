'use client'

import { useState } from 'react'
import {
  RiTerminalBoxFill,
  RiPulseFill,
  RiAlertFill,
  RiCheckboxCircleFill,
  RiCloseCircleFill,
  RiTimeLine,
  RiDatabase2Fill,
  RiCommandLine,
  RiCpuLine,
  RiFlashlightFill
} from 'react-icons/ri'
import { cn } from '@/lib/utils'

interface LogEntry {
  id: string
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'success'
  message: string
  details?: string
}

export default function DebugPage() {
  const [logs] = useState<LogEntry[]>([
    { id: '1', timestamp: '15:42:18', level: 'success', message: 'AGENT_DEPLOYMENT_SUCCESS', details: 'INSTANCE_ID: cust_support_001_v4' },
    { id: '2', timestamp: '15:42:15', level: 'info', message: 'MODEL_INIT_COMPLETE', details: 'ENGINE: GPT-4o_ORCHESTRATOR' },
    { id: '3', timestamp: '15:42:12', level: 'warn', message: 'LATENCY_SPIKE_DETECTED', details: 'METRIC: 1250ms (THRESHOLD: 1000ms)' },
    { id: '4', timestamp: '15:42:08', level: 'error', message: 'RE_RATE_LIMIT_EXCEEDED', details: 'GATEWAY: OPENAI, COOLDOWN: 59s' },
    { id: '5', timestamp: '15:42:05', level: 'info', message: 'WEBHOOK_UPLINK_ESTABLISHED', details: 'SOURCE: CORE_RELAY_NODE_07' }
  ])

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'success': return <RiCheckboxCircleFill className="w-4 h-4 text-primary" />
      case 'error': return <RiCloseCircleFill className="w-4 h-4 text-red-500" />
      case 'warn': return <RiAlertFill className="w-4 h-4 text-yellow-500" />
      default: return <RiPulseFill className="w-4 h-4 text-primary opacity-40 animate-pulse" />
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white font-body p-8 lg:p-12 space-y-12 relative overflow-hidden">

      {/* Header Telemetry */}
      <div className="border-b-2 border-white/10 pb-8 flex justify-between items-end">
        <div className="flex flex-col">
          <div className="text-[10px] font-black force-visible-primary uppercase tracking-[0.4em] mb-2 italic flex items-center gap-2">
            <RiCommandLine /> / SYSTEM_DIAGNOSTICS
          </div>
          <h1 className="text-4xl font-heading font-black italic tracking-tighter uppercase leading-none force-visible-white">
            KERNEL_DEBUG_CONSOLE
          </h1>
        </div>
        <div className="flex gap-10 font-black text-[10px] uppercase tracking-widest italic force-visible-white">
          <div className="flex items-center gap-2"><RiTerminalBoxFill className="w-4 h-4 force-visible-primary" /> SYS_LOGS: v4.0</div>
          <div className="flex items-center gap-2"><RiPulseFill className="w-4 h-4 force-visible-primary animate-pulse" /> LIVE_PULSE: ON</div>
        </div>
      </div>

      {/* Diagnostics Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'TOTAL_EVENTS', value: logs.length, color: 'text-white', icon: RiDatabase2Fill },
          { label: 'CRITICAL_ERR', value: logs.filter(l => l.level === 'error').length, color: 'text-red-500', icon: RiCloseCircleFill },
          { label: 'WARNINGS', value: logs.filter(l => l.level === 'warn').length, color: 'text-yellow-500', icon: RiAlertFill },
          { label: 'SUCCESS_OPS', value: logs.filter(l => l.level === 'success').length, color: 'text-primary', icon: RiCheckboxCircleFill }
        ].map((stat, i) => (
          <div key={i} className="border border-white/20 bg-white/5 p-6 hover:border-[#ccff00]/40 transition-all group">
            <div className="text-[11px] font-black uppercase tracking-[0.3em] text-white group-hover:force-visible-primary transition-colors flex items-center gap-2 mb-3">
              <stat.icon className="w-4 h-4" /> {stat.label}
            </div>
            <div className={`text-4xl font-heading font-black italic tracking-tighter ${stat.color === 'text-primary' ? 'force-visible-primary' : stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </section>

      {/* Main Debug Console */}
      <section className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 force-visible-white">
              <RiTerminalBoxFill className="force-visible-primary" /> ACTIVE_LOG_RECEPTOR
            </div>
            <div className="text-[10px] font-black force-visible-white uppercase italic">SCANNING_BUFFER_v0.7...</div>
          </div>

          <div className="bg-black/40 border-2 border-white/10 p-4 space-y-4 font-mono text-[11px] h-[600px] overflow-y-auto scrollbar-hide relative group">
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary/20 group-hover:bg-primary transition-colors" />
            {logs.map((log) => (
              <div key={log.id} className={cn(
                "p-5 border border-white/5 hover:border-white/20 transition-all group/log relative overflow-hidden",
                log.level === 'error' ? 'bg-red-500/[0.02] border-red-500/10' : 'bg-white/[0.01]'
              )}>
                <div className="flex items-start gap-6">
                  <span className="text-[11px] force-visible-primary font-black tracking-widest italic shrink-0">[{log.timestamp}]</span>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      {getLevelIcon(log.level)}
                      <span className="font-black uppercase tracking-tight force-visible-white">{log.message}</span>
                    </div>
                    {log.details && (
                      <div className="text-[10px] font-black text-white/60 pl-7 uppercase tracking-[0.2em] italic border-l border-white/20">
                        {log.details}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div className="pt-6 animate-pulse force-visible-primary text-[11px] font-black italic uppercase tracking-widest pl-4">
              _ WAITING_FOR_SYS_SIG...
            </div>
          </div>
        </div>

        {/* System Telemetry Sidebar */}
        <aside className="lg:col-span-4 space-y-10">
          <div className="p-8 border border-[#ccff00]/20 bg-[#ccff00]/5 space-y-8">
            <div className="text-[10px] font-black uppercase tracking-[0.4em] force-visible-primary italic border-b border-white/10 pb-4 flex items-center gap-3">
              <RiCpuLine /> RESOURCE_UTIL
            </div>
            <div className="space-y-8">
              {[
                { label: 'KERNEL_READY', val: '99.4%', icon: RiCommandLine },
                { label: 'UPLINK_LATENCY', val: '14ms', icon: RiTimeLine },
                { label: 'MEM_POOL_IDLE', val: '3.4GB', icon: RiFlashlightFill }
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-center group cursor-help">
                  <div className="flex items-center gap-3 text-white/60 group-hover:force-visible-primary transition-colors">
                    <stat.icon className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</span>
                  </div>
                  <span className="text-xs font-black italic tracking-tighter tabular-nums force-visible-white">{stat.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 border border-white/10 bg-white/5 space-y-6">
            <div className="text-[11px] font-black uppercase tracking-[0.3em] force-visible-white italic">OPERATOR_OVERRIDE</div>
            <button className="w-full border border-white/20 py-3 text-[10px] font-black uppercase italic hover:bg-white hover:text-black transition-all">
              FLUSH_BUFFER_CACHE
            </button>
            <button className="w-full border border-white/20 py-3 text-[10px] font-black uppercase italic hover:bg-white hover:text-black transition-all">
              EMERGENCY_REBOOT
            </button>
          </div>
        </aside>
      </section>
    </main>
  )
}
