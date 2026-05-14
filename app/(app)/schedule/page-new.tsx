"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Dumbbell,
  Zap,
  Heart,
  Flame,
  Brain,
  CheckCircle2,
  AlertCircle,
  Info,
  Sparkles,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { generateWeeklyWorkoutPlan } from "@/lib/workout-generator"
import type { OnboardingData } from "@/app/(app)/onboarding/page"

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

type WorkoutType = "strength" | "cardio" | "hiit" | "recovery" | "rest"

interface ScheduleDay {
  date: number
  workout?: {
    name: string
    type: WorkoutType
    duration: number
    time: string
    exercises?: string[]
  }
}

const getWorkoutIcon = (type: WorkoutType) => {
  switch (type) {
    case "strength":
      return Dumbbell
    case "cardio":
      return Flame
    case "hiit":
      return Zap
    case "recovery":
      return Heart
    default:
      return Calendar
  }
}

const getWorkoutColor = (type: WorkoutType) => {
  switch (type) {
    case "strength":
      return "from-primary/30 to-primary/10 border-primary/30"
    case "cardio":
      return "from-orange-500/30 to-orange-500/10 border-orange-500/30"
    case "hiit":
      return "from-yellow-500/30 to-yellow-500/10 border-yellow-500/30"
    case "recovery":
      return "from-green-500/30 to-green-500/10 border-green-500/30"
    default:
      return "from-muted/30 to-muted/10 border-muted/30"
  }
}

export default function SchedulePage() {
  const { user } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [schedule, setSchedule] = useState<ScheduleDay[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSchedule = async () => {
      if (!user) {
        setError('Please sign in to view your workout schedule.')
        setIsLoading(false)
        return
      }

      const { data, error: queryError } = await supabase
        .from('onboarding_data')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (queryError || !data) {
        setError('Complete onboarding to see your personalized schedule.')
        setIsLoading(false)
        return
      }

      const onboarding = data as OnboardingData
      const weeklyPlan = generateWeeklyWorkoutPlan(onboarding)

      // Map weekly plan to month calendar
      const today = new Date()
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()

      const daySchedule: ScheduleDay[] = []

      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(today.getFullYear(), today.getMonth(), i)
        const dayName = days[date.getDay()]

        const session = weeklyPlan.sessions.find(s => s.day === dayName)

        if (session) {
          daySchedule.push({
            date: i,
            workout: {
              name: `${session.focus.replace('-', ' ').toUpperCase()} Workout`,
              type: session.focus === 'cardio' ? 'cardio' : session.focus === 'mobility' ? 'recovery' : 'strength',
              duration: session.totalDuration,
              time: onboarding.workoutTime ? (onboarding.workoutTime === 'morning' ? '7:00 AM' : onboarding.workoutTime === 'afternoon' ? '12:00 PM' : '6:00 PM') : 'Flexible',
              exercises: session.exercises.map(e => e.name),
            },
          })
        } else {
          daySchedule.push({ date: i })
        }
      }

      setSchedule(daySchedule)
      setIsLoading(false)
    }

    loadSchedule()
  }, [user])

  if (isLoading) {
    return (
      <DashboardLayout title="Schedule" subtitle="Your personalized weekly schedule">
        <div className="rounded-3xl border border-border bg-muted/60 p-10 text-center text-foreground-muted">
          Loading your workout schedule…
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout title="Schedule" subtitle="Your personalized weekly schedule">
        <div className="rounded-3xl border border-border bg-muted/60 p-10 text-center">
          <p className="text-lg font-semibold text-foreground mb-2">{error}</p>
        </div>
      </DashboardLayout>
    )
  }

  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }

  // Group calendar days by weeks
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const weeks: (ScheduleDay | null)[][] = []
  let currentWeek: (ScheduleDay | null)[] = Array(firstDayOfMonth).fill(null)

  for (let i = 1; i <= daysInMonth; i++) {
    const scheduleDay = schedule.find(d => d.date === i)
    currentWeek.push(scheduleDay || { date: i })

    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }

  if (currentWeek.length > 0) {
    weeks.push([...currentWeek, ...Array(7 - currentWeek.length).fill(null)])
  }

  return (
    <DashboardLayout title="Schedule" subtitle="Your personalized weekly schedule">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Calendar */}
        <div className="space-y-6 lg:col-span-2">
          <div className="glass-card rounded-2xl p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {months[currentMonth]} {currentYear}
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevMonth}
                  className="rounded-lg"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextMonth}
                  className="rounded-lg"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {days.map((day) => (
                <div key={day} className="text-center font-semibold text-sm text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="space-y-2">
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="grid grid-cols-7 gap-2">
                  {week.map((day, dayIdx) => (
                    <motion.div
                      key={`${weekIdx}-${dayIdx}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: dayIdx * 0.05 }}
                      className={cn(
                        "aspect-square rounded-lg p-2 border transition-colors",
                        !day
                          ? "bg-transparent border-transparent"
                          : day.workout
                          ? `glass-card border bg-gradient-to-br ${getWorkoutColor(day.workout.type)} cursor-pointer hover:opacity-80`
                          : "border-border bg-muted/50"
                      )}
                    >
                      {day && (
                        <div className="h-full flex flex-col text-xs">
                          <span className="font-semibold">{day.date}</span>
                          {day.workout && (
                            <>
                              {React.createElement(getWorkoutIcon(day.workout.type), {
                                className: "h-4 w-4 mt-1",
                              })}
                              <div className="mt-1 truncate text-xs leading-tight">
                                {day.workout.duration}m
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Legend */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="font-semibold mb-4">Workout Types</h3>
            <div className="space-y-3">
              {[
                { type: 'strength', label: 'Strength Training' },
                { type: 'cardio', label: 'Cardio' },
                { type: 'recovery', label: 'Recovery' },
              ].map((item) => (
                <div key={item.type} className="flex items-center gap-3">
                  {React.createElement(getWorkoutIcon(item.type as WorkoutType), {
                    className: "h-5 w-5",
                  })}
                  <span className="text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6 border-l-4 border-blue-500"
          >
            <div className="flex gap-3 mb-3">
              <Info className="h-5 w-5 text-blue-400 shrink-0" />
              <h3 className="font-semibold">Your Plan</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Your workouts are personalized based on your fitness level, goals, and recovery needs.
            </p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Automatically adjusts intensity over time</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Respects your rest days</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Adapts to your injury history</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}

import React from 'react'
