"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Trophy,
  Medal,
  Star,
  Flame,
  Zap,
  Target,
  Crown,
  Dumbbell,
  Heart,
  Calendar,
  TrendingUp,
  Lock,
  CheckCircle2,
  Sparkles,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

type AchievementCategory = "all" | "workout" | "streak" | "strength" | "milestone"

interface Achievement {
  id: number
  name: string
  description: string
  icon: typeof Trophy
  category: AchievementCategory
  unlocked: boolean
  unlockedAt?: string
  progress?: number
  maxProgress?: number
  xp: number
  rarity: "common" | "rare" | "epic" | "legendary"
}

const achievements: Achievement[] = [
  // Unlocked
  {
    id: 1,
    name: "First Steps",
    description: "Complete your first workout",
    icon: Dumbbell,
    category: "workout",
    unlocked: true,
    unlockedAt: "Jan 15, 2024",
    xp: 50,
    rarity: "common",
  },
  {
    id: 2,
    name: "Week Warrior",
    description: "Complete 7 workouts in a week",
    icon: Calendar,
    category: "workout",
    unlocked: true,
    unlockedAt: "Feb 3, 2024",
    xp: 150,
    rarity: "rare",
  },
  {
    id: 3,
    name: "Streak Master",
    description: "Maintain a 30-day workout streak",
    icon: Flame,
    category: "streak",
    unlocked: true,
    unlockedAt: "Mar 15, 2024",
    xp: 500,
    rarity: "epic",
  },
  {
    id: 4,
    name: "Centurion",
    description: "Complete 100 workouts",
    icon: Medal,
    category: "milestone",
    unlocked: true,
    unlockedAt: "Apr 20, 2024",
    xp: 1000,
    rarity: "legendary",
  },
  {
    id: 5,
    name: "Early Bird",
    description: "Complete 10 workouts before 7 AM",
    icon: Star,
    category: "workout",
    unlocked: true,
    unlockedAt: "Feb 28, 2024",
    xp: 200,
    rarity: "rare",
  },
  {
    id: 6,
    name: "Strength Gains",
    description: "Increase your bench press by 25 lbs",
    icon: TrendingUp,
    category: "strength",
    unlocked: true,
    unlockedAt: "Mar 1, 2024",
    xp: 300,
    rarity: "rare",
  },
  // In Progress
  {
    id: 7,
    name: "Iron Will",
    description: "Complete 200 workouts",
    icon: Trophy,
    category: "milestone",
    unlocked: false,
    progress: 124,
    maxProgress: 200,
    xp: 2000,
    rarity: "legendary",
  },
  {
    id: 8,
    name: "Consistency King",
    description: "Maintain a 60-day workout streak",
    icon: Crown,
    category: "streak",
    unlocked: false,
    progress: 42,
    maxProgress: 60,
    xp: 1000,
    rarity: "epic",
  },
  {
    id: 9,
    name: "Recovery Champion",
    description: "Achieve 90+ recovery score 10 times",
    icon: Heart,
    category: "milestone",
    unlocked: false,
    progress: 7,
    maxProgress: 10,
    xp: 400,
    rarity: "rare",
  },
  // Locked
  {
    id: 10,
    name: "Elite Athlete",
    description: "Complete 500 workouts",
    icon: Zap,
    category: "milestone",
    unlocked: false,
    progress: 124,
    maxProgress: 500,
    xp: 5000,
    rarity: "legendary",
  },
  {
    id: 11,
    name: "Goal Crusher",
    description: "Achieve all your monthly goals",
    icon: Target,
    category: "milestone",
    unlocked: false,
    xp: 750,
    rarity: "epic",
  },
  {
    id: 12,
    name: "Perfect Week",
    description: "Complete every scheduled workout for 4 weeks straight",
    icon: Star,
    category: "workout",
    unlocked: false,
    progress: 2,
    maxProgress: 4,
    xp: 600,
    rarity: "epic",
  },
]

const rarityColors = {
  common: "from-zinc-500/30 to-zinc-500/10 border-zinc-500/30",
  rare: "from-blue-500/30 to-blue-500/10 border-blue-500/30",
  epic: "from-purple-500/30 to-purple-500/10 border-purple-500/30",
  legendary: "from-amber-500/30 to-amber-500/10 border-amber-500/30",
}

const rarityTextColors = {
  common: "text-zinc-400",
  rare: "text-blue-400",
  epic: "text-purple-400",
  legendary: "text-amber-400",
}

