'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Brain, Dumbbell, Utensils, Activity, Calendar, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProcessingStepProps {
  isProcessing: boolean
  onComplete: () => void
}

const processingSteps = [
  { icon: Brain, label: 'Analyzing your profile', duration: 1200 },
  { icon: Activity, label: 'Body composition analyzed', duration: 1000 },
  { icon: Dumbbell, label: 'Workout split generated', duration: 1400 },
  { icon: Utensils, label: 'Meal plan created', duration: 1200 },
  { icon: Calendar, label: 'Schedule optimized', duration: 1000 },
]

export function ProcessingStep({ isProcessing, onComplete }: ProcessingStepProps) {
  const [currentStep, setCurrentStep] = useState(-1)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (!isProcessing) return

    let totalDelay = 0
    const timeouts: NodeJS.Timeout[] = []

    processingSteps.forEach((step, index) => {
      const timeout = setTimeout(() => {
        setCurrentStep(index)
      }, totalDelay)
      timeouts.push(timeout)
      totalDelay += step.duration
    })

    // Mark complete after all steps
    const completeTimeout = setTimeout(() => {
      setIsComplete(true)
    }, totalDelay + 500)
    timeouts.push(completeTimeout)

    return () => {
      timeouts.forEach(clearTimeout)
    }
  }, [isProcessing])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <AnimatePresence mode="wait">
        {!isComplete ? (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md"
          >
            {/* Neural network animation */}
            <div className="relative w-32 h-32 mx-auto mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-secondary" />
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-success" />
              </motion.div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Brain className="w-10 h-10 text-white" />
                </div>
              </div>
              
              {/* Pulse effect */}
              <motion.div
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-primary/30"
              />
            </div>

            <h2 className="font-[family-name:var(--font-syne)] font-bold text-3xl text-foreground mb-2">
              Building your plan...
            </h2>
            <p className="text-foreground-secondary mb-8">
              Our AI is analyzing 47 data points to create your perfect program.
            </p>

            {/* Progress steps */}
            <div className="space-y-3 text-left">
              {processingSteps.map((step, index) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: currentStep >= index ? 1 : 0.3,
                    x: 0 
                  }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
                >
                  {currentStep > index ? (
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                  ) : currentStep === index ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <step.icon className="w-5 h-5 text-primary flex-shrink-0" />
                    </motion.div>
                  ) : (
                    <step.icon className="w-5 h-5 text-foreground-muted flex-shrink-0" />
                  )}
                  <span className={currentStep >= index ? 'text-foreground' : 'text-foreground-muted'}>
                    {step.label}
                  </span>
                  {currentStep === index && (
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="ml-auto text-xs text-primary"
                    >
                      Processing...
                    </motion.span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-full max-w-md"
          >
            {/* Success animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="relative w-32 h-32 mx-auto mb-8"
            >
              <div className="absolute inset-0 rounded-full bg-success/20" />
              <div className="absolute inset-2 rounded-full bg-success/30 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                >
                  <CheckCircle className="w-16 h-16 text-success" />
                </motion.div>
              </div>
              
              {/* Confetti-like particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{ 
                    scale: [0, 1, 0],
                    x: Math.cos(i * 45 * Math.PI / 180) * 80,
                    y: Math.sin(i * 45 * Math.PI / 180) * 80,
                  }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className={`absolute top-1/2 left-1/2 w-3 h-3 rounded-full ${
                    i % 3 === 0 ? 'bg-primary' : i % 3 === 1 ? 'bg-secondary' : 'bg-accent'
                  }`}
                />
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-success/10 border border-success/20 text-sm font-medium text-success mb-4">
                <Sparkles className="w-4 h-4" />
                Plan Generated
              </span>

              <h2 className="font-[family-name:var(--font-syne)] font-bold text-3xl text-foreground mb-2">
                Your AI coach is ready!
              </h2>
              <p className="text-foreground-secondary mb-8">
                We&apos;ve created a fully personalized workout and nutrition plan just for you.
              </p>

              <Button
                onClick={onComplete}
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8"
              >
                View Your Plan
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
