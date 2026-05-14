import { Achievement, UserStats } from '@/types'

/**
 * Gamification System
 * Handles achievements, streaks, levels, and XP
 */

export class GamificationService {
  /**
   * Check and unlock new achievements
   */
  static checkAchievements(
    stats: UserStats,
    currentAction: 'workout-completed' | 'meal-logged' | 'pr-hit' | 'streak-milestone' | 'goal-reached'
  ): Achievement[] {
    const newAchievements: Achievement[] = []

    switch (currentAction) {
      case 'workout-completed':
        if (stats.totalWorkouts === 1) {
          newAchievements.push(this.createAchievement(
            'first-workout',
            'Getting Started',
            'Completed your first workout',
            'Zap',
            10
          ))
        }
        if (stats.workoutStreak === 7) {
          newAchievements.push(this.createAchievement(
            'week-warrior',
            'Week Warrior',
            'Completed 7 consecutive workouts',
            'Flame',
            50
          ))
        }
        if (stats.workoutStreak === 30) {
          newAchievements.push(this.createAchievement(
            'month-master',
            'Month Master',
            'Completed 30 consecutive workouts',
            'Trophy',
            100
          ))
        }
        if (stats.workoutStreak === 100) {
          newAchievements.push(this.createAchievement(
            'century',
            'Century',
            '100 consecutive workouts!',
            'Crown',
            500
          ))
        }
        break

      case 'meal-logged':
        if (stats.completionRate >= 0.7) {
          newAchievements.push(this.createAchievement(
            'macro-master',
            'Macro Master',
            'Maintained macros for a week',
            'Star',
            50
          ))
        }
        break

      case 'pr-hit':
        newAchievements.push(this.createAchievement(
          'strength-seeker',
          'Strength Seeker',
          'Hit a new personal record',
          'Target',
          75
        ))
        break
    }

    return newAchievements
  }

  /**
   * Add XP and level up
   */
  static addXP(stats: UserStats, amount: number): UserStats {
    const newTotal = stats.totalPoints + amount
    const newLevel = Math.floor(newTotal / 100) + 1

    return {
      ...stats,
      totalPoints: newTotal,
      level: newLevel,
    }
  }

  /**
   * Update workout streak
   */
  static updateStreak(stats: UserStats, workoutCompleted: boolean): UserStats {
    let newStreak = stats.workoutStreak
    let newLongest = stats.longestStreak

    if (workoutCompleted) {
      newStreak += 1
      if (newStreak > newLongest) {
        newLongest = newStreak
      }
    } else {
      newStreak = 0
    }

    return {
      ...stats,
      workoutStreak: newStreak,
      longestStreak: newLongest,
    }
  }

  /**
   * Calculate completion rate
   */
  static calculateCompletionRate(totalWorkouts: number, missedWorkouts: number): number {
    if (totalWorkouts === 0) return 0
    return (totalWorkouts - missedWorkouts) / totalWorkouts
  }

  // ============ PRIVATE HELPERS ============

  private static createAchievement(
    id: string,
    title: string,
    description: string,
    icon: string,
    points: number
  ): Achievement {
    return {
      id,
      userId: '',
      title,
      description,
      icon,
      unlockedAt: new Date(),
      points,
    }
  }
}
