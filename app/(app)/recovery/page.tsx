"use client"

import { motion } from "framer-motion"
import {
  Moon,
  Heart,
  Activity,
  Brain,
  Battery,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Zap,
  ChevronRight,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { useAIPlan } from "@/hooks/use-ai-plan"
import type { AIRecoveryTip } from "@/lib/services/groq-ai-service"

// ─── Helpers ──────────────────────────────────────────────────────────────────
function readinessColor(label: string) {
  if (label === "High")     return "text-success"
  if (label === "Moderate") return "text-yellow-400"
  return "text-destructive"
}
function readinessBg(label: string) {
  if (label === "High")     return "from-success/20 to-emerald-500/20 border-success/30"
  if (label === "Moderate") return "from-yellow-500/20 to-amber-500/20 border-yellow-500/30"
  return "from-red-500/20 to-rose-500/20 border-red-500/30"
}

function categoryIcon(cat: AIRecoveryTip["category"]) {
  switch (cat) {
    case "sleep":           return Moon
    case "nutrition":       return Heart
    case "active-recovery": return Activity
    case "stress":          return Brain
    case "injury":          return ShieldAlert
    default:                return Battery
  }
}

function categoryColor(cat: AIRecoveryTip["category"]) {
  switch (cat) {
    case "sleep":           return "bg-blue-500/20 text-blue-400"
    case "nutrition":       return "bg-green-500/20 text-green-400"
    case "active-recovery": return "bg-purple-500/20 text-purple-400"
    case "stress":          return "bg-pink-500/20 text-pink-400"
    case "injury":          return "bg-red-500/20 text-red-400"
    default:                return "bg-yellow-500/20 text-yellow-400"
  }
}

function priorityBadge(p: AIRecoveryTip["priority"]) {
  switch (p) {
    case "high":   return "bg-red-500/20 text-red-400"
    case "medium": return "bg-yellow-500/20 text-yellow-400"
    default:       return "bg-muted text-muted-foreground"
  }
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return (
    <motion.div
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ repeat: Infinity, duration: 1.5 }}
      className={cn("rounded-xl bg-muted/40", className)}
    />
  )
}

