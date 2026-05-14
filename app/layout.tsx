import type { Metadata, Viewport } from 'next'
import { DM_Sans, Syne, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { Providers } from '@/app/providers'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AdaptFit AI - Your Fitness, Redesigned by AI',
  description:
    'AI-powered adaptive fitness platform that intelligently restructures your workout schedule when life happens. Build muscle, lose fat, and achieve your goals with personalized AI coaching.',
  keywords: [
    'fitness',
    'AI',
    'workout',
    'adaptive scheduling',
    'meal planning',
    'recovery',
  ],
  authors: [{ name: 'AdaptFit AI' }],
  openGraph: {
    title: 'AdaptFit AI - Your Fitness, Redesigned by AI',
    description:
      'AI-powered adaptive fitness platform that intelligently restructures your workout schedule when life happens.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AdaptFit AI - Your Fitness, Redesigned by AI',
    description:
      'AI-powered adaptive fitness platform that intelligently restructures your workout schedule when life happens.',
  },
}

export const viewport: Viewport = {
  themeColor: '#050508',
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${syne.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} bg-background`}
      suppressHydrationWarning
    >
      <body
        className="font-sans antialiased min-h-screen"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Providers>
            {children}

            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: 'rgba(17, 17, 25, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  color: '#F8FAFC',
                },
              }}
            />

            {process.env.NODE_ENV === 'production' && <Analytics />}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}