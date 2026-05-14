'use client'

import { motion } from 'framer-motion'
import { UserCircle, Cpu, Dumbbell, RefreshCw, ArrowRight } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: UserCircle,
    title: 'Tell us about you',
    description: 'Quick 3-minute onboarding captures your body metrics, goals, schedule, and dietary preferences.',
    visual: 'form',
  },
  {
    number: '02',
    icon: Cpu,
    title: 'AI builds your plan',
    description: 'Our neural network analyzes 47 biomarkers to create your perfectly optimized program.',
    visual: 'processing',
  },
  {
    number: '03',
    icon: Dumbbell,
    title: 'Train with purpose',
    description: 'Follow AI-optimized workouts with real-time guidance and progressive overload tracking.',
    visual: 'workout',
  },
  {
    number: '04',
    icon: RefreshCw,
    title: 'AI adapts in real-time',
    description: 'Miss a session? The AI restructures your week to maintain progress without burnout.',
    visual: 'adapt',
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-24 md:py-32 bg-background-secondary">
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-[family-name:var(--font-syne)] font-bold text-3xl sm:text-4xl md:text-5xl text-foreground text-balance">
            From zero to optimized in minutes.
          </h2>
          <p className="mt-4 text-lg text-foreground-secondary max-w-2xl mx-auto">
            A simple four-step journey to your most intelligent fitness program ever.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 -translate-y-1/2" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative"
              >
                {/* Step card */}
                <div className="glass rounded-2xl p-6 h-full">
                  {/* Number badge */}
                  <div className="relative mb-6">
                    <span className="font-[family-name:var(--font-syne)] font-bold text-6xl bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent opacity-20">
                      {step.number}
                    </span>
                    <div className="absolute top-1/2 left-16 -translate-y-1/2 w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="font-[family-name:var(--font-space-grotesk)] font-semibold text-xl text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-foreground-secondary leading-relaxed text-sm">
                    {step.description}
                  </p>

                  {/* Visual preview */}
                  <div className="mt-6 rounded-lg bg-background/50 border border-border p-4">
                    <StepVisual type={step.visual} />
                  </div>
                </div>

                {/* Arrow connector (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-4 z-10 w-8 h-8 rounded-full bg-background border border-border items-center justify-center -translate-y-1/2">
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function StepVisual({ type }: { type: string }) {
  switch (type) {
    case 'form':
      return (
        <div className="space-y-2">
          <div className="h-2 bg-primary/30 rounded-full w-3/4" />
          <div className="h-2 bg-secondary/30 rounded-full w-1/2" />
          <div className="h-2 bg-accent/30 rounded-full w-2/3" />
          <div className="flex gap-2 mt-3">
            <div className="h-6 w-6 rounded bg-primary/20" />
            <div className="h-6 w-6 rounded bg-secondary/20" />
            <div className="h-6 w-6 rounded bg-accent/20" />
          </div>
        </div>
      )
    case 'processing':
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-foreground-muted">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full"
            />
            Analyzing biomarkers...
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="h-full w-1/2 bg-gradient-to-r from-primary to-secondary rounded-full"
            />
          </div>
        </div>
      )
    case 'workout':
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-foreground-secondary">Bench Press</span>
            <span className="text-primary font-[family-name:var(--font-jetbrains-mono)]">4x8</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-foreground-secondary">Squats</span>
            <span className="text-primary font-[family-name:var(--font-jetbrains-mono)]">3x10</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-foreground-secondary">Deadlift</span>
            <span className="text-primary font-[family-name:var(--font-jetbrains-mono)]">3x6</span>
          </div>
        </div>
      )
    case 'adapt':
      return (
        <div className="flex items-center gap-2">
          <div className="flex-1 space-y-1">
            <div className="h-4 bg-destructive/30 rounded text-[10px] flex items-center px-2 text-destructive line-through">
              Legs (missed)
            </div>
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
              className="h-4 bg-success/30 rounded text-[10px] flex items-center px-2 text-success"
            >
              Legs → Thu
            </motion.div>
          </div>
        </div>
      )
    default:
      return null
  }
}
