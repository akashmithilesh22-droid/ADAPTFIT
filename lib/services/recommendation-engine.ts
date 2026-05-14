import { WeeklySchedule, ProgressEntry, Recommendation, UserStats } from '@/types'

/**
 * AI Recommendation Engine
 * Provides intelligent suggestions for:
 * - Exercise replacements
 * - Split adjustments
 * - Recovery improvements
 * - Diet modifications
 * - Plateau busting strategies
 */

export class RecommendationEngine {
  /**
   * Analyze progress and suggest improvements
   */
  static analyzeProgressAndRecommend(
    progressHistory: ProgressEntry[],
    stats: UserStats
  ): Recommendation[] {
    const recommendations: Recommendation[] = []

    if (progressHistory.length < 4) {
      return recommendations // Need more data
    }

    // Check for plateau
    const recentProgress = progressHistory.slice(-4)
    const improvement = Math.abs(
      recentProgress[recentProgress.length - 1].weight - recentProgress[0].weight
    )

    if (improvement < 0.5) {
      recommendations.push({
        type: 'diet-adjustment',
        title: 'Plateau Detection',
        description: 'You haven\'t seen weight changes in 4 weeks. Consider adjusting calories.',
        reason: 'Your body may have adapted. Increasing activity or reducing calories by 200-300 can kickstart progress.',
        impact: 'high',
        priority: 1,
      })
    }

    // Check body fat vs muscle ratio
    const avgBodyFat = recentProgress.reduce((sum, p) => sum + (p.bodyFat || 0), 0) / recentProgress.length
    if (avgBodyFat > 20 && stats.totalWorkouts > 50) {
      recommendations.push({
        type: 'diet-adjustment',
        title: 'Body Fat Optimization',
        description: 'Consider entering a cut phase to reduce body fat to 15-18%.',
        reason: 'You have solid training volume. A cutting phase now can reveal muscle definition.',
        impact: 'high',
        priority: 2,
      })
    }

    return recommendations
  }

  /**
   * Suggest exercise replacements based on equipment/injuries
   */
  static suggestExerciseReplacement(
    originalExercise: string,
    availableEquipment: string[],
    injuries: string[]
  ): string[] {
    const replacements: Record<string, Record<string, string[]>> = {
      'Barbell Bench Press': {
        'dumbbells': ['Dumbbell Bench Press', 'Dumbbell Floor Press'],
        'no-equipment': ['Push-ups', 'Resistance Band Chest Press'],
        'machines': ['Smith Machine Bench Press', 'Machine Chest Press'],
      },
      'Barbell Squat': {
        'dumbbells': ['Goblet Squats', 'Dumbbell Bulgarian Split Squats'],
        'machines': ['Leg Press', 'Smith Machine Squats'],
        'no-equipment': ['Bodyweight Squats', 'Pistol Squats'],
      },
      'Deadlift': {
        'dumbbells': ['Dumbbell Romanian Deadlifts', 'Dumbbell Suitcase Deadlifts'],
        'machines': ['Machine Leg Press', 'Hack Squat'],
        'no-equipment': ['Single-Leg Bodyweight Rows'],
      },
      'Pull-ups': {
        'no-pull-up-bar': ['Resistance Band Assisted Rows', 'Machine Lat Pulldown'],
        'dumbbells': ['Dumbbell Rows', 'Dumbbell Pullovers'],
      },
      'Dips': {
        'no-bars': ['Tricep Pushdowns', 'Skull Crushers', 'Bench Dips'],
        'dumbbells': ['Close-Grip Dumbbell Press', 'Overhead Tricep Extension'],
      },
    }

    if (!replacements[originalExercise]) {
      return ['No direct replacement available']
    }

    let suggestions: string[] = []

    for (const equipment of availableEquipment) {
      const options = replacements[originalExercise][equipment] || []
      suggestions = [...suggestions, ...options]
    }

    // Filter by injuries
    if (injuries.length > 0) {
      suggestions = this.filterByInjuries(suggestions, injuries)
    }

    return suggestions.length > 0 ? suggestions : ['Consult a trainer for modifications']
  }

  /**
   * Recommend split changes based on performance
   */
  static recommendSplitChange(
    currentSchedule: WeeklySchedule,
    stats: UserStats,
    plateauDetected: boolean
  ): Recommendation | null {
    if (stats.totalWorkouts < 30) {
      return null // Too early for split change
    }

    const currentSplit = currentSchedule.split
    let recommendation: Recommendation | null = null

    if (plateauDetected && currentSplit === 'full-body') {
      recommendation = {
        type: 'split-change',
        title: 'Increase Training Frequency',
        description: 'Consider switching to Upper/Lower split for better recovery.',
        reason: 'Full body workouts 3x/week may not provide enough volume stimulus.',
        impact: 'medium',
        priority: 2,
      }
    }

    if (stats.workoutStreak > 50 && currentSplit === 'upper-lower') {
      recommendation = {
        type: 'split-change',
        title: 'Advanced Split Recommendation',
        description: 'Try Push/Pull/Legs for higher specialization.',
        reason: 'Your consistency suggests you can handle higher volume and intensity.',
        impact: 'medium',
        priority: 3,
      }
    }

    return recommendation
  }

