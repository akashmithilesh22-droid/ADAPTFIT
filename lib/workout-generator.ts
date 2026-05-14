import type { OnboardingData } from '@/app/(app)/onboarding/page'
import { estimateCaloriesBurned } from './fitness-calculations'

/**
 * Exercise database with intensity and safety profile
 */
export interface Exercise {
  id: string
  name: string
  category: 'upper-push' | 'upper-pull' | 'lower' | 'core' | 'cardio' | 'mobility'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  equipment: string[]
  duration: number // minutes
  calorieMultiplier: number
  contraindications: string[] // injuries to avoid
}

const EXERCISE_DATABASE: Exercise[] = [
  // Upper Push
  {
    id: 'pushups',
    name: 'Push-ups',
    category: 'upper-push',
    difficulty: 'beginner',
    equipment: [],
    duration: 10,
    calorieMultiplier: 0.10,
    contraindications: ['shoulder-injury', 'elbow-pain'],
  },
  {
    id: 'bench-press',
    name: 'Barbell Bench Press',
    category: 'upper-push',
    difficulty: 'intermediate',
    equipment: ['barbell', 'bench'],
    duration: 15,
    calorieMultiplier: 0.12,
    contraindications: ['shoulder-injury', 'chest-pain'],
  },
  {
    id: 'dumbbell-press',
    name: 'Dumbbell Shoulder Press',
    category: 'upper-push',
    difficulty: 'intermediate',
    equipment: ['dumbbells'],
    duration: 12,
    calorieMultiplier: 0.11,
    contraindications: ['shoulder-injury'],
  },

  // Upper Pull
  {
    id: 'pullups',
    name: 'Pull-ups',
    category: 'upper-pull',
    difficulty: 'intermediate',
    equipment: ['pull-up-bar'],
    duration: 12,
    calorieMultiplier: 0.15,
    contraindications: ['shoulder-injury', 'back-pain'],
  },
  {
    id: 'rows',
    name: 'Barbell Rows',
    category: 'upper-pull',
    difficulty: 'intermediate',
    equipment: ['barbell'],
    duration: 14,
    calorieMultiplier: 0.13,
    contraindications: ['back-pain', 'lower-back-injury'],
  },
  {
    id: 'assisted-pullups',
    name: 'Assisted Pull-ups',
    category: 'upper-pull',
    difficulty: 'beginner',
    equipment: ['pull-up-machine'],
    duration: 12,
    calorieMultiplier: 0.10,
    contraindications: ['shoulder-injury'],
  },

  // Lower
  {
    id: 'squats',
    name: 'Barbell Squats',
    category: 'lower',
    difficulty: 'intermediate',
    equipment: ['barbell', 'rack'],
    duration: 15,
    calorieMultiplier: 0.15,
    contraindications: ['knee-pain', 'lower-back-injury'],
  },
  {
    id: 'leg-press',
    name: 'Leg Press',
    category: 'lower',
    difficulty: 'beginner',
    equipment: ['leg-press-machine'],
    duration: 12,
    calorieMultiplier: 0.12,
    contraindications: ['knee-pain'],
  },
  {
    id: 'deadlifts',
    name: 'Deadlifts',
    category: 'lower',
    difficulty: 'advanced',
    equipment: ['barbell'],
    duration: 14,
    calorieMultiplier: 0.18,
    contraindications: ['lower-back-injury', 'knee-pain'],
  },
  {
    id: 'lunges',
    name: 'Walking Lunges',
    category: 'lower',
    difficulty: 'beginner',
    equipment: [],
    duration: 12,
    calorieMultiplier: 0.10,
    contraindications: ['knee-pain'],
  },

  // Core
  {
    id: 'planks',
    name: 'Planks',
    category: 'core',
    difficulty: 'beginner',
    equipment: [],
    duration: 8,
    calorieMultiplier: 0.06,
    contraindications: ['lower-back-injury'],
  },
  {
    id: 'ab-wheel',
    name: 'Ab Wheel Rollout',
    category: 'core',
    difficulty: 'advanced',
    equipment: ['ab-wheel'],
    duration: 8,
    calorieMultiplier: 0.08,
    contraindications: ['lower-back-injury'],
  },

  // Cardio
  {
    id: 'running',
    name: 'Running (moderate pace)',
    category: 'cardio',
    difficulty: 'beginner',
    equipment: [],
    duration: 20,
    calorieMultiplier: 0.18,
    contraindications: ['knee-pain', 'ankle-injury'],
  },
  {
    id: 'cycling',
    name: 'Cycling',
    category: 'cardio',
    difficulty: 'beginner',
    equipment: ['bike'],
    duration: 20,
    calorieMultiplier: 0.15,
    contraindications: ['knee-pain'],
  },
  {
    id: 'jump-rope',
    name: 'Jump Rope',
    category: 'cardio',
    difficulty: 'intermediate',
    equipment: ['jump-rope'],
    duration: 15,
    calorieMultiplier: 0.20,
    contraindications: ['knee-pain', 'ankle-injury'],
  },
  {
    id: 'rowing',
    name: 'Rowing',
    category: 'cardio',
    difficulty: 'intermediate',
    equipment: ['rowing-machine'],
    duration: 20,
    calorieMultiplier: 0.16,
    contraindications: ['back-pain', 'shoulder-injury'],
  },

  // Mobility
  {
    id: 'yoga',
    name: 'Yoga Flow',
    category: 'mobility',
    difficulty: 'beginner',
    equipment: [],
    duration: 30,
    calorieMultiplier: 0.04,
    contraindications: [],
  },
  {
    id: 'stretching',
    name: 'Static Stretching',
    category: 'mobility',
    difficulty: 'beginner',
    equipment: [],
    duration: 15,
    calorieMultiplier: 0.02,
    contraindications: [],
  },
]

