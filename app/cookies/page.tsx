import { LandingNav } from '@/components/landing/landing-nav'
import { Footer } from '@/components/landing/footer'

export default function CookiesPage() {
  return (
    <main className="relative min-h-screen flex flex-col">
      <LandingNav />
      <div className="flex-1 max-w-3xl mx-auto px-4 pt-32 pb-24 text-foreground-secondary">
        <h1 className="text-3xl font-bold text-foreground mb-8">Cookie Policy</h1>
        <div className="space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. What are cookies?</h2>
            <p>Cookies are small text files that are stored on your device when you visit our website. They help us make the site work properly and provide a better user experience.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. How we use cookies</h2>
            <p>We use essential cookies to maintain your authenticated session with Supabase, allowing you to stay logged in while navigating the dashboard. We do not currently use third-party tracking cookies.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Managing cookies</h2>
            <p>You can control and/or delete cookies as you wish via your browser settings. However, disabling essential cookies will prevent you from logging into your AdaptFit account.</p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  )
}
