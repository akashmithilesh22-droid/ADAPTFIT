"use client"

import { useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Flame, Dumbbell, Trophy, Target, RefreshCw, Zap, Sparkles } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { StatsCard } from "@/components/dashboard/stats-card"
import { TodayWorkout } from "@/components/dashboard/today-workout"
import { RecoveryScore } from "@/components/dashboard/recovery-score"
import { WeeklyProgress } from "@/components/dashboard/weekly-progress"
import { NutritionOverview } from "@/components/dashboard/nutrition-overview"
import { UpcomingSchedule } from "@/components/dashboard/upcoming-schedule"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { useAIPlan } from "@/hooks/use-ai-plan"
import type { AIWorkoutPlan, AIDietPlan, AIRecoveryPlan } from "@/lib/services/groq-ai-service"

// ─── Skeleton ────────────────────────────────────────────────────────────────
function PlanSkeleton({ label, isGenerating }: { label: string, isGenerating?: boolean }) {
  const loadingText = isGenerating 
    ? `Generating your ${label} with your AI Coach…` 
    : `Loading your ${label}…`

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ repeat: Infinity, duration: 1.5 }}
      className="rounded-2xl border border-border bg-muted/40 p-6 text-center text-sm text-foreground-muted flex flex-col items-center justify-center h-full min-h-[200px]"
    >
      <Sparkles className="mb-2 h-6 w-6 text-primary opacity-60" />
      {loadingText}
    </motion.div>
  )
}

// ─── Builders ────────────────────────────────────────────────────────────────

function buildTodayWorkout(plan: AIWorkoutPlan) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" })
  const session =
    plan.weeklyPlan.find((d) => d.day === today && d.type !== "rest") ??
    plan.weeklyPlan.find((d) => d.type !== "rest") ??
    plan.weeklyPlan[0]

  return {
    name: session.name,
    type: session.type,
    duration: `${session.duration} min`,
    calories: session.calories,
    exercises: session.exercises.map((ex) => ({
      name: ex.name,
      sets: ex.sets,
      reps: ex.reps,
      muscle: ex.muscle,
    })),
    aiAdjustment: session.aiTip,
  }
}

function buildWeeklyData(plan: AIWorkoutPlan) {
  const dayOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const shortLabel = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return dayOrder.map((day, i) => {
    const session = plan.weeklyPlan.find((d) => d.day === day)
    return {
      day: shortLabel[i],
      workouts: session && session.type !== "rest" ? 1 : 0,
      calories: session?.calories ?? 0,
      duration: session?.duration ?? 0,
    }
  })
}

function buildNutrition(plan: AIDietPlan) {
  const t = plan.targets
  return {
    calories: { current: t.calories, target: t.calories, unit: "kcal" },
    protein:  { current: t.protein,  target: t.protein,  unit: "g" },
    carbs:    { current: t.carbs,    target: t.carbs,    unit: "g" },
    fats:     { current: t.fats,     target: t.fats,     unit: "g" },
    water:    { current: 0,           target: t.water,    unit: "glasses" },
  }
}

function buildRecovery(plan: AIRecoveryPlan) {
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  const sorted = [...plan.personalizedTips].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  )
  return {
    overall: plan.readinessScore,
    factors: sorted.slice(0, 4).map((tip) => ({
      label: tip.category.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      value: tip.priority === "high" ? 80 : tip.priority === "medium" ? 55 : 30,
    })),
  }
}

