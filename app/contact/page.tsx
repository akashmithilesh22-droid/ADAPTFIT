'use client'

import { useState } from 'react'
import { LandingNav } from '@/components/landing/landing-nav'
import { Footer } from '@/components/landing/footer'
import { motion } from 'framer-motion'
import { Mail, MessageSquare, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise(res => setTimeout(res, 1500))
    setIsLoading(false)
    toast.success("Message sent!", { description: "We'll get back to you within 24 hours." })
    ;(e.target as HTMLFormElement).reset()
  }

  return (
    <main className="relative min-h-screen flex flex-col">
      <LandingNav />
      
      <div className="flex-1 max-w-7xl mx-auto px-4 pt-32 pb-24 grid md:grid-cols-2 gap-12 lg:gap-24 w-full">
        {/* Left Side: Info */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-syne)] mb-6">
              Let's talk about the future of fitness.
            </h1>
            <p className="text-lg text-foreground-secondary mb-8">
              Whether you have a question about our AI pipeline, need technical support, or just want to say hi — we're here for it.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-foreground-secondary">Email Support</p>
                <a href="mailto:support@adaptfit.ai" className="text-lg font-medium hover:text-primary transition-colors">support@adaptfit.ai</a>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-foreground-secondary">Community</p>
                <p className="text-lg font-medium">Join our Discord</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-3xl p-8 border border-white/10"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" required placeholder="John Doe" className="bg-background/50 h-12" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required placeholder="john@example.com" className="bg-background/50 h-12" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" required placeholder="How can we help?" className="bg-background/50 h-12" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <textarea 
                id="message" 
                required 
                rows={4}
                placeholder="Tell us more..." 
                className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-12 bg-gradient-to-r from-primary to-secondary text-white text-base">
              {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</> : <><Send className="w-4 h-4 mr-2" /> Send Message</>}
            </Button>
          </form>
        </motion.div>
      </div>
      <Footer />
    </main>
  )
}
