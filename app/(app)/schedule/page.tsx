"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Dumbbell,
  Heart,
  Flame,
  X,
  Clock,
  Zap,
  Info,
  Play,
  BedDouble,
  Sparkles,
  CheckCircle2,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { getOnboardingData, supabase } from "@/lib/supabase"
import { generateWeeklyWorkoutPlan } from "@/lib/workout-generator"
import type { OnboardingData } from "@/app/(app)/onboarding/page"

// Full weekday names matching generateWeeklyWorkoutPlan output
const FULL_DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

type WorkoutType = "strength" | "cardio" | "recovery" | "rest"

interface WorkoutDetail {
  name: string
  type: WorkoutType
  duration: number
  time: string
  exercises: string[]
  calories: number
  aiNotes: string
  restInfo: string
}

interface ScheduleDay {
  date: number
  workout?: WorkoutDetail
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getWorkoutIcon = (type: WorkoutType) => {
  switch (type) {
    case "strength": return Dumbbell
    case "cardio": return Flame
    case "recovery": return Heart
    default: return BedDouble
  }
}

const WORKOUT_COLORS: Record<WorkoutType, { bg: string; border: string; dot: string; badge: string; text: string }> = {
  strength: {
    bg: "from-primary/25 to-primary/5",
    border: "border-primary/40",
    dot: "bg-primary",
    badge: "bg-primary/20 text-primary",
    text: "text-primary",
  },
  cardio: {
    bg: "from-orange-500/25 to-orange-500/5",
    border: "border-orange-500/40",
    dot: "bg-orange-500",
    badge: "bg-orange-500/20 text-orange-400",
    text: "text-orange-400",
  },
  recovery: {
    bg: "from-green-500/25 to-green-500/5",
    border: "border-green-500/40",
    dot: "bg-green-500",
    badge: "bg-green-500/20 text-green-400",
    text: "text-green-400",
  },
  rest: {
    bg: "from-muted/20 to-muted/5",
    border: "border-muted/30",
    dot: "bg-muted-foreground/40",
    badge: "bg-muted/30 text-muted-foreground",
    text: "text-muted-foreground",
  },
}

const estimateCalories = (type: WorkoutType, duration: number): number => {
  const rates: Record<WorkoutType, number> = { strength: 7, cardio: 10, recovery: 3, rest: 0 }
  return Math.round(rates[type] * duration)
}

const getAINotes = (type: WorkoutType, exercises: string[]): string => {
  if (type === "strength") return `Focus on progressive overload today. Prioritize form on ${exercises[0] || "compound lifts"} before adding weight.`
  if (type === "cardio") return "Keep your heart rate in Zone 2–3 for fat-burning efficiency. Stay hydrated throughout."
  if (type === "recovery") return "Active recovery boosts circulation and reduces soreness. Keep intensity very low."
  return "Rest is training too. Sleep 7–9 hours, eat at your maintenance calories, and let your muscles rebuild."
}

const getRestInfo = (type: WorkoutType): string => {
  if (type === "strength") return "Rest 60–90 sec between sets. Full rest day within 48 hrs recommended."
  if (type === "cardio") return "Cool down with 5 min of light walking and full stretching."
  if (type === "recovery") return "Pair with foam rolling and 10 min of deep breathing for best results."
  return "Use today to prepare mentally and physically for the next training block."
}

// ─── Workout Detail Modal ──────────────────────────────────────────────────────

function WorkoutModal({
  day,
  date,
  month,
  year,
  isToday,
  isCompleted,
  onClose,
}: {
  day: ScheduleDay
  date: string
  month: string
  year: number
  isToday: boolean
  isCompleted: boolean
  onClose: () => void
}) {
  const router = useRouter()
  const workout = day.workout
  const type: WorkoutType = workout?.type ?? "rest"
  const colors = WORKOUT_COLORS[type]
  const Icon = getWorkoutIcon(type)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-full max-w-md rounded-2xl border border-white/10 bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={cn("p-5 bg-gradient-to-br", colors.bg, "border-b border-white/10")}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", colors.badge)}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{month} {date}, {year}</p>
                  <h3 className="text-lg font-bold">
                    {workout ? workout.name : "Rest Day"}
                  </h3>
                  <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block", colors.badge)}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
            {workout ? (
              <>
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Clock, label: "Duration", value: `${workout.duration} min` },
                    { icon: Zap, label: "Est. Calories", value: `${workout.calories} kcal` },
                    { icon: Calendar, label: "Time", value: workout.time },
                  ].map(({ icon: StatIcon, label, value }) => (
                    <div key={label} className="rounded-xl bg-white/5 p-3 text-center border border-white/5">
                      <StatIcon className={cn("h-4 w-4 mx-auto mb-1", colors.text)} />
                      <p className="text-xs font-bold">{value}</p>
                      <p className="text-[10px] text-muted-foreground">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Exercises */}
                {workout.exercises.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Exercises</p>
                    <div className="flex flex-wrap gap-2">
                      {workout.exercises.map((ex) => (
                        <span key={ex} className={cn("text-xs px-2.5 py-1 rounded-full", colors.badge)}>
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recovery info */}
                <div className="rounded-xl bg-white/5 border border-white/5 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="h-4 w-4 text-green-400" />
                    <p className="text-xs font-semibold">Recovery Info</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{workout.restInfo}</p>
                </div>

                {/* AI Notes */}
                <div className="rounded-xl bg-gradient-to-br from-accent/10 to-primary/5 border border-accent/20 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="h-4 w-4 text-accent" />
                    <p className="text-xs font-semibold text-accent">AI Coach Tip</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{workout.aiNotes}</p>
                </div>

                {/* Start Workout / Completed button */}
                {isCompleted ? (
                  <div className="w-full flex items-center justify-center gap-2 rounded-lg bg-success/20 py-3 text-success font-semibold border border-success/30">
                    <CheckCircle2 className="h-5 w-5" />
                    Workout Completed
                  </div>
                ) : isToday ? (
                  <Button
                    onClick={() => { onClose(); router.push("/workouts") }}
                    className="w-full gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                  >
                    <Play className="h-4 w-4" />
                    Start Workout
                  </Button>
                ) : null}
              </>
            ) : (
              <>
                <div className="rounded-xl bg-white/5 border border-white/5 p-4 text-center">
                  <BedDouble className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
                  <p className="font-medium">No Workout Scheduled</p>
                  <p className="text-sm text-muted-foreground mt-1">This is a rest day — no training planned.</p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-accent/10 to-primary/5 border border-accent/20 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="h-4 w-4 text-accent" />
                    <p className="text-xs font-semibold text-accent">AI Coach Tip</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Rest is training too. Sleep 7–9 hours, eat at maintenance calories, and let your muscles fully recover.
                  </p>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SchedulePage() {
  const { user } = useAuth()
  const [weekMap, setWeekMap] = useState<Map<number, WorkoutDetail>>(new Map())
  const [onboardingTime, setOnboardingTime] = useState<string>("")

  const today = new Date()
  const todayDate = today.getDate()
  const todayMonth = today.getMonth()
  const todayYear = today.getFullYear()

  // weekMap[0..6] = WorkoutDetail | undefined, keyed by JS day-of-week index
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDay, setSelectedDay] = useState<ScheduleDay | null>(null)
  const [direction, setDirection] = useState(0) // -1 prev, 1 next
  const [completedDates, setCompletedDates] = useState<Set<string>>(new Set())

  useEffect(() => {
    const loadSchedule = async () => {
      if (!user) {
        setError("Please sign in to view your workout schedule.")
        setIsLoading(false)
        return
      }

      // Fetch AI Plan and Onboarding data
      const { data: onboarding, error: queryError } = await getOnboardingData(user.id)

      if (queryError || !onboarding) {
        setError("Complete onboarding to see your personalized schedule.")
        setIsLoading(false)
        return
      }

      // Fetch completed workouts from backend API
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const statsRes = await fetch("/api/user/stats", {
            headers: { Authorization: `Bearer ${session.access_token}` },
            cache: 'no-store'
          });
          if (statsRes.ok) {
            const statsData = await statsRes.json();
            if (statsData.recentWorkouts) {
              const dates = new Set<string>();
              statsData.recentWorkouts.forEach((w: any) => dates.add(w.date));
              setCompletedDates(dates);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch completed workouts:", err);
      }

      console.log("[Schedule] Onboarding data:", onboarding)
      console.log("[Schedule] workoutDays:", onboarding.workoutDays)

      const weeklyPlan = generateWeeklyWorkoutPlan(onboarding)
      console.log("[Schedule] Weekly plan sessions:", weeklyPlan.sessions.map(s => `${s.day}: ${s.focus}`))

      // Build a map from JS day index (0=Sun) → WorkoutDetail
      const map = new Map<number, WorkoutDetail>()
      const preferredTime = onboarding.workoutTime === "morning" ? "7:00 AM"
        : onboarding.workoutTime === "afternoon" ? "12:00 PM"
        : onboarding.workoutTime === "evening" ? "6:00 PM"
        : "Flexible"

      for (const session of weeklyPlan.sessions) {
        // generator uses full names: 'Monday', 'Tuesday', etc.
        const dayIndex = FULL_DAY_NAMES.indexOf(session.day)
        if (dayIndex === -1) {
          console.warn("[Schedule] Unrecognized day name from generator:", session.day)
          continue
        }
        const type: WorkoutType =
          session.focus === "cardio" ? "cardio"
          : session.focus === "mobility" ? "recovery"
          : "strength"
        const exercises = session.exercises.map((e) => e.name)
        const focusLabel = session.focus.replace(/-/g, " ")
          .split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
        map.set(dayIndex, {
          name: `${focusLabel} Workout`,
          type,
          duration: session.totalDuration,
          time: preferredTime,
          exercises,
          calories: session.estimatedCaloriesBurned || estimateCalories(type, session.totalDuration),
          aiNotes: getAINotes(type, exercises),
          restInfo: getRestInfo(type),
        })
      }

      console.log("[Schedule] weekMap keys (day indices):", [...map.keys()])
      setWeekMap(map)
      setOnboardingTime(preferredTime)
      setIsLoading(false)
    }

    loadSchedule()
  }, [user])

  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const navigate = (dir: number) => {
    setDirection(dir)
    setCurrentDate(new Date(currentYear, currentMonth + dir, 1))
  }

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const weeks: (ScheduleDay | null)[][] = []
  let currentWeek: (ScheduleDay | null)[] = Array(firstDayOfMonth).fill(null)

  for (let i = 1; i <= daysInMonth; i++) {
    // Use weekMap: look up the workout by this date's day-of-week index
    const dateObj = new Date(currentYear, currentMonth, i)
    const dayOfWeekIdx = dateObj.getDay() // 0=Sun, 1=Mon, ...
    const workout = weekMap.get(dayOfWeekIdx)
    currentWeek.push({ date: i, workout })
    if (currentWeek.length === 7) { weeks.push(currentWeek); currentWeek = [] }
  }
  if (currentWeek.length > 0) weeks.push([...currentWeek, ...Array(7 - currentWeek.length).fill(null)])

  const isCurrentDisplayMonth = currentMonth === todayMonth && currentYear === todayYear

  // Counts from weekMap (weekly pattern repeated across month)
  const workoutCount = weekMap.size
  const strengthCount = [...weekMap.values()].filter(w => w.type === "strength").length
  const cardioCount = [...weekMap.values()].filter(w => w.type === "cardio").length
  const recoveryCount = [...weekMap.values()].filter(w => w.type === "recovery").length

  if (isLoading) {
    return (
      <DashboardLayout title="Schedule" subtitle="Your personalized weekly schedule">
        <div className="rounded-3xl border border-border bg-muted/30 p-12 text-center">
          <Calendar className="h-10 w-10 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Loading your workout schedule…</p>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout title="Schedule" subtitle="Your personalized weekly schedule">
        <div className="rounded-3xl border border-border bg-muted/30 p-12 text-center">
          <Info className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-semibold text-foreground mb-2">{error}</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Schedule" subtitle="Click any date to see your workout details">
      {/* Modal */}
      {selectedDay && (
        <WorkoutModal
          day={selectedDay}
          date={selectedDay.date.toString()}
          month={MONTHS[currentMonth]}
          year={currentYear}
          isToday={
            selectedDay.date === todayDate &&
            currentMonth === todayMonth &&
            currentYear === todayYear
          }
          isCompleted={completedDates.has(
            `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay.date).padStart(2, '0')}`
          )}
          onClose={() => setSelectedDay(null)}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-2xl p-5 sm:p-6">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">
                {MONTHS[currentMonth]} <span className="text-muted-foreground font-normal">{currentYear}</span>
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="rounded-lg h-9 w-9 p-0">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigate(1)} className="rounded-lg h-9 w-9 p-0">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Day labels */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAY_LABELS.map((d) => (
                <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-1">{d}</div>
              ))}
            </div>

            {/* Calendar grid */}
            <motion.div
              key={`${currentYear}-${currentMonth}`}
              initial={{ opacity: 0, x: direction * 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="space-y-1"
            >
              {weeks.map((week, wi) => (
                <div key={wi} className="grid grid-cols-7 gap-1">
                  {week.map((day, di) => {
                    const isToday = isCurrentDisplayMonth && day?.date === todayDate
                    const hasWorkout = !!day?.workout
                    const colors = day?.workout ? WORKOUT_COLORS[day.workout.type] : WORKOUT_COLORS.rest
                    const Icon = day?.workout ? getWorkoutIcon(day.workout.type) : null

                    const isCompleted = day ? completedDates.has(
                      `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day.date).padStart(2, '0')}`
                    ) : false;

                    return (
                      <motion.button
                        key={`${wi}-${di}`}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: (wi * 7 + di) * 0.012 }}
                        whileHover={day ? { scale: 1.06, y: -2 } : {}}
                        whileTap={day ? { scale: 0.96 } : {}}
                        onClick={() => day && setSelectedDay(day)}
                        disabled={!day}
                        className={cn(
                          "relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-200 text-xs",
                          !day ? "bg-transparent cursor-default" :
                          isCompleted
                            ? "bg-success/20 border-2 border-success/40 cursor-pointer"
                            : hasWorkout
                            ? cn("bg-gradient-to-br border cursor-pointer hover:shadow-lg", colors.bg, colors.border)
                            : isToday
                            ? "border-2 border-primary/60 bg-primary/10 cursor-pointer"
                            : "border border-white/5 bg-white/3 hover:bg-white/8 cursor-pointer",
                          isToday && !hasWorkout && !isCompleted && "ring-2 ring-primary/30"
                        )}
                      >
                        {day && (
                          <>
                            <span className={cn(
                              "font-semibold text-xs sm:text-sm leading-none mb-0.5 z-10",
                              isCompleted ? "text-success" : isToday && !hasWorkout ? "text-primary" : hasWorkout ? "" : "text-muted-foreground"
                            )}>
                              {day.date}
                            </span>
                            {isToday && (
                              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary ring-2 ring-card z-20" />
                            )}
                            {isCompleted ? (
                              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-success z-10" />
                            ) : hasWorkout && Icon ? (
                              <Icon className={cn("h-3 w-3 sm:h-3.5 sm:w-3.5 mt-0.5 z-10", colors.text)} />
                            ) : null}
                            {hasWorkout && !isCompleted && (
                              <span className={cn("w-1.5 h-1.5 rounded-full absolute bottom-1 z-10", colors.dot)} />
                            )}
                          </>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              ))}
            </motion.div>

            {/* Legend */}
            <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap gap-3 justify-center sm:justify-start">
              {[
                { type: "strength" as WorkoutType, label: "Strength" },
                { type: "cardio" as WorkoutType, label: "Cardio" },
                { type: "recovery" as WorkoutType, label: "Recovery" },
              ].map(({ type, label }) => {
                const c = WORKOUT_COLORS[type]
                const LIcon = getWorkoutIcon(type)
                return (
                  <div key={type} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className={cn("h-2.5 w-2.5 rounded-full", c.dot)} />
                    <LIcon className={cn("h-3 w-3", c.text)} />
                    <span>{label}</span>
                  </div>
                )
              })}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                <span>Today</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Monthly Summary */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-2xl p-5">
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-muted-foreground">This Month</h3>
            <div className="space-y-3">
              {[
                { label: "Total Workouts", value: workoutCount, color: "text-foreground" },
                { label: "Strength Sessions", value: strengthCount, color: WORKOUT_COLORS.strength.text },
                { label: "Cardio Sessions", value: cardioCount, color: WORKOUT_COLORS.cardio.text },
                { label: "Recovery Sessions", value: recoveryCount, color: WORKOUT_COLORS.recovery.text },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className={cn("text-sm font-bold", color)}>{value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Workout Types legend card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-5"
          >
            <h3 className="font-semibold mb-4">Workout Types</h3>
            <div className="space-y-3">
              {([
                { type: "strength" as WorkoutType, label: "Strength Training", desc: "Build muscle & power" },
                { type: "cardio" as WorkoutType, label: "Cardio", desc: "Burn fat & boost endurance" },
                { type: "recovery" as WorkoutType, label: "Recovery", desc: "Mobility & active rest" },
              ] as const).map(({ type, label, desc }) => {
                const c = WORKOUT_COLORS[type]
                const LIcon = getWorkoutIcon(type)
                return (
                  <div key={type} className="flex items-center gap-3">
                    <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0", c.badge)}>
                      <LIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* AI Plan info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-5 border-l-4 border-primary"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-accent" />
              <h3 className="font-semibold text-sm">AI-Personalized Plan</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Your schedule is generated from your fitness profile. Click any date to view workout details.
            </p>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              {[
                "Adapts to your fitness level",
                "Respects your rest days",
                "Accounts for injury history",
              ].map((tip) => (
                <li key={tip} className="flex gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}
