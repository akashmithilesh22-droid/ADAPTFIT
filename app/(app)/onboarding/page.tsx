'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  Zap,
  Brain,
  User,
  Target,
  Calendar,
  Utensils,
  Calculator,
  CheckCircle,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { validateStep, type ValidationResult } from '@/lib/onboarding-validation'
import { useAuth } from '@/lib/auth-context'
import { saveOnboardingData } from '@/lib/supabase'

// Step Components
import { WelcomeStep } from '@/components/onboarding/welcome-step'
import { BodyMetricsStep } from '@/components/onboarding/body-metrics-step'
import { FitnessBackgroundStep } from '@/components/onboarding/fitness-background-step'
import { GoalsStep } from '@/components/onboarding/goals-step'
import { ScheduleStep } from '@/components/onboarding/schedule-step'
import { DietStep } from '@/components/onboarding/diet-step'
import { MacrosStep } from '@/components/onboarding/macros-step'
import { ProcessingStep } from '@/components/onboarding/processing-step'

export interface OnboardingData {
  // Body Metrics
  age: number
  gender: string
  heightCm: number
  weightKg: number
  bodyFatPct: number
  // Fitness Background
  fitnessExperience: string
  injuries: string[]
  gymAccess: string
  // Goals
  primaryGoal: string
  timeline: string
  commitment: number
  // Schedule
  workoutDays: string[]
  workoutDuration: number
  workoutTime: string
  activityLevel: string
  // Diet
  dietType: string
  allergies: string[]
  culturalRestrictions: string
  budget: string
  cuisinePreferences: string[]
  // Macros
  calorieTarget: string
  macroPreference: string
  mealsPerDay: number
  // AI Preferences
  aiPreferences?: {
    preferBudgetMeals: boolean
    preferHomeWorkouts: boolean
    avoidAdvancedExercises: boolean
  }
}

const defaultData: OnboardingData = {
  // Body Metrics
  age: 0,
  gender: '',
  heightCm: 0,
  weightKg: 0,
  bodyFatPct: 0,

  // Fitness Background
  fitnessExperience: '',
  injuries: [],
  gymAccess: '',

  // Goals
  primaryGoal: '',
  timeline: '',
  commitment: 0,

  // Schedule
  workoutDays: [],
  workoutDuration: 0,
  workoutTime: '',
  activityLevel: '',

  // Diet
  dietType: '',
  allergies: [],
  culturalRestrictions: '',
  budget: '',
  cuisinePreferences: [],

  // Macros
  calorieTarget: '',
  macroPreference: '',
  mealsPerDay: 0,
  
  // AI Preferences
  aiPreferences: {
    preferBudgetMeals: false,
    preferHomeWorkouts: false,
    avoidAdvancedExercises: false,
  }
}

const steps = [
  { id: 'welcome', icon: Zap, title: 'Welcome' },
  { id: 'body', icon: User, title: 'Body Metrics' },
  { id: 'fitness', icon: Brain, title: 'Fitness Background' },
  { id: 'goals', icon: Target, title: 'Goals' },
  { id: 'schedule', icon: Calendar, title: 'Schedule' },
  { id: 'diet', icon: Utensils, title: 'Diet' },
  { id: 'macros', icon: Calculator, title: 'Macros' },
  { id: 'processing', icon: CheckCircle, title: 'Processing' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<OnboardingData>(defaultData)
  const [isProcessing, setIsProcessing] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationResult>({
    isValid: true,
    errors: [],
  })
  const [showErrors, setShowErrors] = useState(false)

  const { user } = useAuth()

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }))
    // Clear errors when user makes changes (optimistic validation clearing)
    setShowErrors(false)
  }

  const saveOnboarding = async () => {
    if (!user) {
      toast.error('Authentication required', {
        description: 'Please log in again to save your onboarding data.',
      })
      router.push('/login')
      return false
    }

    const error = await saveOnboardingData(user.id, data)

    if (error) {
      toast.error('Unable to save your onboarding answers', {
        description: error.message,
      })
      return false
    }

    return true
  }

  const nextStep = async () => {
    // Validate current step before advancing
    const validation = validateStep(currentStep, data)
    setValidationErrors(validation)

    if (!validation.isValid) {
      setShowErrors(true)
      // Show error toast
      const errorCount = validation.errors.length
      toast.error('Please complete all required fields', {
        description: `${errorCount} field${errorCount !== 1 ? 's' : ''} need${errorCount !== 1 ? '' : 's'} attention`,
      })
      return
    }

    // Clear errors on successful validation
    setShowErrors(false)

    if (currentStep === steps.length - 2) {
      setIsProcessing(true)
      const saved = await saveOnboarding()
      if (!saved) {
        setIsProcessing(false)
        return
      }
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
      setShowErrors(false)
    }
  }

  const handleComplete = async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    toast.success('Your AI coach is ready!', {
      description: 'Your personalized fitness plan has been created.',
    })
    router.push('/dashboard')
  }

  const progress = ((currentStep) / (steps.length - 1)) * 100
  const isNextDisabled = !validationErrors.isValid && showErrors

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-[family-name:var(--font-syne)] font-bold text-xl text-foreground">
                AdaptFit
              </span>
            </div>
            
            {/* Step indicator */}
            <span className="text-sm text-foreground-muted">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {currentStep === 0 && <WelcomeStep onNext={nextStep} />}
            {currentStep === 1 && (
              <BodyMetricsStep 
                data={data} 
                updateData={updateData}
              />
            )}
            {currentStep === 2 && (
              <FitnessBackgroundStep 
                data={data} 
                updateData={updateData}
              />
            )}
            {currentStep === 3 && (
              <GoalsStep 
                data={data} 
                updateData={updateData}
              />
            )}
            {currentStep === 4 && (
              <ScheduleStep 
                data={data} 
                updateData={updateData}
              />
            )}
            {currentStep === 5 && (
              <DietStep 
                data={data} 
                updateData={updateData}
              />
            )}
            {currentStep === 6 && (
              <MacrosStep 
                data={data} 
                updateData={updateData}
              />
            )}
            {currentStep === 7 && <ProcessingStep isProcessing={isProcessing} onComplete={handleComplete} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer navigation */}
      {currentStep > 0 && currentStep < steps.length - 1 && (
        <footer className="border-t border-border bg-background/80 backdrop-blur-xl sticky bottom-0">
          <div className="max-w-4xl mx-auto px-4 py-4">
            {/* Validation errors display */}
            <AnimatePresence>
              {showErrors && validationErrors.errors.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-destructive mb-2">
                      {validationErrors.errors.length} field{validationErrors.errors.length !== 1 ? 's' : ''} require{validationErrors.errors.length !== 1 ? '' : 's'} attention:
                    </p>
                    <ul className="text-xs text-destructive space-y-1">
                      {validationErrors.errors.map((error, idx) => (
                        <li key={idx}>• {error.message}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="text-foreground-secondary"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              <div className="flex gap-2">
                {steps.slice(0, -1).map((step, index) => (
                  <div
                    key={step.id}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentStep 
                        ? 'bg-primary' 
                        : index < currentStep 
                        ? 'bg-success' 
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={nextStep}
                disabled={isNextDisabled}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentStep === steps.length - 2 ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2" />
                    Generate Plan
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
