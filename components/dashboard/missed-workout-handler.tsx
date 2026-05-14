'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScheduleAdapter } from '@/lib/services/schedule-adapter'
import { Workout, WeeklySchedule } from '@/types'

interface MissedWorkoutHandlerProps {
  missedWorkout: Workout
  weeklySchedule: WeeklySchedule
  currentDay: number
  onScheduleUpdate: (newSchedule: WeeklySchedule) => void
}

export function MissedWorkoutHandler({
  missedWorkout,
  weeklySchedule,
  currentDay,
  onScheduleUpdate,
}: MissedWorkoutHandlerProps) {
  const [handlingMethod, setHandlingMethod] = useState<'integrate' | 'reschedule' | 'skip' | null>(null)
  const [showSuggestion, setShowSuggestion] = useState(true)

  // Generate adapted schedule
  const adaptedSchedule = ScheduleAdapter.adaptScheduleForMissedWorkout(
    weeklySchedule,
    missedWorkout.id,
    currentDay
  )

  const handleIntegrate = () => {
    onScheduleUpdate(adaptedSchedule)
    setShowSuggestion(false)
  }

  const handleSkip = () => {
    // Skip this workout in weekly schedule
    const updated = {
      ...weeklySchedule,
      workouts: weeklySchedule.workouts.filter(w => w.id !== missedWorkout.id),
    }
    onScheduleUpdate(updated)
    setShowSuggestion(false)
  }

  const handleReschedule = () => {
    // User chooses to reschedule manually
    setHandlingMethod('reschedule')
  }

  if (!showSuggestion) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-6"
    >
      <Card className="p-6 border-orange-500/50 bg-orange-500/5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground">Missed Workout Detected</h3>
            <p className="text-sm text-foreground-secondary mt-1">
              You missed <span className="font-semibold text-foreground">{missedWorkout.name}</span>
            </p>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-4">
          {/* Option 1: Integrate */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleIntegrate}
            className="w-full p-4 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg hover:border-primary/50 transition-all text-left"
          >
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-sm">Integrate with Next Workout</div>
                <div className="text-xs text-foreground-secondary mt-1">
                  Add key exercises from {missedWorkout.name} to your next session
                </div>
              </div>
            </div>
          </motion.button>

          {/* Option 2: Reschedule */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleReschedule}
            className="w-full p-4 bg-gradient-to-r from-blue-500/10 to-blue-400/10 border border-blue-500/20 rounded-lg hover:border-blue-500/50 transition-all text-left"
          >
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-sm">Reschedule for Later</div>
                <div className="text-xs text-foreground-secondary mt-1">
                  Pick a different day this week to complete {missedWorkout.name}
                </div>
              </div>
            </div>
          </motion.button>

          {/* Option 3: Skip */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSkip}
            className="w-full p-4 bg-muted border border-border rounded-lg hover:border-foreground/20 transition-all text-left"
          >
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-foreground-secondary flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-sm">Skip This Week</div>
                <div className="text-xs text-foreground-secondary mt-1">
                  Remove {missedWorkout.name} from this week's schedule
                </div>
              </div>
            </div>
          </motion.button>
        </div>

        {/* AI Insight */}
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded text-sm text-foreground-secondary">
          <span className="text-blue-500 font-semibold">💡 AI Tip:</span> We recommend integrating this workout to maintain your training stimulus. Your schedule has been automatically adjusted to prevent overtraining.
        </div>
      </Card>
    </motion.div>
  )
}
