'use client'

import { motion } from 'framer-motion'
import type { OnboardingData } from '@/app/(app)/onboarding/page'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Sun, Sunset, Moon, Clock } from 'lucide-react'

interface ScheduleStepProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
}

const weekDays = [
  { value: 'mon', label: 'Mon' },
  { value: 'tue', label: 'Tue' },
  { value: 'wed', label: 'Wed' },
  { value: 'thu', label: 'Thu' },
  { value: 'fri', label: 'Fri' },
  { value: 'sat', label: 'Sat' },
  { value: 'sun', label: 'Sun' },
]

const workoutTimes = [
  { value: 'morning', label: 'Morning', description: '6am - 10am', Icon: Sun },
  { value: 'afternoon', label: 'Afternoon', description: '11am - 4pm', Icon: Sunset },
  { value: 'evening', label: 'Evening', description: '5pm - 9pm', Icon: Moon },
  { value: 'flexible', label: 'Flexible', description: 'Varies day to day', Icon: Clock },
]

const activityLevels = [
  { value: 'sedentary', label: 'Sedentary', description: 'Desk job, minimal movement' },
  { value: 'lightly-active', label: 'Lightly Active', description: 'Light walking, standing job' },
  { value: 'moderately-active', label: 'Moderately Active', description: 'Regular movement, some exercise' },
  { value: 'very-active', label: 'Very Active', description: 'Active job, daily exercise' },
  { value: 'athlete', label: 'Athlete', description: 'Training multiple times daily' },
]

export function ScheduleStep({ data, updateData }: ScheduleStepProps) {
  const toggleDay = (day: string) => {
    if (data.workoutDays.includes(day)) {
      updateData({ workoutDays: data.workoutDays.filter(d => d !== day) })
    } else {
      updateData({ workoutDays: [...data.workoutDays, day] })
    }
  }

  const getSplitRecommendation = () => {
    const days = data.workoutDays.length
    if (days <= 2) return 'Full Body routine recommended'
    if (days === 3) return 'Full Body or Push/Pull/Legs'
    if (days === 4) return 'Upper/Lower split recommended'
    if (days === 5) return 'PPL or Upper/Lower + Full Body'
    return 'PPL+ or Advanced split'
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-[family-name:var(--font-syne)] font-bold text-3xl text-foreground mb-2">
          Your schedule & lifestyle
        </h2>
        <p className="text-foreground-secondary">
          We&apos;ll design a program that fits perfectly into your week.
        </p>
      </div>

      <div className="space-y-8">
        {/* Workout Days */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base">Which days can you work out?</Label>
            <span className="text-sm text-foreground-muted">
              {data.workoutDays.length} days selected
            </span>
          </div>
          <div className="flex gap-2">
            {weekDays.map((day) => (
              <motion.button
                key={day.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleDay(day.value)}
                className={`flex-1 py-4 rounded-xl border text-center font-medium transition-all ${
                  data.workoutDays.includes(day.value)
                    ? 'border-primary bg-primary/20 text-primary'
                    : 'border-border bg-muted/30 text-foreground-muted hover:border-primary/50'
                }`}
              >
                {day.label}
              </motion.button>
            ))}
          </div>
          
          {data.workoutDays.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-sm text-primary"
            >
              {getSplitRecommendation()}
            </motion.div>
          )}
        </div>

        {/* Workout Duration */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base">How long can you train per session?</Label>
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-lg text-primary">
              {data.workoutDuration} min
            </span>
          </div>
          <Slider
            value={[data.workoutDuration]}
            onValueChange={([value]) => updateData({ workoutDuration: value })}
            min={20}
            max={120}
            step={5}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-foreground-muted">
            <span>20 min</span>
            <span>60 min</span>
            <span>120 min</span>
          </div>
        </div>

        {/* Preferred Time */}
        <div className="space-y-3">
          <Label className="text-base">When do you prefer to work out?</Label>
          <div className="grid grid-cols-2 gap-3">
            {workoutTimes.map((time) => (
              <motion.button
                key={time.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateData({ workoutTime: time.value })}
                className={`p-4 rounded-xl border transition-all flex items-center gap-3 ${
                  data.workoutTime === time.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-muted/30 hover:border-primary/50'
                }`}
              >
                <time.Icon className={`w-5 h-5 ${
                  data.workoutTime === time.value ? 'text-primary' : 'text-foreground-muted'
                }`} />
                <div className="text-left">
                  <span className={`font-medium block ${
                    data.workoutTime === time.value ? 'text-primary' : 'text-foreground'
                  }`}>
                    {time.label}
                  </span>
                  <span className="text-xs text-foreground-muted">{time.description}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Activity Level */}
        <div className="space-y-3">
          <Label className="text-base">Activity level outside the gym</Label>
          <div className="space-y-2">
            {activityLevels.map((level) => (
              <motion.button
                key={level.value}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => updateData({ activityLevel: level.value })}
                className={`w-full p-4 rounded-xl border transition-all text-left ${
                  data.activityLevel === level.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-muted/30 hover:border-primary/50'
                }`}
              >
                <span className={`font-medium ${
                  data.activityLevel === level.value ? 'text-primary' : 'text-foreground'
                }`}>
                  {level.label}
                </span>
                <span className="text-sm text-foreground-muted ml-2">— {level.description}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
