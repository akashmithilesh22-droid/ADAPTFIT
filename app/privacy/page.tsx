import { LandingNav } from '@/components/landing/landing-nav'
import { Footer } from '@/components/landing/footer'

export default function PrivacyPage() {
  return (
    <main className="relative min-h-screen flex flex-col">
      <LandingNav />
      <div className="flex-1 max-w-3xl mx-auto px-4 pt-32 pb-24 text-foreground-secondary">
        <h1 className="text-3xl font-bold text-foreground mb-8">Privacy Policy</h1>
        <div className="space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as your name, email address, and fitness data provided during onboarding.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our AI-powered fitness generation services, and to personalize your experience.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized processing or accidental loss.</p>
          </section>
          <p className="mt-8 text-sm">For privacy-related inquiries, please use our contact page.</p>
        </div>
      </div>
      <Footer />
    </main>
  )
}
