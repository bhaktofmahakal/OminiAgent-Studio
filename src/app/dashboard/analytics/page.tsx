'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@clerk/nextjs'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  AreaChart, Area, Tooltip
} from 'recharts'
import {
  TrendingUp, DollarSign, Clock, Activity,
  Globe, Download
} from 'lucide-react'
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AnalyticsData {
  totalRequests: number
  totalCost: number
  avgLatency: number
  successRate: number
  activeAgents: number
  topModels: Array<{ name: string, usage: number, color: string }>
  requestTrends: Array<{ date: string, requests: number, cost: number }>
  modelPerformance: Array<{ model: string, latency: number, success: number }>
  geographicUsage: Array<{ country: string, requests: number }>
}

const EMPTY_DATA: AnalyticsData = {
  totalRequests: 0,
  totalCost: 0,
  avgLatency: 0,
  successRate: 0,
  activeAgents: 0,
  topModels: [],
  requestTrends: [],
  modelPerformance: [],
  geographicUsage: []
}

export default function AnalyticsPage() {
  const { isLoaded } = useAuth()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')
  const [activeTab, setActiveTab] = useState('trends')

  const fetchAnalytics = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/metrics?timeRange=${timeRange}`)
      if (response.ok) {
        const analyticsData = await response.json()
        setData(analyticsData)
      } else {
        console.error('Analytics fetch failed')
        setData(EMPTY_DATA)
        toast.error("Failed to load analytics data")
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setData(EMPTY_DATA)
      toast.error("Network error loading analytics")
    } finally {
      setLoading(false)
    }
  }, [timeRange])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Activity className="w-12 h-12 mx-auto animate-pulse text-primary" />
          <p className="text-white/40 font-black uppercase tracking-widest text-xs">LOADING_ANALYTICS...</p>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-8 lg:p-12 space-y-12">

      {/* Telemetry Header */}
      <div className="border-b-2 border-white/10 pb-8 flex justify-between items-end">
        <div className="flex flex-col">
          <div className="text-[10px] font-black force-visible-primary uppercase tracking-[0.4em] mb-2 italic flex items-center gap-2">
            <TrendingUp className="w-3 h-3 force-visible-primary" /> / SYSTEM_METRICS
          </div>
          <h1 className="text-4xl font-heading font-black italic tracking-tighter uppercase leading-none force-visible-white">
            ANALYTICS_<span className="force-visible-primary">CORE</span>
          </h1>
        </div>

        <div className="flex gap-6 items-center">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40 bg-black/40 border border-white/20 rounded-none h-10 font-black text-[10px] uppercase tracking-widest text-white hover:border-[#ccff00]/40 focus:ring-0 focus:ring-offset-0 transition-all">
              <SelectValue placeholder="SELECT_RANGE" />
            </SelectTrigger>
            <SelectContent className="bg-black border border-[#ccff00]/20 rounded-none">
              <SelectItem value="1d" className="text-[10px] font-black uppercase tracking-widest focus:bg-[#ccff00] focus:text-black py-3">LAST_24H</SelectItem>
              <SelectItem value="7d" className="text-[10px] font-black uppercase tracking-widest focus:bg-[#ccff00] focus:text-black py-3">LAST_7D</SelectItem>
              <SelectItem value="30d" className="text-[10px] font-black uppercase tracking-widest focus:bg-[#ccff00] focus:text-black py-3">LAST_30D</SelectItem>
              <SelectItem value="90d" className="text-[10px] font-black uppercase tracking-widest focus:bg-[#ccff00] focus:text-black py-3">LAST_90D</SelectItem>
            </SelectContent>
          </Select>

          <button className="force-bg-primary force-visible-black py-2.5 px-6 font-black uppercase italic hover:bg-white transition-all text-[10px] flex items-center gap-2 shadow-[4px_4px_0px_rgba(255,255,255,0.2)]">
            <Download className="w-4 h-4" /> EXPORT_DATA
          </button>
        </div>
      </div>

      <p className="text-[10px] font-body font-black text-white/60 max-w-2xl uppercase tracking-[0.3em] leading-relaxed italic">
        REAL-TIME PERFORMANCE MONITORING AND USAGE ANALYTICS FOR MULTI-MODEL INFRASTRUCTURE. DATA AGGREGATED FROM HELICONE PROXY.
      </p>

      {/* Key Metrics Grid */}
      <section className="py-12 px-6 lg:px-20 border-y-8 border-white/5">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'TOTAL_REQUESTS', value: data?.totalRequests?.toLocaleString() || '0', change: '+0.0%', icon: Activity, positive: true },
              { label: 'TOTAL_COST', value: `$${data?.totalCost?.toFixed(4) || '0.0000'}`, change: '+0.0%', icon: DollarSign, positive: false },
              { label: 'AVG_LATENCY', value: `${data?.avgLatency || 0}ms`, change: '0.0%', icon: Clock, positive: true },
              { label: 'SUCCESS_RATE', value: `${data?.successRate || 0}%`, change: '0.0%', icon: TrendingUp, positive: true }
            ].map((metric, i) => (
              <div key={i} className="border border-white/20 bg-white/5 p-6 hover:border-[#ccff00]/40 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{metric.label}</span>
                  <metric.icon className="w-5 h-5 text-white/20 group-hover:force-visible-primary transition-colors" />
                </div>
                <div className="text-3xl font-heading font-black text-white mb-2">{metric.value}</div>
                <div className={`text-xs font-black uppercase ${metric.positive ? 'force-visible-primary' : 'text-red-500'}`}>
                  {metric.change} FROM_LAST
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-12 px-6 lg:px-20">
        <div className="container mx-auto">
          <div className="flex gap-4 mb-12 border-b border-white/10 pb-4">
            {['trends', 'models', 'geographic'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 font-black uppercase text-xs tracking-widest transition-all ${activeTab === tab
                  ? 'force-bg-primary force-visible-black italic'
                  : 'bg-white/5 text-white/60 hover:text-white'
                  }`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>

          {activeTab === 'trends' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 border-2 border-white/10 bg-white/[0.02] p-8">
                <h3 className="text-xl font-heading font-black uppercase mb-6 text-white">REQUEST_VOLUME</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data?.requestTrends || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="date" stroke="#ffffff40" />
                    <YAxis stroke="#ffffff40" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#080808', border: '1px solid #ccff00' }}
                      labelStyle={{ color: '#ccff00' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="requests"
                      stroke="#ccff00"
                      fill="#ccff00"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="border border-white/10 bg-white/5 p-8">
                <h3 className="text-xl font-heading font-black uppercase mb-6 force-visible-white">ACTIVE_AGENTS</h3>
                <div className="text-6xl font-heading font-black force-visible-primary mb-6">{data?.activeAgents || 0}</div>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-black uppercase">
                    <span className="text-white/60">PUBLIC</span>
                    <span className="text-white">0</span>
                  </div>
                  <div className="flex justify-between text-sm font-black uppercase">
                    <span className="text-white/60">PRIVATE</span>
                    <span className="text-white">{data?.activeAgents || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'models' && (
            <div className="border-2 border-white/10 bg-white/[0.02] p-8">
              <h3 className="text-xl font-heading font-black uppercase mb-6 text-white">MODEL_PERFORMANCE</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data?.modelPerformance || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="model" stroke="#ffffff40" />
                  <YAxis stroke="#ffffff40" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#080808', border: '1px solid #ccff00' }}
                  />
                  <Bar dataKey="latency" fill="#ccff00" name="Latency (ms)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeTab === 'geographic' && (
            <div className="border-2 border-white/10 bg-white/[0.02] p-8">
              <h3 className="text-xl font-heading font-black uppercase mb-8 text-white">GEOGRAPHIC_USAGE</h3>
              <div className="space-y-6">
                {(data?.geographicUsage || []).map((country) => (
                  <div key={country.country} className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-4">
                      <Globe className="w-4 h-4 force-visible-primary" />
                      <span className="font-black uppercase text-sm">{country.country}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-white/60 text-xs font-black">{country.requests.toLocaleString()}</span>
                      <span className="force-visible-primary text-xs font-black">
                        {data.totalRequests > 0 ? ((country.requests / data.totalRequests) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}