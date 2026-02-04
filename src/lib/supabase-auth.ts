import { createClient } from '@supabase/supabase-js'

function getEnv(name: string, fallback: string): string {
    const val = process.env[name]
    if (!val || val === 'undefined' || val === 'null' || val === '') return fallback
    return val
}

/**
 * Creates a Supabase client with the user's Clerk session token.
 * This ensures that Row Level Security (RLS) is enforced based on the user's identity.
 * 
 * @param clerkToken The JWT from clerk auth().getToken({ template: 'supabase' })
 */
export function getSupabaseAuthClient(clerkToken: string) {
    const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://placeholder.supabase.co')
    const supabaseAnonKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'placeholder')

    return createClient(supabaseUrl, supabaseAnonKey, {
        global: {
            headers: {
                Authorization: `Bearer ${clerkToken}`,
            },
        },
    })
}
