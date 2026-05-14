// User Profile Types
export interface UserProfile {
  id: string
  age: number
  gender: string
  heightCm: number
  weightKg: number
  bodyFatPct: number
  fitnessExperience: 'beginner' | 'intermediate' | 'advanced'
  injuries: string[]
  gymAccess: 'full-gym' | 'home-gym' | 'dumbbells-only' | 'bodyweight-only'
  activityLevel: 'sedentary' | 'lightly-active' | 'moderately-active' | 'very-active'
  createdAt: Date
  updatedAt: Date
}

// Fitness Goal Types
export interface FitnessGoal {
  id: string
  userId: string
  primaryGoal: 'bulking' | 'cutting' | 'maintenance' | 'body-recomposition'
  strength: 'strength-focused' | 'muscle-gain-focused' | 'fat-loss-focused'
  aestheticPreferences: ('bigger-arms' | 'wider-shoulders' | 'bigger-chest' | 'lean-aesthetic' | 'strength-athlete' | 'athletic-conditioning')[]
  timeline: number // weeks
  commitment: number // 1-10 scale
  createdAt: Date
}

// Workout Split Types
export type WorkoutSplit = 'push-pull-legs' | 'arnold' | 'upper-lower' | 'full-body' | 'hybrid'

export interface Exercise {
  id: string
  name: string
  targetMuscles: string[]
  equipment: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  sets: number
  reps: number | string // e.g., "8-12"
  restSeconds: number
  notes?: string
}

export interface Workout {
  id: string
  userId: string
  dayOfWeek: number // 0-6
  name: string
  exercises: Exercise[]
  estimatedDuration: number // minutes
  intensity: 'low' | 'moderate' | 'high'
  createdAt: Date
}

export interface WeeklySchedule {
  id: string
  userId: string
  split: WorkoutSplit
  workouts: Workout[]
  cardioAllocation: number // minutes per week
  createdAt: Date
}

// Diet Types
export interface MealPlan {
  id: string
  userId: string
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre-workout' | 'post-workout'
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
  ingredients: string[]
  cost?: number
  prepTime?: number
}

export interface DailyDietPlan {
  id: string
  userId: string
  date: Date
  meals: MealPlan[]
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFats: number
}

export interface DietPreferences {
  id: string
  userId: string
  dietType: 'vegetarian' | 'non-vegetarian' | 'eggetarian' | 'vegan'
  allergies: string[]
  culturalRestrictions: string
  budget: 'low' | 'medium' | 'high'
  cuisinePreferences: string[]
  mealsPerDay: number
}

// Recovery Types
export interface RecoveryMetrics {
  userId: string
  date: Date
  sleepDuration: number // hours
  sorenessLevel: number // 1-10
  stressLevel: number // 1-10
  previousWorkoutIntensity: number // 1-10
  mood: 'great' | 'good' | 'okay' | 'bad'
}

export interface RecoveryScore {
  score: number // 0-100
  readiness: 'low' | 'moderate' | 'high'
  recommendation: string
  suggestedIntensity: 'rest' | 'light' | 'moderate' | 'heavy'
}

// Gamification Types
export interface Achievement {
  id: string
  userId: string
  title: string
  description: string
  icon: string
  unlockedAt: Date
  points: number
}

export interface UserStats {
  userId: string
  level: number
  totalPoints: number
  workoutStreak: number
  longestStreak: number
  totalWorkouts: number
  completionRate: number // percentage
  achievements: Achievement[]
}

// Progress Tracking Types
export interface ProgressEntry {
  userId: string
  date: Date
  weight: number
  bodyFat?: number
  measurements?: {
    chest?: number
    arms?: number
    waist?: number
    thighs?: number
  }
  photos?: string[] // URLs
  notes?: string
}

export interface StrengthPR {
  userId: string
  exercise: string
  weight: number
  reps: number
  date: Date
}

export interface WorkoutLog {
  userId: string
  workoutId: string
  date: Date
  exerciseLogs: {
    exerciseId: string
    setsCompleted: number
    repsCompleted: number[]
    weightUsed: number
    notes?: string
  }[]
  duration: number // minutes
  intensity: 'light' | 'moderate' | 'heavy'
  notes?: string
  missed?: boolean
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  type: 'missed-workout' | 'recovery-tip' | 'nutrition-alert' | 'achievement' | 'streak' | 'reminder'
  title: string
  message: string
  actionUrl?: string
  read: boolean
  createdAt: Date
}

// Recommendation Types
export interface Recommendation {
  type: 'exercise-replacement' | 'split-change' | 'recovery-improvement' | 'diet-adjustment'
  title: string
  description: string
  reason: string
  impact: 'high' | 'medium' | 'low'
  priority: number
}
