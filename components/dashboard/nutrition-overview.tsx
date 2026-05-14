"use client"

import { motion } from "framer-motion"
import { UtensilsCrossed, Droplets, Apple, ChevronRight } from "lucide-react"
import Link from "next/link"

interface NutritionOverviewProps {
  nutritionData: {
    calories: {
      current: number
      target: number
      unit: string
    }
    protein: {
      current: number
      target: number
      unit: string
    }
    carbs: {
      current: number
      target: number
      unit: string
    }
    fats: {
      current: number
      target: number
      unit: string
    }
    water: {
      current: number
      target: number
      unit: string
    }
  }
}

interface MacroBarProps {
  label: string
  current: number
  target: number
  unit?: string
  color: string
}

function MacroBar({ label, current, target, unit = "g", color }: MacroBarProps) {
  const percentage = Math.min((current / target) * 100, 100)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {current}/{target}
          {unit}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  )
}

export function NutritionOverview({ nutritionData }: NutritionOverviewProps) {
  const caloriePercentage = nutritionData.calories.target
    ? (nutritionData.calories.current / nutritionData.calories.target) * 100
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-card overflow-hidden rounded-2xl p-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{"Today's Nutrition"}</h3>
        <Link
          href="/diet"
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          View Details
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Calorie Ring */}
      <div className="mt-6 flex items-center gap-6">
        <div className="relative">
          <svg className="h-24 w-24 -rotate-90 transform">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-white/10"
            />
            <motion.circle
              cx="48"
              cy="48"
              r="40"
              stroke="url(#calorieGradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={251}
              initial={{ strokeDashoffset: 251 }}
              animate={{
                strokeDashoffset: 251 - (251 * Math.min(caloriePercentage, 100)) / 100,
              }}
              transition={{ duration: 1, delay: 0.3 }}
            />
            <defs>
              <linearGradient id="calorieGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <UtensilsCrossed className="h-5 w-5 text-primary" />
          </div>
        </div>

        <div className="flex-1">
          <p className="text-3xl font-bold">{nutritionData.calories.current}</p>
          <p className="text-sm text-muted-foreground">
            of {nutritionData.calories.target} kcal
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {nutritionData.calories.target - nutritionData.calories.current} remaining
          </p>
        </div>
      </div>

      {/* Macros */}
      <div className="mt-6 space-y-4">
        <MacroBar
          label="Protein"
          current={nutritionData.protein.current}
          target={nutritionData.protein.target}
          color="bg-red-500"
        />
        <MacroBar
          label="Carbs"
          current={nutritionData.carbs.current}
          target={nutritionData.carbs.target}
          color="bg-blue-500"
        />
        <MacroBar
          label="Fats"
          current={nutritionData.fats.current}
          target={nutritionData.fats.target}
          color="bg-yellow-500"
        />
      </div>

      {/* Water */}
      <div className="mt-4 flex items-center gap-3 rounded-xl bg-blue-500/10 p-3">
        <Droplets className="h-5 w-5 text-blue-500" />
        <div className="flex-1">
          <p className="text-sm font-medium">Water Intake</p>
          <p className="text-xs text-muted-foreground">
            {nutritionData.water.current} of {nutritionData.water.target} glasses
          </p>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: nutritionData.water.target }).map((_, i) => (
            <div
              key={i}
              className={`h-6 w-2 rounded-full ${
                i < nutritionData.water.current ? "bg-blue-500" : "bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
