'use client'

import { motion } from 'framer-motion'
import type { OnboardingData } from '@/app/(app)/onboarding/page'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

interface GoalsStepProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
}

const goals = [
  { 
    value: 'bulk', 
    label: 'Build Muscle', 
    description: 'Gain size and strength',
    icon: '💪',
    color: 'from-blue-500 to-blue-600'
  },
  { 
    value: 'cut', 
    label: 'Lose Fat', 
    description: 'Get leaner while preserving muscle',
    icon: '🔥',
    color: 'from-orange-500 to-red-500'
  },
  { 
    value: 'recomp', 
    label: 'Body Recomposition', 
    description: 'Lose fat and build muscle simultaneously',
    icon: '⚡',
    color: 'from-primary to-secondary'
  },
  { 
    value: 'strength', 
    label: 'Strength & Power', 
    description: 'Focus on maximal strength gains',
    icon: '🏋️',
    color: 'from-yellow-500 to-orange-500'
  },
  { 
    value: 'general', 
    label: 'General Fitness', 
    description: 'Overall health and wellness',
    icon: '❤️',
    color: 'from-green-500 to-emerald-500'
  },
  { 
    value: 'athletic', 
    label: 'Athletic Performance', 
    description: 'Sport-specific training',
    icon: '🏆',
    color: 'from-accent to-cyan-400'
  },
]

const timelines = [
  { value: '1month', label: '1 Month', description: 'Quick sprint' },
  { value: '3months', label: '3 Months', description: 'Standard program' },
  { value: '6months', label: '6 Months', description: 'Solid transformation' },
  { value: '1year', label: '1 Year', description: 'Long-term commitment' },
  { value: 'no-rush', label: 'No Rush', description: 'Lifestyle change' },
]

export function GoalsStep({ data, updateData }: GoalsStepProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-[family-name:var(--font-syne)] font-bold text-3xl text-foreground mb-2">
          What&apos;s your main goal?
        </h2>
        <p className="text-foreground-secondary">
          We&apos;ll optimize your entire program around this objective.
        </p>
      </div>

      <div className="space-y-8">
        {/* Primary Goal */}
        <div className="space-y-3">
          <Label className="text-base">Primary Goal</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {goals.map((goal) => (
              <motion.button
                key={goal.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateData({ primaryGoal: goal.value })}
                className={`p-4 rounded-xl border transition-all text-left ${
                  data.primaryGoal === goal.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-muted/30 hover:border-primary/50'
                }`}
              >
                <span className="text-3xl mb-2 block">{goal.icon}</span>
                <span className={`font-medium block ${
                  data.primaryGoal === goal.value ? 'text-primary' : 'text-foreground'
                }`}>
                  {goal.label}
                </span>
                <span className="text-xs text-foreground-muted">{goal.description}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-3">
          <Label className="text-base">When do you want to achieve this?</Label>
          <div className="flex flex-wrap gap-2">
            {timelines.map((timeline) => (
              <motion.button
                key={timeline.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => updateData({ timeline: timeline.value })}
                className={`px-4 py-3 rounded-xl border text-sm transition-all ${
                  data.timeline === timeline.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-muted/30 hover:border-primary/50'
                }`}
              >
                <span className={`font-medium block ${
                  data.timeline === timeline.value ? 'text-primary' : 'text-foreground'
                }`}>
                  {timeline.label}
                </span>
                <span className="text-xs text-foreground-muted">{timeline.description}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Commitment Level */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base">How committed are you?</Label>
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-lg text-primary">
              {data.commitment}/10
            </span>
          </div>
          <Slider
            value={[data.commitment]}
            onValueChange={([value]) => updateData({ commitment: value })}
            min={1}
            max={10}
            step={1}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-foreground-muted">
            <span>Casual</span>
            <span>Moderate</span>
            <span>All in</span>
          </div>
          
          {/* Commitment feedback */}
          <div className="p-3 rounded-lg bg-muted/30 border border-border text-sm text-foreground-secondary">
            {data.commitment <= 3 && "We'll start with a manageable routine that fits easily into your life."}
            {data.commitment > 3 && data.commitment <= 6 && "Great balance! We'll challenge you while keeping it sustainable."}
            {data.commitment > 6 && data.commitment <= 8 && "Solid commitment! Expect significant results with this dedication."}
            {data.commitment > 8 && "Maximum intensity unlocked! We'll push you to your limits."}
          </div>
        </div>
      </div>
    </div>
  )
}
