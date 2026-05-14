"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  User, Activity, Apple, Sparkles, Shield,
  LogOut, RefreshCw, Dumbbell,
  CheckCircle2
} from "lucide-react"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import type { OnboardingData } from "@/app/(app)/onboarding/page"
import { useAIPlan } from "@/hooks/use-ai-plan"

const defaultAiPrefs = {
  preferBudgetMeals: false,
  preferHomeWorkouts: false,
  avoidAdvancedExercises: false,
}

export default function SettingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [data, setData] = useState<Partial<OnboardingData> | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // To trigger AI generation
  const { regenerate: regenWorkout, isGenerating: genW } = useAIPlan("workout", user?.id)
  const { regenerate: regenDiet, isGenerating: genD } = useAIPlan("diet", user?.id)
  const { regenerate: regenRecovery, isGenerating: genR } = useAIPlan("recovery", user?.id)
  const isGeneratingAll = genW || genD || genR

  // Load data
  useEffect(() => {
    if (!user) return
    const loadData = async () => {
      const { data: obData } = await supabase
        .from("onboarding_data")
        .select("onboarding_data")
        .eq("user_id", user.id)
        .maybeSingle()

      if (obData?.onboarding_data) {
        const parsed = typeof obData.onboarding_data === 'string' 
          ? JSON.parse(obData.onboarding_data) 
          : obData.onboarding_data
        setData({
          ...parsed,
          aiPreferences: parsed.aiPreferences || defaultAiPrefs
        })
      }
      setLoading(false)
    }
    loadData()
  }, [user])

  // Save data handler
  const saveChanges = async (updates: Partial<OnboardingData>) => {
    if (!user) return
    const newData = { ...data, ...updates }
    setData(newData) // Optimistic update
    setSaving(true)
    
    const { error } = await supabase.from("onboarding_data").upsert(
      {
        user_id: user.id,
        onboarding_data: newData,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )

    setSaving(false)
    if (error) {
      toast({
        title: "Error saving preferences",
        description: error.message,
        variant: "destructive"
      })
    } else {
      toast({
        title: "Preferences saved",
        description: "Your settings have been updated.",
      })
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  const regenerateAll = async () => {
    toast({ title: "Regenerating...", description: "Building fresh AI plans for you." })
    await Promise.all([regenWorkout(), regenDiet(), regenRecovery()])
    toast({ title: "Complete!", description: "All AI plans have been freshly generated." })
  }

  if (loading) {
    return (
      <DashboardLayout title="Settings" subtitle="Manage your account preferences">
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse flex items-center gap-2 text-muted-foreground">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Loading preferences...
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Settings" subtitle="Manage your account and AI preferences">
      <div className="max-w-4xl mt-6 pb-24 space-y-8">
        
        {/* Section 1: Profile */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
            <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold">Profile Details</h2>
            {saving && <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1"><RefreshCw className="h-3 w-3 animate-spin"/> Saving</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Age</Label>
              <Input 
                type="number" 
                value={data?.age || ""} 
                onChange={(e) => saveChanges({ age: Number(e.target.value) })}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={data?.gender || ""} onValueChange={(val) => saveChanges({ gender: val })}>
                <SelectTrigger className="bg-white/5 border-white/10"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Height (cm)</Label>
              <Input 
                type="number" 
                value={data?.heightCm || ""} 
                onChange={(e) => saveChanges({ heightCm: Number(e.target.value) })}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label>Weight (kg)</Label>
              <Input 
                type="number" 
                value={data?.weightKg || ""} 
                onChange={(e) => saveChanges({ weightKg: Number(e.target.value) })}
                className="bg-white/5 border-white/10"
              />
            </div>
          </div>
        </motion.section>

        {/* Section 2: Fitness Preferences */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
            <div className="h-10 w-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <Activity className="h-5 w-5 text-orange-500" />
            </div>
            <h2 className="text-xl font-bold">Fitness Preferences</h2>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <Label>Primary Goal</Label>
              <div className="flex flex-wrap gap-2">
                {["fat loss", "muscle gain", "maintenance", "endurance"].map(goal => (
                  <button
                    key={goal}
                    onClick={() => saveChanges({ primaryGoal: goal })}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      data?.primaryGoal === goal ? 'bg-primary text-white' : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                    }`}
                  >
                    {goal.charAt(0).toUpperCase() + goal.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Workouts Per Week ({data?.workoutDays?.length || 3})</Label>
              </div>
              <Slider
                value={[data?.workoutDays?.length || 3]}
                min={1} max={7} step={1}
                onValueChange={(val) => {
                  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].slice(0, val[0])
                  saveChanges({ workoutDays: days })
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Known Injuries or Limitations</Label>
              <Input 
                placeholder="e.g. Bad lower back, shoulder impingement..." 
                value={data?.injuries?.join(", ") || ""} 
                onChange={(e) => saveChanges({ injuries: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                className="bg-white/5 border-white/10"
              />
              <p className="text-xs text-muted-foreground">The AI will modify your routines to avoid aggravating these areas.</p>
            </div>
          </div>
        </motion.section>

        {/* Section 3: Diet Preferences */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
            <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Apple className="h-5 w-5 text-green-500" />
            </div>
            <h2 className="text-xl font-bold">Diet Preferences</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Diet Type</Label>
              <Select value={data?.dietType || ""} onValueChange={(val) => saveChanges({ dietType: val })}>
                <SelectTrigger className="bg-white/5 border-white/10"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="eggetarian">Eggetarian</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Meals Per Day</Label>
              <Select value={data?.mealsPerDay?.toString() || "3"} onValueChange={(val) => saveChanges({ mealsPerDay: parseInt(val) })}>
                <SelectTrigger className="bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[2,3,4,5,6].map(num => <SelectItem key={num} value={num.toString()}>{num} meals</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Allergies</Label>
              <Input 
                placeholder="e.g. Peanuts, Shellfish..." 
                value={data?.allergies?.join(", ") || ""} 
                onChange={(e) => saveChanges({ allergies: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                className="bg-white/5 border-white/10"
              />
            </div>
          </div>
        </motion.section>

        {/* Section 4: AI Preferences */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="relative overflow-hidden glass-card rounded-2xl p-6 border-accent/20"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Sparkles className="h-48 w-48 text-accent" />
          </div>

          <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6 relative">
            <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
            <h2 className="text-xl font-bold">AI Directives</h2>
          </div>

          <div className="space-y-6 relative">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
              <div>
                <Label className="text-base font-medium">Budget-Friendly Meals</Label>
                <p className="text-sm text-muted-foreground mt-1">Force AI to prioritize cheap, highly accessible ingredients.</p>
              </div>
              <Switch 
                checked={data?.aiPreferences?.preferBudgetMeals || false} 
                onCheckedChange={(checked) => saveChanges({ aiPreferences: { ...data?.aiPreferences, preferBudgetMeals: checked } as any })}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
              <div>
                <Label className="text-base font-medium">Home Workouts</Label>
                <p className="text-sm text-muted-foreground mt-1">Generate plans requiring zero gym machines (bodyweight/dumbbells only).</p>
              </div>
              <Switch 
                checked={data?.aiPreferences?.preferHomeWorkouts || false} 
                onCheckedChange={(checked) => saveChanges({ aiPreferences: { ...data?.aiPreferences, preferHomeWorkouts: checked } as any })}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
              <div>
                <Label className="text-base font-medium">Avoid Advanced Exercises</Label>
                <p className="text-sm text-muted-foreground mt-1">Keep movements simple and foundational (no olympic lifts or complex gymnastics).</p>
              </div>
              <Switch 
                checked={data?.aiPreferences?.avoidAdvancedExercises || false} 
                onCheckedChange={(checked) => saveChanges({ aiPreferences: { ...data?.aiPreferences, avoidAdvancedExercises: checked } as any })}
              />
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center border-t border-white/10">
              <Button 
                onClick={regenerateAll} 
                disabled={isGeneratingAll}
                className="w-full sm:w-auto gap-2 bg-gradient-to-r from-accent to-primary"
              >
                {isGeneratingAll ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Regenerate All AI Plans Now
              </Button>
              <p className="text-xs text-muted-foreground flex-1">Apply your new settings by forcing the AI to generate fresh plans instantly.</p>
            </div>
          </div>
        </motion.section>

        {/* Section 5: Account */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
            <div className="h-10 w-10 rounded-lg bg-muted/30 flex items-center justify-center">
              <Shield className="h-5 w-5 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold">Account</h2>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-white/5">
              <div className="mb-4 sm:mb-0">
                <p className="font-medium">Sign Out</p>
                <p className="text-sm text-muted-foreground">Log out of your AdaptFit account on this device.</p>
              </div>
              <Button variant="destructive" onClick={handleLogout} className="w-full sm:w-auto gap-2">
                <LogOut className="h-4 w-4" /> Sign Out
              </Button>
            </div>
          </div>
        </motion.section>

      </div>
    </DashboardLayout>
  )
}
