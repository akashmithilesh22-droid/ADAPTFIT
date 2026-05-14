"use client"

import { useState, useEffect, useMemo, use } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  Volume2,
  Settings,
  X,
  Trophy,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export default function DynamicWorkoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { user } = useAuth()
  
  const [workout, setWorkout] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [currentSet, setCurrentSet] = useState(1)
  const [isResting, setIsResting] = useState(false)
  const [restTime, setRestTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [completedSets, setCompletedSets] = useState<Record<string, number[]>>({})
  const [workoutComplete, setWorkoutComplete] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [completionData, setCompletionData] = useState<{ earnedXP: number, leveledUp: boolean, newLevel: number } | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [hasAttemptedSave, setHasAttemptedSave] = useState(false)

  useEffect(() => {
    const fetchWorkout = async () => {
      if (!user) return
      
      setIsLoading(true)
      console.log(`[WorkoutPage] Fetching workout session: ${id}`)
      
      try {
        const { data: { session: authSession } } = await supabase.auth.getSession()
        const accessToken = authSession?.access_token

        if (!accessToken) {
          throw new Error("No active session")
        }

        const res = await fetch(`/api/workouts?id=${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        const json = await res.json()

        if (!res.ok) {
          throw new Error(json.error || "Failed to load workout")
        }

        // Process data to match UI expectations
        const rawWorkout = json.data
        const processedWorkout = {
          ...rawWorkout,
          exercises: rawWorkout.exercises.map((ex: any, i: number) => ({
            id: i + 1,
            name: ex.name,
            sets: ex.sets || 3,
            reps: ex.reps || "8-12",
            weight: "Tracked in app",
            rest: 60,
            muscle: ex.muscle || "Full Body",
            tips: ex.notes || "Focus on form and controlled movements.",
          }))
        }

        setWorkout(processedWorkout)
        console.log(`[WorkoutPage] Workout loaded: ${processedWorkout.name}`)
      } catch (err: any) {
        console.error("[WorkoutPage] Error fetching workout:", err)
        setError(err.message)
        toast.error("Could not load workout session.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchWorkout()
  }, [id, user])

  // Save workout when complete
  useEffect(() => {
    if (workoutComplete && !isSaving && !completionData && !hasAttemptedSave) {
      const saveWorkout = async () => {
        setHasAttemptedSave(true)
        setIsSaving(true)
        try {
          const { data: { session } } = await supabase.auth.getSession()
          if (!session?.access_token) throw new Error("No active session found")

          const durationMins = Math.ceil(elapsedTime / 60)
          console.log("[WorkoutPage] Attempting to save completed workout...")
          
          const res = await fetch("/api/workouts/complete", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              workoutId: id,
              workoutName: workout.name,
              workoutType: workout.type,
              duration: durationMins,
              calories: workout.calories,
              exercises: completedSets,
            }),
          })

          const json = await res.json()
          console.log("[WorkoutPage] Save response:", json)

          if (!res.ok) throw new Error(json.error || "Failed to save workout")
          
          setCompletionData({
            earnedXP: json.earnedXP,
            leveledUp: json.leveledUp,
            newLevel: json.newLevel,
          })
          toast.success("Workout saved successfully!")
        } catch (err: any) {
          console.error("[WorkoutPage] Failed to save completed workout:", err)
          toast.error(err.message || "Failed to save workout data. Please try again.")
        } finally {
          setIsSaving(false)
        }
      }
      saveWorkout()
    }
  }, [workoutComplete, id, workout, elapsedTime, isSaving, completionData, hasAttemptedSave])

  // Elapsed time timer
  useEffect(() => {
    if (isPlaying && !workoutComplete && !isLoading) {
      const timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isPlaying, workoutComplete, isLoading])

  // Rest timer
  useEffect(() => {
    if (isResting && restTime > 0) {
      const timer = setTimeout(() => {
        setRestTime((prev) => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (isResting && restTime === 0) {
      setIsResting(false)
    }
  }, [isResting, restTime])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleCompleteSet = () => {
    const currentExercise = workout.exercises[currentExerciseIndex]
    const exerciseId = currentExercise.id.toString()
    const currentCompleted = completedSets[exerciseId] || []

    setCompletedSets({
      ...completedSets,
      [exerciseId]: [...currentCompleted, currentSet],
    })

    if (currentSet < currentExercise.sets) {
      setCurrentSet(currentSet + 1)
      setRestTime(currentExercise.rest)
      setIsResting(true)
    } else if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1)
      setCurrentSet(1)
      setRestTime(currentExercise.rest)
      setIsResting(true)
    } else {
      setWorkoutComplete(true)
    }
  }

  const handleSkipRest = () => {
    setIsResting(false)
    setRestTime(0)
  }

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1)
      setCurrentSet(1)
      setIsResting(false)
    }
  }

  const handleNextExercise = () => {
    if (currentExerciseIndex < (workout?.exercises?.length || 0) - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1)
      setCurrentSet(1)
      setIsResting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4" />
        <h2 className="text-xl font-semibold">Loading Workout...</h2>
        <p className="text-muted-foreground mt-2">Fetching your personalized session data</p>
      </div>
    )
  }

  if (error || !workout) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <div className="rounded-full bg-destructive/10 p-4 mb-4">
          <X className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Workout Not Found</h2>
        <p className="text-muted-foreground mb-6">
          {error || "Could not find the workout session you're looking for."}
        </p>
        <Button asChild><Link href="/workouts">Back to Workouts</Link></Button>
      </div>
    )
  }

  const currentExercise = workout.exercises[currentExerciseIndex]
  const totalExercises = workout.exercises.length
  const progress = ((currentExerciseIndex + 1) / totalExercises) * 100

  if (workoutComplete) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="rounded-full bg-gradient-to-br from-primary to-accent p-8"
        >
          <Trophy className="h-16 w-16 text-white" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-3xl font-bold"
        >
          Workout Complete!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-2 text-muted-foreground"
        >
          Great job finishing {workout.name}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 grid grid-cols-3 gap-6"
        >
          <div className="glass-card rounded-xl p-4 text-center">
            <Clock className="mx-auto h-6 w-6 text-primary" />
            <p className="mt-2 text-2xl font-bold">{formatTime(elapsedTime)}</p>
            <p className="text-sm text-muted-foreground">Duration</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <Flame className="mx-auto h-6 w-6 text-orange-500" />
            <p className="mt-2 text-2xl font-bold">{workout.calories}</p>
            <p className="text-sm text-muted-foreground">Calories</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <CheckCircle2 className="mx-auto h-6 w-6 text-success" />
            <p className="mt-2 text-2xl font-bold">{totalExercises}</p>
            <p className="text-sm text-muted-foreground">Exercises</p>
          </div>
        </motion.div>

        <AnimatePresence>
          {completionData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.7, type: "spring" }}
              className="mt-6 w-full max-w-sm rounded-2xl border border-primary/20 bg-primary/10 p-5 text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-accent" />
                <span className="font-bold text-accent">+{completionData.earnedXP} XP Earned</span>
              </div>
              {completionData.leveledUp && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="mt-3 rounded-xl bg-accent/20 py-2 text-accent-foreground font-bold"
                >
                  🎉 Level Up! You are now Level {completionData.newLevel}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex gap-4"
        >
          <Button variant="outline" asChild>
            <Link href="/workouts">Back to Workouts</Link>
          </Button>
          <Button className="bg-primary" asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/10 bg-card/30 px-6 py-4 backdrop-blur-xl">
        <Link
          href="/workouts"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
          Exit
        </Link>
        <div className="text-center">
          <h1 className="font-semibold">{workout.name}</h1>
          <p className="text-sm text-muted-foreground">
            {currentExerciseIndex + 1} of {totalExercises} exercises
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Volume2 className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="px-6 py-2">
        <Progress value={progress} className="h-2" />
      </div>

      {/* Timer Bar */}
      <div className="flex items-center justify-center gap-6 border-b border-white/10 py-3">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono">{formatTime(elapsedTime)}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsPlaying(!isPlaying)}
          className="gap-2"
        >
          {isPlaying ? (
            <>
              <Pause className="h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Resume
            </>
          )}
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {isResting ? (
            <motion.div
              key="rest"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center text-center"
            >
              <div className="relative">
                <svg className="h-48 w-48 -rotate-90 transform">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-white/10"
                  />
                  <motion.circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="url(#restGradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={553}
                    initial={{ strokeDashoffset: 0 }}
                    animate={{
                      strokeDashoffset:
                        553 - (553 * restTime) / currentExercise.rest,
                    }}
                  />
                  <defs>
                    <linearGradient
                      id="restGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--accent))" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold">{restTime}</span>
                  <span className="text-muted-foreground">seconds</span>
                </div>
              </div>

              <h2 className="mt-6 text-2xl font-bold">Rest Time</h2>
              <p className="mt-2 text-muted-foreground">
                Next: Set {currentSet} of {currentExercise.name}
              </p>

              <Button
                onClick={handleSkipRest}
                className="mt-6 gap-2 bg-primary"
              >
                <SkipForward className="h-4 w-4" />
                Skip Rest
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key={`exercise-${currentExerciseIndex}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full max-w-lg"
            >
              {/* Exercise Card */}
              <div className="glass-card overflow-hidden rounded-2xl">
                <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-6">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-background/50 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                      {currentExercise.muscle}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Set {currentSet} of {currentExercise.sets}
                    </span>
                  </div>
                  <h2 className="mt-4 text-3xl font-bold">
                    {currentExercise.name}
                  </h2>
                </div>

                <div className="p-6">
                  {/* Set Indicators */}
                  <div className="flex justify-center gap-2">
                    {Array.from({ length: currentExercise.sets }).map(
                      (_, i) => {
                        const isCompleted = (
                          completedSets[currentExercise.id.toString()] || []
                        ).includes(i + 1)
                        const isCurrent = i + 1 === currentSet

                        return (
                          <div
                            key={i}
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-all",
                              isCompleted &&
                                "border-success bg-success/20 text-success",
                              isCurrent &&
                                !isCompleted &&
                                "border-primary bg-primary/20 text-primary",
                              !isCompleted &&
                                !isCurrent &&
                                "border-white/20 text-muted-foreground"
                            )}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              i + 1
                            )}
                          </div>
                        )
                      }
                    )}
                  </div>

                  {/* Reps & Weight */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-white/5 p-4 text-center">
                      <p className="text-sm text-muted-foreground">Reps</p>
                      <p className="mt-1 text-2xl font-bold">
                        {currentExercise.reps}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white/5 p-4 text-center">
                      <p className="text-sm text-muted-foreground">Weight</p>
                      <p className="mt-1 text-2xl font-bold">
                        {currentExercise.weight}
                      </p>
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="mt-6 flex items-start gap-3 rounded-xl bg-accent/10 p-4">
                    <Zap className="h-5 w-5 shrink-0 text-accent" />
                    <p className="text-sm text-muted-foreground">
                      {currentExercise.tips}
                    </p>
                  </div>

                  {/* Complete Button */}
                  <Button
                    onClick={handleCompleteSet}
                    className="mt-6 w-full gap-2 bg-primary py-6 text-lg"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    Complete Set
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <footer className="flex items-center justify-between border-t border-white/10 bg-card/30 px-6 py-4 backdrop-blur-xl">
        <Button
          variant="ghost"
          onClick={handlePreviousExercise}
          disabled={currentExerciseIndex === 0}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="flex gap-2">
          {workout.exercises.map((_: any, i: number) => (
            <button
              key={i}
              onClick={() => {
                setCurrentExerciseIndex(i)
                setCurrentSet(1)
                setIsResting(false)
              }}
              className={cn(
                "h-2 w-2 rounded-full transition-all",
                i === currentExerciseIndex
                  ? "w-6 bg-primary"
                  : i < currentExerciseIndex
                  ? "bg-success"
                  : "bg-white/20"
              )}
            />
          ))}
        </div>

        <Button
          variant="ghost"
          onClick={handleNextExercise}
          disabled={currentExerciseIndex === totalExercises - 1}
          className="gap-2"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </footer>
    </div>
  )
}
