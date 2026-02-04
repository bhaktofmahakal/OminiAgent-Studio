import { createClient } from '@supabase/supabase-js'

function getEnv(name: string, fallback: string): string {
    const val = process.env[name]
    if (!val || val === 'undefined' || val === 'null' || val === '') return fallback
    return val
}

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://placeholder.supabase.co')
const supabaseServiceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY', getEnv('NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY', 'placeholder'))

// Lazy client creation to avoid build-time initialization errors
let _supabaseAdmin: any = null
export const supabaseAdmin = new Proxy({} as any, {
    get(target, prop) {
        if (!_supabaseAdmin) {
            _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            })
        }
        const val = _supabaseAdmin[prop]
        return typeof val === 'function' ? val.bind(_supabaseAdmin) : val
    }
})
