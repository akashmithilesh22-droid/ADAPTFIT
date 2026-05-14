import { WeeklySchedule, Workout } from '@/types'

/**
 * Schedule Adaptation System
 * Intelligently handles missed workouts by:
 * - Restructuring the remaining week
 * - Preventing overtraining
 * - Redistributing muscle groups intelligently
 * - Maintaining progression
 */

export class ScheduleAdapter {
  /**
   * Adapts schedule when a workout is missed
   * Returns restructured weekly schedule
   */
  static adaptScheduleForMissedWorkout(
    schedule: WeeklySchedule,
    missedWorkoutId: string,
    currentDay: number // 0-6
  ): WeeklySchedule {
    const missedWorkout = schedule.workouts.find(w => w.id === missedWorkoutId)
    if (!missedWorkout) return schedule

    // Get remaining days in week
    const remainingDays = 6 - currentDay

    // Option 1: Integrate missed muscles into next workout
    const adaptedSchedule = this.integrateWithNextWorkout(schedule, missedWorkout, currentDay)

    // Option 2: If too many muscles, redistribute
    if (this.isTooMuchVolume(adaptedSchedule)) {
      return this.redistributeMuscleGroups(adaptedSchedule, currentDay, remainingDays)
    }

    return adaptedSchedule
  }

  /**
   * Creates a recovery-focused adjustment when user reports fatigue
   */
  static adjustForFatigue(
    schedule: WeeklySchedule,
    currentDay: number,
    fatigueLevel: 'mild' | 'moderate' | 'severe'
  ): WeeklySchedule {
    const adjusted = { ...schedule, workouts: [...schedule.workouts] }

    const fatigueFactors = {
      'mild': 0.85,      // Reduce intensity to 85%
      'moderate': 0.70,  // Reduce to 70%
      'severe': 0.50,    // Reduce to 50%, consider rest
    }

    const factor = fatigueFactors[fatigueLevel]

    adjusted.workouts = adjusted.workouts.map(workout => {
      if (workout.dayOfWeek >= currentDay) {
        return {
          ...workout,
          exercises: workout.exercises.map(ex => ({
            ...ex,
            sets: Math.max(2, Math.ceil(ex.sets * factor)),
            reps: ex.reps,
            restSeconds: Math.ceil(ex.restSeconds * 1.25),
          })),
          intensity: fatigueLevel === 'severe' ? 'low' : fatigueLevel === 'moderate' ? 'moderate' : 'moderate',
          estimatedDuration: Math.round(workout.estimatedDuration * factor),
        }
      }
      return workout
    })

    // If severe, inject rest days
    if (fatigueLevel === 'severe') {
      adjusted.workouts = adjusted.workouts.filter(w => w.dayOfWeek >= currentDay).slice(0, 2)
    }

    return adjusted
  }

  /**
   * Reschedules multiple missed days
   * More aggressive redistribution
   */
  static rescheduleMultipleMissedDays(
    schedule: WeeklySchedule,
    missedDays: number[], // e.g., [1, 2] for Monday and Tuesday
    currentDay: number
  ): WeeklySchedule {
    const missedWorkouts = schedule.workouts.filter(w => missedDays.includes(w.dayOfWeek))

    if (missedWorkouts.length === 0) return schedule

    // Get all remaining muscle groups from missed days
    const missedMuscles = new Set<string>()
    missedWorkouts.forEach(w => {
      w.exercises.forEach(ex => {
        ex.targetMuscles.forEach(m => missedMuscles.add(m))
      })
    })

    // Prioritize which muscles MUST be hit
    const priorityMuscles = this.prioritizeMuscleGroups(missedMuscles)

    // Redistribute to remaining workouts
    return this.redistributeMuscleGroups(schedule, currentDay, 6 - currentDay, priorityMuscles)
  }