const categories = [
  { id: "all" as AchievementCategory, label: "All" },
  { id: "workout" as AchievementCategory, label: "Workout" },
  { id: "streak" as AchievementCategory, label: "Streaks" },
  { id: "strength" as AchievementCategory, label: "Strength" },
  { id: "milestone" as AchievementCategory, label: "Milestones" },
]

export default function AchievementsPage() {
  const [activeCategory, setActiveCategory] = useState<AchievementCategory>("all")

  const filteredAchievements = achievements.filter(
    (a) => activeCategory === "all" || a.category === activeCategory
  )

  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const totalXP = achievements
    .filter((a) => a.unlocked)
    .reduce((acc, a) => acc + a.xp, 0)

  const currentLevel = Math.floor(totalXP / 1000) + 1
  const xpToNextLevel = 1000 - (totalXP % 1000)
  const levelProgress = ((totalXP % 1000) / 1000) * 100

  return (
    <DashboardLayout title="Achievements" subtitle="Track your milestones and rewards">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/10 p-3">
              <Trophy className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {unlockedCount}/{achievements.length}
              </p>
              <p className="text-sm text-muted-foreground">Unlocked</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 p-3">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalXP.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total XP</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6 md:col-span-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
                <span className="text-lg font-bold text-white">{currentLevel}</span>
              </div>
              <div>
                <p className="font-semibold">Level {currentLevel}</p>
                <p className="text-sm text-muted-foreground">
                  {xpToNextLevel} XP to next level
                </p>
              </div>
            </div>
            <div className="flex-1 px-6">
              <Progress value={levelProgress} className="h-3" />
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-white/20">
              <span className="text-lg font-bold text-muted-foreground">
                {currentLevel + 1}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Category Filter */}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={cn(
              "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all",
              activeCategory === category.id
                ? "bg-primary text-primary-foreground"
                : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAchievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              "group relative overflow-hidden rounded-2xl border bg-gradient-to-br transition-all",
              achievement.unlocked
                ? rarityColors[achievement.rarity]
                : "border-white/10 from-white/5 to-white/0"
            )}
          >
            {/* Rarity Badge */}
            <div
              className={cn(
                "absolute right-3 top-3 rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                achievement.unlocked
                  ? `bg-background/50 ${rarityTextColors[achievement.rarity]}`
                  : "bg-white/10 text-muted-foreground"
              )}
            >
              {achievement.rarity}
            </div>

            <div className="p-6">
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "relative rounded-xl p-3",
                    achievement.unlocked
                      ? "bg-background/30"
                      : "bg-white/5"
                  )}
                >
                  <achievement.icon
                    className={cn(
                      "h-8 w-8",
                      achievement.unlocked
                        ? rarityTextColors[achievement.rarity]
                        : "text-muted-foreground"
                    )}
                  />
                  {!achievement.unlocked && (
                    <Lock className="absolute -bottom-1 -right-1 h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1">
                  <h3
                    className={cn(
                      "font-semibold",
                      !achievement.unlocked && "text-muted-foreground"
                    )}
                  >
                    {achievement.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                </div>
              </div>

              {/* Progress or Unlocked Info */}
              <div className="mt-4">
                {achievement.unlocked ? (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Unlocked</span>
                    </div>
                    <span className="text-muted-foreground">
                      {achievement.unlockedAt}
                    </span>
                  </div>
                ) : achievement.progress !== undefined ? (
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {achievement.progress}/{achievement.maxProgress}
                      </span>
                    </div>
                    <Progress
                      value={
                        (achievement.progress / (achievement.maxProgress || 1)) * 100
                      }
                      className="mt-2 h-2"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    <span>Not started</span>
                  </div>
                )}
              </div>

              {/* XP Reward */}
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                <div className="flex items-center gap-2">
                  <Sparkles
                    className={cn(
                      "h-4 w-4",
                      achievement.unlocked ? "text-accent" : "text-muted-foreground"
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm font-medium",
                      achievement.unlocked ? "text-accent" : "text-muted-foreground"
                    )}
                  >
                    +{achievement.xp} XP
                  </span>
                </div>
                {achievement.unlocked && (
                  <Button size="sm" variant="ghost" className="text-xs">
                    Share
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <div className="mt-12 flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-white/5 p-6">
            <Trophy className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No achievements found</h3>
          <p className="mt-2 text-muted-foreground">
            Try selecting a different category
          </p>
        </div>
      )}
    </DashboardLayout>
  )
}
