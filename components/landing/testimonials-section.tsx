'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    quote: "The adaptive scheduling is insane. It rearranged my whole week when I got sick and I never lost momentum. This is the future of fitness.",
    name: 'Priya M.',
    role: 'Marathon Runner',
    avatar: 'P',
    achievement: 'Completed first marathon',
    rating: 5,
  },
  {
    quote: "Finally an app that understands I can't eat chicken every meal. The Indian meal options are chef's kiss. Macros hit perfectly every day.",
    name: 'Arjun K.',
    role: 'Powerlifter',
    avatar: 'A',
    achievement: 'Added 30kg to squat',
    rating: 5,
  },
  {
    quote: "The recovery score predicted my burnout before I felt it. Took a rest day on its advice and PR'd the next session. Mind-blowing accuracy.",
    name: 'Sarah L.',
    role: 'CrossFit Athlete',
    avatar: 'S',
    achievement: 'PR streak: 12 weeks',
    rating: 5,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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

export function TestimonialsSection() {
  return (
    <section className="relative py-24 md:py-32 bg-background-secondary">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-primary/5 blur-[100px]" />
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
            Athletes who stopped guessing.
          </h2>
          <p className="mt-4 text-lg text-foreground-secondary max-w-2xl mx-auto">
            Real results from real people who let AI optimize their fitness journey.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, rotateY: 2, rotateX: 2 }}
              transition={{ duration: 0.3 }}
              className="group"
              style={{ perspective: '1000px' }}
            >
              <div className="glass rounded-2xl p-6 h-full flex flex-col transition-all duration-300 hover:border-primary/30">
                {/* Quote icon */}
                <Quote className="w-8 h-8 text-primary/30 mb-4" />

                {/* Quote text */}
                <p className="text-foreground-secondary leading-relaxed flex-grow">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                {/* Rating */}
                <div className="flex gap-1 my-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>

                {/* Achievement badge */}
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-success/10 border border-success/30 text-success text-xs font-medium">
                    {testimonial.achievement}
                  </span>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-foreground-muted">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