  /**
   * Generate recovery recommendations
   */
  static recommendRecoveryImprovements(
    stats: UserStats,
    averageSleep: number,
    stressLevel: number
  ): Recommendation[] {
    const recommendations: Recommendation[] = []

    if (averageSleep < 7) {
      recommendations.push({
        type: 'recovery-improvement',
        title: 'Sleep Quality',
        description: 'Aim for 7-9 hours of sleep per night for optimal recovery.',
        reason: 'Sleep is critical for muscle growth and hormonal balance.',
        impact: 'high',
        priority: 1,
      })
    }

    if (stressLevel > 7) {
      recommendations.push({
        type: 'recovery-improvement',
        title: 'Stress Management',
        description: 'Practice meditation or yoga to reduce cortisol levels.',
        reason: 'High stress impairs recovery and can lead to overtraining.',
        impact: 'high',
        priority: 1,
      })
    }

    if (stats.totalWorkouts > 100 && stats.workoutStreak > 30) {
      recommendations.push({
        type: 'recovery-improvement',
        title: 'Deload Week',
        description: 'Schedule a deload week every 4-6 weeks to prevent overtraining.',
        reason: 'Extended high intensity requires periodic lower intensity recovery weeks.',
        impact: 'medium',
        priority: 2,
      })
    }

    return recommendations
  }

  /**
   * Suggest nutrition adjustments
   */
  static recommendNutritionAdjustment(
    weight: number,
    previousWeight: number,
    goal: 'bulking' | 'cutting' | 'maintenance',
    calories: number
  ): Recommendation | null {
    const weightChange = weight - previousWeight

    if (goal === 'bulking' && weightChange < 0.3 && previousWeight > 0) {
      return {
        type: 'diet-adjustment',
        title: 'Increase Caloric Intake',
        description: `Increase calories by 200-300 to accelerate gains.`,
        reason: `You're not gaining enough weight. Progressive overload requires fuel.`,
        impact: 'high',
        priority: 1,
      }
    }

    if (goal === 'cutting' && weightChange > -0.2 && previousWeight > 0) {
      return {
        type: 'diet-adjustment',
        title: 'Increase Caloric Deficit',
        description: `Reduce calories by 200-300 or increase cardio.`,
        reason: `Fat loss has stalled. A larger deficit or more activity is needed.`,
        impact: 'high',
        priority: 1,
      }
    }

    return null
  }

  /**
   * Detect and suggest plateau busting
   */
  static suggestPlateauBusting(
    exerciseName: string,
    currentPR: number,
    progressHistory: Array<{ weight: number; date: Date }>
  ): Recommendation | null {
    if (progressHistory.length < 8) {
      return null
    }

    // Check if no PRs in last 4 weeks
    const fourWeeksAgo = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000)
    const recentProgress = progressHistory.filter(p => new Date(p.date) > fourWeeksAgo)

    if (recentProgress.length > 0 && recentProgress[recentProgress.length - 1].weight === recentProgress[0].weight) {
      return {
        type: 'exercise-replacement',
        title: 'Break Through Plateau',
        description: `Try a variation of ${exerciseName} (pause reps, tempo training, drop sets, or different rep range).`,
        reason: `Muscles adapt to stimuli. Changing variables forces new adaptation.`,
        impact: 'high',
        priority: 1,
      }
    }

    return null
  }

  // ============ PRIVATE HELPERS ============

  private static filterByInjuries(exercises: string[], injuries: string[]): string[] {
    const injuryRestrictions: Record<string, string[]> = {
      'lower-back': ['Deadlift', 'Barbell Squat', 'Good Mornings'],
      'shoulder': ['Bench Press', 'Overhead Press', 'Pull-ups'],
      'knee': ['Squat', 'Leg Press', 'Lunges'],
      'elbow': ['Tricep Dips', 'Bench Press', 'Curls'],
      'wrist': ['Bench Press', 'Rows', 'Curls'],
    }

    return exercises.filter(ex => {
      for (const injury of injuries) {
        const restricted = injuryRestrictions[injury] || []
        if (restricted.some(r => ex.includes(r))) {
          return false
        }
      }
      return true
    })
  }
}