// ─── Radial readiness gauge ───────────────────────────────────────────────────
function ReadinessGauge({ score, label }: { score: number; label: string }) {
  const circumference = 2 * Math.PI * 52
  const offset = circumference - (circumference * score) / 100

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <svg width="140" height="140" className="-rotate-90">
          <circle cx="70" cy="70" r="52" fill="none" stroke="currentColor" strokeWidth="10" className="text-white/10" />
          <motion.circle
            cx="70" cy="70" r="52"
            fill="none"
            stroke="url(#readinessGrad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="readinessGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold">{score}</span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
      </div>
      <span className={cn("text-lg font-semibold", readinessColor(label))}>
        {label} Readiness
      </span>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function RecoveryPage() {
  const { user } = useAuth()
  const { data: plan, isLoading, isGenerating, needsGeneration, error, isCached, regenerate } = useAIPlan("recovery", user?.id)

  // Sort tips: high → medium → low
  const sortedTips = plan
    ? [...plan.personalizedTips].sort((a, b) => {
        const order = { high: 0, medium: 1, low: 2 }
        return order[a.priority] - order[b.priority]
      })
    : []

  return (
    <DashboardLayout title="Recovery" subtitle="AI-personalised recovery plan based on your profile">
      {/* Banner */}
      <div className="mb-4 flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-accent" />
          {isCached ? "Recovery plan from cache" : "Fresh AI recovery plan"}
        </div>
        <Button variant="ghost" size="sm" className="gap-2 text-xs" disabled={isLoading || isGenerating} onClick={regenerate}>
          <RefreshCw className={cn("h-3 w-3", isGenerating && "animate-spin")} />
          {isGenerating ? "Generating..." : "Regenerate"}
        </Button>
      </div>

      {/* Error */}
      {error && !isLoading && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4">
          <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-destructive">{error}</p>
            <Button variant="ghost" size="sm" className="mt-2 text-destructive" onClick={regenerate}>
              Try again
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Main Content ── */}
        <div className="space-y-6 lg:col-span-2">

          {/* Readiness Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "glass-card rounded-2xl p-6 border bg-gradient-to-br",
              plan ? readinessBg(plan.readinessLabel) : "from-muted/40 to-muted/20 border-border"
            )}
          >
            {isLoading || isGenerating ? (
              <Skeleton className="h-48 w-full" />
            ) : needsGeneration ? (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <Sparkles className="h-8 w-8 text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-4">No recovery plan generated yet.</p>
                <Button onClick={regenerate} disabled={isLoading || isGenerating} className="gap-2">
                  <Zap className="h-4 w-4" />
                  Generate with AI
                </Button>
              </div>
            ) : plan ? (
              <div className="flex flex-col md:flex-row items-center gap-8">
                <ReadinessGauge score={plan.readinessScore} label={plan.readinessLabel} />
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Today&apos;s Recommendation</p>
                    <p className="text-lg font-semibold">{plan.todaySuggestion}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-background/40 backdrop-blur-sm p-3">
                      <p className="text-xs text-muted-foreground mb-1">Sleep Target</p>
                      <p className="font-bold text-lg">{plan.sleepTarget}h</p>
                    </div>
                    <div className="rounded-xl bg-background/40 backdrop-blur-sm p-3">
                      <p className="text-xs text-muted-foreground mb-1">Recovery Days</p>
                      <p className="font-bold text-lg">
                        {plan.weeklyRecoveryPlan.filter((d) => d.activity.toLowerCase().includes("rest") || d.activity.toLowerCase().includes("recovery")).length} / 7
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </motion.div>

          {/* Personalised Tips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Zap className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Personalised Recovery Tips</h3>
            </div>

            {isLoading || isGenerating ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : needsGeneration ? null : (
              <div className="space-y-3">
                {sortedTips.map((tip, i) => {
                  const Icon = categoryIcon(tip.category)
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.07 }}
                      className="flex items-start gap-4 rounded-xl bg-white/5 p-4"
                    >
                      <div className={cn("rounded-lg p-2 shrink-0", categoryColor(tip.category))}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{tip.tip}</p>
                        <p className="text-xs text-muted-foreground mt-1 capitalize">
                          {tip.category.replace("-", " ")}
                        </p>
                      </div>
                      <span className={cn("text-xs rounded-full px-2 py-0.5 font-medium shrink-0", priorityBadge(tip.priority))}>
                        {tip.priority}
                      </span>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>

          {/* Injury Modifications */}
          {plan && plan.injuryModifications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-2xl p-6 border-l-4 border-amber-500"
            >
              <div className="flex items-center gap-2 mb-4">
                <ShieldAlert className="h-5 w-5 text-amber-500" />
                <h3 className="font-semibold">Injury Modifications</h3>
              </div>
              <div className="space-y-2">
                {plan.injuryModifications.map((mod, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    className="flex gap-2"
                  >
                    <ChevronRight className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{mod}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-6">
          {/* Weekly Recovery Schedule */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="font-semibold mb-4">Weekly Recovery Plan</h3>
            {isLoading || isGenerating ? (
              <div className="space-y-3">
                {Array.from({ length: 7 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : needsGeneration ? null : plan ? (
              <div className="space-y-3">
                {plan.weeklyRecoveryPlan.map((day, i) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="flex items-start gap-3 rounded-xl bg-white/5 p-3"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-xs font-bold text-primary">
                      {day.day.slice(0, 3)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{day.activity}</p>
                      <p className="text-xs text-muted-foreground">{day.duration} min · {day.notes}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : null}
          </motion.div>

          {/* Recovery Factors Tracked */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="font-semibold mb-4">Factors We Track</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "Sleep Quality",   icon: Moon,        color: "bg-blue-500/20 text-blue-400"   },
                { name: "HRV",             icon: Activity,    color: "bg-purple-500/20 text-purple-400" },
                { name: "Energy Level",    icon: Battery,     color: "bg-yellow-500/20 text-yellow-400" },
                { name: "Mental State",    icon: Brain,       color: "bg-pink-500/20 text-pink-400"   },
                { name: "Resting HR",      icon: Heart,       color: "bg-red-500/20 text-red-400"     },
                { name: "Readiness Score", icon: CheckCircle2, color: "bg-green-500/20 text-green-400" },
              ].map((f, i) => (
                <motion.div
                  key={f.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.06 }}
                  className={cn("rounded-xl p-3 flex flex-col items-center gap-2 text-center", f.color)}
                >
                  <f.icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{f.name}</span>
                </motion.div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Wearable integration (Apple Watch, Garmin, Fitbit) coming soon.
            </p>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}
