import { create } from 'zustand'
import { UserProfile, FitnessGoal, WeeklySchedule, DailyDietPlan, UserStats, ProgressEntry, WorkoutLog } from '@/types'

interface FitnessStore {
  // User Profile
  userProfile: UserProfile | null
  setUserProfile: (profile: UserProfile) => void

  // Fitness Goal
  fitnessGoal: FitnessGoal | null
  setFitnessGoal: (goal: FitnessGoal) => void

  // Weekly Schedule
  weeklySchedule: WeeklySchedule | null
  setWeeklySchedule: (schedule: WeeklySchedule) => void

  // Diet Plans
  dietPlans: DailyDietPlan[]
  setDietPlans: (plans: DailyDietPlan[]) => void

  // User Stats & Gamification
  userStats: UserStats | null
  setUserStats: (stats: UserStats) => void

  // Progress Tracking
  progressHistory: ProgressEntry[]
  addProgressEntry: (entry: ProgressEntry) => void

  // Workout Logs
  workoutLogs: WorkoutLog[]
  addWorkoutLog: (log: WorkoutLog) => void

  // UI State
  isLoading: boolean
  setIsLoading: (loading: boolean) => void

  // Reset
  resetAll: () => void
}

export const useFitnessStore = create<FitnessStore>((set) => ({
  userProfile: null,
  setUserProfile: (profile) => set({ userProfile: profile }),

  fitnessGoal: null,
  setFitnessGoal: (goal) => set({ fitnessGoal: goal }),

  weeklySchedule: null,
  setWeeklySchedule: (schedule) => set({ weeklySchedule: schedule }),

  dietPlans: [],
  setDietPlans: (plans) => set({ dietPlans: plans }),

  userStats: null,
  setUserStats: (stats) => set({ userStats: stats }),

  progressHistory: [],
  addProgressEntry: (entry) =>
    set((state) => ({
      progressHistory: [...state.progressHistory, entry],
    })),

  workoutLogs: [],
  addWorkoutLog: (log) =>
    set((state) => ({
      workoutLogs: [...state.workoutLogs, log],
    })),

  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),

  resetAll: () =>
    set({
      userProfile: null,
      fitnessGoal: null,
      weeklySchedule: null,
      dietPlans: [],
      userStats: null,
      progressHistory: [],
      workoutLogs: [],
      isLoading: false,
    }),
}))
