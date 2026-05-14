'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { AIWorkoutPlan, AIDietPlan, AIRecoveryPlan } from '@/lib/services/groq-ai-service'

type PlanType = 'workout' | 'diet' | 'recovery'

type PlanDataMap = {
  workout: AIWorkoutPlan
  diet: AIDietPlan
  recovery: AIRecoveryPlan
}

interface UseAIPlanResult<T> {
  data: T | null
  isLoading: boolean
  isGenerating: boolean
  needsGeneration: boolean
  error: string | null
  isCached: boolean
  regenerate: () => void
}

/**
 * Reusable hook for fetching AI-generated plans.
 *
 * Key fix: we grab the user's JWT access token from supabase.auth.getSession()
 * and forward it in the Authorization header so the server-side Supabase client
 * can run queries as the authenticated user (satisfying RLS policies on
 * onboarding_data and ai_plans).
 */
export function useAIPlan<T extends PlanType>(
  planType: T,
  userId: string | undefined
): UseAIPlanResult<PlanDataMap[T]> {
  const [data, setData] = useState<PlanDataMap[T] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [needsGeneration, setNeedsGeneration] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCached, setIsCached] = useState(false)
  // We use a ref to prevent concurrent fetches
  const fetchLock = React.useRef(false)

  const fetchPlan = useCallback(
    async (action: 'fetch' | 'generate') => {
      if (!userId || fetchLock.current) return

      fetchLock.current = true
      if (action === 'generate') setIsGenerating(true)
      else setIsLoading(true)
      
      setError(null)

      try {
        const { data: { session } } = await supabase.auth.getSession()
        const accessToken = session?.access_token

        if (!accessToken) {
          throw new Error('No active session — please sign in again.')
        }

        const res = await fetch(`/api/ai/${planType}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ userId, action }),
        })

        const json = await res.json()

        if (!res.ok) {
          throw new Error(json.error ?? `Failed to load ${planType} plan`)
        }

        if (json.needsGeneration) {
          setNeedsGeneration(true)
          setData(null)
        } else {
          setData(json.data as PlanDataMap[T])
          setNeedsGeneration(false)
        }
        setIsCached(json.cached === true)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : `Failed to load ${planType} plan`
        setError(msg)
      } finally {
        setIsLoading(false)
        setIsGenerating(false)
        fetchLock.current = false
      }
    },
    [userId, planType]
  )

  // Initial fetch
  useEffect(() => {
    if (userId) {
      fetchPlan('fetch')
    }
  }, [userId, fetchPlan])

  const regenerate = useCallback(() => {
    fetchPlan('generate')
  }, [fetchPlan])

  return { data, isLoading, isGenerating, needsGeneration, error, isCached, regenerate }
}
