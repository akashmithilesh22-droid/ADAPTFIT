import type { OnboardingData } from '@/app/(app)/onboarding/page'

/**
 * Mifflin-St Jeor Equation for BMR calculation
 * More accurate for modern populations than Harris-Benedict
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female'
): number {
  if (gender === 'male') {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5
  }
  return 10 * weightKg + 6.25 * heightCm - 5 * age - 161
}

/**
 * Activity multipliers for TDEE calculation
 */
const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  'sedentary': 1.2,           // Little or no exercise
  'lightly-active': 1.375,    // 1-3 days/week
  'moderately-active': 1.55,  // 3-5 days/week
  'very-active': 1.725,       // 6-7 days/week
  'athlete': 1.9,             // Heavy training / twice per day
}

/**
 * Calculate Total Daily Energy Expenditure
 */
export function calculateTDEE(
  bmr: number,
  activityLevel: string
): number {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] ?? 1.55
  return Math.round(bmr * multiplier)
}

/**
 * Goal-based calorie adjustments
 */
const CALORIE_ADJUSTMENTS: Record<string, number> = {
  'aggressive-cut': -500,      // ~1 lb per week loss
  'moderate-cut': -250,        // ~0.5 lb per week loss
  'maintenance': 0,
  'moderate-bulk': 250,        // ~0.5 lb per week gain
  'aggressive-bulk': 500,      // ~1 lb per week gain
}

/**
 * Calculate daily calorie target
 */
export function calculateDailyCalories(
  onboarding: OnboardingData
): number {
  const weightKg = onboarding.weightKg || 70
  const heightCm = onboarding.heightCm || 170
  const age = onboarding.age || 30
  const gender = (onboarding.gender || 'male') as 'male' | 'female'

  const bmr = calculateBMR(weightKg, heightCm, age, gender)
  const tdee = calculateTDEE(bmr, onboarding.activityLevel)

  // Check if user provided explicit calorie target
  const explicitCalories = Number(onboarding.calorieTarget)
  if (!Number.isNaN(explicitCalories) && explicitCalories > 1000) {
    return Math.max(1200, explicitCalories)
  }

  // Apply goal-based adjustment
  const adjustment = CALORIE_ADJUSTMENTS[onboarding.calorieTarget as string] ?? 0
  return Math.max(1200, tdee + adjustment)
}

/**
 * Macro distribution based on goal and preference
 */
export interface MacroDistribution {
  proteinPercent: number
  carbsPercent: number
  fatsPercent: number
}

export function getMacroDistribution(
  onboarding: OnboardingData
): MacroDistribution {
  const preference = onboarding.macroPreference || 'standard'

  // Standard: 30% protein, 40% carbs, 30% fats
  // High-protein: 40% protein, 35% carbs, 25% fats (for muscle gain)
  // Low-carb: 35% protein, 25% carbs, 40% fats
  // High-carb: 25% protein, 55% carbs, 20% fats (for endurance)
  // Balanced: 33% / 34% / 33%

  const distributions: Record<string, MacroDistribution> = {
    'standard': { proteinPercent: 0.30, carbsPercent: 0.40, fatsPercent: 0.30 },
    'high-protein': { proteinPercent: 0.40, carbsPercent: 0.35, fatsPercent: 0.25 },
    'low-carb': { proteinPercent: 0.35, carbsPercent: 0.25, fatsPercent: 0.40 },
    'high-carb': { proteinPercent: 0.25, carbsPercent: 0.55, fatsPercent: 0.20 },
    'balanced': { proteinPercent: 0.33, carbsPercent: 0.34, fatsPercent: 0.33 },
  }

  return distributions[preference] ?? distributions.standard
}

/**
 * Calculate protein target based on goal and intensity
 * - Aggressive bulk: 2.0–2.2g per kg (maximum muscle growth)
 * - Moderate bulk: 1.6–1.8g per kg (lean muscle gains)
 * - Maintenance: 1.6g per kg (muscle preservation)
 * - Moderate cut: 1.8–2.0g per kg (muscle preservation during fat loss)
 * - Aggressive cut: 2.0–2.4g per kg (maximum protein to preserve muscle)
 *
 * These are evidence-based recommendations from sports nutrition research.
 */
export function calculateProteinGrams(
  calories: number,
  onboarding: OnboardingData
): number {
  const weightKg = onboarding.weightKg || 70
  const goal = onboarding.calorieTarget

  // Protein multiplier based on goal and intensity
  let proteinPerKg = 1.6 // Default for maintenance

  if (goal === 'aggressive-bulk') {
    proteinPerKg = 2.1 // High end of muscle gain range
  } else if (goal === 'moderate-bulk') {
    proteinPerKg = 1.6 // Lower end for leaner bulk
  } else if (goal === 'maintenance') {
    proteinPerKg = 1.6 // Standard maintenance
  } else if (goal === 'moderate-cut') {
    proteinPerKg = 1.9 // Mid-range for muscle preservation during cut
  } else if (goal === 'aggressive-cut') {
    proteinPerKg = 2.2 // High end to maximize muscle preservation
  }

  const proteinFromWeight = weightKg * proteinPerKg
  const macroDistribution = getMacroDistribution(onboarding)
  const proteinFromCalories = (calories * macroDistribution.proteinPercent) / 4

  // Use whichever is higher for safety
  return Math.round(Math.max(proteinFromWeight, proteinFromCalories))
}

