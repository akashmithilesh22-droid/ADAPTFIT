'use client'

import { LandingNav } from '@/components/landing/landing-nav'
import { Footer } from '@/components/landing/footer'
import { motion } from 'framer-motion'
import { ArrowLeft, Construction } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function PlaceholderLayout({ title, description }: { title: string, description: string }) {
  return (
    <main className="relative min-h-screen flex flex-col">
      <LandingNav />
      
      <div className="flex-1 flex items-center justify-center pt-24 pb-12 px-4 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-2xl text-center glass-card rounded-3xl p-12 border border-white/5 shadow-2xl"
        >
          <div className="w-16 h-16 mx-auto bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
            <Construction className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-syne)] mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-lg text-foreground-secondary mb-8">
            {description}
          </p>
          <Link href="/">
            <Button variant="outline" className="gap-2 bg-white/5 border-white/10 hover:bg-white/10">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Button>
          </Link>
        </motion.div>
      </div>

      <Footer />
    </main>
  )
}
