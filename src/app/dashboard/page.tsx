"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from '@clerk/nextjs'
import {
  RiTerminalBoxFill,
  RiSignalTowerFill,
  RiPulseFill,
  RiAddCircleFill,
  RiSearchEyeLine,
  RiFilter3Line,
  RiMore2Fill,
  RiRobot2Line,
  RiDashboardFill,
  RiSettings4Fill,
  RiShieldFlashFill,
  RiCpuLine,
  RiFlashlightFill,
  RiDatabase2Fill,
  RiTimeLine,
  RiArrowRightSLine,
  RiHashtag,
  RiEyeLine,
  RiGlobalLine,
  RiCloseCircleFill,
  RiFlashlightLine,
  RiCommandLine,
  RiTeamFill
} from "react-icons/ri"
import { SiOpenai, SiAnthropic, SiGooglecloud } from "react-icons/si"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

interface Agent {
  id: string
  name: string
  description: string
  models: string[]
  visibility: 'private' | 'public'
  team_id: string | null
  created_at: string
  updated_at: string
}

interface Team {
  id: string
  name: string
  role: string
}

interface Metrics {
  totalRequests: number
  successRate: number
  totalCost: number
  avgLatency: number
  recentMetrics?: Array<{
    timestamp: string
    message: string
  }>
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#080808] p-10 font-body">
      <div className="flex gap-4 px-10">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-40 flex-1 bg-white/5" />)}
      </div>
      <div className="mt-10 grid lg:grid-cols-12 gap-10 px-10">
        <div className="lg:col-span-8 space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 bg-white/5" />)}
        </div>
        <div className="lg:col-span-4 space-y-4">
          <Skeleton className="h-96 bg-white/5" />
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { isSignedIn, userId } = useAuth();
  const [searchQuery, setSearchQuery] = useState("")
  const [agents, setAgents] = useState<Agent[]>([])
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isSignedIn) return
    async function loadData() {
      try {
        const [agentsRes, metricsRes, teamsRes] = await Promise.all([
          fetch('/api/agent'),
          fetch('/api/metrics?timeRange=30d'),
          fetch('/api/teams')
        ])
        if (agentsRes.ok) setAgents(await agentsRes.json())
        if (metricsRes.ok) setMetrics(await metricsRes.json())
        if (teamsRes.ok) setTeams(await teamsRes.json())
      } catch (e) { console.error(e) }
      finally { setIsLoading(false) }
    }
    loadData()
  }, [isSignedIn])

  // Filter agents by search and team
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTeam = selectedTeamFilter === 'all'
      || (selectedTeamFilter === 'personal' && !agent.team_id)
      || agent.team_id === selectedTeamFilter
    return matchesSearch && matchesTeam
  })

  const handleDeleteAgent = async (id: string, name: string) => {
    toast.error(`HAZARD_ACTION: WIPE_PROTOCOL`, {
      description: `Wiping instance: ${name.toUpperCase()}. Confirmed?`,
      action: {
        label: "WIPE",
        onClick: async () => {
          const res = await fetch(`/api/agent/${id}`, { method: 'DELETE' })
          if (res.ok) {
            setAgents(prev => prev.filter(a => a.id !== id))
            toast.success('INSTANCE_PURGED')
          }
        }
      }
    })
  }

  if (isLoading) return <DashboardSkeleton />

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-body selection:bg-primary selection:text-black mt-20 lg:mt-0">
      {/* SOLID TOP TELEMETRY BAR */}
      <nav className="sticky top-0 z-40 bg-black border-b border-white/10 px-6 lg:px-12 py-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-8">
          <div className="flex flex-col">
            <h1 className="text-sm font-black tracking-[0.2em] uppercase text-primary">
              / CONSOLE_HOME
            </h1>
            <div className="text-[10px] font-black text-white/60 tracking-[0.4em] mt-1 uppercase">NODE_ID: {userId?.slice(0, 8)}_SYS</div>
          </div>

          <div className="hidden xl:flex items-center gap-6 border-l border-white/20 pl-8 text-white">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest italic animate-pulse">
              <RiSignalTowerFill className="text-primary" /> SYNCHRONIZED
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest italic">
              <RiShieldFlashFill className="text-primary" /> HASH_VALID
            </div>
          </div>
        </div>

        <Link href="/dashboard/create">
          <button className="force-bg-primary force-visible-black font-black flex items-center gap-3 px-8 py-3 uppercase italic text-[11px] hover:bg-white transition-all shadow-[4px_4px_0px_rgba(255,255,255,0.2)]">
            DEPLOY_AGENT <RiCommandLine className="w-4 h-4 force-visible-black" />
          </button>
        </Link>
      </nav>

      <div className="px-6 lg:px-12 py-8 space-y-12">
        {/* TELEMETRY STATS GRID */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'INSTANCES', value: agents.length, icon: RiDatabase2Fill, trend: 'ACTIVE' },
            { label: 'SUCCESS_RATE', value: metrics?.successRate?.toFixed(1) || 0, suffix: '%', icon: RiPulseFill, trend: '+0.4%' },
            { label: 'AVG_LATENCY', value: metrics?.avgLatency || 0, suffix: 'ms', icon: RiTimeLine, trend: '-12ms' },
            { label: 'TOTAL_BURN', value: (metrics?.totalCost || 0).toFixed(4), prefix: '$', icon: RiFlashlightFill, trend: 'NOMINAL' }
          ].map((stat, i) => (
            <div key={i} className="border border-white/20 bg-white/[0.03] p-6 transition-all hover:border-[#ccff00]/60">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-[#ccff00] flex items-center gap-2">
                  <stat.icon className="w-4 h-4 force-visible-primary" /> {stat.label}
                </div>
                <div className="text-[8px] font-black force-visible-primary px-2 py-0.5 border border-[#ccff00]/40 uppercase italic">
                  {stat.trend}
                </div>
              </div>
              <div className="text-3xl font-heading font-black tracking-tighter text-white">
                {stat.prefix}<span className="tabular-nums">{stat.value}</span>{stat.suffix}
              </div>
            </div>
          ))}
        </section>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* MAIN DATA STREAM */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-baseline gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 force-bg-primary shadow-[0_0_10px_rgba(204,255,0,0.4)]" />
                <h2 className="font-heading font-black italic uppercase text-lg tracking-tighter force-visible-white">DATA_STREAM</h2>
              </div>
              <div className="relative w-full sm:w-auto">
                <input
                  placeholder="SEARCH_PROCESSES..."
                  className="bg-white/5 border border-white/20 focus:border-primary outline-none font-black text-[10px] uppercase px-4 h-10 w-full sm:w-64 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {teams.length > 0 && (
                <select
                  value={selectedTeamFilter}
                  onChange={(e) => setSelectedTeamFilter(e.target.value)}
                  className="bg-white/5 border border-white/20 focus:border-primary outline-none font-black text-[10px] uppercase px-4 h-10 text-white"
                >
                  <option value="all">ALL_WORKSPACES</option>
                  <option value="personal">PERSONAL</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name.toUpperCase()}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="grid gap-3">
              <AnimatePresence mode="popLayout">
                {filteredAgents.length > 0 ? (
                  filteredAgents.map((agent) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={agent.id}
                      className="group border border-white/10 bg-white/5 p-4 flex flex-col md:flex-row items-center gap-6 hover:border-primary/40 transition-all"
                    >
                      <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center">
                        <RiRobot2Line className="w-6 h-6 force-visible-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-base font-black uppercase text-white">{agent.name}</h3>
                          <span className="text-[8px] font-black px-2 py-0.5 bg-primary text-black">
                            {agent.visibility}
                          </span>
                          {agent.team_id && (
                            <span className="text-[8px] font-black px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center gap-1">
                              <RiTeamFill className="w-2.5 h-2.5" />
                              {teams.find(t => t.id === agent.team_id)?.name || 'TEAM'}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-black force-visible-primary tracking-widest mt-1 uppercase">
                          {agent.description}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/agent/${agent.id}`}>
                          <button className="bg-white force-visible-black font-black px-6 py-2.5 text-[10px] uppercase hover:force-bg-primary transition-all border-2 border-white">
                            CONNECT
                          </button>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="w-10 h-10 border border-white/10 flex items-center justify-center transition-all bg-white/5">
                              <RiMore2Fill className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-black border border-white/20 text-white rounded-none p-1 font-black text-[9px] uppercase">
                            <Link href={`/agent/${agent.id}/edit`}>
                              <DropdownMenuItem className="py-3 px-6 cursor-pointer focus:bg-primary focus:text-black">Edit_Config</DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem className="py-3 px-6 cursor-pointer text-red-500 focus:bg-red-500 focus:text-white" onClick={() => handleDeleteAgent(agent.id, agent.name)}>Terminate</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-24 text-center border border-dashed border-white/20">
                    <div className="text-xl font-black italic uppercase tracking-[0.4em] text-white/40">NO_INSTANCES_DETECTED</div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* TELEMETRY ASIDE */}
          <aside className="lg:col-span-4 space-y-8">
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <RiTerminalBoxFill className="force-visible-primary" />
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] force-visible-white">SYSTEM_LOGS</h3>
              </div>
              <div className="bg-black border border-white/10 p-4 font-mono text-[9px] h-[400px] overflow-y-auto space-y-2">
                {metrics?.recentMetrics && metrics.recentMetrics.length > 0 ? (
                  metrics.recentMetrics.map((log: any, i: number) => (
                    <div key={i} className="flex gap-3 text-white border-b border-white/10 pb-2">
                      <span className="text-[#ccff00] font-black shrink-0 font-mono">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                      <span className="uppercase tracking-tight">{log.message}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex gap-3 text-white border-b border-white/10 pb-2 opacity-40">
                    <span className="text-[#ccff00] font-black shrink-0 font-mono">[{new Date().toLocaleTimeString()}]</span>
                    <span className="uppercase tracking-tight">WAITING_FOR_SYS_SIGNAL...</span>
                  </div>
                )}
                <div className="pt-4 text-[#ccff00] italic animate-pulse font-black uppercase text-[10px] tracking-widest">_ LIVE_TELEMETRY_STREAM</div>
              </div>
            </section>

            <section className="p-6 border border-white/10 bg-white/5 space-y-4">
              <div className="text-[10px] font-black uppercase tracking-widest text-primary italic border-b border-white/10 pb-2">
                INFRA_REPORT
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[8px] text-white/40 uppercase font-black">REGION</div>
                  <div className="text-[10px] font-black uppercase text-white">US-EAST-ALPHA</div>
                </div>
                <div>
                  <div className="text-[8px] text-white/40 uppercase font-black">CLUSTER</div>
                  <div className="text-[10px] font-black uppercase text-white">SIGMA_7</div>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>

      <style jsx global>{`
        .underline-glow {
          background-image: linear-gradient(to right, transparent, rgba(204, 255, 0, 0.4), transparent);
          box-shadow: 0 0 20px rgba(204, 255, 0, 0.2);
        }
        .brutal-card {
           box-shadow: 8px 8px 0px rgba(255, 255, 255, 0.05);
        }
        @keyframes pulse-primary {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}

function RiXCircleFill(props: any) {
  return <RiCloseCircleFill {...props} className="text-red-500" />
}

function RiLayersFill(props: any) {
  return <RiCpuLine {...props} />
}

function RiGlobeLine(props: any) {
  return <RiGlobalLine className={props.className} size={props.size} />
}
