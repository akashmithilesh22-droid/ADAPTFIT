'use client'

import { motion } from 'framer-motion'
import { Brain, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WelcomeStepProps {
  onNext: () => void
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      {/* AI Brain Animation */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="relative mb-8"
      >
        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <Brain className="w-16 h-16 text-white" />
        </div>
        
        {/* Orbiting particles */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-accent" />
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
        >
          <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-3 h-3 rounded-full bg-secondary" />
        </motion.div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-3xl bg-primary/30 blur-2xl -z-10" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-4">
          <Sparkles className="w-4 h-4" />
          Personalized AI Coaching
        </span>

        <h1 className="font-[family-name:var(--font-syne)] font-bold text-4xl md:text-5xl text-foreground mb-4">
          Let&apos;s build your{' '}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            perfect plan
          </span>
        </h1>

        <p className="text-lg text-foreground-secondary max-w-md mx-auto mb-8">
          Answer 7 quick questions. Takes about 3 minutes. Our AI will create a fully personalized fitness program just for you.
        </p>

        <Button
          onClick={onNext}
          size="lg"
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8"
        >
          Let&apos;s Go
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 flex items-center gap-8 text-center"
      >
        <div>
          <p className="font-[family-name:var(--font-jetbrains-mono)] font-bold text-2xl text-foreground">47+</p>
          <p className="text-sm text-foreground-muted">Biomarkers analyzed</p>
        </div>
        <div className="w-px h-10 bg-border" />
        <div>
          <p className="font-[family-name:var(--font-jetbrains-mono)] font-bold text-2xl text-foreground">3 min</p>
          <p className="text-sm text-foreground-muted">To complete</p>
        </div>
        <div className="w-px h-10 bg-border" />
        <div>
          <p className="font-[family-name:var(--font-jetbrains-mono)] font-bold text-2xl text-foreground">100%</p>
          <p className="text-sm text-foreground-muted">Personalized</p>
        </div>
      </motion.div>
    </div>
  )
}
