import { NextRequest, NextResponse } from 'next/server'
import { generateWorkoutPlan } from '@/lib/services/groq-ai-service'
import {
  createAuthenticatedClient,
  fetchOnboardingData,
  fetchCachedPlan,
  savePlan,
} from '@/lib/server-supabase'
import type { OnboardingData } from '@/app/(app)/onboarding/page'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, action = 'fetch' } = body

    console.log('[/api/ai/workout] userId received:', userId)
    console.log('[/api/ai/workout] action:', action)

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    // ── Build an authenticated Supabase client using the forwarded JWT ──────
    const supabase = createAuthenticatedClient(req)

    // ── Debug: verify who Supabase thinks is calling ─────────────────────────
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
    console.log('[/api/ai/workout] supabase.auth.getUser():', {
      uid: authUser?.id ?? null,
      email: authUser?.email ?? null,
      authError: authError?.message ?? null,
    })

    // ── Check Supabase cache first ──────────────────────────────────────────
    if (action === 'fetch') {
      const cached = await fetchCachedPlan(supabase, userId, 'workout')
      if (cached) {
        console.log('[/api/ai/workout] returning cached plan')
        return NextResponse.json({ data: cached, cached: true })
      } else {
        console.log('[/api/ai/workout] cache miss on fetch')
        return NextResponse.json({ data: null, cached: false, needsGeneration: true })
      }
    }

    // ── Fetch onboarding data ────────────────────────────────────────────────
    const { onboarding, error: onboardingError } = await fetchOnboardingData(supabase, userId)

    if (onboardingError) {
      console.error('[/api/ai/workout] onboarding query error:', onboardingError)
      return NextResponse.json(
        { error: `Failed to fetch onboarding data: ${onboardingError.message}` },
        { status: 500 }
      )
    }

    if (!onboarding) {
      console.warn('[/api/ai/workout] no onboarding row found for user:', userId)
      return NextResponse.json(
        { error: 'Onboarding data not found. Please complete onboarding first.' },
        { status: 404 }
      )
    }

    console.log('[/api/ai/workout] onboarding found, generating plan...')

    // ── Call Gemini ──────────────────────────────────────────────────────────
    const plan = await generateWorkoutPlan(onboarding as OnboardingData)

    // ── Cache result (fire-and-forget) ───────────────────────────────────────
    savePlan(supabase, userId, 'workout', plan).catch(console.error)

    return NextResponse.json({ data: plan, cached: false })
  } catch (err: unknown) {
    console.error('[/api/ai/workout] unhandled error:', err)
    const message = err instanceof Error ? err.message : 'Failed to generate workout plan'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
