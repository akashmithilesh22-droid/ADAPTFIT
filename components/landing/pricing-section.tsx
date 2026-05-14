'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Sparkles, Zap, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const plans = [
  {
    name: 'Free',
    icon: Zap,
    description: 'Get started with the basics',
    price: { monthly: 0, annual: 0 },
    currency: '₹',
    features: [
      'Basic workout plan',
      '7-day meal plan',
      'Limited AI adaptations (3/month)',
      'Basic progress tracking',
      'Community access',
    ],
    cta: 'Start Free',
    popular: false,
  },
  {
    name: 'Pro',
    icon: Sparkles,
    description: 'Everything you need to excel',
    price: { monthly: 1577, annual: 15770 },
    currency: '₹',
    features: [
      'Full adaptive AI scheduling',
      'Unlimited AI adaptations',
      'Complete diet planner',
      'Recovery system',
      'Advanced analytics',
      'Priority support',
      'Export reports',
    ],
    cta: 'Start 14-Day Trial',
    popular: true,
  },
  {
    name: 'Elite',
    icon: Crown,
    description: 'For serious athletes',
    price: { monthly: 4067, annual: 40670 },
    currency: '₹',
    features: [
      'Everything in Pro',
      'Advanced body composition AI',
      'Personal coach integration',
      'API access',
      'White-label reports',
      'Custom macro algorithms',
      '1-on-1 onboarding call',
    ],
    cta: 'Go Elite',
    popular: false,
  },
]

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <section id="pricing" className="relative py-24 md:py-32">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[100px]" />
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
          <h2 className="font-[family-name:var(--font-syne)] font-bold text-3xl sm:text-4xl md:text-5xl text-foreground text-balance">
            Simple pricing. Extraordinary results.
          </h2>
          <p className="mt-4 text-lg text-foreground-secondary max-w-2xl mx-auto">
            Choose the plan that fits your goals. Upgrade or cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 inline-flex items-center gap-4 p-1 rounded-full bg-muted border border-border">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !isAnnual 
                  ? 'bg-primary text-white' 
                  : 'text-foreground-secondary hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                isAnnual 
                  ? 'bg-primary text-white' 
                  : 'text-foreground-secondary hover:text-foreground'
              }`}
            >
              Annual
              <span className="text-xs px-1.5 py-0.5 rounded bg-success text-success-foreground">
                2 mo free
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative ${plan.popular ? 'lg:-mt-4 lg:mb-4' : ''}`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-4 py-1 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className={`h-full rounded-2xl p-6 lg:p-8 transition-all duration-300 ${
                plan.popular 
                  ? 'glass border-primary/50 shadow-lg shadow-primary/10' 
                  : 'glass hover:border-primary/30'
              }`}>
                {/* Plan header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    plan.popular 
                      ? 'bg-gradient-to-br from-primary to-secondary' 
                      : 'bg-muted'
                  }`}>
                    <plan.icon className={`w-5 h-5 ${plan.popular ? 'text-white' : 'text-foreground-secondary'}`} />
                  </div>
                  <div>
                    <h3 className="font-[family-name:var(--font-space-grotesk)] font-semibold text-xl text-foreground">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-foreground-muted">{plan.description}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="font-[family-name:var(--font-syne)] font-bold text-4xl text-foreground">
                      {plan.currency}{(isAnnual ? Math.floor(plan.price.annual / 12) : plan.price.monthly).toLocaleString('en-IN')}
                    </span>
                    {plan.price.monthly > 0 && (
                      <span className="text-foreground-muted">/month</span>
                    )}
                  </div>
                  {isAnnual && plan.price.annual > 0 && (
                    <p className="text-sm text-foreground-muted mt-1">
                      {plan.currency}{plan.price.annual.toLocaleString('en-IN')} billed annually
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        plan.popular ? 'text-primary' : 'text-success'
                      }`} />
                      <span className="text-foreground-secondary text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link href="/signup" className="block">
                  {plan.popular ? (
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-300" />
                      <Button className="relative w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white">
                        {plan.cta}
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full border-border hover:border-primary/50 hover:bg-primary/5"
                    >
                      {plan.cta}
                    </Button>
                  )}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pricing note */}
        <p className="text-center text-sm text-foreground-muted mt-8">
          All prices in Indian Rupees (₹). Cancel anytime. No hidden fees.
        </p>
      </div>
    </section>
  )
}
