import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

/**
 * Creates a Supabase client that is authenticated as the calling user.
 *
 * The client forwards the user's JWT (sent in the Authorization header by
 * use-ai-plan.ts) so that Row-Level Security policies evaluate correctly.
 * This means queries to onboarding_data and ai_plans will work for the
 * authenticated user without needing a service-role key.
 */
export function createAuthenticatedClient(req: NextRequest): SupabaseClient {
  const authHeader = req.headers.get('authorization') ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          // Inject the user JWT so Supabase treats this client as authenticated
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
      auth: {
        // Disable automatic session persistence — we manage auth via the header
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  )
}

/**
 * Fetch onboarding data for a user, bypassing .single() to avoid
 * throwing on missing rows (uses .maybeSingle() instead).
 *
 * Returns { onboarding, error } where onboarding is null if not found.
 */
export async function fetchOnboardingData(
  supabase: SupabaseClient,
  userId: string
) {
  console.log('[fetchOnboardingData] querying for user_id:', userId)

  const { data, error } = await supabase
    .from('onboarding_data')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()   // ← never throws on missing row

  console.log('[fetchOnboardingData] result:', {
    found: !!data,
    error: error?.message ?? null,
  })

  return { onboarding: data, error }
}

/**
 * Fetch a cached AI plan for the user (maybeSingle — safe on missing row).
 * Returns null if not found or expired.
 */
export async function fetchCachedPlan(
  supabase: SupabaseClient,
  userId: string,
  planType: 'workout' | 'diet' | 'recovery'
) {
  const { data, error } = await supabase
    .from('ai_plans')
    .select('plan_data, expires_at')
    .eq('user_id', userId)
    .eq('plan_type', planType)
    .maybeSingle()

  if (error || !data) return null

  // Expired?
  if (new Date(data.expires_at as string) < new Date()) return null

  return data.plan_data
}

/**
 * Upsert an AI plan into Supabase with a 24-hour TTL.
 */
export async function savePlan(
  supabase: SupabaseClient,
  userId: string,
  planType: 'workout' | 'diet' | 'recovery',
  planData: unknown
) {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

  const { error } = await supabase.from('ai_plans').upsert(
    {
      user_id: userId,
      plan_type: planType,
      plan_data: planData,
      generated_at: new Date().toISOString(),
      expires_at: expiresAt,
    },
    { onConflict: 'user_id,plan_type' }
  )

  if (error) {
    console.error('[savePlan] upsert error:', error.message)
  }
}
