'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  X, 
  CheckCircle, 
  AlertTriangle, 
  Loader2,
  Shield,
  Activity,
  Brain,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WorkoutDay {
  id: string
  day: string
  type: string
  color: string
  status: 'upcoming' | 'completed' | 'missed' | 'adapted'
}

const initialSchedule: WorkoutDay[] = [
  { id: '1', day: 'Mon', type: 'Push', color: 'bg-primary', status: 'completed' },
  { id: '2', day: 'Tue', type: 'Pull', color: 'bg-secondary', status: 'completed' },
  { id: '3', day: 'Wed', type: 'Legs', color: 'bg-success', status: 'upcoming' },
  { id: '4', day: 'Thu', type: 'Rest', color: 'bg-muted', status: 'upcoming' },
  { id: '5', day: 'Fri', type: 'Push', color: 'bg-primary', status: 'upcoming' },
  { id: '6', day: 'Sat', type: 'Pull', color: 'bg-secondary', status: 'upcoming' },
  { id: '7', day: 'Sun', type: 'Rest', color: 'bg-muted', status: 'upcoming' },
]

const adaptedSchedule: WorkoutDay[] = [
  { id: '1', day: 'Mon', type: 'Push', color: 'bg-primary', status: 'completed' },
  { id: '2', day: 'Tue', type: 'Pull', color: 'bg-secondary', status: 'completed' },
  { id: '3', day: 'Wed', type: 'Missed', color: 'bg-destructive', status: 'missed' },
  { id: '4', day: 'Thu', type: 'Legs', color: 'bg-success', status: 'adapted' },
  { id: '5', day: 'Fri', type: 'Active Recovery', color: 'bg-warning', status: 'adapted' },
  { id: '6', day: 'Sat', type: 'Push', color: 'bg-primary', status: 'adapted' },
  { id: '7', day: 'Sun', type: 'Pull', color: 'bg-secondary', status: 'adapted' },
]

const reasoningSteps = [
  { icon: AlertTriangle, text: 'Detecting missed workout...', color: 'text-warning' },
  { icon: Activity, text: 'Analyzing muscle overlap...', color: 'text-primary' },
  { icon: Calendar, text: 'Calculating recovery windows...', color: 'text-secondary' },
  { icon: Brain, text: 'Rebuilding optimal schedule...', color: 'text-accent' },
]

