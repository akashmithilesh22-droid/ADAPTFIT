"use client"

import { motion } from "framer-motion"
import { Battery, Activity, Brain, Moon } from "lucide-react"
import { cn } from "@/lib/utils"

interface RecoveryScoreProps {
  overall: number
  factors: {
    label: string
    value: number
  }[]
}

const getFactorIcon = (label: string) => {
  if (label.includes('Sleep')) return Moon
  if (label === 'HRV') return Activity
  if (label === 'Energy') return Battery
  return Brain
}

export function RecoveryScore({ overall, factors }: RecoveryScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success"
    if (score >= 60) return "text-warning"
    return "text-destructive"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Fair"
    return "Low"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card overflow-hidden rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold">Recovery Score</h3>

      {/* Main Score */}
      <div className="mt-6 flex items-center justify-center">
        <div className="relative">
          {/* Background circle */}
          <svg className="h-40 w-40 -rotate-90 transform">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-white/10"
            />
            <motion.circle
              cx="80"
              cy="80"
              r="70"
              stroke="url(#recoveryGradient)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={440}
              initial={{ strokeDashoffset: 440 }}
              animate={{
                strokeDashoffset: 440 - (440 * overall) / 100,
              }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            <defs>
              <linearGradient id="recoveryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
              </linearGradient>
            </defs>
          </svg>

          {/* Score text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className={cn("text-4xl font-bold", getScoreColor(overall))}
            >
              {overall}
            </motion.span>
            <span className="text-sm text-muted-foreground">
              {getScoreLabel(overall)}
            </span>
          </div>
        </div>
      </div>

      {/* Factors */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        {factors.map((factor, index) => (
          <motion.div
            key={factor.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1 + index * 0.1 }}
            className="rounded-xl bg-white/5 p-3"
          >
            <div className="flex items-center gap-2">
              {(() => {
                const Icon = getFactorIcon(factor.label)
                return <Icon className="h-4 w-4 text-muted-foreground" />
              })()}
              <span className="text-xs text-muted-foreground">{factor.label}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${factor.value}%` }}
                  transition={{ duration: 0.8, delay: 1.2 + index * 0.1 }}
                  className={cn(
                    "h-full rounded-full",
                    factor.value >= 80 && "bg-success",
                    factor.value >= 60 && factor.value < 80 && "bg-warning",
                    factor.value < 60 && "bg-destructive"
                  )}
                />
              </div>
              <span className="ml-2 text-sm font-medium">{factor.value}%</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
