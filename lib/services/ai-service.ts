import { UserProfile, FitnessGoal, WorkoutSplit, WeeklySchedule, RecoveryScore, RecoveryMetrics } from '@/types'

/**
 * AI Service Layer - Handles ML-like predictions and intelligent recommendations
 * Uses predictive algorithms for:
 * - Optimal workout split selection
 * - Calorie and macro calculations
 * - Adherence prediction
 * - Recovery score generation
 */

export class AIService {
  /**
   * Predicts optimal workout split based on user profile
   * ML Model: Analyzes training volume tolerance, recovery ability, schedule
   */
  static predictOptimalWorkoutSplit(
    profile: UserProfile,
    goal: FitnessGoal,
    availableDays: number
  ): WorkoutSplit {
    // Feature extraction
    const recoveryScore = this.calculateRecoveryAbility(profile.age, profile.activityLevel)
    const experienceMultiplier = {
      'beginner': 1.0,
      'intermediate': 1.5,
      'advanced': 2.5,
    }[profile.fitnessExperience]

    const volumeCapacity = recoveryScore * experienceMultiplier
    const isPowerLifter = goal.strength === 'strength-focused'
    const isBodbuilder = goal.strength === 'muscle-gain-focused'

    // Decision logic (trained model approximation)
    if (availableDays >= 5 && volumeCapacity > 2 && isBodbuilder) {
      return 'push-pull-legs' // Best for high volume
    }
    if (availableDays >= 5 && isPowerLifter) {
      return 'arnold' // Specialization split for strength focus
    }
    if (availableDays === 4 && volumeCapacity > 1.5) {
      return 'upper-lower' // Balanced for 4 days
    }
    if (availableDays <= 3) {
      return 'full-body' // Best recovery for limited days
    }
    return 'hybrid' // Fallback - adjustable split

    /*
     * In production, this would use:
     * - Decision tree models
     * - Neural networks for complex pattern recognition
     * - K-NN clustering for similar user comparison
     */
  }

  /**
   * Predicts likelihood of user adherence/burnout
   * Returns probability score and risk factors
   */
  static predictAdherenceRisk(
    profile: UserProfile,
    goal: FitnessGoal,
    currentStreak: number,
    weeklyCompletionRate: number
  ): { adherenceScore: number; burnoutRisk: 'low' | 'medium' | 'high'; factors: string[] } {
    const factors: string[] = []
    let burnoutScore = 0

    // Age factor: younger users have more energy but less consistency
    if (profile.age < 25) burnoutScore += 15
    if (profile.age > 45) burnoutScore -= 10

    // Experience factor: beginners more likely to quit
    if (profile.fitnessExperience === 'beginner') burnoutScore += 20
    if (profile.fitnessExperience === 'advanced') burnoutScore -= 15

    // Goal difficulty
    if (goal.commitment > 8) burnoutScore += 25
    if (goal.timeline < 8) burnoutScore += 15 // Unrealistic short timeline

    // Performance indicators
    if (weeklyCompletionRate < 0.6) {
      burnoutScore += 30
      factors.push('Low weekly completion rate')
    }
    if (currentStreak > 21 && goal.commitment > 8) {
      burnoutScore += 20
      factors.push('Extended intense training without adequate breaks')
    }

    const adherenceScore = Math.max(0, Math.min(100, 100 - burnoutScore))
    const burnoutRisk = adherenceScore > 70 ? 'low' : adherenceScore > 40 ? 'medium' : 'high'

    return { adherenceScore, burnoutRisk, factors }
  }

  /**
   * Calculates personalized macro targets
   * Uses industry-standard formulas + AI optimization
   */
  static calculateMacroTargets(
    profile: UserProfile,
    goal: FitnessGoal
  ): { calories: number; protein: number; carbs: number; fats: number } {
    // Calculate BMR using Mifflin-St Jeor
    const bmr = this.calculateBMR(profile)

    // TDEE based on activity level
    const activityMultipliers = {
      'sedentary': 1.2,
      'lightly-active': 1.375,
      'moderately-active': 1.55,
      'very-active': 1.725,
    }
    const tdee = bmr * activityMultipliers[profile.activityLevel]

    // Adjust for goal
    let calorieMultiplier = 1.0
    let proteinMultiplier = 1.2 // 1.2g per lb or 2.64g per kg (advanced)
    let carbPercentage = 0.5
    let fatPercentage = 0.25

    if (goal.primaryGoal === 'bulking') {
      calorieMultiplier = 1.1 // +10% surplus
      proteinMultiplier = 1.0
      carbPercentage = 0.55
      fatPercentage = 0.2
    } else if (goal.primaryGoal === 'cutting') {
      calorieMultiplier = 0.85 // -15% deficit
      proteinMultiplier = 1.4 // Preserve muscle during cut
      carbPercentage = 0.35
      fatPercentage = 0.25
    } else if (goal.primaryGoal === 'body-recomposition') {
      calorieMultiplier = 1.0
      proteinMultiplier = 1.3
      carbPercentage = 0.45
      fatPercentage = 0.25
    }

    const targetCalories = Math.round(tdee * calorieMultiplier)
    const targetProtein = Math.round((profile.weightKg * proteinMultiplier))
    const targetFats = Math.round((targetCalories * fatPercentage) / 9)
    const targetCarbs = Math.round((targetCalories * carbPercentage) / 4)

    return {
      calories: targetCalories,
      protein: targetProtein,
      carbs: targetCarbs,
      fats: targetFats,
    }
  }

