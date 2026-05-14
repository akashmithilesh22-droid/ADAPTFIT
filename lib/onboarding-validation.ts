/**
 * Onboarding Validation Rules and Utilities
 */

import type { OnboardingData } from '@/app/(app)/onboarding/page'

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

/**
 * Validation rules for each step
 */

export const validateWelcomeStep = (): ValidationResult => {
  // Welcome step is just informational
  return { isValid: true, errors: [] }
}

export const validateBodyMetricsStep = (data: OnboardingData): ValidationResult => {
  const errors: ValidationError[] = []

  if (!data.gender) {
    errors.push({ field: 'gender', message: 'Please select your gender' })
  }

  if (!data.heightCm || data.heightCm < 140 || data.heightCm > 220) {
    errors.push({ field: 'height', message: 'Height must be between 140-220 cm' })
  }

  if (!data.weightKg || data.weightKg < 40 || data.weightKg > 180) {
    errors.push({ field: 'weight', message: 'Weight must be between 40-180 kg' })
  }

  if (!data.age || data.age < 16 || data.age > 80) {
    errors.push({ field: 'age', message: 'Age must be between 16-80 years' })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const validateFitnessBackgroundStep = (data: OnboardingData): ValidationResult => {
  const errors: ValidationError[] = []

  if (!data.fitnessExperience) {
    errors.push({ field: 'experience', message: 'Please select your fitness experience level' })
  }

  if (!data.gymAccess) {
    errors.push({ field: 'gymAccess', message: 'Please select your gym access type' })
  }

  // Injuries is optional but if selected, validate format
  if (data.injuries.length === 0) {
    errors.push({ field: 'injuries', message: 'Please select your injury status' })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const validateGoalsStep = (data: OnboardingData): ValidationResult => {
  const errors: ValidationError[] = []

  if (!data.primaryGoal) {
    errors.push({ field: 'primaryGoal', message: 'Please select your primary goal' })
  }

  if (!data.timeline) {
    errors.push({ field: 'timeline', message: 'Please select a timeline for your goal' })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const validateScheduleStep = (data: OnboardingData): ValidationResult => {
  const errors: ValidationError[] = []

  if (!data.workoutDays || data.workoutDays.length === 0) {
    errors.push({ field: 'workoutDays', message: 'Please select at least one workout day' })
  }

  if (!data.workoutTime) {
    errors.push({ field: 'workoutTime', message: 'Please select your preferred workout time' })
  }

  if (!data.activityLevel) {
    errors.push({ field: 'activityLevel', message: 'Please select your activity level' })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const validateDietStep = (data: OnboardingData): ValidationResult => {
  const errors: ValidationError[] = []

  if (!data.dietType) {
    errors.push({ field: 'dietType', message: 'Please select your diet type' })
  }

  if (!data.budget) {
    errors.push({ field: 'budget', message: 'Please select your budget level' })
  }

  if (!data.allergies || data.allergies.length === 0) {
    errors.push({ field: 'allergies', message: 'Please select your allergy status' })
  }

  if (!data.cuisinePreferences || data.cuisinePreferences.length === 0) {
    errors.push({ field: 'cuisinePreferences', message: 'Please select at least one cuisine preference' })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const validateMacrosStep = (data: OnboardingData): ValidationResult => {
  const errors: ValidationError[] = []

  if (!data.calorieTarget) {
    errors.push({ field: 'calorieTarget', message: 'Please select your calorie target' })
  }

  if (!data.macroPreference) {
    errors.push({ field: 'macroPreference', message: 'Please select your macro preference' })
  }

  if (!data.mealsPerDay || data.mealsPerDay < 1 || data.mealsPerDay > 10) {
    errors.push({ field: 'mealsPerDay', message: 'Please enter a valid number of meals per day' })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Master validation function that validates the current step
 */
export const validateStep = (stepIndex: number, data: OnboardingData): ValidationResult => {
  switch (stepIndex) {
    case 0: // Welcome
      return validateWelcomeStep()
    case 1: // Body Metrics
      return validateBodyMetricsStep(data)
    case 2: // Fitness Background
      return validateFitnessBackgroundStep(data)
    case 3: // Goals
      return validateGoalsStep(data)
    case 4: // Schedule
      return validateScheduleStep(data)
    case 5: // Diet
      return validateDietStep(data)
    case 6: // Macros
      return validateMacrosStep(data)
    case 7: // Processing
      return { isValid: true, errors: [] }
    default:
      return { isValid: true, errors: [] }
  }
}

/**
 * Validate entire onboarding data (for final submission)
 */
export const validateCompleteOnboarding = (data: OnboardingData): ValidationResult => {
  const errors: ValidationError[] = []

  // Validate each section
  const sections = [
    validateBodyMetricsStep(data),
    validateFitnessBackgroundStep(data),
    validateGoalsStep(data),
    validateScheduleStep(data),
    validateDietStep(data),
    validateMacrosStep(data),
  ]

  sections.forEach(section => {
    errors.push(...section.errors)
  })

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Check if a field has an error
 */
export const getFieldError = (errors: ValidationError[], fieldName: string): string | null => {
  return errors.find(e => e.field === fieldName)?.message || null
}

/**
 * Check if a field has an error (convenience method)
 */
export const hasError = (errors: ValidationError[], fieldName: string): boolean => {
  return !!getFieldError(errors, fieldName)
}
