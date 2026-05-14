"use client"

import { useState, createContext, useContext, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Loader2 } from "lucide-react"

interface AppLayoutContextType {
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
}

const AppLayoutContext = createContext<AppLayoutContextType>({
  sidebarCollapsed: false,
  setSidebarCollapsed: () => {},
})

export const useAppLayout = () => useContext(AppLayoutContext)

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, isLoading, router])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-foreground-secondary">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // Redirect unauthenticated users
  if (!isAuthenticated) {
    return null
  }

  return (
    <AppLayoutContext.Provider value={{ sidebarCollapsed, setSidebarCollapsed }}>
      <div className="min-h-screen bg-background">
        {children}
      </div>
    </AppLayoutContext.Provider>
  )
}

