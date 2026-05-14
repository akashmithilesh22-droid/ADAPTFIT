import { Workout } from '@/types'

/**
 * Fatigue-Aware Adjustment System
 * Automatically adjusts workout intensity based on user fatigue reports
 */

export class FatigueAdjuster {
  /**
   * Adjust workout intensity based on fatigue level
   */
  static adjustWorkoutForFatigue(
    workout: Workout,
    fatigueLevel: number, // 1-10 scale
    fatigueReasons: string[] = [] // e.g., ['poor-sleep', 'high-stress', 'soreness']
  ): Workout {
    let intensityMultiplier = 1.0
    let volumeMultiplier = 1.0
    let durationMultiplier = 1.0

    // Base adjustment on fatigue level
    if (fatigueLevel <= 3) {
      // Well rested
      intensityMultiplier = 1.15
      volumeMultiplier = 1.1
    } else if (fatigueLevel <= 5) {
      // Moderate fatigue
      intensityMultiplier = 0.9
      volumeMultiplier = 0.95
    } else if (fatigueLevel <= 7) {
      // High fatigue
      intensityMultiplier = 0.75
      volumeMultiplier = 0.8
      durationMultiplier = 0.85
    } else {
      // Severe fatigue
      intensityMultiplier = 0.5
      volumeMultiplier = 0.6
      durationMultiplier = 0.7
    }

    // Factor in specific reasons
    fatigueReasons.forEach(reason => {
      if (reason === 'poor-sleep') {
        intensityMultiplier *= 0.85
        volumeMultiplier *= 0.9
      } else if (reason === 'high-stress') {
        intensityMultiplier *= 0.8
        volumeMultiplier *= 0.85
      } else if (reason === 'soreness') {
        intensityMultiplier *= 0.7
        volumeMultiplier *= 0.75
      } else if (reason === 'illness') {
        intensityMultiplier *= 0.6
        volumeMultiplier *= 0.6
        durationMultiplier *= 0.5
      }
    })

    // Apply adjustments
    const adjustedWorkout: Workout = {
      ...workout,
      exercises: workout.exercises.map(ex => ({
        ...ex,
        sets: Math.max(2, Math.ceil(ex.sets * volumeMultiplier)),
        reps: typeof ex.reps === 'string'
          ? this.adjustRepRange(ex.reps, intensityMultiplier)
          : ex.reps,
        restSeconds: Math.ceil(ex.restSeconds * (1 + (1 - intensityMultiplier) * 0.5)),
      })),
      intensity: this.determineIntensity(intensityMultiplier),
      estimatedDuration: Math.round(workout.estimatedDuration * durationMultiplier),
    }

    return adjustedWorkout
  }

  /**
   * Suggest alternative lighter workout
   */
  static suggestLighterAlternative(
    originalWorkout: Workout,
    fatigueLevel: number
  ): Workout {
    if (fatigueLevel < 5) {
      return originalWorkout // No adjustment needed
    }

    // Create a lighter version
    const lighter: Workout = {
      ...originalWorkout,
      name: `${originalWorkout.name} (Light)`,
      exercises: originalWorkout.exercises.slice(0, Math.ceil(originalWorkout.exercises.length / 2)).map(ex => ({
        ...ex,
        sets: Math.max(1, Math.ceil(ex.sets * 0.5)),
        reps: this.adjustRepRange(typeof ex.reps === 'string' ? ex.reps : '8-12', 0.6),
        restSeconds: Math.ceil(ex.restSeconds * 0.8),
      })),
      intensity: 'low',
      estimatedDuration: Math.round(originalWorkout.estimatedDuration * 0.6),
    }

    return lighter
  }

  /**
   * Determine if rest day is recommended
   */
  static shouldTakeRestDay(
    fatigueLevel: number,
    consecutiveWorkoutDays: number,
    averageSleep: number,
    stressLevel: number
  ): {
    shouldRest: boolean
    reason: string
    urgency: 'low' | 'medium' | 'high'
  } {
    let shouldRest = false
    let reason = ''
    let urgency: 'low' | 'medium' | 'high' = 'low'

    if (fatigueLevel >= 8) {
      shouldRest = true
      reason = 'Severe fatigue detected'
      urgency = 'high'
    } else if (consecutiveWorkoutDays >= 5 && fatigueLevel >= 6) {
      shouldRest = true
      reason = `${consecutiveWorkoutDays} consecutive workouts with high fatigue`
      urgency = 'high'
    } else if (averageSleep < 6 && fatigueLevel >= 6) {
      shouldRest = true
      reason = `Poor sleep (${averageSleep}hrs) affecting recovery`
      urgency = 'medium'
    } else if (stressLevel > 8 && fatigueLevel >= 6) {
      shouldRest = true
      reason = 'High stress levels may impair recovery'
      urgency = 'medium'
    } else if (consecutiveWorkoutDays >= 7) {
      shouldRest = true
      reason = 'Consider a deload/recovery week'
      urgency = 'low'
    }

    return { shouldRest, reason, urgency }
  }

