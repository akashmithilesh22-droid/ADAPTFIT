"use client"

import { motion } from "framer-motion"
import { Calendar, Clock, ChevronRight, Dumbbell, Heart, Zap } from "lucide-react"
import Link from "next/link"

interface UpcomingScheduleProps {
  upcomingWorkouts: {
    id: number
    name: string
    day: string
    time: string
    duration: string
    type: string
  }[]
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "strength":
      return "from-primary/20 to-primary/10 text-primary"
    case "cardio":
      return "from-orange-500/20 to-orange-500/10 text-orange-500"
    case "recovery":
      return "from-green-500/20 to-green-500/10 text-green-500"
    default:
      return "from-primary/20 to-primary/10 text-primary"
  }
}

const getIcon = (type: string) => {
  switch (type) {
    case 'strength':
      return Dumbbell
    case 'cardio':
      return Zap
    case 'recovery':
      return Heart
    default:
      return Dumbbell
  }
}

export function UpcomingSchedule({ upcomingWorkouts }: UpcomingScheduleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="glass-card overflow-hidden rounded-2xl p-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Upcoming Workouts</h3>
        </div>
        <Link
          href="/schedule"
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          View All
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-4 space-y-3">
        {upcomingWorkouts.map((workout, index) => (
          <motion.div
            key={workout.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
            className="group flex items-center gap-4 rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10"
          >
            <div
              className={`rounded-xl bg-gradient-to-br p-3 ${getTypeColor(workout.type)}`}
            >
              {(() => {
                const Icon = getIcon(workout.type)
                return <Icon className="h-5 w-5" />
              })()}
            </div>

            <div className="flex-1">
              <p className="font-medium group-hover:text-primary transition-colors">
                {workout.name}
              </p>
              <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                <span>{workout.day}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {workout.time}
                </span>
                <span>{workout.duration}</span>
              </div>
            </div>

            <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