/**
 * Get max exercise difficulty based on fitness experience
 */
function getMaxDifficulty(fitnessExperience: string): 'beginner' | 'intermediate' | 'advanced' {
  if (fitnessExperience === 'advanced' || fitnessExperience === 'very-experienced') {
    return 'advanced'
  }
  if (fitnessExperience === 'intermediate' || fitnessExperience === 'somewhat-experienced') {
    return 'intermediate'
  }
  return 'beginner'
}

/**
 * Get volume targets based on fitness level
 */
interface VolumeProfile {
  setsPerExercise: number
  repsRange: [number, number]
  restSecondsBetweenSets: number
}

function getVolumeProfile(difficulty: 'beginner' | 'intermediate' | 'advanced'): VolumeProfile {
  if (difficulty === 'beginner') {
    return {
      setsPerExercise: 3,
      repsRange: [10, 15],
      restSecondsBetweenSets: 60,
    }
  }
  if (difficulty === 'intermediate') {
    return {
      setsPerExercise: 4,
      repsRange: [8, 12],
      restSecondsBetweenSets: 90,
    }
  }
  return {
    setsPerExercise: 5,
    repsRange: [6, 10],
    restSecondsBetweenSets: 120,
  }
}

/**
 * Check if exercise is safe for user
 */
export function isExerciseSafe(exercise: Exercise, onboarding: OnboardingData): boolean {
  const injuries = (onboarding.injuries || []) as string[]
  for (const injury of injuries) {
    if (exercise.contraindications.includes(injury)) {
      return false
    }
  }
  return true
}

/**
 * Filter exercises by difficulty and safety
 */
export function filterExercisesByDifficulty(
  maxDifficulty: 'beginner' | 'intermediate' | 'advanced',
  onboarding: OnboardingData
): Exercise[] {
  const difficultyMap: Record<string, number> = { beginner: 1, intermediate: 2, advanced: 3 }
  const maxScore = difficultyMap[maxDifficulty]

  return EXERCISE_DATABASE.filter((exercise) => {
    const exerciseScore = difficultyMap[exercise.difficulty]
    return exerciseScore <= maxScore && isExerciseSafe(exercise, onboarding)
  })
}

/**
 * Generate a single workout session
 */
export interface WorkoutExercise {
  name: string
  sets: number
  reps: string
  duration: number
  estimatedCaloriesBurned: number
}

export interface WorkoutSession {
  day: string
  focus: string
  exercises: WorkoutExercise[]
  totalDuration: number
  estimatedCaloriesBurned: number
  volumeProfile: VolumeProfile
}

export function generateWorkoutSession(
  day: string,
  focus: string,
  onboarding: OnboardingData
): WorkoutSession {
  const maxDifficulty = getMaxDifficulty(onboarding.fitnessExperience)
  const volumeProfile = getVolumeProfile(maxDifficulty)
  const availableExercises = filterExercisesByDifficulty(maxDifficulty, onboarding)

  // Filter by category/focus
  const focusExercises = availableExercises.filter((ex) => {
    if (focus === 'upper-push') return ex.category === 'upper-push'
    if (focus === 'upper-pull') return ex.category === 'upper-pull'
    if (focus === 'lower') return ex.category === 'lower'
    if (focus === 'full-body') {
      return ['upper-push', 'upper-pull', 'lower', 'core'].includes(ex.category)
    }
    if (focus === 'cardio') return ex.category === 'cardio'
    return true
  })

  // Pick exercises (typically 4-6 per session)
  const exerciseCount =
    focus === 'cardio' ? 1 : maxDifficulty === 'beginner' ? 4 : maxDifficulty === 'intermediate' ? 5 : 6

  const selectedExercises: WorkoutExercise[] = []
  let totalDuration = 0
  let totalCaloriesBurned = 0

  for (let i = 0; i < Math.min(exerciseCount, focusExercises.length); i++) {
    const exercise = focusExercises[i]!
    const [minReps, maxReps] = volumeProfile.repsRange
    const reps = `${minReps}-${maxReps}`
    const duration = exercise.duration
    const estimatedCalories = estimateCaloriesBurned(
      exercise.duration,
      exercise.category === 'cardio' ? 'cardio' : 'strength',
      onboarding.weightKg || 70
    )

    selectedExercises.push({
      name: exercise.name,
      sets: volumeProfile.setsPerExercise,
      reps,
      duration,
      estimatedCaloriesBurned: estimatedCalories,
    })

    totalDuration += duration
    totalCaloriesBurned += estimatedCalories
  }

  return {
    day,
    focus,
    exercises: selectedExercises,
    totalDuration,
    estimatedCaloriesBurned: totalCaloriesBurned,
    volumeProfile,
  }
}

