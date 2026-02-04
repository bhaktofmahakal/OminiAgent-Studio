import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto'

/**
 * GET /api/user/keys - List all API keys for the current user
 * Note: Never returns the full secret, only prefixes.
 */
export async function GET() {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabaseAdmin
        .from('api_keys')
        .select('id, name, key_prefix, last_used_at, created_at')
        .eq('user_id', userId)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

/**
 * POST /api/user/keys - Create a new API key
 * Returns the full key ONLY ONCE.
 */
export async function POST(req: NextRequest) {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { name } = await req.json()
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

    // 1. Generate a strong random key
    const fullKey = `oa_${randomBytes(32).toString('hex')}`
    const prefix = fullKey.slice(0, 8)

    // 2. Hash the key for secure storage (PBKDF2/Scrypt)
    const salt = randomBytes(16).toString('hex')
    const hashedKey = scryptSync(fullKey, salt, 64).toString('hex')

    // Format: "salt:hash"
    const storageValue = `${salt}:${hashedKey}`

    const { data, error } = await supabaseAdmin
        .from('api_keys')
        .insert({
            user_id: userId,
            name,
            key_prefix: prefix,
            key_secret: storageValue, // Store the hash, not the key!
        })
        .select('id, name, key_prefix, created_at')
        .single()

    if (error) {
        console.error('API Key creation failed:', error.message)
        return NextResponse.json({ error: 'System failed to register key' }, { status: 500 })
    }

    // Return the full key ONLY ONCE during creation
    return NextResponse.json({ ...data, key_secret: fullKey })
}