  /**
   * Schedule strategic deload week
   */
  static planDeloadWeek(workouts: Workout[]): Workout[] {
    return workouts.map(workout => ({
      ...workout,
      exercises: workout.exercises.map(ex => ({
        ...ex,
        sets: Math.max(1, Math.ceil(ex.sets * 0.5)),
        reps: typeof ex.reps === 'string' ? ex.reps : '12-15',
        restSeconds: ex.restSeconds,
      })),
      intensity: 'low',
      estimatedDuration: Math.round(workout.estimatedDuration * 0.5),
    }))
  }

  /**
   * Get recovery recommendations
   */
  static getRecoveryRecommendations(
    fatigueLevel: number,
    fatigueReasons: string[] = []
  ): string[] {
    const recommendations: string[] = []

    if (fatigueLevel >= 6) {
      recommendations.push('Prioritize sleep: Aim for 8-9 hours')
    }

    if (fatigueReasons.includes('poor-sleep')) {
      recommendations.push('Establish consistent sleep schedule')
      recommendations.push('Limit caffeine after 2 PM')
      recommendations.push('Try meditation or sleep meditation before bed')
    }

    if (fatigueReasons.includes('high-stress')) {
      recommendations.push('Practice 10-15 min meditation daily')
      recommendations.push('Take a walk or do light stretching')
      recommendations.push('Consider a lighter workout or yoga')
    }

    if (fatigueReasons.includes('soreness')) {
      recommendations.push('Foam roll affected muscles')
      recommendations.push('Increase protein intake for muscle repair')
      recommendations.push('Stay hydrated')
      recommendations.push('Consider active recovery (walking, swimming)')
    }

    if (fatigueReasons.includes('illness')) {
      recommendations.push('Take a complete rest day')
      recommendations.push('Hydrate and get proper nutrition')
      recommendations.push('Consult a doctor if symptoms persist')
    }

    if (fatigueLevel >= 7) {
      recommendations.push('Consider taking 1-2 complete rest days')
      recommendations.push('Increase caloric intake slightly for recovery')
    }

    return recommendations
  }

  /**
   * Analyze recovery trends
   */
  static analyzeRecoveryTrend(
    fatigueHistory: Array<{ date: Date; level: number }>
  ): {
    trend: 'improving' | 'declining' | 'stable'
    averageFatigue: number
    recommendation: string
  } {
    if (fatigueHistory.length < 3) {
      return {
        trend: 'stable',
        averageFatigue: fatigueHistory[0]?.level || 5,
        recommendation: 'Not enough data',
      }
    }

    const recent = fatigueHistory.slice(-7)
    const avgRecent = recent.reduce((sum, entry) => sum + entry.level, 0) / recent.length

    const older = fatigueHistory.slice(Math.max(0, fatigueHistory.length - 14), -7)
    const avgOlder = older.length > 0
      ? older.reduce((sum, entry) => sum + entry.level, 0) / older.length
      : avgRecent

    let trend: 'improving' | 'declining' | 'stable' = 'stable'
    let recommendation = 'Recovery is stable'

    if (avgRecent < avgOlder - 1) {
      trend = 'improving'
      recommendation = 'Great! Your recovery is improving. Keep up the good habits!'
    } else if (avgRecent > avgOlder + 1) {
      trend = 'declining'
      recommendation = 'Recovery is declining. Focus on sleep and stress management.'
    }

    return {
      trend,
      averageFatigue: avgRecent,
      recommendation,
    }
  }

  // ============ PRIVATE HELPERS ============

  private static adjustRepRange(repRange: string, multiplier: number): string {
    if (!repRange.includes('-')) return repRange

    const [min, max] = repRange.split('-').map(Number)
    const adjustedMin = Math.max(1, Math.round(min * (2 - multiplier)))
    const adjustedMax = Math.max(1, Math.round(max * (2 - multiplier)))

    return `${adjustedMin}-${adjustedMax}`
  }

  private static determineIntensity(multiplier: number): 'low' | 'moderate' | 'high' {
    if (multiplier >= 1.1) return 'high'
    if (multiplier <= 0.85) return 'low'
    return 'moderate'
  }
}