export function AdaptiveDemoSection() {
  const [schedule, setSchedule] = useState(initialSchedule)
  const [isAdapting, setIsAdapting] = useState(false)
  const [isAdapted, setIsAdapted] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)

  const handleMissWorkout = async () => {
    if (isAdapting || isAdapted) return

    setIsAdapting(true)
    
    // Step through reasoning
    for (let i = 0; i < reasoningSteps.length; i++) {
      setCurrentStep(i)
      await new Promise(resolve => setTimeout(resolve, 800))
    }
    
    // Apply adaptation
    await new Promise(resolve => setTimeout(resolve, 400))
    setSchedule(adaptedSchedule)
    setIsAdapting(false)
    setIsAdapted(true)
    setCurrentStep(-1)
  }

  const handleReset = () => {
    setSchedule(initialSchedule)
    setIsAdapted(false)
    setCurrentStep(-1)
  }

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-4">
            <Sparkles className="w-4 h-4" />
            Live Demo
          </span>
          <h2 className="font-[family-name:var(--font-syne)] font-bold text-3xl sm:text-4xl md:text-5xl text-foreground text-balance">
            Watch the AI adapt. Live.
          </h2>
          <p className="mt-4 text-lg text-foreground-secondary max-w-2xl mx-auto">
            Click the button to simulate missing a workout and watch our AI restructure your entire week in real-time.
          </p>
        </motion.div>

        {/* Demo Widget */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="glass rounded-3xl p-6 md:p-8 border border-primary/20">
            <div className="grid lg:grid-cols-[1fr_320px] gap-8">
              {/* Calendar/Schedule View */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-[family-name:var(--font-space-grotesk)] font-semibold text-xl text-foreground flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    This Week&apos;s Schedule
                  </h3>
                  {isAdapted && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-success/20 text-success text-sm font-medium"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Adapted
                    </motion.span>
                  )}
                </div>

                {/* Week Grid */}
                <div className="grid grid-cols-7 gap-2 md:gap-3">
                  <AnimatePresence mode="wait">
                    {schedule.map((day, index) => (
                      <motion.div
                        key={`${day.id}-${day.type}`}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ 
                          opacity: 1, 
                          scale: 1,
                          transition: { delay: index * 0.05 }
                        }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`relative rounded-xl p-3 md:p-4 text-center transition-all duration-300 ${
                          day.status === 'missed' 
                            ? 'bg-destructive/20 border border-destructive/50' 
                            : day.status === 'adapted'
                            ? 'bg-success/10 border border-success/30'
                            : day.status === 'completed'
                            ? 'bg-muted/50 border border-border'
                            : 'bg-muted/30 border border-border'
                        }`}
                      >
                        <span className="text-xs text-foreground-muted font-[family-name:var(--font-jetbrains-mono)]">
                          {day.day}
                        </span>
                        <div className={`mt-2 h-2 w-2 mx-auto rounded-full ${day.color}`} />
                        <span className={`mt-2 block text-xs font-medium ${
                          day.status === 'missed' 
                            ? 'text-destructive line-through' 
                            : day.status === 'adapted'
                            ? 'text-success'
                            : 'text-foreground-secondary'
                        }`}>
                          {day.type}
                        </span>
                        {day.status === 'missed' && (
                          <X className="absolute top-1 right-1 w-3 h-3 text-destructive" />
                        )}
                        {day.status === 'adapted' && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-success flex items-center justify-center"
                          >
                            <CheckCircle className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Action Button */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  {!isAdapted ? (
                    <Button
                      onClick={handleMissWorkout}
                      disabled={isAdapting}
                      size="lg"
                      className="bg-destructive hover:bg-destructive/90 text-white"
                    >
                      {isAdapting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          AI Recalculating...
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4 mr-2" />
                          Miss Leg Day (Wednesday)
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleReset}
                      size="lg"
                      variant="outline"
                      className="border-primary/50 hover:bg-primary/10"
                    >
                      Reset Demo
                    </Button>
                  )}
                </div>
              </div>

              {/* AI Reasoning Panel */}
              <div className="glass rounded-2xl p-5 bg-background/50">
                <h4 className="font-[family-name:var(--font-space-grotesk)] font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-primary" />
                  AI Reasoning
                </h4>

                {/* Processing Steps */}
                <div className="space-y-3 mb-6">
                  {reasoningSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0.3 }}
                      animate={{ 
                        opacity: currentStep >= index || isAdapted ? 1 : 0.3,
                      }}
                      className="flex items-center gap-3 text-sm"
                    >
                      {currentStep === index ? (
                        <Loader2 className={`w-4 h-4 ${step.color} animate-spin`} />
                      ) : currentStep > index || isAdapted ? (
                        <CheckCircle className="w-4 h-4 text-success" />
                      ) : (
                        <step.icon className={`w-4 h-4 ${step.color} opacity-50`} />
                      )}
                      <span className={currentStep >= index || isAdapted ? 'text-foreground-secondary' : 'text-foreground-muted'}>
                        {step.text}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Results */}
                <AnimatePresence>
                  {isAdapted && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3 pt-4 border-t border-border"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground-secondary">Volume maintained</span>
                        <span className="text-success font-[family-name:var(--font-jetbrains-mono)] font-medium">97%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground-secondary">Overtraining risk</span>
                        <span className="text-success font-[family-name:var(--font-jetbrains-mono)] font-medium flex items-center gap-1">
                          Low <Shield className="w-3 h-3" />
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground-secondary">Recovery gaps</span>
                        <span className="text-success font-[family-name:var(--font-jetbrains-mono)] font-medium">Optimal</span>
                      </div>

                      <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                        <p className="text-xs text-foreground-secondary leading-relaxed">
                          <strong className="text-primary">AI Note:</strong> Moved Legs to Thursday. Inserted Active Recovery on Friday to prevent fatigue cascade. Adjusted weekend to maintain weekly volume.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
