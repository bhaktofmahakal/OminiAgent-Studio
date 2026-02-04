import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(req: NextRequest) {
    try {
        const { data, error } = await supabaseAdmin
            .from('agents')
            .select('*')
            .eq('visibility', 'public')
            .order('created_at', { ascending: false })
            .limit(20)

        if (error) throw error

        return NextResponse.json(data)
    } catch (error: any) {
        console.error('Fetch public agents error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch public agents' },
            { status: 500 }
        )
    }
}
