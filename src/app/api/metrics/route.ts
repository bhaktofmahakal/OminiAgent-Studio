import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const agentId = searchParams.get('agentId')
    const timeRange = searchParams.get('timeRange') || '7d'

    // Calculate time filter
    const now = new Date()
    const timeFilter = new Date()

    switch (timeRange) {
      case '1h':
        timeFilter.setHours(now.getHours() - 1)
        break
      case '24h':
        timeFilter.setDate(now.getDate() - 1)
        break
      case '7d':
        timeFilter.setDate(now.getDate() - 7)
        break
      case '30d':
        timeFilter.setDate(now.getDate() - 30)
        break
      case '90d':
        timeFilter.setDate(now.getDate() - 90)
        break
      default:
        timeFilter.setDate(now.getDate() - 7)
    }

    // Base query for metrics
    let query = supabase
      .from('metrics')
      .select(`
        *,
        agents!inner(user_id, name)
      `)
      .eq('agents.user_id', userId)
      .gte('timestamp', timeFilter.toISOString())
      .order('timestamp', { ascending: true }) // Ascending for easier trend calculation

    if (agentId) {
      query = query.eq('agent_id', agentId)
    }

    const { data: metrics, error: dbError } = await query
    if (dbError) throw dbError

    // 1. Calculate Summary Stats
    const totalRequests = metrics?.length || 0
    const successfulRequests = metrics?.filter(m => m.success).length || 0
    const totalCost = metrics?.reduce((sum, m) => sum + (m.cost || 0), 0) || 0
    const avgLatency = totalRequests > 0
      ? metrics?.reduce((sum, m) => sum + (m.latency || 0), 0) / totalRequests
      : 0
    const successRate = totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0

    // 2. Active Agents Count
    const activeAgents = new Set(metrics?.map(m => m.agent_id)).size

    // 3. Request Trends (Grouped by day)
    const trendsMap: Record<string, { date: string, requests: number, cost: number }> = {}
    metrics?.forEach(m => {
      const date = new Date(m.timestamp).toISOString().split('T')[0]
      if (!trendsMap[date]) {
        trendsMap[date] = { date, requests: 0, cost: 0 }
      }
      trendsMap[date].requests++
      trendsMap[date].cost += (m.cost || 0)
    })
    const requestTrends = Object.values(trendsMap)

    // 4. Model Performance
    const modelStats: Record<string, { model: string, latencySum: number, count: number, successCount: number }> = {}
    metrics?.forEach(m => {
      if (!modelStats[m.model]) {
        modelStats[m.model] = { model: m.model, latencySum: 0, count: 0, successCount: 0 }
      }
      modelStats[m.model].latencySum += (m.latency || 0)
      modelStats[m.model].count++
      if (m.success) modelStats[m.model].successCount++
    })
    const modelPerformance = Object.values(modelStats).map(s => ({
      model: s.model,
      latency: Math.round(s.latencySum / s.count),
      success: Math.round((s.successCount / s.count) * 100)
    })).sort((a, b) => b.latency - a.latency)

    // 5. Top Models
    const topModels = Object.values(modelStats)
      .map(s => ({ name: s.model, usage: s.count, color: 'primary' }))
      .sort((a, b) => b.usage - a.usage)
      .slice(0, 5)

    // 6. Geographic Usage (Mocked for now as we don't store IP/Geo yet)
    const geographicUsage = [
      { country: 'United States', requests: Math.floor(totalRequests * 0.6) },
      { country: 'Germany', requests: Math.floor(totalRequests * 0.15) },
      { country: 'United Kingdom', requests: Math.floor(totalRequests * 0.1) },
      { country: 'Japan', requests: Math.floor(totalRequests * 0.05) },
      { country: 'Other', requests: Math.floor(totalRequests * 0.1) },
    ].filter(c => c.requests > 0)

    return NextResponse.json({
      totalRequests,
      totalCost,
      avgLatency: Math.round(avgLatency),
      successRate: Math.round(successRate),
      activeAgents,
      topModels,
      requestTrends,
      modelPerformance,
      geographicUsage,
      recentMetrics: metrics?.slice(-10).reverse().map(m => ({
        timestamp: m.timestamp,
        message: `${m.success ? 'SUCCESS' : 'FAILURE'}: ${m.model.toUpperCase()} // ${m.latency}ms // agent_${m.agent_id.slice(0, 8)}`
      })) || []
    })

  } catch (error: any) {
    console.error('Metrics API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal system failure' },
      { status: 500 }
    )
  }
}
