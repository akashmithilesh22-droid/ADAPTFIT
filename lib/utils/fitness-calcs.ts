/**
 * Fitness Calculation Utilities
 * All scientific formulas and calculations used throughout the app
 */

export class FitnessCalcs {
  /**
   * Mifflin-St Jeor Formula - Most accurate BMR calculation
   * Used for: Base Metabolic Rate
   */
  static calculateBMR(
    weight_kg: number,
    height_cm: number,
    age_years: number,
    gender: 'male' | 'female'
  ): number {
    if (gender === 'male') {
      return 10 * weight_kg + 6.25 * height_cm - 5 * age_years + 5
    }
    return 10 * weight_kg + 6.25 * height_cm - 5 * age_years - 161
  }

  /**
   * Total Daily Energy Expenditure (TDEE)
   * BMR × Activity Multiplier
   */
  static calculateTDEE(
    bmr: number,
    activityLevel: 'sedentary' | 'lightly-active' | 'moderately-active' | 'very-active' | 'extra-active'
  ): number {
    const multipliers: Record<string, number> = {
      sedentary: 1.2,         // Little/no exercise
      'lightly-active': 1.375,    // Exercise 1-3 days/week
      'moderately-active': 1.55,  // Exercise 3-5 days/week
      'very-active': 1.725,       // Exercise 6-7 days/week
      'extra-active': 1.9,        // Physical job + exercise daily
    }
    return bmr * (multipliers[activityLevel] || 1.2)
  }

  /**
   * Caloric adjustment for goals
   */
  static adjustCaloriesForGoal(
    tdee: number,
    goal: 'bulking' | 'cutting' | 'maintenance' | 'body-recomposition'
  ): number {
    const adjustments: Record<string, number> = {
      bulking: 1.1,           // +10% surplus (0.5-1kg/week gain)
      cutting: 0.85,          // -15% deficit (0.75-1kg/week loss)
      maintenance: 1.0,       // No change
      'body-recomposition': 1.0,  // No change but manipulate macros
    }
    return Math.round(tdee * (adjustments[goal] || 1.0))
  }

  /**
   * Macro distribution based on goal
   * Returns percentages for Protein, Carbs, Fats
   */
  static calculateMacroDistribution(
    goal: 'bulking' | 'cutting' | 'maintenance' | 'body-recomposition'
  ): { protein: number; carbs: number; fats: number } {
    const distributions: Record<string, { protein: number; carbs: number; fats: number }> = {
      bulking: {
        protein: 0.25,        // 25% of calories (2.5g per kg)
        carbs: 0.55,          // 55% of calories (excess to fuel growth)
        fats: 0.2,            // 20% of calories
      },
      cutting: {
        protein: 0.4,         // 40% of calories (preserve muscle)
        carbs: 0.35,          // 35% of calories (preserve performance)
        fats: 0.25,           // 25% of calories
      },
      maintenance: {
        protein: 0.3,         // 30% of calories
        carbs: 0.45,          // 45% of calories
        fats: 0.25,           // 25% of calories
      },
      'body-recomposition': {
        protein: 0.35,        // 35% of calories (balanced)
        carbs: 0.45,          // 45% of calories
        fats: 0.2,            // 20% of calories
      },
    }
    return distributions[goal] || distributions.maintenance
  }

  /**
   * Convert macro percentages to grams
   */
  static macroPercentagesToGrams(
    calories: number,
    percentages: { protein: number; carbs: number; fats: number }
  ): { protein: number; carbs: number; fats: number } {
    return {
      protein: Math.round((calories * percentages.protein) / 4), // 4 cal/g
      carbs: Math.round((calories * percentages.carbs) / 4),     // 4 cal/g
      fats: Math.round((calories * percentages.fats) / 9),       // 9 cal/g
    }
  }

  /**
   * Body Mass Index (BMI)
   * Useful for reference (not absolute indicator of fitness)
   */
  static calculateBMI(weight_kg: number, height_cm: number): number {
    const height_m = height_cm / 100
    return Math.round((weight_kg / (height_m * height_m)) * 10) / 10
  }

  /**
   * Lean Body Mass (LBM)
   * Used for more accurate macro calculations
   */
  static calculateLBM(
    weight_kg: number,
    bodyFat_percent: number
  ): number {
    const fatMass = weight_kg * (bodyFat_percent / 100)
    return weight_kg - fatMass
  }

  /**
   * Estimated fat loss when in deficit
   * Based on: 1kg fat = 7,700 calories
   */
  static estimateFatLoss(
    dailyDeficit: number,
    weeks: number
  ): number {
    const weeklyDeficit = dailyDeficit * 7
    const totalDeficit = weeklyDeficit * weeks
    return Math.round((totalDeficit / 7700) * 10) / 10 // Rounds to 1 decimal
  }

  /**
   * Estimated muscle gain in bulk
   * 1kg muscle per month for beginners, less for advanced
   */
  static estimateMuscleGain(
    weeks: number,
    experience: 'beginner' | 'intermediate' | 'advanced'
  ): number {
    const monthlyGain: Record<string, number> = {
      beginner: 1.0,       // 1kg/month
      intermediate: 0.5,   // 0.5kg/month
      advanced: 0.25,      // 0.25kg/month (plateauing)
    }
    return Math.round((weeks / 4) * (monthlyGain[experience] || 0.5) * 10) / 10
  }

