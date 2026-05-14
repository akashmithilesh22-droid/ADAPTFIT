import { createClient } from '@supabase/supabase-js'
import type { AIWorkoutPlan, AIDietPlan, AIRecoveryPlan } from '@/lib/services/groq-ai-service'
import type { OnboardingData } from '@/app/(app)/onboarding/page'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function saveOnboardingData(userId: string, data: OnboardingData) {
  const payload = {
    user_id: userId,
    ...data,
  }

  const { error } = await supabase
    .from('onboarding_data')
    .upsert(payload, { onConflict: 'user_id' })

  return error
}

export async function getOnboardingData(userId: string) {
  const { data, error } = await supabase
    .from('onboarding_data')
    .select('*')
    .eq('user_id', userId)
    .single()

  return { data: data as OnboardingData | null, error }
}

// ─── AI Plans ────────────────────────────────────────────────────────────────

export type PlanType = 'workout' | 'diet' | 'recovery'

type PlanDataMap = {
  workout: AIWorkoutPlan
  diet: AIDietPlan
  recovery: AIRecoveryPlan
}

/**
 * Fetch a cached AI plan for the user. Returns null if expired or missing.
 */
export async function getCachedPlan<T extends PlanType>(
  userId: string,
  planType: T
): Promise<PlanDataMap[T] | null> {
  const { data, error } = await supabase
    .from('ai_plans')
    .select('plan_data, expires_at')
    .eq('user_id', userId)
    .eq('plan_type', planType)
    .single()

  if (error || !data) return null

  // Check expiry
  const expires = new Date(data.expires_at as string)
  if (expires < new Date()) return null

  return data.plan_data as PlanDataMap[T]
}

/**
 * Upsert an AI plan result. Overwrites existing row for same (user_id, plan_type).
 * Cache TTL: 24 hours.
 */
export async function upsertAIPlan<T extends PlanType>(
  userId: string,
  planType: T,
  planData: PlanDataMap[T]
): Promise<void> {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

  await supabase.from('ai_plans').upsert(
    {
      user_id: userId,
      plan_type: planType,
      plan_data: planData,
      generated_at: new Date().toISOString(),
      expires_at: expiresAt,
    },
    { onConflict: 'user_id,plan_type' }
  )
}

// ─── Workout Sessions ────────────────────────────────────────────────────────

export async function saveWorkoutSession(userId: string, workout: any) {
  const { data, error } = await supabase
    .from('workouts')
    .insert({
      user_id: userId,
      name: workout.name,
      type: workout.type,
      duration: parseInt(workout.duration),
      calories: workout.calories,
      exercises: workout.exercises,
      ai_tip: workout.aiAdjustment || workout.aiTip,
      status: 'in-progress'
    })
    .select('id')
    .single()

  return { data, error }
}

export async function getWorkoutSession(workoutId: string) {
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('id', workoutId)
    .single()

  return { data, error }
}
