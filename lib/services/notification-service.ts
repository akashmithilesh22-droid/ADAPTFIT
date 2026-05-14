import { Notification } from '@/types'

/**
 * Notification Service
 * Handles intelligent reminders and alerts for:
 * - Missed workouts
 * - Recovery tips
 * - Nutrition tracking
 * - Achievements
 * - Streaks
 */

export class NotificationService {
  /**
   * Generate smart notification for missed workout
   */
  static generateMissedWorkoutNotification(
    userId: string,
    workoutName: string,
    daysMissed: number,
    scheduledDay: string
  ): Notification {
    let message = `You missed ${workoutName}`
    if (daysMissed > 1) {
      message = `You missed ${workoutName} ${daysMissed} days ago on ${scheduledDay}`
    }

    return {
      id: `notif-${Date.now()}`,
      userId,
      type: 'missed-workout',
      title: '💪 Workout Recovery',
      message,
      actionUrl: '/dashboard/reschedule',
      read: false,
      createdAt: new Date(),
    }
  }

  /**
   * Generate recovery tip based on metrics
   */
  static generateRecoveryTipNotification(
    userId: string,
    sleepQuality: number,
    stressLevel: number,
    soreness: number
  ): Notification | null {
    if (sleepQuality < 6) {
      return {
        id: `notif-${Date.now()}`,
        userId,
        type: 'recovery-tip',
        title: '😴 Sleep Quality Alert',
        message: `You got ${sleepQuality}hrs of sleep. Aim for 7-9 hours for optimal recovery.`,
        actionUrl: '/dashboard/recovery',
        read: false,
        createdAt: new Date(),
      }
    }

    if (stressLevel > 8) {
      return {
        id: `notif-${Date.now()}`,
        userId,
        type: 'recovery-tip',
        title: '🧘 Stress Management',
        message: 'High stress levels detected. Consider lighter training or meditation today.',
        actionUrl: '/dashboard',
        read: false,
        createdAt: new Date(),
      }
    }

    if (soreness > 8) {
      return {
        id: `notif-${Date.now()}`,
        userId,
        type: 'recovery-tip',
        title: '😤 DOMS Alert',
        message: 'You\'re very sore. Consider active recovery or a light workout today.',
        actionUrl: '/dashboard/recovery',
        read: false,
        createdAt: new Date(),
      }
    }

    return null
  }

  /**
   * Generate nutrition reminder
   */
  static generateNutritionReminderNotification(
    userId: string,
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre-workout' | 'post-workout',
    macrosRemaining: { protein: number; carbs: number; fats: number }
  ): Notification {
    const mealEmoji: Record<string, string> = {
      breakfast: '🌅',
      lunch: '🍽️',
      dinner: '🌙',
      snack: '🥜',
      'pre-workout': '⚡',
      'post-workout': '💪',
    }

    return {
      id: `notif-${Date.now()}`,
      userId,
      type: 'nutrition-alert',
      title: `${mealEmoji[mealType]} ${mealType.charAt(0).toUpperCase() + mealType.slice(1)} Time`,
      message: `Log your ${mealType}. Remaining: ${macrosRemaining.protein}g protein, ${macrosRemaining.carbs}g carbs, ${macrosRemaining.fats}g fat`,
      actionUrl: '/dashboard/diet',
      read: false,
      createdAt: new Date(),
    }
  }

  /**
   * Generate achievement unlocked notification
   */
  static generateAchievementNotification(
    userId: string,
    achievementName: string,
    pointsEarned: number
  ): Notification {
    return {
      id: `notif-${Date.now()}`,
      userId,
      type: 'achievement',
      title: '🏆 Achievement Unlocked!',
      message: `You unlocked "${achievementName}" and earned ${pointsEarned} XP!`,
      actionUrl: '/dashboard/achievements',
      read: false,
      createdAt: new Date(),
    }
  }

  /**
   * Generate streak notification
   */
  static generateStreakNotification(
    userId: string,
    streakCount: number,
    type: 'workout' | 'diet' | 'consistency'
  ): Notification {
    const streakType: Record<string, string> = {
      workout: 'Workout',
      diet: 'Nutrition',
      consistency: 'Consistency',
    }

    const emoji: Record<string, string> = {
      workout: '🔥',
      diet: '🎯',
      consistency: '⭐',
    }

    return {
      id: `notif-${Date.now()}`,
      userId,
      type: 'streak',
      title: `${emoji[type]} ${streakType[type]} Streak!`,
      message: `You're on a ${streakCount} day ${streakType[type].toLowerCase()} streak! Keep it up! 💪`,
      actionUrl: '/dashboard',
      read: false,
      createdAt: new Date(),
    }
  }

  /**
   * Generate workout reminder
   */
  static generateWorkoutReminderNotification(
    userId: string,
    workoutName: string,
    timeOfDay: string,
    daysUntil: number = 0
  ): Notification {
    let message = `Your ${workoutName} is scheduled for ${timeOfDay}`
    if (daysUntil > 0) {
      message = `${daysUntil} day(s) until your ${workoutName} session`
    }

    return {
      id: `notif-${Date.now()}`,
      userId,
      type: 'reminder',
      title: '⏰ Upcoming Workout',
      message,
      actionUrl: '/dashboard',
      read: false,
      createdAt: new Date(),
    }
  }

  /**
   * Generate milestone notification
   */
  static generateMilestoneNotification(
    userId: string,
    milestone: string,
    value: number | string
  ): Notification {
    const milestoneEmoji: Record<string, string> = {
      'weight-loss': '⬇️',
      'muscle-gain': '💪',
      'strength': '⚡',
      'workout-count': '🔢',
      'level-up': '📈',
    }

    return {
      id: `notif-${Date.now()}`,
      userId,
      type: 'achievement',
      title: `${milestoneEmoji[milestone] || '🎉'} Milestone Reached!`,
      message: `Amazing! You reached ${milestone}: ${value}`,
      actionUrl: '/dashboard/progress',
      read: false,
      createdAt: new Date(),
    }
  }

  /**
   * Get motivational message based on time of day
   */
  static getMotivationalReminder(hour: number): string {
    if (hour >= 5 && hour < 12) {
      return '🌅 Rise and grind! Your morning workout awaits!'
    } else if (hour >= 12 && hour < 17) {
      return '💪 Midday push! Crush your training session!'
    } else if (hour >= 17 && hour < 21) {
      return '🌆 Evening grind! Make today count!'
    } else {
      return '🌙 Night owl? Make tomorrow count! Rest well!'
    }
  }

  /**
   * Batch notifications for a user
   */
  static batchNotifications(
    userId: string,
    notifications: Notification[]
  ): Notification[] {
    // Group similar notifications
    const grouped: Record<string, Notification[]> = {}

    notifications.forEach(notif => {
      if (!grouped[notif.type]) {
        grouped[notif.type] = []
      }
      grouped[notif.type].push(notif)
    })

    // Keep only the most recent of each type
    const batched: Notification[] = []
    Object.values(grouped).forEach(group => {
      if (group.length > 3) {
        batched.push(...group.slice(0, 2))
      } else {
        batched.push(...group)
      }
    })

    return batched
  }
}