  /**
   * One Rep Max (1RM) Estimation
   * Brzycki Formula: 1RM = weight × (36 / (37 - reps))
   */
  static estimateOneRepMax(weight: number, reps: number): number {
    if (reps >= 37) return weight
    return Math.round(weight * (36 / (37 - reps)))
  }

  /**
   * Training Volume Calculation
   * Volume = Sets × Reps × Weight
   */
  static calculateVolume(sets: number, reps: number, weight: number): number {
    return sets * reps * weight
  }

  /**
   * Rest Period Duration
   * Based on intensity and rep range
   */
  static getRestPeriod(
    reps: number,
    intensity: 'heavy' | 'moderate' | 'light'
  ): number {
    if (intensity === 'heavy') {
      return reps < 6 ? 180 : 120 // 3 min for heavy, 2 min otherwise
    }
    if (intensity === 'moderate') {
      return reps <= 10 ? 90 : 60 // 1.5-1 min
    }
    return 45 // 45 sec for light
  }

  /**
   * Progressive Overload Calculation
   * How much to increase each week
   */
  static getProgressiveOverload(
    currentWeight: number,
    exercise: string
  ): number {
    // Standard progression: +2.5kg for compound lifts, +1-2.5kg for isolation
    const compounds = ['Squat', 'Deadlift', 'Bench', 'Row', 'Press']
    const isCompound = compounds.some(c => exercise.includes(c))

    return isCompound ? 2.5 : 1.25
  }

  /**
   * Recovery Time Between Sessions
   * Based on muscle group and intensity
   */
  static getRecoveryTime(
    muscleGroup: string,
    intensity: 'heavy' | 'moderate' | 'light'
  ): number {
    const baseRecovery: Record<string, number> = {
      chest: 48,
      back: 48,
      quads: 72,     // Larger muscle, more recovery
      hamstrings: 72,
      glutes: 72,
      shoulders: 48,
      biceps: 48,
      triceps: 48,
      forearms: 24,
      calves: 24,
    }

    const hours = baseRecovery[muscleGroup] || 48
    const intensityMultiplier = intensity === 'heavy' ? 1.25 : intensity === 'moderate' ? 1.0 : 0.75

    return Math.round(hours * intensityMultiplier)
  }

  /**
   * Caloric Burn During Exercise
   * METs (Metabolic Equivalent) formula
   */
  static calculateCaloriesBurned(
    weight_kg: number,
    exercise_mets: number,
    duration_minutes: number
  ): number {
    // Calories = (METs × 3.5 × weight_kg / 200) × duration
    return Math.round((exercise_mets * 3.5 * weight_kg / 200) * duration_minutes)
  }

  /**
   * Water Intake Recommendation
   * Based on activity and weight
   */
  static recommendedWaterIntake(weight_kg: number, activityHours: number): number {
    // Base: 0.5 oz per lb (0.033 oz per kg)
    // Plus: 12-16 oz per hour of exercise
    const base = weight_kg * 0.033 * 28.35 // Convert to ml
    const exercise = activityHours * 400     // ml
    return Math.round(base + exercise)
  }

  /**
   * Protein Requirements
   * Different based on goal
   */
  static proteinRequirements(
    weight_kg: number,
    goal: 'bulking' | 'cutting' | 'maintenance'
  ): number {
    const multipliers: Record<string, number> = {
      bulking: 2.0,        // 2.0g per kg
      cutting: 2.2,        // 2.2g per kg (preserve muscle)
      maintenance: 1.8,    // 1.8g per kg
    }
    return Math.round(weight_kg * (multipliers[goal] || 2.0))
  }

  /**
   * Check if caloric intake is safe
   */
  static isSafeDeficit(currentCalories: number, tdee: number): boolean {
    const deficit = tdee - currentCalories
    const deficitPercent = (deficit / tdee) * 100

    // Safe range: 15-25% deficit
    return deficitPercent >= 15 && deficitPercent <= 25
  }

  /**
   * Get weight change rate (kg/week)
   */
  static getWeightChangeRate(progressHistory: Array<{ date: Date; weight: number }>): number {
    if (progressHistory.length < 2) return 0

    const recent = progressHistory[progressHistory.length - 1]
    const previous = progressHistory[Math.max(0, progressHistory.length - 5)]

    const daysDifference = Math.max(1, (recent.date.getTime() - previous.date.getTime()) / (1000 * 60 * 60 * 24))
    const weightDifference = recent.weight - previous.weight

    return Math.round((weightDifference / (daysDifference / 7)) * 10) / 10
  }

  /**
   * Estimate remaining time to goal
   */
  static timeToGoal(
    currentMetric: number,
    goalMetric: number,
    weeklyChangeRate: number
  ): number {
    if (weeklyChangeRate === 0) return Infinity

    const metricsToChange = Math.abs(goalMetric - currentMetric)
    return Math.ceil(metricsToChange / Math.abs(weeklyChangeRate))
  }
}