  /**
   * Suggests a complete new schedule for the rest of the week
   * Used when user prefers fresh start over redistribution
   */
  static generateFreshWeekSchedule(
    schedule: WeeklySchedule,
    currentDay: number,
    availableDays: number
  ): Workout[] {
    // Compress the remaining week
    const compressedSchedule: Workout[] = []

    if (availableDays <= 3) {
      // Full body workouts for limited time
      const fullBodyDays = Math.min(3, availableDays)
      for (let i = 0; i < fullBodyDays; i++) {
        compressedSchedule.push(this.createCompressedFullBodyWorkout(schedule, currentDay + i * 2, i))
      }
    } else if (availableDays <= 4) {
      // Upper/Lower split
      compressedSchedule.push(this.createCompressedUpperBodyWorkout(schedule, currentDay))
      compressedSchedule.push(this.createCompressedLowerBodyWorkout(schedule, currentDay + 1))
      if (availableDays >= 3) {
        compressedSchedule.push(this.createCompressedUpperBodyWorkout(schedule, currentDay + 2))
      }
    }

    return compressedSchedule
  }

  /**
   * Suggests which workout to do if user has limited time
   * Returns a shorter version of next scheduled workout
   */
  static suggestPrioritizedWorkout(
    schedule: WeeklySchedule,
    timeAvailable: number, // minutes
    currentDay: number
  ): Workout | null {
    // Find next workout
    const nextWorkout = schedule.workouts.find(w => w.dayOfWeek >= currentDay)
    if (!nextWorkout) return null

    // If enough time, return full workout
    if (timeAvailable >= nextWorkout.estimatedDuration) {
      return nextWorkout
    }

    // Otherwise, prioritize exercises
    const prioritized = this.prioritizeExercisesForTime(nextWorkout, timeAvailable)
    return prioritized
  }

  /**
   * Check if scheduled week has too much volume
   * Returns overtraining indicator
   */
  static assessWeeklyVolume(schedule: WeeklySchedule): {
    isOvertraining: boolean
    totalSets: number
    totalExercises: number
    recommendedAdjustment: string
  } {
    let totalSets = 0
    let totalExercises = 0

    schedule.workouts.forEach(w => {
      w.exercises.forEach(ex => {
        totalSets += ex.sets
        totalExercises += 1
      })
    })

    // Thresholds
    const isOvertraining = totalSets > 180 || totalExercises > 60

    let recommendedAdjustment = 'Volume is optimal'
    if (totalSets > 200) {
      recommendedAdjustment = 'Consider reducing volume by 15-20%'
    } else if (totalSets > 180) {
      recommendedAdjustment = 'Volume is slightly high; reduce by 10%'
    }

    return {
      isOvertraining,
      totalSets,
      totalExercises,
      recommendedAdjustment,
    }
  }

  // ============ PRIVATE HELPERS ============

  private static integrateWithNextWorkout(
    schedule: WeeklySchedule,
    missedWorkout: Workout,
    currentDay: number
  ): WeeklySchedule {
    const workouts = [...schedule.workouts]
    const nextWorkoutIndex = workouts.findIndex(w => w.dayOfWeek > currentDay)

    if (nextWorkoutIndex === -1) {
      // No upcoming workouts, add missed as recovery session
      return schedule
    }

    const nextWorkout = workouts[nextWorkoutIndex]

    // Reduce next workout intensity to accommodate missed muscles
    const integrated = {
      ...nextWorkout,
      exercises: [
        // Add 2-3 key exercises from missed workout
        ...missedWorkout.exercises.slice(0, 3),
        // Add some from next workout
        ...nextWorkout.exercises.slice(0, 3),
      ],
      estimatedDuration: nextWorkout.estimatedDuration + 15,
      intensity: 'moderate' as const,
    }

    workouts[nextWorkoutIndex] = integrated
    return { ...schedule, workouts }
  }

  private static isTooMuchVolume(schedule: WeeklySchedule): boolean {
    let totalSets = 0
    schedule.workouts.forEach(w => {
      w.exercises.forEach(ex => {
        totalSets += ex.sets
      })
    })
    return totalSets > 180
  }

