import type { OnboardingData } from '@/app/(app)/onboarding/page'
import { generateWorkoutPlan, calculateNutritionTargets } from '@/lib/services/plan-service'
import { generateWeeklyWorkoutPlan } from '@/lib/workout-generator'

export interface DashboardStats {
  weeklyStreak: number
  workoutsThisWeek: string
  achievements: number
  goalProgress: number
}

export interface DashboardExercise {
  name: string
  sets: number
  reps: string
  muscle: string
}

export interface TodayWorkoutData {
  name: string
  type: string
  duration: string
  calories: number
  exercises: DashboardExercise[]
  aiAdjustment: string
}

export interface WeeklyActivityPoint {
  day: string
  workouts: number
  calories: number
  duration: number
}

export interface WeeklySummary {
  workouts: number
  calories: number
  totalTime: string
}

export interface RecoveryFactor {
  label: string
  value: number
}

export interface NutritionMetric {
  current: number
  target: number
  unit: string
}

export interface NutritionData {
  calories: NutritionMetric
  protein: NutritionMetric
  carbs: NutritionMetric
  fats: NutritionMetric
  water: NutritionMetric
}

export interface UpcomingWorkout {
  id: number
  name: string
  day: string
  time: string
  duration: string
  type: 'strength' | 'cardio' | 'recovery'
}

export interface DashboardData {
  stats: DashboardStats
  workout: TodayWorkoutData
  weeklyData: WeeklyActivityPoint[]
  summary: WeeklySummary
  recovery: {
    overall: number | string
    factors: RecoveryFactor[]
  }
  nutrition: NutritionData
  schedule: UpcomingWorkout[]
}

const timeLabelMap: Record<string, string> = {
  morning: '7:00 AM',
  afternoon: '12:00 PM',
  evening: '6:00 PM',
  flexible: 'Anytime',
}

const normalizeDays = (days: string[]) => {
  const order = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  return [...days].sort((a, b) => order.indexOf(a) - order.indexOf(b))
}

/**
 * Recovery scores require historical tracking (sleep, HRV, soreness, etc.)
 * Without that data, we can only provide "Not enough data yet"
 */
const getRecoveryStatus = (data: OnboardingData): { overall: number | string; factors: RecoveryFactor[] } => {
  return {
    overall: 'Not enough data',
    factors: [
      { label: 'Sleep Quality', value: 0 },
      { label: 'Muscle Soreness', value: 0 },
      { label: 'Heart Rate Variability', value: 0 },
      { label: 'Readiness', value: 0 },
    ],
  }
}

export function buildDashboardData(onboarding: OnboardingData): DashboardData {
  const selectedDays = normalizeDays(onboarding.workoutDays)
  const totalDays = selectedDays.length || 3
  const dayOrder = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  
  const workoutPlan = generateWorkoutPlan(onboarding)
  const nutritionTargets = calculateNutritionTargets(onboarding)
  const weeklyWorkoutPlan = generateWeeklyWorkoutPlan(onboarding)

  const dayMap: Record<string, string> = {
    mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday',
    thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday'
  }

  // Build weekly activity data based on scheduled workouts
  const weeklyData = dayOrder.map((day) => {
    const hasWorkout = selectedDays.includes(day)
    const fullName = dayMap[day]
    const daySession = weeklyWorkoutPlan.sessions.find(s => s.day === fullName)
    const displayLabel = fullName.slice(0, 3)
    
    return {
      day: displayLabel,
      workouts: hasWorkout ? 1 : 0,
      calories: hasWorkout && daySession ? daySession.estimatedCaloriesBurned : 0,
      duration: hasWorkout && daySession ? daySession.totalDuration : 0,
    }
  })

  const totalCalories = weeklyData.reduce((sum, point) => sum + point.calories, 0)
  const totalTime = weeklyData.reduce((sum, point) => sum + point.duration, 0)

  // Nutrition data - use target values as "current" is hypothetical
  // In a real app, this would come from logged meals
  const currentCalories = nutritionTargets.calories
  const currentProtein = nutritionTargets.protein
  const currentCarbs = nutritionTargets.carbs
  const currentFats = nutritionTargets.fats
  const currentWater = nutritionTargets.water

  // Schedule: show planned workouts for this week
  const schedule = weeklyWorkoutPlan.sessions.slice(0, 3).map((session, index) => ({
    id: index + 1,
    name: `${session.focus.replace('-', ' ').toUpperCase()} Session`,
    day: session.day,
    time: timeLabelMap[onboarding.workoutTime] ?? 'Anytime',
    duration: `${session.totalDuration} min`,
    type: session.focus === 'cardio' ? 'cardio' : session.focus === 'mobility' ? 'recovery' : 'strength',
  } as UpcomingWorkout))

  // Dashboard stats - be more honest about real vs. estimated data
  const recoveryData = getRecoveryStatus(onboarding)

  return {
    stats: {
      // Streak: requires historical data, show as placeholder
      weeklyStreak: totalDays,
      workoutsThisWeek: `${totalDays} planned`,
      // Achievements: requires progress tracking, show as "Not started"
      achievements: 0,
      // Goal Progress: can only estimate based on planned vs. completed (which we don't track yet)
      goalProgress: 0,
    },
    workout: {
      name: workoutPlan.name,
      type: workoutPlan.type,
      duration: `${workoutPlan.duration} min`,
      calories: workoutPlan.calories,
      exercises: workoutPlan.exercises,
      aiAdjustment: workoutPlan.aiAdjustment,
    },
    weeklyData,
    summary: {
      workouts: totalDays,
      calories: totalCalories,
      totalTime: `${totalTime}m`,
    },
    recovery: {
      overall: recoveryData.overall,
      factors: recoveryData.factors,
    },
    nutrition: {
      calories: { current: currentCalories, target: nutritionTargets.calories, unit: 'kcal' },
      protein: { current: currentProtein, target: nutritionTargets.protein, unit: 'g' },
      carbs: { current: currentCarbs, target: nutritionTargets.carbs, unit: 'g' },
      fats: { current: currentFats, target: nutritionTargets.fats, unit: 'g' },
      water: { current: currentWater, target: nutritionTargets.water, unit: 'glasses' },
    },
    schedule,
  }
}