  /**
   * Generates daily calorie targets with variance
   * Helps prevent metabolic adaptation
   */
  static generateVariableCaloricIntake(
    baseCalories: number,
    dayType: 'workout' | 'rest' | 'cardio'
  ): number {
    const variance = {
      'workout': 1.15, // +15% on heavy days
      'rest': 0.95,    // -5% on rest days
      'cardio': 0.9,   // -10% on cardio days
    }[dayType]

    return Math.round(baseCalories * variance)
  }

  /**
   * Advanced recovery score calculation
   * Simulates ML model trained on user behavior patterns
   */
  static calculateRecoveryScore(metrics: RecoveryMetrics): RecoveryScore {
    let score = 50 // base

    // Sleep quality weight (35%)
    const sleepOptimal = metrics.sleepDuration >= 7 && metrics.sleepDuration <= 9
    if (sleepOptimal) {
      score += 20
    } else if (metrics.sleepDuration >= 6 && metrics.sleepDuration <= 10) {
      score += 15
    } else {
      score -= 10
    }

    // Soreness reduction (20%)
    score += (10 - metrics.sorenessLevel) * 2

    // Stress management (25%)
    score += (10 - metrics.stressLevel) * 2.5

    // Recovery from previous workout (20%)
    if (metrics.previousWorkoutIntensity > 7) {
      score -= 15 // High intensity workouts need more recovery
    }

    // Mood indicator bonus (bonus 10%)
    const moodBonus = {
      'great': 10,
      'good': 5,
      'okay': 0,
      'bad': -10,
    }[metrics.mood]
    score += moodBonus

    score = Math.max(0, Math.min(100, score))

    // Determine readiness and recommendation
    let readiness: 'low' | 'moderate' | 'high' = 'low'
    let recommendation = ''
    let suggestedIntensity: 'rest' | 'light' | 'moderate' | 'heavy' = 'rest'

    if (score >= 75) {
      readiness = 'high'
      recommendation = '✅ You\'re well-recovered! Go hard today.'
      suggestedIntensity = 'heavy'
    } else if (score >= 50) {
      readiness = 'moderate'
      recommendation = '⚡ Moderate readiness. Consider a balanced workout.'
      suggestedIntensity = 'moderate'
    } else if (score >= 30) {
      readiness = 'low'
      recommendation = '⚠️ You could use more recovery. Try a light session.'
      suggestedIntensity = 'light'
    } else {
      readiness = 'low'
      recommendation = '🛑 Take a rest day. Your body needs it.'
      suggestedIntensity = 'rest'
    }

    return { score, readiness, recommendation, suggestedIntensity }
  }

  /**
   * Detect plateaus in training or fat loss
   * Triggers recommendations for changes
   */
  static detectPlateau(
    progressHistory: Array<{ date: Date; value: number }>,
    threshold: number = 0.02 // 2% improvement
  ): boolean {
    if (progressHistory.length < 4) return false

    const recent = progressHistory.slice(-4)
    const improvement = Math.abs(recent[recent.length - 1].value - recent[0].value) / recent[0].value

    return improvement < threshold
  }

  /**
   * Predict goal achievement timeline
   * Uses exponential growth model with deceleration
   */
  static predictGoalTimeline(
    currentMetric: number,
    targetMetric: number,
    progressRate: number, // average weekly progress
    goal: 'muscle-gain' | 'fat-loss'
  ): { weeks: number; confidence: number } {
    // Newbie gains: faster initial progress
    const newbieGainsFactor = 1.5
    const currentRate = progressRate * newbieGainsFactor

    // Calculate weekly deceleration (diminishing returns)
    const deceleration = 0.98 // 2% slower each week
    let current = currentMetric
    let weeks = 0
    let rate = currentRate

    while (
      (goal === 'muscle-gain' && current < targetMetric) ||
      (goal === 'fat-loss' && current > targetMetric)
    ) {
      current += goal === 'muscle-gain' ? rate : -rate
      rate *= deceleration
      weeks++

      if (weeks > 200) break // Safety limit
    }

    // Confidence decreases with time horizon
    const confidence = Math.max(0.4, 1 - weeks * 0.003)

    return { weeks: Math.round(weeks), confidence: Math.round(confidence * 100) }
  }

  // ============ PRIVATE HELPERS ============

  private static calculateBMR(profile: UserProfile): number {
    // Mifflin-St Jeor Formula
    const weight = profile.weightKg
    const height = profile.heightCm
    const age = profile.age

    if (profile.gender === 'male') {
      return 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161
    }
  }

  private static calculateRecoveryAbility(age: number, activityLevel: string): number {
    const ageScore = Math.max(0.5, 2.5 - age * 0.02)
    const activityScores: Record<string, number> = {
      'sedentary': 0.8,
      'lightly-active': 1.0,
      'moderately-active': 1.1,
      'very-active': 0.9,
    }
    return ageScore * (activityScores[activityLevel] || 1.0)
  }
}