  private static redistributeMuscleGroups(
    schedule: WeeklySchedule,
    currentDay: number,
    remainingDays: number,
    priorityMuscles?: Set<string>
  ): WeeklySchedule {
    const adapted = { ...schedule, workouts: [...schedule.workouts] }

    // Filter to remaining workouts
    adapted.workouts = adapted.workouts.filter(w => w.dayOfWeek >= currentDay)

    // Reduce volume per workout slightly
    adapted.workouts = adapted.workouts.map(w => ({
      ...w,
      exercises: w.exercises.map(ex => ({
        ...ex,
        sets: Math.max(2, Math.ceil(ex.sets * 0.85)),
      })),
    }))

    return adapted
  }

  private static prioritizeMuscleGroups(muscles: Set<string>): Set<string> {
    const priority = ['chest', 'back', 'legs'] // Major muscle groups
    return new Set(Array.from(muscles).filter(m => priority.includes(m)))
  }

  private static createCompressedFullBodyWorkout(
    schedule: WeeklySchedule,
    dayOfWeek: number,
    index: number
  ): Workout {
    const allExercises = schedule.workouts.flatMap(w => w.exercises)

    // Select best exercises
    const selected = [
      allExercises.find(ex => ex.targetMuscles.includes('chest')),
      allExercises.find(ex => ex.targetMuscles.includes('back')),
      allExercises.find(ex => ex.targetMuscles.includes('quads')),
      allExercises.find(ex => ex.targetMuscles.includes('hamstrings')),
      allExercises.find(ex => ex.targetMuscles.includes('shoulders')),
    ].filter((ex): ex is any => ex !== undefined)

    return {
      id: `compressed-fb-${index}`,
      userId: '',
      dayOfWeek,
      name: `Full Body ${index + 1}`,
      exercises: selected.slice(0, 5),
      estimatedDuration: 60,
      intensity: 'moderate',
      createdAt: new Date(),
    }
  }

  private static createCompressedUpperBodyWorkout(
    schedule: WeeklySchedule,
    dayOfWeek: number
  ): Workout {
    const upperExercises = schedule.workouts
      .flatMap(w => w.exercises)
      .filter(ex => !['quads', 'hamstrings', 'glutes'].some(m => ex.targetMuscles.includes(m)))

    return {
      id: `compressed-upper-${dayOfWeek}`,
      userId: '',
      dayOfWeek,
      name: 'Upper Body',
      exercises: upperExercises.slice(0, 5),
      estimatedDuration: 45,
      intensity: 'moderate',
      createdAt: new Date(),
    }
  }

  private static createCompressedLowerBodyWorkout(
    schedule: WeeklySchedule,
    dayOfWeek: number
  ): Workout {
    const lowerExercises = schedule.workouts
      .flatMap(w => w.exercises)
      .filter(ex => ['quads', 'hamstrings', 'glutes'].some(m => ex.targetMuscles.includes(m)))

    return {
      id: `compressed-lower-${dayOfWeek}`,
      userId: '',
      dayOfWeek,
      name: 'Lower Body',
      exercises: lowerExercises.slice(0, 5),
      estimatedDuration: 45,
      intensity: 'moderate',
      createdAt: new Date(),
    }
  }

  private static prioritizeExercisesForTime(workout: Workout, timeAvailable: number): Workout {
    // Prioritize compound exercises
    const compoundFirst = workout.exercises.sort((a, b) => {
      const compoundExercises = ['Squat', 'Deadlift', 'Bench', 'Row', 'Press']
      const aIsCompound = compoundExercises.some(c => a.name.includes(c))
      const bIsCompound = compoundExercises.some(c => b.name.includes(c))
      return aIsCompound ? -1 : bIsCompound ? 1 : 0
    })

    // Fit exercises into time
    let timeUsed = 0
    const selected = []

    for (const ex of compoundFirst) {
      const exerciseTime = (ex.sets * 3) + ex.restSeconds / 60
      if (timeUsed + exerciseTime <= timeAvailable) {
        selected.push(ex)
        timeUsed += exerciseTime
      }
    }

    return {
      ...workout,
      exercises: selected,
      estimatedDuration: Math.round(timeUsed),
    }
  }
}
