"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  TrendingUp,
  Info,
  AlertCircle,
  Target,
  Scale,
  Dumbbell,
  Trophy,
  Flame,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import type { OnboardingData } from "@/app/(app)/onboarding/page"



export default function ProgressPage() {
  const { user } = useAuth()
  const [onboarding, setOnboarding] = useState<OnboardingData | null>(null)
  const [userStats, setUserStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setError('Please sign in to view your progress.')
        setIsLoading(false)
        return
      }

      const { data, error: queryError } = await supabase
        .from('onboarding_data')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (queryError || !data) {
        setError('Complete onboarding to track your progress.')
        setIsLoading(false)
        return
      }

      setOnboarding(data as OnboardingData)

      // Fetch user stats
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          const statsRes = await fetch('/api/user/stats', {
            headers: { Authorization: `Bearer ${session.access_token}` },
            cache: 'no-store'
          })
          if (statsRes.ok) {
            const statsData = await statsRes.json()
            setUserStats(statsData.stats)
          }
        }
      } catch (err) {
        console.error("Failed to fetch user stats in progress:", err)
      }

      setIsLoading(false)
    }

    loadData()
  }, [user])

  if (isLoading) {
    return (
      <DashboardLayout title="Progress" subtitle="Track your fitness journey">
        <div className="rounded-3xl border border-border bg-muted/60 p-10 text-center text-foreground-muted">
          Loading your progress…
        </div>
      </DashboardLayout>
    )
  }

  if (error || !onboarding) {
    return (
      <DashboardLayout title="Progress" subtitle="Track your fitness journey">
        <div className="rounded-3xl border border-border bg-muted/60 p-10 text-center">
          <p className="text-lg font-semibold text-foreground mb-2">{error ?? 'Unable to load progress data.'}</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Progress" subtitle="Track your fitness journey">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Data Tracking Notice */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 border-l-4 border-blue-500"
          >
            <div className="flex items-start gap-4">
              <Info className="h-6 w-6 text-blue-400 shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Progress Tracking</h3>
                <p className="text-muted-foreground mt-2">
                  Real progress tracking requires consistent data logging over time. Our system will automatically track:
                </p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Weight changes from weekly check-ins</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Strength improvements via workout logs</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Body measurements from manual entries</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Workout frequency and volume from your calendar</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Photos for visual progress documentation</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* User Stats Snapshot */}
          {userStats && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid gap-4 md:grid-cols-3 mb-6"
            >
              <div className="glass-card rounded-2xl p-6 text-center">
                <Trophy className="mx-auto h-6 w-6 text-yellow-500 mb-2" />
                <div className="text-2xl font-bold">Level {userStats.level}</div>
                <div className="text-xs text-muted-foreground">{userStats.xp} XP total</div>
              </div>
              <div className="glass-card rounded-2xl p-6 text-center">
                <Flame className="mx-auto h-6 w-6 text-orange-500 mb-2" />
                <div className="text-2xl font-bold">{userStats.calories_burned}</div>
                <div className="text-xs text-muted-foreground">Calories Burned</div>
              </div>
              <div className="glass-card rounded-2xl p-6 text-center">
                <Dumbbell className="mx-auto h-6 w-6 text-primary mb-2" />
                <div className="text-2xl font-bold">{userStats.total_workouts}</div>
                <div className="text-xs text-muted-foreground">Workouts Completed</div>
              </div>
            </motion.div>
          )}

          {/* Starting Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold mb-6">Your Baseline Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <span className="text-xs text-muted-foreground block mb-2">Starting Weight</span>
                <span className="font-semibold text-xl">{onboarding.weightKg} kg</span>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <span className="text-xs text-muted-foreground block mb-2">Height</span>
                <span className="font-semibold text-xl">{onboarding.heightCm} cm</span>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <span className="text-xs text-muted-foreground block mb-2">Age</span>
                <span className="font-semibold text-xl">{onboarding.age}</span>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <span className="text-xs text-muted-foreground block mb-2">Gender</span>
                <span className="font-semibold capitalize text-xl">{onboarding.gender}</span>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <span className="text-xs text-muted-foreground block mb-2">Goal</span>
                <span className="font-semibold capitalize text-xl">{onboarding.primaryGoal?.replace('-', ' ')}</span>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <span className="text-xs text-muted-foreground block mb-2">Experience</span>
                <span className="font-semibold capitalize text-xl">{onboarding.fitnessExperience}</span>
              </div>
            </div>
          </motion.div>

          {/* Goals Summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-accent" />
              <h3 className="text-lg font-semibold">Your Goals</h3>
            </div>
            <div className="space-y-3">
              {onboarding.primaryGoal && (
                <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <span className="text-sm">Primary Goal</span>
                  <span className="font-semibold capitalize">{onboarding.primaryGoal.replace('-', ' ')}</span>
                </div>
              )}
              {onboarding.commitment && (
                <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <span className="text-sm">Commitment Level</span>
                  <span className="font-semibold">{onboarding.commitment} / 10</span>
                </div>
              )}
              {onboarding.workoutDaysPerWeek && (
                <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <span className="text-sm">Target Workout Days</span>
                  <span className="font-semibold">{onboarding.workoutDaysPerWeek} per week</span>
                </div>
              )}
              {onboarding.timeline && (
                <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <span className="text-sm">Target Timeline</span>
                  <span className="font-semibold capitalize">{onboarding.timeline}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Coming Soon */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-6 border-l-4 border-amber-500"
          >
            <div className="flex items-start gap-3 mb-3">
              <AlertCircle className="h-5 w-5 text-amber-400 shrink-0" />
              <h3 className="font-semibold">Coming Soon</h3>
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Weight tracking dashboard</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Strength milestone charts</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Body measurement history</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Progress photos gallery</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Monthly summary reports</span>
              </li>
            </ul>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="font-semibold mb-4">Pro Tips</h3>
            <div className="space-y-3 text-sm">
              {[
                "Weigh yourself at the same time daily for consistency",
                "Log your workouts immediately after completion",
                "Take progress photos from the same angle and lighting",
                "Track measurements monthly for body composition changes",
                "Note how clothes fit - a key indicator of progress",
              ].map((tip, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex gap-2"
                >
                  <span className="text-primary mt-0.5">✓</span>
                  <span className="text-muted-foreground">{tip}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}
