'use client'

import { motion } from 'framer-motion'
import type { OnboardingData } from '@/app/(app)/onboarding/page'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface DietStepProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
}

const dietTypes = [
  { value: 'non-veg', label: 'Non-vegetarian', icon: '🍖' },
  { value: 'vegetarian', label: 'Vegetarian', icon: '🥗' },
  { value: 'vegan', label: 'Vegan', icon: '🌱' },
  { value: 'pescatarian', label: 'Pescatarian', icon: '🐟' },
  { value: 'keto', label: 'Keto', icon: '🥑' },
  { value: 'other', label: 'Other', icon: '🍽️' },
]

const allergies = [
  'None',
  'Dairy',
  'Gluten',
  'Nuts',
  'Eggs',
  'Soy',
  'Shellfish',
  'Fish',
]

const budgetOptions = [
  { value: 'tight', label: 'Budget-friendly', description: 'Under ₹800/meal' },
  { value: 'moderate', label: 'Moderate', description: '₹800-1,600/meal' },
  { value: 'flexible', label: 'Flexible', description: '₹1,600+/meal' },
  { value: 'no-limit', label: 'No limit', description: 'Quality over cost' },
]

const cuisines = [
  'Indian',
  'Continental',
  'Mediterranean',
  'Asian',
  'Mexican',
  'Middle Eastern',
  'Japanese',
  'Any',
]

export function DietStep({ data, updateData }: DietStepProps) {
  const toggleAllergy = (allergy: string) => {
    if (allergy === 'None') {
      updateData({ allergies: ['None'] })
    } else {
      const filtered = data.allergies.filter(a => a !== 'None')
      if (filtered.includes(allergy)) {
        updateData({ allergies: filtered.filter(a => a !== allergy) })
      } else {
        updateData({ allergies: [...filtered, allergy] })
      }
    }
  }

  const toggleCuisine = (cuisine: string) => {
    if (cuisine === 'Any') {
      updateData({ cuisinePreferences: ['Any'] })
    } else {
      const filtered = data.cuisinePreferences.filter(c => c !== 'Any')
      if (filtered.includes(cuisine)) {
        updateData({ cuisinePreferences: filtered.filter(c => c !== cuisine) })
      } else {
        updateData({ cuisinePreferences: [...filtered, cuisine] })
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-[family-name:var(--font-syne)] font-bold text-3xl text-foreground mb-2">
          Diet preferences
        </h2>
        <p className="text-foreground-secondary">
          We&apos;ll create meal plans that match your taste and values.
        </p>
      </div>

      <div className="space-y-8">
        {/* Diet Type */}
        <div className="space-y-3">
          <Label className="text-base">What&apos;s your diet type?</Label>
          <div className="grid grid-cols-3 gap-3">
            {dietTypes.map((diet) => (
              <motion.button
                key={diet.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateData({ dietType: diet.value })}
                className={`p-4 rounded-xl border transition-all text-center ${
                  data.dietType === diet.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-muted/30 hover:border-primary/50'
                }`}
              >
                <span className="text-2xl mb-1 block">{diet.icon}</span>
                <span className={`text-sm font-medium ${
                  data.dietType === diet.value ? 'text-primary' : 'text-foreground'
                }`}>
                  {diet.label}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Allergies */}
        <div className="space-y-3">
          <Label className="text-base">Any food allergies?</Label>
          <div className="flex flex-wrap gap-2">
            {allergies.map((allergy) => (
              <motion.button
                key={allergy}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleAllergy(allergy)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                  data.allergies.includes(allergy)
                    ? allergy === 'None'
                      ? 'border-success bg-success/10 text-success'
                      : 'border-warning bg-warning/10 text-warning'
                    : 'border-border bg-muted/30 text-foreground-secondary hover:border-primary/50'
                }`}
              >
                {allergy}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Cultural/Religious Restrictions */}
        <div className="space-y-3">
          <Label htmlFor="cultural" className="text-base">Cultural or religious dietary restrictions</Label>
          <Input
            id="cultural"
            placeholder="e.g., No beef, No pork, No non-veg on certain days"
            value={data.culturalRestrictions}
            onChange={(e) => updateData({ culturalRestrictions: e.target.value })}
            className="h-12"
          />
          <p className="text-xs text-foreground-muted">
            We respect all dietary needs and will customize your meal plan accordingly.
          </p>
        </div>

        {/* Budget */}
        <div className="space-y-3">
          <Label className="text-base">Meal budget</Label>
          <div className="grid grid-cols-2 gap-3">
            {budgetOptions.map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateData({ budget: option.value })}
                className={`p-4 rounded-xl border transition-all text-left ${
                  data.budget === option.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-muted/30 hover:border-primary/50'
                }`}
              >
                <span className={`font-medium block ${
                  data.budget === option.value ? 'text-primary' : 'text-foreground'
                }`}>
                  {option.label}
                </span>
                <span className="text-xs text-foreground-muted">{option.description}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Cuisine Preferences */}
        <div className="space-y-3">
          <Label className="text-base">Preferred cuisines</Label>
          <div className="flex flex-wrap gap-2">
            {cuisines.map((cuisine) => (
              <motion.button
                key={cuisine}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleCuisine(cuisine)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                  data.cuisinePreferences.includes(cuisine)
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-muted/30 text-foreground-secondary hover:border-primary/50'
                }`}
              >
                {cuisine}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
