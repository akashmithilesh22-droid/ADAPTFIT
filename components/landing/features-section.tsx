'use client'

import { motion } from 'framer-motion'
import { 
  CalendarClock, 
  Brain, 
  Utensils, 
  Heart, 
  TrendingUp, 
  Flame,
  Zap
} from 'lucide-react'

const features = [
  {
    icon: CalendarClock,
    title: 'Adaptive Scheduling',
    description: 'AI restructures your entire week when you miss a session. No more guilt, just optimized progress.',
    gradient: 'from-primary to-secondary',
  },
  {
    icon: Brain,
    title: 'Neural Workout Engine',
    description: 'Deep learning models personalize every set, rep, and rest period to your unique physiology.',
    gradient: 'from-secondary to-accent',
  },
  {
    icon: Utensils,
    title: 'Smart Diet Planning',
    description: 'Macros, meals, and timing calibrated to your metabolism and cultural preferences daily.',
    gradient: 'from-accent to-success',
  },
  {
    icon: Heart,
    title: 'Recovery Intelligence',
    description: 'Readiness scores prevent overtraining before it happens. Train hard, recover smarter.',
    gradient: 'from-success to-primary',
  },
  {
    icon: TrendingUp,
    title: 'Progress Analytics',
    description: 'Track strength, body composition, and consistency in one beautiful, insightful view.',
    gradient: 'from-primary to-accent',
  },
  {
    icon: Flame,
    title: 'Habit Reinforcement',
    description: 'Streaks, XP, and achievements make consistency addictive. Gamify your gains.',
    gradient: 'from-warning to-destructive',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
}

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 md:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[120px]" />
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
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-4">
            <Zap className="w-4 h-4" />
            Core Features
          </span>
          <h2 className="font-[family-name:var(--font-syne)] font-bold text-3xl sm:text-4xl md:text-5xl text-foreground text-balance">
            Intelligence built into every rep.
          </h2>
          <p className="mt-4 text-lg text-foreground-secondary max-w-2xl mx-auto">
            Six powerful AI systems working together to optimize your fitness journey.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative"
            >
              <div className="glass rounded-2xl p-6 h-full transition-all duration-300 hover:bg-white/[0.06] hover:border-primary/30 hover:-translate-y-1">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="font-[family-name:var(--font-space-grotesk)] font-semibold text-xl text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-foreground-secondary leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
