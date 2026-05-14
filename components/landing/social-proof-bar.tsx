'use client'

import { motion } from 'framer-motion'

const brands = [
  'TechCrunch',
  'ProductHunt #1',
  'Forbes AI 50',
  'Wired',
  'The Verge',
  'Fast Company',
]

export function SocialProofBar() {
  return (
    <section className="relative py-8 border-y border-border/50 overflow-hidden">
      {/* Gradient fade on edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div className="flex overflow-hidden">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{
            duration: 20,
            ease: 'linear',
            repeat: Infinity,
          }}
          className="flex items-center gap-12 whitespace-nowrap"
        >
          {[...brands, ...brands, ...brands].map((brand, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-foreground-muted hover:text-foreground-secondary transition-colors"
            >
              <span className="text-sm font-medium tracking-wide uppercase">
                {brand.includes('#') ? (
                  <>
                    <span className="text-warning">{brand}</span>
                  </>
                ) : (
                  `Featured in ${brand}`
                )}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
