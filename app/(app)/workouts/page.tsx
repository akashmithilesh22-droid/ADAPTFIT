"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import {
  Search,
  Filter,
  Clock,
  Flame,
  Dumbbell,
  Play,
  Zap,
  Heart,
  Target,
  ChevronRight,
  RefreshCw,
  Sparkles,
  AlertCircle,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useAIPlan } from "@/hooks/use-ai-plan"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import type { AIWorkoutDay } from "@/lib/services/groq-ai-service"

// ─── Category pills ──────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "all",      label: "All Workouts" },
  { id: "strength", label: "Strength"     },
  { id: "cardio",   label: "Cardio"       },
  { id: "hiit",     label: "HIIT"         },
  { id: "recovery", label: "Recovery"     },
]

// ─── Icon / gradient per workout type ───────────────────────────────────────
function workoutMeta(type: AIWorkoutDay["type"]) {
  switch (type) {
    case "strength": return { icon: Dumbbell, gradient: "from-primary/20 to-accent/20" }
    case "cardio":   return { icon: Flame,    gradient: "from-red-500/20 to-orange-500/20" }
    case "hiit":     return { icon: Zap,      gradient: "from-yellow-500/20 to-orange-500/20" }
    case "recovery": return { icon: Heart,    gradient: "from-green-500/20 to-emerald-500/20" }
    default:         return { icon: Target,   gradient: "from-purple-500/20 to-pink-500/20" }
  }
}

// ─── Skeleton card ────────────────────────────────────────────────────────────
function WorkoutSkeleton() {
  return (
    <motion.div
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ repeat: Infinity, duration: 1.5 }}
      className="rounded-2xl border border-border bg-muted/30 h-64"
    />
  )
}

