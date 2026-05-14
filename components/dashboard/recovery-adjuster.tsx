'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, CheckCircle2, Zap, Heart, Moon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { FatigueAdjuster } from '@/lib/services/fatigue-adjuster'
import { Workout } from '@/types'

interface RecoveryAdjusterProps {
  currentWorkout: Workout
  onWorkoutAdjusted: (adjustedWorkout: Workout) => void
}

export function RecoveryAdjuster({ currentWorkout, onWorkoutAdjusted }: RecoveryAdjusterProps) {
  const [fatigueLevel, setFatigueLevel] = useState(5)
  const [fatigueReasons, setFatigueReasons] = useState<string[]>([])
  const [open, setOpen] = useState(false)

  const fatigueOptions = [
    { value: 'poor-sleep', label: 'Poor Sleep', icon: Moon },
    { value: 'high-stress', label: 'High Stress', icon: Heart },
    { value: 'soreness', label: 'Soreness', icon: AlertTriangle },
    { value: 'illness', label: 'Illness', icon: Zap },
  ]

  const handleFatigueReasonToggle = (reason: string) => {
    setFatigueReasons(prev =>
      prev.includes(reason)
        ? prev.filter(r => r !== reason)
        : [...prev, reason]
    )
  }

  const handleApplyAdjustment = () => {
    const adjustedWorkout = FatigueAdjuster.adjustWorkoutForFatigue(
      currentWorkout,
      fatigueLevel,
      fatigueReasons
    )
    onWorkoutAdjusted(adjustedWorkout)
    setOpen(false)
  }

  const shouldTakeRest = FatigueAdjuster.shouldTakeRestDay(fatigueLevel, 0, 7, 5).shouldRest

  const recommendations = FatigueAdjuster.getRecoveryRecommendations(fatigueLevel, fatigueReasons)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full gap-2">
          <Heart className="w-4 h-4" />
          Check Recovery Status
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Recovery Check-in</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Fatigue Level Slider */}
          <div>
            <label className="text-sm font-semibold mb-3 block">How fatigued are you? (1-10)</label>
            <div className="space-y-3">
              <Slider
                value={[fatigueLevel]}
                onValueChange={(value) => setFatigueLevel(value[0])}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-foreground-secondary">
                <span>Fresh 💪</span>
                <span className="font-semibold text-foreground">{fatigueLevel}/10</span>
                <span>Exhausted 😴</span>
              </div>
            </div>

            {/* Fatigue Color Indicator */}
            <div className="mt-3 h-2 rounded-full bg-gradient-to-r from-green-500 via-orange-500 to-red-500" />
          </div>

          {/* Fatigue Reasons */}
          <div>
            <label className="text-sm font-semibold mb-3 block">Why are you fatigued?</label>
            <div className="grid grid-cols-2 gap-2">
              {fatigueOptions.map(({ value, label, icon: IconComponent }) => (
                <button
                  key={value}
                  onClick={() => handleFatigueReasonToggle(value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    fatigueReasons.includes(value)
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-foreground/20'
                  }`}
                >
                  <IconComponent className="w-4 h-4 mb-1 mx-auto" />
                  <div className="text-xs font-medium">{label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Alert */}
          <AnimatePresence>
            {shouldTakeRest && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-red-600">Rest Day Recommended</div>
                    <div className="text-xs text-foreground-secondary mt-1">
                      Your recovery metrics suggest taking a rest day would be beneficial.
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <Card className="p-3 bg-blue-500/5 border-blue-500/20">
              <div className="text-sm font-semibold text-blue-600 mb-2">Recommendations</div>
              <ul className="space-y-1 text-xs text-foreground-secondary">
                {recommendations.slice(0, 3).map((rec, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-blue-500">✓</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {shouldTakeRest ? (
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1 gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Take Rest Day
              </Button>
            ) : (
              <Button
                onClick={handleApplyAdjustment}
                className="flex-1 gap-2 bg-gradient-to-r from-primary to-secondary"
              >
                <Zap className="w-4 h-4" />
                Adjust Workout
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Proceed As Planned
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
