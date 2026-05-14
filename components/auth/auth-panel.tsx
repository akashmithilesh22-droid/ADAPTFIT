'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Zap, Brain, Calendar, TrendingUp } from 'lucide-react'

interface AuthPanelProps {
  children: React.ReactNode
}

const features = [
  {
    icon: Brain,
    title: 'Neural Workout Engine',
    description: 'AI-powered personalization for every rep',
  },
  {
    icon: Calendar,
    title: 'Adaptive Scheduling',
    description: 'Plans that adjust when life happens',
  },
  {
    icon: TrendingUp,
    title: 'Progress Analytics',
    description: 'Track your gains with precision',
  },
]

export function AuthPanel({ children }: AuthPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const colors = [
      'rgba(99, 102, 241, 0.4)',
      'rgba(139, 92, 246, 0.4)',
      'rgba(6, 182, 212, 0.3)',
    ]

    const nodeCount = 30
    const nodes: { x: number; y: number; vx: number; vy: number; radius: number; color: string }[] = []

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    const connectionDistance = 120

    const animate = () => {
      ctx.fillStyle = 'rgba(5, 5, 8, 0.15)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      nodes.forEach((node, i) => {
        node.x += node.vx
        node.y += node.vy

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1

        nodes.slice(i + 1).forEach((otherNode) => {
          const dx = node.x - otherNode.x
          const dy = node.y - otherNode.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.2
            ctx.beginPath()
            ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`
            ctx.lineWidth = 0.5
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(otherNode.x, otherNode.y)
            ctx.stroke()
          }
        })

        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fillStyle = node.color
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Brand */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-background-secondary">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
        
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="font-[family-name:var(--font-syne)] font-bold text-2xl text-foreground">
              AdaptFit
            </span>
          </Link>

          {/* Tagline */}
          <div className="max-w-md">
            <h1 className="font-[family-name:var(--font-syne)] font-bold text-4xl text-foreground leading-tight mb-6">
              Your Fitness.{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Redesigned by AI.
              </span>
            </h1>
            <p className="text-foreground-secondary text-lg leading-relaxed">
              Join thousands of athletes who&apos;ve discovered the power of adaptive fitness training.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-space-grotesk)] font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-foreground-muted">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="font-[family-name:var(--font-syne)] font-bold text-2xl text-foreground">
                AdaptFit
              </span>
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
