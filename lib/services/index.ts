// Export all AI services
export { AIService } from './ai-service'
export { WorkoutGenerator } from './workout-generator'
export { ScheduleAdapter } from './schedule-adapter'
export { DietPlanner } from './diet-planner'
export { GamificationService } from './gamification'
export { RecommendationEngine } from './recommendation-engine'
export { NotificationService } from './notification-service'
export { FatigueAdjuster } from './fatigue-adjuster'

// Gemini AI Service (server-side only)
export type { AIWorkoutPlan, AIDietPlan, AIRecoveryPlan, AIExercise, AIWorkoutDay, AIMeal, AIMealSuggestion, AIRecoveryTip } from './groq-ai-service'
export { generateWorkoutPlan, generateDietPlan, generateRecoveryPlan } from './groq-ai-service'