function buildSchedule(plan: AIWorkoutPlan) {
  const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const timeMap: Record<string, string> = {
    morning: "7:00 AM",
    afternoon: "12:00 PM",
    evening: "6:00 PM",
    flexible: "Anytime",
  }

  return plan.weeklyPlan
    .filter((d) => d.type !== "rest")
    .sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day))
    .slice(0, 4)
    .map((d, i) => ({
      id: i + 1,
      name: d.name,
      day: d.day,
      time: timeMap["flexible"],
      duration: `${d.duration} min`,
      type: (d.type === "strength" || d.type === "hiit"
        ? "strength"
        : d.type === "cardio"
        ? "cardio"
        : "recovery") as "strength" | "cardio" | "recovery",
    }))
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { userDisplayName, user } = useAuth()

  const {
    data: workoutPlan,
    isLoading: workoutLoading,
    isGenerating: workoutGenerating,
    needsGeneration: workoutNeedsGen,
    error: workoutError,
    isCached: workoutCached,
    regenerate: regenerateWorkout,
  } = useAIPlan("workout", user?.id)

  const {
    data: dietPlan,
    isLoading: dietLoading,
    isGenerating: dietGenerating,
    needsGeneration: dietNeedsGen,
    error: dietError,
    regenerate: regenerateDiet,
  } = useAIPlan("diet", user?.id)

  const {
    data: recoveryPlan,
    isLoading: recoveryLoading,
    isGenerating: recoveryGenerating,
    needsGeneration: recoveryNeedsGen,
    error: recoveryError,
    regenerate: regenerateRecovery,
  } = useAIPlan("recovery", user?.id)

  const isLoading = workoutLoading || dietLoading || recoveryLoading
  const isGenerating = workoutGenerating || dietGenerating || recoveryGenerating
  const needsGeneration = workoutNeedsGen || dietNeedsGen || recoveryNeedsGen
  const hasError = !workoutPlan && workoutError

  const [userStats, setUserStats] = useState<any>(null)

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          const res = await fetch("/api/user/stats", {
            headers: { Authorization: `Bearer ${session.access_token}` },
            cache: 'no-store'
          })
          if (res.ok) {
            const data = await res.json()
            setUserStats(data.stats)
          }
        }
      } catch (err) {
        console.error("Failed to fetch user stats", err)
      }
    }
    fetchStats()
  }, [user])

  // Derived dashboard values
  const todayWorkout = useMemo(
    () => (workoutPlan ? buildTodayWorkout(workoutPlan) : null),
    [workoutPlan]
  )
  const weeklyData = useMemo(
    () => (workoutPlan ? buildWeeklyData(workoutPlan) : []),
    [workoutPlan]
  )
  const nutrition = useMemo(
    () => (dietPlan ? buildNutrition(dietPlan) : null),
    [dietPlan]
  )
  const recovery = useMemo(
    () => (recoveryPlan ? buildRecovery(recoveryPlan) : null),
    [recoveryPlan]
  )
  const schedule = useMemo(
    () => (workoutPlan ? buildSchedule(workoutPlan) : []),
    [workoutPlan]
  )
  const weeklySummary = useMemo(() => {
    if (!workoutPlan) return { workouts: 0, calories: 0, totalTime: "0m" }
    const activeDays = workoutPlan.weeklyPlan.filter((d) => d.type !== "rest")
    return {
      workouts: activeDays.length,
      calories: activeDays.reduce((s, d) => s + d.calories, 0),
      totalTime: `${activeDays.reduce((s, d) => s + d.duration, 0)}m`,
    }
  }, [workoutPlan])

  // ── Not authenticated ─────────────────────────────────────────────────────
  if (!user) {
    return (
      <DashboardLayout
        title={`Welcome back, ${userDisplayName}!`}
        subtitle="Here's your fitness overview for today"
      >
        <div className="rounded-3xl border border-border bg-muted/60 p-10 text-center">
          <p className="text-lg font-semibold text-foreground mb-4">Please sign in to view your dashboard.</p>
          <Link href="/login" className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition">
            Sign In
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  // ── Onboarding missing ────────────────────────────────────────────────────
  if (!isLoading && !isGenerating && hasError) {
    return (
      <DashboardLayout
        title={`Welcome back, ${userDisplayName}!`}
        subtitle="Here's your fitness overview for today"
      >
        <div className="rounded-3xl border border-border bg-muted/60 p-10 text-center">
          <p className="text-lg font-semibold text-foreground mb-2">{workoutError}</p>
          <p className="text-sm text-foreground-secondary mb-6">
            Complete the onboarding flow so your AI Coach can build your personalised plan.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition"
          >
            Finish Onboarding
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  // ── Needs Generation ──────────────────────────────────────────────────────
  if (!isLoading && !isGenerating && needsGeneration) {
    return (
      <DashboardLayout
        title={`Welcome back, ${userDisplayName}!`}
        subtitle="Your profile is ready for your AI Coach"
      >
        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-10 text-center">
          <Sparkles className="mx-auto mb-4 h-10 w-10 text-primary" />
          <p className="text-xl font-bold text-foreground mb-2">Generate Your AI Plans</p>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            You haven&apos;t generated your personalised fitness, diet, and recovery plans yet. Click below to let your AI Coach build your complete schedule.
          </p>
          <Button
            size="lg"
            className="gap-2"
            onClick={() => { regenerateWorkout(); regenerateDiet(); regenerateRecovery() }}
          >
            <Zap className="h-4 w-4" />
            Generate All Plans
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  // ── Stats (always calculable once plans load) ─────────────────────────────
  const trainDays = workoutPlan?.weeklyPlan.filter((d) => d.type !== "rest").length ?? 0

  return (
    <DashboardLayout
      title={`Welcome back, ${userDisplayName}!`}
      subtitle="Here's your AI-personalised fitness overview"
    >
      {/* Regenerate bar */}
      <div className="mb-4 flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Zap className="h-4 w-4 text-accent" />
          {workoutCached
            ? "Plans loaded from cache — regenerate anytime"
            : "Fresh AI-generated plans — cached for 24 h"}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-xs"
          disabled={isLoading || isGenerating}
          onClick={() => { regenerateWorkout(); regenerateDiet(); regenerateRecovery() }}
        >
          <RefreshCw className={`h-3 w-3 ${isGenerating ? "animate-spin" : ""}`} />
          {isGenerating ? "Generating..." : "Regenerate"}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Weekly Streak"
          value={userStats ? `${userStats.workout_streak} days` : "0 days"}
          change={userStats ? userStats.longest_streak : 0}
          changeLabel="longest streak"
          icon={Flame}
          iconColor="text-orange-500"
          gradient="from-orange-500/20 to-red-500/20"
          delay={0}
        />
        <StatsCard
          title="Workouts Completed"
          value={userStats ? `${userStats.total_workouts}` : "0"}
          change={userStats ? userStats.calories_burned : 0}
          changeLabel="total kcal burned"
          icon={Dumbbell}
          iconColor="text-primary"
          gradient="from-primary/20 to-accent/20"
          delay={0.1}
        />
        <StatsCard
          title="Current Level"
          value={userStats ? `Level ${userStats.level}` : "Level 1"}
          change={userStats ? userStats.xp : 0}
          changeLabel="total XP"
          icon={Trophy}
          iconColor="text-yellow-500"
          gradient="from-yellow-500/20 to-orange-500/20"
          delay={0.2}
        />
        <StatsCard
          title="Readiness Score"
          value={recoveryPlan ? `${recoveryPlan.readinessScore}%` : "—"}
          change={recoveryPlan ? (recoveryPlan.readinessScore > 70 ? 5 : -2) : 0}
          changeLabel="vs yesterday"
          icon={Target}
          iconColor="text-success"
          gradient="from-success/20 to-emerald-500/20"
          delay={0.3}
        />
      </div>

      {/* Main Grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {workoutLoading || workoutGenerating || !todayWorkout ? (
            <PlanSkeleton label="workout" isGenerating={workoutGenerating} />
          ) : (
            <TodayWorkout workout={todayWorkout} />
          )}
          <WeeklyProgress weeklyData={weeklyData} summary={weeklySummary} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {recoveryLoading || recoveryGenerating || !recovery ? (
            <PlanSkeleton label="recovery score" isGenerating={recoveryGenerating} />
          ) : (
            <RecoveryScore overall={recovery.overall} factors={recovery.factors} />
          )}
          {dietLoading || dietGenerating || !nutrition ? (
            <PlanSkeleton label="nutrition" isGenerating={dietGenerating} />
          ) : (
            <NutritionOverview nutritionData={nutrition} />
          )}
        </div>
      </div>

      {/* Upcoming Schedule */}
      <div className="mt-6">
        {!workoutLoading && schedule.length > 0 && (
          <UpcomingSchedule upcomingWorkouts={schedule} />
        )}
      </div>

      {/* AI Coach Note */}
      {workoutPlan?.coachNote && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-5"
        >
          <div className="flex items-start gap-3">
            <Zap className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">AI Coach Note</p>
              <p className="text-sm text-muted-foreground">{workoutPlan.coachNote}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Error notices (non-blocking) */}
      {(dietError || recoveryError) && (
        <p className="mt-4 text-center text-xs text-muted-foreground">
          {dietError ?? recoveryError} — some sections may be incomplete.
        </p>
      )}
    </DashboardLayout>
  )
}
