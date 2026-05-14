'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import type { OnboardingData } from '@/app/(app)/onboarding/page'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { calculateNutritionTargets } from '@/lib/fitness-calculations'

interface MacrosStepProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
}

const calorieTargets = [
  { value: 'aggressive-cut', label: 'Aggressive Cut', offset: -500, description: 'Fast fat loss' },
  { value: 'moderate-cut', label: 'Moderate Cut', offset: -250, description: 'Steady fat loss' },
  { value: 'maintenance', label: 'Maintenance', offset: 0, description: 'Maintain weight' },
  { value: 'moderate-bulk', label: 'Moderate Bulk', offset: 250, description: 'Lean gains' },
  { value: 'aggressive-bulk', label: 'Aggressive Bulk', offset: 500, description: 'Maximum growth' },
]

const macroPreferences = [
  { value: 'standard', label: 'Standard', description: '30P / 40C / 30F' },
  { value: 'high-protein', label: 'High Protein', description: '40P / 35C / 25F' },
  { value: 'low-carb', label: 'Low Carb', description: '35P / 25C / 40F' },
  { value: 'high-carb', label: 'High Carb', description: '25P / 55C / 20F' },
  { value: 'balanced', label: 'Balanced', description: '33P / 34C / 33F' },
]

export function MacrosStep({ data, updateData }: MacrosStepProps) {
  const nutrition = useMemo(() => {
    return calculateNutritionTargets(data)
  }, [data])

  const tdee = useMemo(() => {
    // Re-calculate BMR and TDEE without goal adjustment to show baseline expenditure
    let bmr: number
    if (data.gender === 'female') {
      bmr = 10 * (data.weightKg || 70) + 6.25 * (data.heightCm || 170) - 5 * (data.age || 30) - 161
    } else {
      bmr = 10 * (data.weightKg || 70) + 6.25 * (data.heightCm || 170) - 5 * (data.age || 30) + 5
    }

    const activityMultipliers: Record<string, number> = {
      'sedentary': 1.2,
      'lightly-active': 1.375,
      'moderately-active': 1.55,
      'very-active': 1.725,
      'athlete': 1.9,
    }

    const multiplier = activityMultipliers[data.activityLevel] || 1.2
    return Math.round(bmr * multiplier)
  }, [data.gender, data.weightKg, data.heightCm, data.age, data.activityLevel])

  const targetCalories = nutrition.calories
  const macros = {
    protein: nutrition.protein,
    carbs: nutrition.carbs,
    fats: nutrition.fats,
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-[family-name:var(--font-syne)] font-bold text-3xl text-foreground mb-2">
          Calorie & macro goals
        </h2>
        <p className="text-foreground-secondary">
          We&apos;ve calculated your needs. Fine-tune if you&apos;d like.
        </p>
      </div>

      <div className="space-y-8">
        {/* TDEE Display */}
        <div className="glass rounded-2xl p-6 text-center">
          <p className="text-foreground-secondary mb-2">Your estimated daily energy expenditure</p>
          <p className="font-[family-name:var(--font-syne)] font-bold text-5xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {tdee.toLocaleString()}
          </p>
          <p className="text-foreground-muted text-sm mt-1">calories/day (TDEE)</p>
        </div>

        {/* Calorie Target */}
        <div className="space-y-3">
          <Label className="text-base">Caloric target</Label>
          <div className="space-y-2">
            {calorieTargets.map((target) => (
              <motion.button
                key={target.value}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => updateData({ calorieTarget: target.value })}
                className={`w-full p-4 rounded-xl border transition-all flex items-center justify-between ${data.calorieTarget === target.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-muted/30 hover:border-primary/50'
                  }`}
              >
                <div className="text-left">
                  <span className={`font-medium ${data.calorieTarget === target.value ? 'text-primary' : 'text-foreground'
                    }`}>
                    {target.label}
                  </span>
                  <span className="text-sm text-foreground-muted ml-2">— {target.description}</span>
                </div>
                <span className={`font-[family-name:var(--font-jetbrains-mono)] ${target.offset > 0 ? 'text-success' : target.offset < 0 ? 'text-warning' : 'text-foreground-muted'
                  }`}>
                  {target.offset > 0 ? '+' : ''}{target.offset} kcal
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Target Calories Display */}
        <div className="p-4 rounded-xl bg-muted/30 border border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-foreground-secondary">Your daily target</span>
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-2xl text-primary font-bold">
              {targetCalories.toLocaleString()} kcal
            </span>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 text-center p-2 rounded-lg bg-blue-500/10">
              <span className="block text-xs text-blue-400">Protein</span>
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-blue-400 font-medium">{macros.protein}g</span>
            </div>
            <div className="flex-1 text-center p-2 rounded-lg bg-orange-500/10">
              <span className="block text-xs text-orange-400">Carbs</span>
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-orange-400 font-medium">{macros.carbs}g</span>
            </div>
            <div className="flex-1 text-center p-2 rounded-lg bg-green-500/10">
              <span className="block text-xs text-green-400">Fats</span>
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-green-400 font-medium">{macros.fats}g</span>
            </div>
          </div>
        </div>

        {/* Macro Preference */}
        <div className="space-y-3">
          <Label className="text-base">Macro distribution preference</Label>
          <div className="flex flex-wrap gap-2">
            {macroPreferences.map((pref) => (
              <motion.button
                key={pref.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => updateData({ macroPreference: pref.value })}
                className={`px-4 py-3 rounded-xl border text-sm transition-all ${data.macroPreference === pref.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-muted/30 hover:border-primary/50'
                  }`}
              >
                <span className={`font-medium block ${data.macroPreference === pref.value ? 'text-primary' : 'text-foreground'
                  }`}>
                  {pref.label}
                </span>
                <span className="text-xs text-foreground-muted">{pref.description}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Meals Per Day */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base">Meals per day</Label>
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-lg text-primary">
              {data.mealsPerDay} meals
            </span>
          </div>
          <Slider
            value={[data.mealsPerDay]}
            onValueChange={([value]) => updateData({ mealsPerDay: value })}
            min={2}
            max={6}
            step={1}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-foreground-muted">
            <span>2 meals</span>
            <span>4 meals</span>
            <span>6 meals</span>
          </div>
        </div>
      </div>
    </div>
  )
}
