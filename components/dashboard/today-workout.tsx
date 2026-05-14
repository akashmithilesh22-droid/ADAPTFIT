"use client"

import { motion } from "framer-motion"
import { Play, Clock, Flame, Dumbbell, ChevronRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"

interface Exercise {
  name: string
  sets: number
  reps: string
  muscle: string
}

interface TodayWorkoutProps {
  workout: {
    name: string
    type: string
    duration: string
    calories: number
    exercises: Exercise[]
    aiAdjustment: string
  }
}

export function TodayWorkout({ workout }: TodayWorkoutProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [isStarting, setIsStarting] = useState(false)

  const handleStart = async () => {
    if (!user) {
      toast.error("Please sign in to start your workout")
      return
    }

    setIsStarting(true)
    console.log("[TodayWorkout] Saving session to Supabase...", workout.name)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const accessToken = session?.access_token

      if (!accessToken) {
        throw new Error("No active session — please sign in again.")
      }

      const res = await fetch("/api/workouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          userId: user.id,
          workout: workout
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || "Failed to start workout")
      }

      const workoutId = json.data.id
      console.log("[TodayWorkout] Workout saved! ID:", workoutId)
      
      toast.success("Workout session started!")
      router.push(`/workouts/${workoutId}`)
    } catch (error: any) {
      console.error("[TodayWorkout] Error starting workout:", error)
      toast.error(error.message || "Failed to start workout. Please try again.")
    } finally {
      setIsStarting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card overflow-hidden rounded-2xl"
    >
      {/* Header */}
      <div className="relative border-b border-white/10 bg-gradient-to-r from-primary/20 to-accent/20 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary">
                {"Today's Workout"}
              </span>
            </div>
            <h3 className="mt-2 text-2xl font-bold">{workout.name}</h3>
            <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {workout.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-orange-500" />
                {workout.calories} cal
              </span>
              <span className="flex items-center gap-1.5">
                <Dumbbell className="h-4 w-4" />
                {workout.exercises.length} exercises
              </span>
            </div>
          </div>
          <Button 
            size="lg" 
            className="gap-2 bg-primary hover:bg-primary/90" 
            onClick={handleStart}
            disabled={isStarting}
          >
            <Play className={isStarting ? "animate-pulse" : "h-5 w-5"} />
            {isStarting ? "Starting..." : "Start"}
          </Button>
        </div>

        {/* AI Adjustment Notice */}
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-background/50 p-3 backdrop-blur-sm">
          <Zap className="h-4 w-4 text-accent" />
          <span className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">AI Adjusted:</span>{" "}
            {workout.aiAdjustment}
          </span>
        </div>
      </div>

      {/* Exercise List */}
      <div className="p-4">
        <div className="space-y-2">
          {workout.exercises.slice(0, 4).map((exercise, index) => (
            <motion.div
              key={exercise.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              className="flex items-center justify-between rounded-xl bg-white/5 p-3 transition-colors hover:bg-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-sm font-bold text-primary">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium">{exercise.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {exercise.muscle}
                  </p>
                </div>
              </div>
              <div className="text-right text-sm">
                <p className="font-medium">
                  {exercise.sets} x {exercise.reps}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {workout.exercises.length > 4 && (
  <button
    onClick={handleStart}
    className="mt-3 flex items-center justify-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground w-full"
  >
    +{workout.exercises.length - 4} more exercises
    <ChevronRight className="h-4 w-4" />
  </button>
)}
      </div>
    </motion.div>
  )
}