/**
 * Calculate fat target: 20–30% of total calories
 */
export function calculateFatGrams(
  calories: number,
  onboarding: OnboardingData
): number {
  const macroDistribution = getMacroDistribution(onboarding)
  return Math.round((calories * macroDistribution.fatsPercent) / 9)
}

/**
 * Remaining calories go to carbs
 */
export function calculateCarbsGrams(
  calories: number,
  proteinGrams: number,
  fatGrams: number
): number {
  const usedCalories = proteinGrams * 4 + fatGrams * 9
  const remainingCalories = calories - usedCalories
  return Math.round(Math.max(0, remainingCalories) / 4)
}

/**
 * Full macro calculation
 */
export interface NutritionTarget {
  calories: number
  protein: number
  carbs: number
  fats: number
  water: number
}

/**
 * Full macro calculation using accurate Mifflin-St Jeor and goal-based adjustments.
 */
export function calculateNutritionTargets(
  onboarding: OnboardingData
): NutritionTarget {
  const {
    weightKg = 70,
    heightCm = 170,
    age = 30,
    gender = 'male',
    activityLevel = 'sedentary',
    primaryGoal = 'maintenance',
    calorieTarget: calorieTargetPref,
  } = onboarding

  // 1. Calculate BMR (Mifflin-St Jeor)
  let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age)
  if (gender === 'male') {
    bmr += 5
  } else {
    bmr -= 161
  }

  // 2. TDEE Multiplier
  const multipliers: Record<string, number> = {
    'sedentary': 1.2,
    'lightly-active': 1.375,
    'moderately-active': 1.55,
    'very-active': 1.725,
    'athlete': 1.9,
    // Add variations for different naming conventions
    'moderately_active': 1.55,
    'lightly_active': 1.375,
    'very_active': 1.725,
    'extra_active': 1.9
  }
  
  const multiplier = multipliers[activityLevel] || 1.2
  const tdee = bmr * multiplier

  // 3. Adjust for Goal
  let targetCalories = tdee
  
  // Use preference if provided, otherwise goal-based
  const explicitCalories = Number(calorieTargetPref)
  if (!Number.isNaN(explicitCalories) && explicitCalories > 1000) {
    targetCalories = explicitCalories
  } else {
    if (primaryGoal === 'fat-loss' || primaryGoal === 'cut') {
      targetCalories -= 500
    } else if (primaryGoal === 'muscle-gain' || primaryGoal === 'bulk') {
      targetCalories += 250
    }
  }

  // Ensure minimum safe calories
  targetCalories = Math.max(1200, Math.round(targetCalories))

  // 4. Macro Calculation
  // Protein: 1.5g per kg bodyweight for bulk, 2.0g for others (as requested)
  let proteinMultiplier = 2.0
  if (primaryGoal === 'muscle-gain' || primaryGoal === 'bulk') {
    proteinMultiplier = 1.5
  }
  const proteinGrams = Math.round(weightKg * proteinMultiplier)
  const proteinCalories = proteinGrams * 4

  // Fats: 25% of total calories (healthy range)
  const fatCalories = targetCalories * 0.25
  const fatGrams = Math.round(fatCalories / 9)

  // Carbs: Remaining calories
  const carbCalories = targetCalories - proteinCalories - fatCalories
  const carbGrams = Math.round(Math.max(0, carbCalories) / 4)

  // 5. Water intake
  let waterGlasses = Math.round(weightKg / 10) + 2
  if (multiplier > 1.5) waterGlasses += 2

  return {
    calories: targetCalories,
    protein: proteinGrams,
    carbs: carbGrams,
    fats: fatGrams,
    water: waterGlasses,
  }
}

/**
 * Estimate calorie burn per minute for different exercise types
 * Varies by weight and intensity
 */
export function estimateCaloriesBurned(
  durationMinutes: number,
  exerciseType: 'strength' | 'cardio' | 'hiit' | 'recovery',
  weightKg: number = 70
): number {
  // Rough estimates: calories per minute per kg, adjusted for 70kg baseline
  const caloriesPerMinPerKg: Record<string, number> = {
    'strength': 0.08,    // ~5-6 cal/min for 70kg
    'cardio': 0.12,      // ~8-9 cal/min for 70kg
    'hiit': 0.20,        // ~14 cal/min for 70kg
    'recovery': 0.04,    // ~3 cal/min for 70kg
  }

  const baseRate = caloriesPerMinPerKg[exerciseType] ?? 0.08
  return Math.round(durationMinutes * baseRate * weightKg)
}
