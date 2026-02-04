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

        // Fetch user profile from Supabase
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('clerk_id', userId)
            .single()

        if (error && error.code !== 'PGRST116') {
            throw error
        }

        // If user doesn't exist, return default profile
        if (!user) {
            return NextResponse.json({
                clerk_id: userId,
                email: '',
                name: '',
                avatar_url: '',
                created_at: new Date().toISOString(),
            })
        }

        return NextResponse.json(user)

    } catch (error: any) {
        console.error('Get profile error:', error)

        return NextResponse.json(
            { error: error.message || 'Failed to fetch profile' },
            { status: 500 }
        )
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()

        // Update or insert user profile
        const { data, error } = await supabase
            .from('users')
            .upsert({
                clerk_id: userId,
                email: body.email,
                name: body.name,
                avatar_url: body.avatar_url,
                updated_at: new Date().toISOString(),
            })
            .select()
            .single()

        if (error) {
            throw error
        }

        return NextResponse.json(data)

    } catch (error: any) {
        console.error('Update profile error:', error)

        return NextResponse.json(
            { error: error.message || 'Failed to update profile' },
            { status: 500 }
        )
    }
}
