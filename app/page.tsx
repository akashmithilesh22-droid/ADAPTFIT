import { NeuralBackground } from '@/components/landing/neural-background'
import { LandingNav } from '@/components/landing/landing-nav'
import { HeroSection } from '@/components/landing/hero-section'
import { SocialProofBar } from '@/components/landing/social-proof-bar'
import { FeaturesSection } from '@/components/landing/features-section'
import { HowItWorksSection } from '@/components/landing/how-it-works-section'
import { AdaptiveDemoSection } from '@/components/landing/adaptive-demo-section'
import { TestimonialsSection } from '@/components/landing/testimonials-section'

import { CtaSection } from '@/components/landing/cta-section'
import { Footer } from '@/components/landing/footer'

export default function LandingPage() {
  return (
    <main className="relative min-h-screen">
      {/* Neural network animated background */}
      <NeuralBackground />
      
      {/* Navigation */}
      <LandingNav />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Social Proof Marquee */}
      <SocialProofBar />
      
      {/* Features Grid */}
      <FeaturesSection />
      
      {/* How It Works */}
      <HowItWorksSection />
      
      {/* Adaptive Scheduling Demo - Crown Jewel */}
      <AdaptiveDemoSection />
      
      {/* Testimonials */}
      <TestimonialsSection />
      

      
      {/* Final CTA */}
      <CtaSection />
      
      {/* Footer */}
      <Footer />
    </main>
  )
}
