import { NextRequest, NextResponse } from 'next/server'
import { generateDietPlan } from '@/lib/services/groq-ai-service'
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

    console.log('[/api/ai/diet] userId received:', userId)
    console.log('[/api/ai/diet] action:', action)

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    // ── Authenticated Supabase client ────────────────────────────────────────
    const supabase = createAuthenticatedClient(req)

    // ── Debug: verify auth ───────────────────────────────────────────────────
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
    console.log('[/api/ai/diet] supabase.auth.getUser():', {
      uid: authUser?.id ?? null,
      email: authUser?.email ?? null,
      authError: authError?.message ?? null,
    })

    // ── Cache check ──────────────────────────────────────────────────────────
    if (action === 'fetch') {
      const cached = await fetchCachedPlan(supabase, userId, 'diet')
      if (cached) {
        console.log('[/api/ai/diet] returning cached plan')
        return NextResponse.json({ data: cached, cached: true })
      } else {
        console.log('[/api/ai/diet] cache miss on fetch')
        return NextResponse.json({ data: null, cached: false, needsGeneration: true })
      }
    }

    // ── Onboarding fetch ─────────────────────────────────────────────────────
    const { onboarding, error: onboardingError } = await fetchOnboardingData(supabase, userId)

    if (onboardingError) {
      console.error('[/api/ai/diet] onboarding query error:', onboardingError)
      return NextResponse.json(
        { error: `Failed to fetch onboarding data: ${onboardingError.message}` },
        { status: 500 }
      )
    }

    if (!onboarding) {
      console.warn('[/api/ai/diet] no onboarding row found for user:', userId)
      return NextResponse.json(
        { error: 'Onboarding data not found. Please complete onboarding first.' },
        { status: 404 }
      )
    }

    console.log('[/api/ai/diet] onboarding found, generating plan...')

    // ── Gemini call ──────────────────────────────────────────────────────────
    const plan = await generateDietPlan(onboarding as OnboardingData)

    savePlan(supabase, userId, 'diet', plan).catch(console.error)

    return NextResponse.json({ data: plan, cached: false })
  } catch (err: unknown) {
    console.error('[/api/ai/diet] unhandled error:', err)
    const message = err instanceof Error ? err.message : 'Failed to generate diet plan'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
