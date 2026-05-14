'use client'

import { motion } from 'framer-motion'
import type { OnboardingData } from '@/app/(app)/onboarding/page'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

interface BodyMetricsStepProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
}

const genderOptions = [
  { value: 'male', label: 'Male', icon: '♂' },
  { value: 'female', label: 'Female', icon: '♀' },
  { value: 'non-binary', label: 'Non-binary', icon: '⚧' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say', icon: '—' },
]

const bodyFatRanges = [
  { min: 3, max: 8, label: 'Essential', description: 'Competition level' },
  { min: 9, max: 15, label: 'Athletic', description: 'Very fit' },
  { min: 16, max: 24, label: 'Fitness', description: 'Active lifestyle' },
  { min: 25, max: 31, label: 'Average', description: 'Healthy range' },
  { min: 32, max: 45, label: 'Above average', description: 'Room to improve' },
]

export function BodyMetricsStep({ data, updateData }: BodyMetricsStepProps) {
  const getBodyFatCategory = (pct: number) => {
    return bodyFatRanges.find(r => pct >= r.min && pct <= r.max) || bodyFatRanges[2]
  }

  const currentCategory = getBodyFatCategory(data.bodyFatPct)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-[family-name:var(--font-syne)] font-bold text-3xl text-foreground mb-2">
          Tell us about your body
        </h2>
        <p className="text-foreground-secondary">
          This helps us calculate your ideal calorie intake and training volume.
        </p>
      </div>

      <div className="space-y-8">
        {/* Age */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base">Age</Label>
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-lg text-primary">
              {data.age} years
            </span>
          </div>
          <Slider
            value={[data.age]}
            onValueChange={([value]) => updateData({ age: value })}
            min={16}
            max={80}
            step={1}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-foreground-muted">
            <span>16</span>
            <span>80</span>
          </div>
        </div>

        {/* Gender */}
        <div className="space-y-3">
          <Label className="text-base">Gender</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {genderOptions.map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateData({ gender: option.value })}
                className={`p-4 rounded-xl border transition-all text-left ${
                  data.gender === option.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-muted/30 hover:border-primary/50'
                }`}
              >
                <span className="text-2xl mb-2 block">{option.icon}</span>
                <span className={`text-sm font-medium ${
                  data.gender === option.value ? 'text-primary' : 'text-foreground'
                }`}>
                  {option.label}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Height */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base">Height</Label>
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-lg text-primary">
              {data.heightCm} cm
              <span className="text-foreground-muted text-sm ml-2">
                ({Math.floor(data.heightCm / 30.48)}&apos;{Math.round((data.heightCm % 30.48) / 2.54)}&quot;)
              </span>
            </span>
          </div>
          <Slider
            value={[data.heightCm]}
            onValueChange={([value]) => updateData({ heightCm: value })}
            min={140}
            max={220}
            step={1}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-foreground-muted">
            <span>140 cm</span>
            <span>220 cm</span>
          </div>
        </div>

        {/* Weight */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base">Weight</Label>
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-lg text-primary">
              {data.weightKg} kg
              <span className="text-foreground-muted text-sm ml-2">
                ({Math.round(data.weightKg * 2.205)} lbs)
              </span>
            </span>
          </div>
          <Slider
            value={[data.weightKg]}
            onValueChange={([value]) => updateData({ weightKg: value })}
            min={40}
            max={180}
            step={0.5}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-foreground-muted">
            <span>40 kg</span>
            <span>180 kg</span>
          </div>
        </div>

        {/* Body Fat */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base">Estimated Body Fat %</Label>
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-lg text-primary">
              {data.bodyFatPct}%
            </span>
          </div>
          <Slider
            value={[data.bodyFatPct]}
            onValueChange={([value]) => updateData({ bodyFatPct: value })}
            min={5}
            max={45}
            step={1}
            className="py-2"
          />
          
          {/* Body fat visual indicator */}
          <div className="p-4 rounded-xl bg-muted/30 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-foreground">{currentCategory.label}</span>
              <span className="text-sm text-foreground-muted">{currentCategory.description}</span>
            </div>
            <div className="flex gap-1">
              {bodyFatRanges.map((range, index) => (
                <div
                  key={range.label}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    data.bodyFatPct >= range.min && data.bodyFatPct <= range.max
                      ? index <= 1 ? 'bg-success' : index <= 3 ? 'bg-primary' : 'bg-warning'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
