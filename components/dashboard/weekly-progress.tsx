"use client"

import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

interface WeeklyProgressProps {
  weeklyData: {
    day: string
    workouts: number
    calories: number
    duration: number
  }[]
  summary: {
    workouts: number
    calories: number
    totalTime: string
  }
}

const CustomTooltip = ({ active, payload, label, weeklyData }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-white/10 bg-card p-3 shadow-xl">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">
          Calories: <span className="text-primary">{payload[0].value}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Duration: <span className="text-accent">{weeklyData.find((d: any) => d.day === label)?.duration} min</span>
        </p>
      </div>
    )
  }
  return null
}

export function WeeklyProgress({ weeklyData, summary }: WeeklyProgressProps) {
  const today = new Date().getDay()
  const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const todayStr = dayMap[today]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card overflow-hidden rounded-2xl p-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Weekly Activity</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Calories Burned</span>
          </div>
        </div>
      </div>

      <div className="mt-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyData} barCategoryGap="20%">
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip weeklyData={weeklyData} />} cursor={false} />
            <Bar dataKey="calories" radius={[8, 8, 0, 0]}>
              {weeklyData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.day === todayStr
                      ? "hsl(var(--accent))"
                      : entry.calories > 0
                      ? "hsl(var(--primary))"
                      : "hsl(var(--muted))"
                  }
                  opacity={entry.day === todayStr ? 1 : 0.7}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary */}
      <div className="mt-4 grid grid-cols-3 gap-4 rounded-xl bg-white/5 p-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{summary.workouts}</p>
          <p className="text-xs text-muted-foreground">Workouts</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-accent">{summary.calories}</p>
          <p className="text-xs text-muted-foreground">Calories</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{summary.totalTime}</p>
          <p className="text-xs text-muted-foreground">Total Time</p>
        </div>
      </div>
    </motion.div>
  )
}
