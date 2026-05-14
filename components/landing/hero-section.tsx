'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Play, Star, CheckCircle, Activity, Flame, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
}

const floatVariants = {
  animate: {
    y: [-8, 8, -8],
    transition: {
      duration: 4,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[100px]" />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            {/* Eyebrow */}
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 text-sm font-medium text-primary">
                <Activity className="w-4 h-4" />
                Powered by Neural Networks
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              variants={itemVariants}
              className="mt-6 font-[family-name:var(--font-syne)] font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight tracking-tight text-balance"
            >
              Your Fitness.{' '}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Redesigned by AI.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              variants={itemVariants}
              className="mt-6 text-lg md:text-xl text-foreground-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed text-pretty"
            >
              AdaptFit learns your body, your schedule, and your limits. 
              When life happens, our AI adapts — intelligently, instantly.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link href="/signup">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-secondary to-accent rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-300 animate-pulse" />
                  <Button 
                    size="lg" 
                    className="relative bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-6 text-lg font-semibold"
                  >
                    Start Your Journey
                  </Button>
                </div>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-border hover:border-primary/50 hover:bg-primary/5 px-8 py-6 text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Trust Bar */}
            <motion.div 
              variants={itemVariants}
              className="mt-10 flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-secondary/40 border-2 border-background flex items-center justify-center text-xs font-bold text-foreground"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-foreground-secondary">
                  <strong className="text-foreground">2,847</strong> athletes adapting
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                ))}
                <span className="ml-1 text-sm text-foreground-secondary">4.9/5</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="relative hidden lg:block"
          >
            {/* Main Dashboard Card */}
            <motion.div
              variants={floatVariants}
              animate="animate"
              className="relative"
              style={{ perspective: '1000px' }}
            >
              <div 
                className="glass rounded-2xl p-6 shadow-2xl"
                style={{ 
                  transform: 'rotateY(-5deg) rotateX(2deg)',
                }}
              >
                {/* Mini Schedule */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-[family-name:var(--font-space-grotesk)] font-semibold text-foreground">
                      This Week
                    </h3>
                    <span className="text-xs text-primary font-medium">AI Optimized</span>
                  </div>
                  
                  {/* Week Days */}
                  <div className="space-y-2">
                    <ScheduleRow day="Mon" type="Push Day" status="completed" />
                    <ScheduleRow day="Tue" type="Pull Day" status="completed" />
                    <ScheduleRow day="Wed" type="Leg Day" status="missed" />
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5, duration: 0.5 }}
                      className="flex items-center gap-2 py-2 px-3 rounded-lg bg-success/10 border border-success/30"
                    >
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-xs text-success font-medium">Schedule Adapted</span>
                    </motion.div>
                    <ScheduleRow day="Thu" type="Leg Day" status="upcoming" highlight />
                    <ScheduleRow day="Fri" type="Push Day" status="upcoming" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Metric Chips */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute -top-4 -left-8"
            >
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }}
                className="glass rounded-xl px-4 py-2 flex items-center gap-2 glow-success"
              >
                <Activity className="w-4 h-4 text-success" />
                <span className="text-sm font-[family-name:var(--font-jetbrains-mono)] text-success">Recovery: 87%</span>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute top-1/4 -right-12"
            >
              <motion.div
                animate={{ y: [4, -4, 4] }}
                transition={{ duration: 3.5, ease: 'easeInOut', repeat: Infinity, delay: 0.5 }}
                className="glass rounded-xl px-4 py-2 flex items-center gap-2"
                style={{ boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)' }}
              >
                <Flame className="w-4 h-4 text-warning" />
                <span className="text-sm font-[family-name:var(--font-jetbrains-mono)] text-warning">Streak: 14 days</span>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute bottom-8 -left-4"
            >
              <motion.div
                animate={{ y: [-3, 5, -3] }}
                transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity, delay: 1 }}
                className="glass rounded-xl px-4 py-2 flex items-center gap-2 glow-accent"
              >
                <Target className="w-4 h-4 text-accent" />
                <span className="text-sm font-[family-name:var(--font-jetbrains-mono)] text-accent">On Track</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function ScheduleRow({ 
  day, 
  type, 
  status, 
  highlight = false 
}: { 
  day: string
  type: string
  status: 'completed' | 'missed' | 'upcoming'
  highlight?: boolean 
}) {
  const statusColors = {
    completed: 'bg-success/20 text-success border-success/30',
    missed: 'bg-destructive/20 text-destructive border-destructive/30 line-through opacity-50',
    upcoming: 'bg-muted text-foreground-secondary border-border',
  }

  return (
    <div className={`flex items-center justify-between py-2 px-3 rounded-lg border ${
      highlight ? 'bg-primary/10 border-primary/30' : statusColors[status]
    }`}>
      <div className="flex items-center gap-3">
        <span className="text-xs font-[family-name:var(--font-jetbrains-mono)] text-foreground-muted w-8">
          {day}
        </span>
        <span className={`text-sm font-medium ${status === 'missed' ? 'text-destructive' : highlight ? 'text-primary' : 'text-foreground'}`}>
          {type}
        </span>
      </div>
      {status === 'completed' && <CheckCircle className="w-4 h-4 text-success" />}
      {highlight && <span className="text-xs text-primary font-medium">NEW</span>}
    </div>
  )
}