// ─── Workout Card ─────────────────────────────────────────────────────────────
function WorkoutCard({ session, index }: { session: AIWorkoutDay; index: number }) {
  const { icon: Icon, gradient } = workoutMeta(session.type)
  const router = useRouter()
  const { user } = useAuth()
  const [isStarting, setIsStarting] = useState(false)

  const handleStart = async () => {
    if (!user) {
      toast.error("Please sign in to start your workout")
      return
    }

    setIsStarting(true)
    console.log("[WorkoutCard] Saving session to Supabase...", session.name)

    try {
      const { data: { session: authSession } } = await supabase.auth.getSession()
      const accessToken = authSession?.access_token

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
          workout: session
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || "Failed to start workout")
      }

      const workoutId = json.data.id
      console.log("[WorkoutCard] Workout saved! ID:", workoutId)
      
      toast.success("Workout session started!")
      router.push(`/workouts/${workoutId}`)
    } catch (error: any) {
      console.error("[WorkoutCard] Error starting workout:", error)
      toast.error(error.message || "Failed to start workout. Please try again.")
    } finally {
      setIsStarting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="glass-card group relative overflow-hidden rounded-2xl"
    >
      {/* Header */}
      <div className={cn("relative bg-gradient-to-br p-6", gradient)}>
        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-background/80 px-2 py-1 text-xs font-medium backdrop-blur-sm">
          <Zap className="h-3 w-3 text-accent" />
          AI Generated
        </div>

        <div className="rounded-xl bg-background/30 p-3 backdrop-blur-sm w-fit">
          <Icon className="h-6 w-6" />
        </div>

        <h3 className="mt-4 text-xl font-bold">{session.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground capitalize">
          {session.day} · {session.type}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 border-b border-white/10 p-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
          </div>
          <p className="mt-1 font-medium">{session.duration}m</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-muted-foreground">
            <Flame className="h-4 w-4" />
          </div>
          <p className="mt-1 font-medium">{session.calories}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-muted-foreground">
            <Dumbbell className="h-4 w-4" />
          </div>
          <p className="mt-1 font-medium">{session.exercises.length}</p>
        </div>
      </div>

      {/* AI Tip */}
      {session.aiTip && (
        <div className="px-4 pt-3 pb-0">
          <p className="text-xs text-muted-foreground line-clamp-2 italic">
            <span className="text-accent font-medium not-italic">AI Tip: </span>
            {session.aiTip}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between p-4">
        <div className="flex flex-col gap-0.5">
          {session.exercises.slice(0, 2).map((ex) => (
            <span key={ex.name} className="text-xs text-muted-foreground">{ex.name}</span>
          ))}
          {session.exercises.length > 2 && (
            <span className="text-xs text-muted-foreground">+{session.exercises.length - 2} more</span>
          )}
        </div>
        <Button 
          size="sm" 
          className="gap-2 bg-primary"
          onClick={handleStart}
          disabled={isStarting}
        >
          <Play className={isStarting ? "animate-pulse" : "h-4 w-4"} />
          {isStarting ? "Starting..." : "Start"}
        </Button>
      </div>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function WorkoutsPage() {
  const { user } = useAuth()
  const { data: workoutPlan, isLoading, isGenerating, needsGeneration, error, isCached, regenerate } = useAIPlan("workout", user?.id)

  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter workout sessions (exclude rest days)
  const sessions = useMemo<AIWorkoutDay[]>(() => {
    if (!workoutPlan) return []
    return workoutPlan.weeklyPlan.filter((d) => d.type !== "rest")
  }, [workoutPlan])

  const filtered = useMemo(() => {
    return sessions.filter((s) => {
      const matchCategory = activeCategory === "all" || s.type === activeCategory
      const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCategory && matchSearch
    })
  }, [sessions, activeCategory, searchQuery])

  // Category counts from live data
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: sessions.length }
    sessions.forEach((s) => { counts[s.type] = (counts[s.type] ?? 0) + 1 })
    return counts
  }, [sessions])

  return (
    <DashboardLayout title="Workouts" subtitle="Your AI-generated weekly workout plan">
      {/* Header Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search workouts…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-white/10 bg-white/5 pl-10"
            />
          </div>
          <Button variant="outline" size="icon" className="border-white/10">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="outline"
          className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
          disabled={isLoading || isGenerating}
          onClick={regenerate}
        >
          <RefreshCw className={cn("h-4 w-4", isGenerating && "animate-spin")} />
          {isGenerating ? "Generating..." : isCached ? "Regenerate with AI" : "Refresh Plan"}
        </Button>
      </div>

      {/* Plan info banner */}
      {workoutPlan && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3"
        >
          <Sparkles className="h-5 w-5 text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">{workoutPlan.split}</p>
            <p className="text-xs text-muted-foreground truncate">{workoutPlan.coachNote}</p>
          </div>
          {isCached && (
            <span className="text-xs text-muted-foreground shrink-0">Cached</span>
          )}
        </motion.div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4"
        >
          <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-destructive">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-destructive hover:text-destructive"
              onClick={regenerate}
            >
              Try again
            </Button>
          </div>
        </motion.div>
      )}

      {/* Categories */}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all",
              activeCategory === cat.id
                ? "bg-primary text-primary-foreground"
                : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
            )}
          >
            {cat.label}
            <span className={cn("rounded-full px-2 py-0.5 text-xs", activeCategory === cat.id ? "bg-white/20" : "bg-white/10")}>
              {categoryCounts[cat.id] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* Workout Grid */}
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading || isGenerating
          ? Array.from({ length: 6 }).map((_, i) => <WorkoutSkeleton key={i} />)
          : filtered.map((session, i) => (
              <WorkoutCard key={`${session.day}-${session.name}`} session={session} index={i} />
            ))}
      </div>

      {/* Empty / Needs Generation State */}
      {!isLoading && !isGenerating && (filtered.length === 0 || needsGeneration) && (
        <div className="mt-12 flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-white/5 p-6">
            <Dumbbell className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">
            {needsGeneration ? "No Plan Generated Yet" : "No workouts found"}
          </h3>
          <p className="mt-2 text-muted-foreground max-w-md">
            {needsGeneration 
              ? "Your profile is ready. Let your AI Coach build your personalised workout schedule." 
              : searchQuery 
                ? "Try a different search term" 
                : "Adjust your filters or regenerate your plan"}
          </p>
          {!searchQuery && (
            <Button className="mt-4 gap-2" onClick={regenerate} disabled={isLoading || isGenerating}>
              <Zap className="h-4 w-4" />
              {needsGeneration ? "Generate Plan" : "Generate with AI"}
            </Button>
          )}
        </div>
      )}
    </DashboardLayout>
  )
}