/**
 * Generate weekly workout plan
 */
export interface WeeklyWorkoutPlan {
  sessions: WorkoutSession[]
  totalWeeklyDuration: number
  totalWeeklyCaloriesBurned: number
  rest_days: string[]
}

export function generateWeeklyWorkoutPlan(onboarding: OnboardingData): WeeklyWorkoutPlan {
  // workoutDays is a string[] of selected days — use its length as the count
  // Falls back to 3 if not set
  const workoutDaysPerWeek = (onboarding as any).workoutDaysPerWeek
    || onboarding.workoutDays?.length
    || 3
  const currentDay = new Date().getDay()

  const allDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dayMap: Record<string, string> = {
    'sun': 'Sunday', 'mon': 'Monday', 'tue': 'Tuesday', 'wed': 'Wednesday',
    'thu': 'Thursday', 'fri': 'Friday', 'sat': 'Saturday'
  }

  const selectedWorkoutDays = (onboarding.workoutDays && onboarding.workoutDays.length > 0)
    ? onboarding.workoutDays.map(d => dayMap[d.toLowerCase()] || d)
    : []

  const workoutDays: string[] = []
  const rest_days: string[] = []

  if (selectedWorkoutDays.length > 0) {
    // Use the user's selected days exactly
    workoutDays.push(...selectedWorkoutDays)
    for (const day of allDays) {
      if (!selectedWorkoutDays.includes(day)) {
        rest_days.push(day)
      }
    }
  } else {
    // Fallback: Distribute workout days evenly through the week
    const workoutDaysPerWeek = (onboarding as any).workoutDaysPerWeek
      || 3
    const daySpacing = Math.ceil(7 / workoutDaysPerWeek)
    for (let i = 0; i < workoutDaysPerWeek && workoutDays.length < 7; i++) {
      const dayIndex = (i * daySpacing) % 7
      workoutDays.push(allDays[dayIndex]!)
    }
    for (const day of allDays) {
      if (!workoutDays.includes(day)) {
        rest_days.push(day)
      }
    }
  }

  // Generate workout sessions
  const sessions: WorkoutSession[] = []
  const focusPlan = getFocusPlan(onboarding.primaryGoal, workoutDaysPerWeek)

  for (let i = 0; i < workoutDays.length; i++) {
    const day = workoutDays[i]!
    const focus = focusPlan[i] || 'full-body'
    const session = generateWorkoutSession(day, focus, onboarding)
    sessions.push(session)
  }

  const totalWeeklyDuration = sessions.reduce((sum, s) => sum + s.totalDuration, 0)
  const totalWeeklyCaloriesBurned = sessions.reduce((sum, s) => sum + s.estimatedCaloriesBurned, 0)

  return {
    sessions,
    totalWeeklyDuration,
    totalWeeklyCaloriesBurned,
    rest_days,
  }
}

/**
 * Get recommended workout focuses based on goal and frequency
 */
function getFocusPlan(goal: string, daysPerWeek: number): string[] {
  if (daysPerWeek === 3) {
    return ['full-body', 'full-body', 'full-body']
  }
  if (daysPerWeek === 4) {
    if (goal === 'muscle-gain') {
      return ['upper-push', 'lower', 'upper-pull', 'lower']
    }
    return ['full-body', 'cardio', 'full-body', 'cardio']
  }
  if (daysPerWeek === 5) {
    if (goal === 'muscle-gain') {
      return ['upper-push', 'lower', 'upper-pull', 'upper-push', 'lower']
    }
    if (goal === 'fat-loss') {
      return ['upper-push', 'cardio', 'lower', 'cardio', 'upper-pull']
    }
    return ['upper-push', 'lower', 'upper-pull', 'cardio', 'full-body']
  }
  if (daysPerWeek === 6) {
    if (goal === 'muscle-gain') {
      return ['upper-push', 'lower', 'upper-pull', 'upper-push', 'lower', 'upper-pull']
    }
    return ['upper-push', 'cardio', 'lower', 'upper-pull', 'cardio', 'full-body']
  }
  return ['full-body', 'full-body', 'full-body', 'full-body', 'full-body', 'cardio', 'cardio']
}

/**
 * Scale workout difficulty based on commitment and progress
 */
export function scaleWorkoutIntensity(
  session: WorkoutSession,
  commitmentScore: number, // 1-10
  weeksSinceStart: number = 4
): WorkoutSession {
  // After 4+ weeks, increase difficulty if commitment is high
  if (weeksSinceStart >= 4 && commitmentScore >= 7 && session.volumeProfile.setsPerExercise < 5) {
    session.volumeProfile.setsPerExercise += 1
  }

  // If commitment is low, reduce volume slightly
  if (commitmentScore <= 3) {
    session.exercises = session.exercises.slice(0, Math.max(2, Math.floor(session.exercises.length * 0.75)))
  }

  return session
}
