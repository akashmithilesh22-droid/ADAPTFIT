'use client'

import { motion } from 'framer-motion'
import type { OnboardingData } from '@/app/(app)/onboarding/page'
import { Label } from '@/components/ui/label'
import { Dumbbell, Home, TreePine, Building2 } from 'lucide-react'

interface FitnessBackgroundStepProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
}

const experienceLevels = [
  { 
    value: 'beginner', 
    label: 'Beginner', 
    description: 'Less than 6 months of consistent training',
    icon: '🌱'
  },
  { 
    value: 'intermediate', 
    label: 'Intermediate', 
    description: '6 months to 2 years of training',
    icon: '💪'
  },
  { 
    value: 'advanced', 
    label: 'Advanced', 
    description: '2-5 years of serious training',
    icon: '🔥'
  },
  { 
    value: 'elite', 
    label: 'Elite', 
    description: '5+ years, competition experience',
    icon: '🏆'
  },
]

const injuries = [
  'No injuries',
  'Lower back',
  'Knee',
  'Shoulder',
  'Hip',
  'Wrist',
  'Ankle',
  'Neck',
  'Other',
]

const gymAccessOptions = [
  { 
    value: 'full-gym', 
    label: 'Full Commercial Gym', 
    description: 'Full equipment access',
    Icon: Building2 
  },
  { 
    value: 'home-gym', 
    label: 'Home Gym', 
    description: 'Dumbbells, bench, some machines',
    Icon: Home 
  },
  { 
    value: 'bodyweight', 
    label: 'Bodyweight Only', 
    description: 'No equipment needed',
    Icon: Dumbbell 
  },
  { 
    value: 'outdoor', 
    label: 'Outdoor / Minimal', 
    description: 'Park, pull-up bars, basics',
    Icon: TreePine 
  },
]

export function FitnessBackgroundStep({ data, updateData }: FitnessBackgroundStepProps) {
  const toggleInjury = (injury: string) => {
    if (injury === 'No injuries') {
      updateData({ injuries: ['No injuries'] })
    } else {
      const filtered = data.injuries.filter(i => i !== 'No injuries')
      if (filtered.includes(injury)) {
        updateData({ injuries: filtered.filter(i => i !== injury) })
      } else {
        updateData({ injuries: [...filtered, injury] })
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-[family-name:var(--font-syne)] font-bold text-3xl text-foreground mb-2">
          Your fitness background
        </h2>
        <p className="text-foreground-secondary">
          This helps us calibrate the intensity and complexity of your program.
        </p>
      </div>

      <div className="space-y-8">
        {/* Experience Level */}
        <div className="space-y-3">
          <Label className="text-base">Training Experience</Label>
          <div className="grid grid-cols-2 gap-3">
            {experienceLevels.map((level) => (
              <motion.button
                key={level.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateData({ fitnessExperience: level.value })}
                className={`p-4 rounded-xl border transition-all text-left ${
                  data.fitnessExperience === level.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-muted/30 hover:border-primary/50'
                }`}
              >
                <span className="text-2xl mb-2 block">{level.icon}</span>
                <span className={`font-medium block ${
                  data.fitnessExperience === level.value ? 'text-primary' : 'text-foreground'
                }`}>
                  {level.label}
                </span>
                <span className="text-xs text-foreground-muted">{level.description}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Injuries/Limitations */}
        <div className="space-y-3">
          <Label className="text-base">Any injuries or limitations?</Label>
          <div className="flex flex-wrap gap-2">
            {injuries.map((injury) => (
              <motion.button
                key={injury}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleInjury(injury)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                  data.injuries.includes(injury)
                    ? injury === 'No injuries' 
                      ? 'border-success bg-success/10 text-success'
                      : 'border-warning bg-warning/10 text-warning'
                    : 'border-border bg-muted/30 text-foreground-secondary hover:border-primary/50'
                }`}
              >
                {injury}
              </motion.button>
            ))}
          </div>
          <p className="text-xs text-foreground-muted">
            We&apos;ll avoid exercises that may aggravate these areas.
          </p>
        </div>

        {/* Gym Access */}
        <div className="space-y-3">
          <Label className="text-base">What equipment do you have access to?</Label>
          <div className="grid grid-cols-2 gap-3">
            {gymAccessOptions.map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateData({ gymAccess: option.value })}
                className={`p-4 rounded-xl border transition-all text-left ${
                  data.gymAccess === option.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-muted/30 hover:border-primary/50'
                }`}
              >
                <option.Icon className={`w-6 h-6 mb-2 ${
                  data.gymAccess === option.value ? 'text-primary' : 'text-foreground-muted'
                }`} />
                <span className={`font-medium block ${
                  data.gymAccess === option.value ? 'text-primary' : 'text-foreground'
                }`}>
                  {option.label}
                </span>
                <span className="text-xs text-foreground-muted">{option.description}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
