"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import {
  Plus,
  UtensilsCrossed,
  Droplets,
  Apple,
  Beef,
  Wheat,
  ChevronRight,
  Sparkles,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Zap
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { useAIPlan } from "@/hooks/use-ai-plan"
import type { AIMeal, AIMealSuggestion } from "@/lib/services/groq-ai-service"

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

// ─── Meal row ─────────────────────────────────────────────────────────────────
function MealRow({ meal, expanded, onToggle }: { meal: AIMeal; expanded: boolean; onToggle: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-white/10 bg-white/5"
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-4"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
            <UtensilsCrossed className="h-5 w-5 text-primary" />
          </div>
          <div className="text-left">
            <p className="font-medium">{meal.meal}</p>
            <p className="text-sm text-muted-foreground line-clamp-1">{meal.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{meal.time}</span>
          <span className="text-sm font-medium">{meal.calories} kcal</span>
          <ChevronRight className={cn("h-5 w-5 text-muted-foreground transition-transform", expanded && "rotate-90")} />
        </div>
      </button>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-white/10 p-4"
        >
          {/* Macros */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: "Protein", value: `${meal.protein}g`, color: "text-red-400" },
              { label: "Carbs", value: `${meal.carbs}g`, color: "text-yellow-400" },
              { label: "Fats", value: `${meal.fats}g`, color: "text-green-400" },
            ].map((m) => (
              <div key={m.label} className="rounded-lg bg-white/5 p-3 text-center">
                <p className={cn("text-sm font-bold", m.color)}>{m.value}</p>
                <p className="text-xs text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>

          {/* Ingredients */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Ingredients</p>
            <div className="flex flex-wrap gap-2">
              {meal.ingredients.map((ing) => (
                <span key={ing} className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Prep time + dietary note */}
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>⏱ {meal.prepTime} min prep</span>
            {meal.dietaryNote && (
              <span className="text-accent italic line-clamp-1 max-w-[60%]">{meal.dietaryNote}</span>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

// ─── Suggestion card ──────────────────────────────────────────────────────────
function SuggestionCard({ meal, index }: { meal: AIMealSuggestion; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className="group cursor-pointer rounded-xl bg-white/5 p-3 transition-colors hover:bg-white/10"
    >
      <div className="flex items-center justify-between">
        <span className="font-medium text-sm">{meal.name}</span>
        <span className="rounded-full bg-success/20 px-2 py-0.5 text-xs font-medium text-success">
          {Math.round(meal.match)}% match
        </span>
      </div>
      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
        <span>{meal.calories} kcal</span>
        <span>P: {meal.protein}g</span>
        <span>C: {meal.carbs}g</span>
        <span>F: {meal.fats}g</span>
      </div>
      {meal.note && (
        <p className="mt-1 text-xs text-muted-foreground italic line-clamp-1">{meal.note}</p>
      )}
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DietPage() {
  const { user } = useAuth()
  const { data: dietPlan, isLoading, isGenerating, needsGeneration, error, isCached, regenerate } = useAIPlan("diet", user?.id)

  const [expandedMeal, setExpandedMeal] = useState<string | null>(null)
  const [waterConsumed, setWaterConsumed] = useState(0)

  const targets = dietPlan?.targets
  const meals = dietPlan?.meals ?? []
  const suggestions = dietPlan?.suggestions ?? []

  // Estimated totals from today's meals (treat all as logged for display)
  const totals = useMemo(() => {
    return meals.reduce(
      (acc, m) => ({
        calories: acc.calories + m.calories,
        protein: acc.protein + m.protein,
        carbs: acc.carbs + m.carbs,
        fats: acc.fats + m.fats,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    )
  }, [meals])

  // Percentages (capped at 100)
  const pct = (val: number, target: number) =>
    target ? Math.min((val / target) * 100, 100) : 0

  return (
    <DashboardLayout title="Diet & Nutrition" subtitle="AI-generated meal plan based on your preferences">
      {/* Regenerate banner */}
      <div className="mb-4 flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-accent" />
          {isCached ? "Plan from cache — fresh every 24 h" : "Fresh AI plan generated"}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-xs"
          disabled={isLoading || isGenerating}
          onClick={regenerate}
        >
          <RefreshCw className={cn("h-3 w-3", isGenerating && "animate-spin")} />
          {isGenerating ? "Generating..." : "Regenerate"}
        </Button>
      </div>

      {/* Dietary compliance badge */}
      {dietPlan?.dietaryCompliance && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 flex items-start gap-3 rounded-xl border border-success/20 bg-success/5 px-4 py-3"
        >
          <ShieldCheck className="h-5 w-5 text-success shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">{dietPlan.dietaryCompliance}</p>
        </motion.div>
      )}

      {/* Error state */}
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
        {/* Left — calories + meals */}
        <div className="space-y-6 lg:col-span-2">
          {/* Calorie ring */}
          <div className="glass-card rounded-2xl p-6">
            {isLoading || isGenerating ? (
              <Skeleton className="h-40 w-full" />
            ) : targets ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Today&apos;s Calories</h3>
                  <span className="text-sm text-muted-foreground">
                    {Math.max(0, targets.calories - totals.calories)} remaining
                  </span>
                </div>

                <div className="mt-6 flex items-center gap-8">
                  {/* SVG ring */}
                  <div className="relative">
                    <svg className="h-32 w-32 -rotate-90 transform">
                      <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="10" fill="none" className="text-white/10" />
                      <motion.circle
                        cx="64" cy="64" r="56"
                        stroke="url(#calRingGrad)"
                        strokeWidth="10" fill="none" strokeLinecap="round"
                        strokeDasharray={352}
                        initial={{ strokeDashoffset: 352 }}
                        animate={{ strokeDashoffset: 352 - (352 * pct(totals.calories, targets.calories)) / 100 }}
                        transition={{ duration: 1 }}
                      />
                      <defs>
                        <linearGradient id="calRingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="hsl(var(--primary))" />
                          <stop offset="100%" stopColor="hsl(var(--accent))" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold">{targets.calories}</span>
                      <span className="text-xs text-muted-foreground">kcal target</span>
                    </div>
                  </div>

                  {/* Macro bars */}
                  <div className="flex-1 space-y-4">
                    {[
                      { label: "Protein", icon: Beef, val: totals.protein, target: targets.protein, color: "text-red-500", progress: pct(totals.protein, targets.protein) },
                      { label: "Carbs", icon: Wheat, val: totals.carbs, target: targets.carbs, color: "text-yellow-500", progress: pct(totals.carbs, targets.carbs) },
                      { label: "Fats", icon: Apple, val: totals.fats, target: targets.fats, color: "text-green-500", progress: pct(totals.fats, targets.fats) },
                    ].map((m) => (
                      <div key={m.label}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <m.icon className={cn("h-4 w-4", m.color)} />
                            {m.label}
                          </span>
                          <span>{m.val}g / {m.target}g</span>
                        </div>
                        <Progress value={m.progress} className="mt-2 h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </div>

          {/* Meals list */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Today&apos;s Meals</h3>
              <span className="text-xs text-muted-foreground px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                AI Generated
              </span>
            </div>

            <div className="mt-6 space-y-3">
              {isLoading || isGenerating
                ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
                : needsGeneration
                  ? (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground mb-4">No diet plan generated yet.</p>
                      <Button onClick={regenerate} disabled={isLoading || isGenerating} className="gap-2">
                        <Zap className="h-4 w-4" />
                        Generate with AI
                      </Button>
                    </div>
                  )
                  : meals.map((meal) => (
                    <MealRow
                      key={`${meal.meal}-${meal.name}`}
                      meal={meal}
                      expanded={expandedMeal === `${meal.meal}-${meal.name}`}
                      onToggle={() =>
                        setExpandedMeal(
                          expandedMeal === `${meal.meal}-${meal.name}`
                            ? null
                            : `${meal.meal}-${meal.name}`
                        )
                      }
                    />
                  ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Water intake */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Water Intake</h3>
              <Droplets className="h-5 w-5 text-blue-500" />
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {waterConsumed} / {targets?.water ?? 8} glasses
                </span>
                <span className="font-medium">
                  {Math.round((waterConsumed / (targets?.water ?? 8)) * 100)}%
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                {Array.from({ length: targets?.water ?? 8 }).map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setWaterConsumed(i < waterConsumed ? i : i + 1)}
                    className={cn(
                      "h-10 flex-1 rounded-lg transition-colors",
                      i < waterConsumed ? "bg-blue-500" : "bg-white/10 hover:bg-white/20"
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  />
                ))}
              </div>
              <Button
                variant="outline"
                className="mt-4 w-full gap-2 border-white/10"
                onClick={() => setWaterConsumed((prev) => Math.min(prev + 1, targets?.water ?? 8))}
              >
                <Plus className="h-4 w-4" />
                Add Glass
              </Button>
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              <h3 className="font-semibold">AI Meal Suggestions</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Tailored to your diet type and macro targets
            </p>

            <div className="mt-4 space-y-3">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
                : suggestions.map((meal, i) => (
                  <SuggestionCard key={meal.name} meal={meal} index={i} />
                ))}
            </div>
          </div>

          {/* Weekly tips */}
          {dietPlan?.weeklyTips && dietPlan.weeklyTips.length > 0 && (
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-success" />
                <h3 className="font-semibold">Weekly Nutrition Tips</h3>
              </div>
              <div className="space-y-3">
                {dietPlan.weeklyTips.map((tip, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{tip}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
