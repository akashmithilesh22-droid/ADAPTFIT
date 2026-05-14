import { UserProfile, FitnessGoal, Exercise, Workout, WorkoutSplit } from '@/types'

/**
 * Intelligent Workout Generator
 * Generates personalized exercises and workout splits based on:
 * - User's equipment availability
 * - Injury history
 * - Experience level
 * - Target muscles
 * - Recovery ability
 */

export class WorkoutGenerator {
  // Exercise database with progressive difficulty
  private static readonly EXERCISE_DB = {
    chest: {
      beginner: [
        { name: 'Push-ups', equipment: ['bodyweight', 'bench'], difficulty: 'beginner' },
        { name: 'Machine Chest Press', equipment: ['machine'], difficulty: 'beginner' },
        { name: 'Dumbbell Bench Press', equipment: ['dumbbells', 'bench'], difficulty: 'beginner' },
      ],
      intermediate: [
        { name: 'Barbell Bench Press', equipment: ['barbell', 'bench', 'rack'], difficulty: 'intermediate' },
        { name: 'Incline Dumbbell Press', equipment: ['dumbbells', 'incline-bench'], difficulty: 'intermediate' },
        { name: 'Chest Dips', equipment: ['dip-bars'], difficulty: 'intermediate' },
        { name: 'Cable Flyes', equipment: ['cable-machine'], difficulty: 'intermediate' },
      ],
      advanced: [
        { name: 'Pin Presses', equipment: ['barbell', 'power-rack'], difficulty: 'advanced' },
        { name: 'Close-Grip Bench Press', equipment: ['barbell', 'bench'], difficulty: 'advanced' },
        { name: 'Machine Decline Press', equipment: ['machine'], difficulty: 'advanced' },
      ],
    },
    back: {
      beginner: [
        { name: 'Assisted Pull-ups', equipment: ['pull-up-bar', 'machine'], difficulty: 'beginner' },
        { name: 'Machine Lat Pulldown', equipment: ['machine'], difficulty: 'beginner' },
        { name: 'Dumbbell Rows', equipment: ['dumbbells', 'bench'], difficulty: 'beginner' },
        { name: 'Bodyweight Rows', equipment: ['pull-up-bar', 'bodyweight'], difficulty: 'beginner' },
      ],
      intermediate: [
        { name: 'Pull-ups', equipment: ['pull-up-bar'], difficulty: 'intermediate' },
        { name: 'Barbell Rows', equipment: ['barbell', 'rack'], difficulty: 'intermediate' },
        { name: 'Weighted Pull-ups', equipment: ['pull-up-bar', 'weight-belt'], difficulty: 'intermediate' },
        { name: 'T-Bar Rows', equipment: ['barbell'], difficulty: 'intermediate' },
        { name: 'Cable Rows', equipment: ['cable-machine'], difficulty: 'intermediate' },
      ],
      advanced: [
        { name: 'Chin-ups', equipment: ['pull-up-bar'], difficulty: 'advanced' },
        { name: 'Archer Pull-ups', equipment: ['pull-up-bar'], difficulty: 'advanced' },
        { name: 'Deficit Deadlifts', equipment: ['barbell', 'platform'], difficulty: 'advanced' },
      ],
    },
    shoulders: {
      beginner: [
        { name: 'Machine Shoulder Press', equipment: ['machine'], difficulty: 'beginner' },
        { name: 'Dumbbell Shoulder Press', equipment: ['dumbbells', 'bench'], difficulty: 'beginner' },
        { name: 'Pike Push-ups', equipment: ['bodyweight'], difficulty: 'beginner' },
        { name: 'Lateral Raises', equipment: ['dumbbells'], difficulty: 'beginner' },
      ],
      intermediate: [
        { name: 'Barbell Overhead Press', equipment: ['barbell', 'rack'], difficulty: 'intermediate' },
        { name: 'Arnold Press', equipment: ['dumbbells', 'bench'], difficulty: 'intermediate' },
        { name: 'Cable Lateral Raises', equipment: ['cable-machine'], difficulty: 'intermediate' },
        { name: 'Face Pulls', equipment: ['rope', 'cable-machine'], difficulty: 'intermediate' },
      ],
      advanced: [
        { name: 'Dumbbell Snatches', equipment: ['dumbbells'], difficulty: 'advanced' },
        { name: 'Power Cleans', equipment: ['barbell', 'platform'], difficulty: 'advanced' },
        { name: 'Handstand Push-ups', equipment: ['bodyweight', 'wall'], difficulty: 'advanced' },
      ],
    },
    biceps: {
      beginner: [
        { name: 'Machine Curls', equipment: ['machine'], difficulty: 'beginner' },
        { name: 'Dumbbell Curls', equipment: ['dumbbells'], difficulty: 'beginner' },
        { name: 'Assisted Chin-ups', equipment: ['pull-up-bar', 'machine'], difficulty: 'beginner' },
      ],
      intermediate: [
        { name: 'Barbell Curls', equipment: ['barbell', 'ez-bar'], difficulty: 'intermediate' },
        { name: 'Preacher Curls', equipment: ['barbell', 'preacher-bench'], difficulty: 'intermediate' },
        { name: 'Cable Curls', equipment: ['cable-machine'], difficulty: 'intermediate' },
        { name: 'Concentration Curls', equipment: ['dumbbells'], difficulty: 'intermediate' },
      ],
      advanced: [
        { name: 'Dragon Curls', equipment: ['pull-up-bar'], difficulty: 'advanced' },
        { name: 'Weighted Dips', equipment: ['dip-bars', 'weight-belt'], difficulty: 'advanced' },
      ],
    },
    triceps: {
      beginner: [
        { name: 'Machine Tricep Press', equipment: ['machine'], difficulty: 'beginner' },
        { name: 'Tricep Dips', equipment: ['bench', 'bodyweight'], difficulty: 'beginner' },
        { name: 'Rope Pushdowns', equipment: ['rope', 'cable-machine'], difficulty: 'beginner' },
        { name: 'Overhead Extension', equipment: ['dumbbells'], difficulty: 'beginner' },
      ],
      intermediate: [
        { name: 'Dumbbell Tricep Press', equipment: ['dumbbells', 'bench'], difficulty: 'intermediate' },
        { name: 'Close-Grip Push-ups', equipment: ['bodyweight'], difficulty: 'intermediate' },
        { name: 'Skull Crushers', equipment: ['barbell', 'dumbbells'], difficulty: 'intermediate' },
        { name: 'V-Bar Pushdowns', equipment: ['v-bar', 'cable-machine'], difficulty: 'intermediate' },
      ],
      advanced: [
        { name: 'Reverse Grip Bench Press', equipment: ['barbell', 'bench'], difficulty: 'advanced' },
        { name: 'Pseudo Planche Push-ups', equipment: ['bodyweight'], difficulty: 'advanced' },
      ],
    },
    quads: {
      beginner: [
        { name: 'Machine Leg Press', equipment: ['machine'], difficulty: 'beginner' },
        { name: 'Bodyweight Squats', equipment: ['bodyweight'], difficulty: 'beginner' },
        { name: 'Machine Leg Extensions', equipment: ['machine'], difficulty: 'beginner' },
        { name: 'Walking Lunges', equipment: ['dumbbells', 'bodyweight'], difficulty: 'beginner' },
      ],
      intermediate: [
        { name: 'Barbell Back Squats', equipment: ['barbell', 'rack'], difficulty: 'intermediate' },
        { name: 'Bulgarian Split Squats', equipment: ['bench', 'dumbbells'], difficulty: 'intermediate' },
        { name: 'Dumbbell Goblet Squats', equipment: ['dumbbells'], difficulty: 'intermediate' },
        { name: 'Smith Machine Squats', equipment: ['smith-machine'], difficulty: 'intermediate' },
      ],
      advanced: [
        { name: 'Front Squats', equipment: ['barbell', 'rack'], difficulty: 'advanced' },
        { name: 'Pause Squats', equipment: ['barbell', 'rack'], difficulty: 'advanced' },
        { name: 'Pistol Squats', equipment: ['bodyweight'], difficulty: 'advanced' },
      ],
    },
    hamstrings: {
      beginner: [
        { name: 'Machine Leg Curls', equipment: ['machine'], difficulty: 'beginner' },
        { name: 'Glute Bridges', equipment: ['bodyweight', 'bench'], difficulty: 'beginner' },
      ],
      intermediate: [
        { name: 'Romanian Deadlifts', equipment: ['barbell', 'dumbbells'], difficulty: 'intermediate' },
        { name: 'Nordic Curls', equipment: ['bench', 'bodyweight'], difficulty: 'intermediate' },
        { name: 'Lying Leg Curls', equipment: ['machine'], difficulty: 'intermediate' },
        { name: 'Good Mornings', equipment: ['barbell'], difficulty: 'intermediate' },
      ],
      advanced: [
        { name: 'Deficit Deadlifts', equipment: ['barbell', 'platform'], difficulty: 'advanced' },
        { name: 'Single-Leg Romanian Deadlifts', equipment: ['dumbbells'], difficulty: 'advanced' },
      ],
    },
    glutes: {
      beginner: [
        { name: 'Glute Bridges', equipment: ['bodyweight', 'bench'], difficulty: 'beginner' },
        { name: 'Machine Hip Thrusts', equipment: ['machine'], difficulty: 'beginner' },
      ],
      intermediate: [
        { name: 'Barbell Hip Thrusts', equipment: ['barbell', 'bench'], difficulty: 'intermediate' },
        { name: 'Step-ups', equipment: ['bench', 'dumbbells'], difficulty: 'intermediate' },
        { name: 'Walking Lunges', equipment: ['dumbbells'], difficulty: 'intermediate' },
      ],
      advanced: [
        { name: 'Weighted Glute Bridges', equipment: ['barbell', 'bench'], difficulty: 'advanced' },
      ],
    },
  }

  /**
   * Generate a complete workout split based on user profile
   */
  static generateWorkoutSplit(
    profile: UserProfile,
    goal: FitnessGoal,
    availableDays: number,
    splitType: WorkoutSplit
  ): Workout[] {
    const workouts: Workout[] = []
    const experience = profile.fitnessExperience

    // Filter available equipment
    const availableEquipment = this.getEquipmentFromGymAccess(profile.gymAccess)

    switch (splitType) {
      case 'push-pull-legs':
        return this.generatePPLSplit(availableDays, experience, availableEquipment, goal, profile)

      case 'arnold':
        return this.generateArnoldSplit(availableDays, experience, availableEquipment, goal, profile)

      case 'upper-lower':
        return this.generateUpperLowerSplit(availableDays, experience, availableEquipment, goal, profile)

      case 'full-body':
        return this.generateFullBodySplit(availableDays, experience, availableEquipment, goal, profile)

      case 'hybrid':
        return this.generateHybridSplit(availableDays, experience, availableEquipment, goal, profile)

      default:
        return []
    }
  }

  // ============ SPLIT GENERATORS ============

  private static generatePPLSplit(
    days: number,
    experience: string,
    equipment: string[],
    goal: FitnessGoal,
    profile: UserProfile
  ): Workout[] {
    const workouts: Workout[] = []
    const musclePrefs = goal.aestheticPreferences || []

    // Push day
    workouts.push({
      id: 'ppl-push',
      userId: '',
      dayOfWeek: 0,
      name: 'Push Day',
      exercises: [
        ...this.selectExercises('chest', experience, equipment, musclePrefs.includes('bigger-chest') ? 3 : 2),
        ...this.selectExercises('shoulders', experience, equipment, musclePrefs.includes('wider-shoulders') ? 3 : 2),
        ...this.selectExercises('triceps', experience, equipment, 2),
      ],
      estimatedDuration: 75,
      intensity: 'high',
      createdAt: new Date(),
    })

    // Pull day
    workouts.push({
      id: 'ppl-pull',
      userId: '',
      dayOfWeek: 2,
      name: 'Pull Day',
      exercises: [
        ...this.selectExercises('back', experience, equipment, musclePrefs.includes('wider-shoulders') ? 3 : 2),
        ...this.selectExercises('biceps', experience, equipment, 2),
      ],
      estimatedDuration: 60,
      intensity: 'high',
      createdAt: new Date(),
    })

    // Leg day
    workouts.push({
      id: 'ppl-legs',
      userId: '',
      dayOfWeek: 4,
      name: 'Leg Day',
      exercises: [
        ...this.selectExercises('quads', experience, equipment, 3),
        ...this.selectExercises('hamstrings', experience, equipment, 2),
        ...this.selectExercises('glutes', experience, equipment, 2),
      ],
      estimatedDuration: 90,
      intensity: 'high',
      createdAt: new Date(),
    })

    return workouts
  }

  private static generateArnoldSplit(
    days: number,
    experience: string,
    equipment: string[],
    goal: FitnessGoal,
    profile: UserProfile
  ): Workout[] {
    const workouts: Workout[] = []
    const musclePrefs = goal.aestheticPreferences || []

    // Chest + Back + Abs
    workouts.push({
      id: 'arnold-1',
      userId: '',
      dayOfWeek: 0,
      name: 'Chest & Back',
      exercises: [
        ...this.selectExercises('chest', experience, equipment, musclePrefs.includes('bigger-chest') ? 4 : 3),
        ...this.selectExercises('back', experience, equipment, 3),
      ],
      estimatedDuration: 90,
      intensity: 'high',
      createdAt: new Date(),
    })

    // Shoulders + Arms + Forearms
    workouts.push({
      id: 'arnold-2',
      userId: '',
      dayOfWeek: 2,
      name: 'Shoulders & Arms',
      exercises: [
        ...this.selectExercises('shoulders', experience, equipment, musclePrefs.includes('wider-shoulders') ? 4 : 3),
        ...this.selectExercises('biceps', experience, equipment, 2),
        ...this.selectExercises('triceps', experience, equipment, 2),
      ],
      estimatedDuration: 90,
      intensity: 'high',
      createdAt: new Date(),
    })

    // Legs
    workouts.push({
      id: 'arnold-3',
      userId: '',
      dayOfWeek: 4,
      name: 'Leg Day',
      exercises: [
        ...this.selectExercises('quads', experience, equipment, 3),
        ...this.selectExercises('hamstrings', experience, equipment, 2),
        ...this.selectExercises('glutes', experience, equipment, 2),
      ],
      estimatedDuration: 90,
      intensity: 'high',
      createdAt: new Date(),
    })

    return workouts
  }

  private static generateUpperLowerSplit(
    days: number,
    experience: string,
    equipment: string[],
    goal: FitnessGoal,
    profile: UserProfile
  ): Workout[] {
    const workouts: Workout[] = []
    const musclePrefs = goal.aestheticPreferences || []

    // Upper A
    workouts.push({
      id: 'ul-upper-a',
      userId: '',
      dayOfWeek: 0,
      name: 'Upper A (Push Focus)',
      exercises: [
        ...this.selectExercises('chest', experience, equipment, musclePrefs.includes('bigger-chest') ? 3 : 2),
        ...this.selectExercises('shoulders', experience, equipment, musclePrefs.includes('wider-shoulders') ? 3 : 2),
        ...this.selectExercises('triceps', experience, equipment, 2),
        ...this.selectExercises('biceps', experience, equipment, 1),
      ],
      estimatedDuration: 75,
      intensity: 'high',
      createdAt: new Date(),
    })

    // Lower A
    workouts.push({
      id: 'ul-lower-a',
      userId: '',
      dayOfWeek: 1,
      name: 'Lower A',
      exercises: [
        ...this.selectExercises('quads', experience, equipment, 3),
        ...this.selectExercises('glutes', experience, equipment, 2),
        ...this.selectExercises('hamstrings', experience, equipment, 1),
      ],
      estimatedDuration: 75,
      intensity: 'high',
      createdAt: new Date(),
    })

    // Upper B
    workouts.push({
      id: 'ul-upper-b',
      userId: '',
      dayOfWeek: 3,
      name: 'Upper B (Pull Focus)',
      exercises: [
        ...this.selectExercises('back', experience, equipment, 3),
        ...this.selectExercises('biceps', experience, equipment, 2),
        ...this.selectExercises('shoulders', experience, equipment, 2),
      ],
      estimatedDuration: 75,
      intensity: 'high',
      createdAt: new Date(),
    })

    // Lower B
    workouts.push({
      id: 'ul-lower-b',
      userId: '',
      dayOfWeek: 4,
      name: 'Lower B',
      exercises: [
        ...this.selectExercises('hamstrings', experience, equipment, 3),
        ...this.selectExercises('quads', experience, equipment, 2),
        ...this.selectExercises('glutes', experience, equipment, 1),
      ],
      estimatedDuration: 75,
      intensity: 'high',
      createdAt: new Date(),
    })

    return workouts
  }

  private static generateFullBodySplit(
    days: number,
    experience: string,
    equipment: string[],
    goal: FitnessGoal,
    profile: UserProfile
  ): Workout[] {
    const workouts: Workout[] = []
    const musclePrefs = goal.aestheticPreferences || []

    for (let i = 0; i < Math.min(days, 3); i++) {
      workouts.push({
        id: `fb-${i}`,
        userId: '',
        dayOfWeek: i * 2,
        name: `Full Body ${i + 1}`,
        exercises: [
          ...this.selectExercises('chest', experience, equipment, 1),
          ...this.selectExercises('back', experience, equipment, 1),
          ...this.selectExercises('quads', experience, equipment, 1),
          ...this.selectExercises('hamstrings', experience, equipment, 1),
          ...this.selectExercises('shoulders', experience, equipment, 1),
          ...this.selectExercises('biceps', experience, equipment, 1),
          ...this.selectExercises('triceps', experience, equipment, 1),
        ],
        estimatedDuration: 90,
        intensity: i === 1 ? 'moderate' : 'high',
        createdAt: new Date(),
      })
    }

    return workouts
  }

  private static generateHybridSplit(
    days: number,
    experience: string,
    equipment: string[],
    goal: FitnessGoal,
    profile: UserProfile
  ): Workout[] {
    // Hybrid: Full body + specialization
    const fullBody = this.generateFullBodySplit(2, experience, equipment, goal, profile)
    const specialization = this.generatePPLSplit(1, experience, equipment, goal, profile)
    return [...fullBody, ...specialization]
  }

  // ============ HELPERS ============

  private static getEquipmentFromGymAccess(gymAccess: string): string[] {
    const equipmentMap: Record<string, string[]> = {
      'full-gym': ['barbell', 'dumbbells', 'machines', 'cable-machine', 'bench', 'rack', 'pull-up-bar', 'dip-bars'],
      'home-gym': ['dumbbells', 'bench', 'pull-up-bar'],
      'dumbbells-only': ['dumbbells'],
      'bodyweight-only': ['bodyweight'],
    }
    return equipmentMap[gymAccess] || ['bodyweight']
  }

  private static selectExercises(
    muscleGroup: string,
    experience: string,
    availableEquipment: string[],
    count: number
  ): Exercise[] {
    const db = this.EXERCISE_DB[muscleGroup as keyof typeof this.EXERCISE_DB] || {}
    const difficultyLevel: 'beginner' | 'intermediate' | 'advanced' =
      experience === 'advanced' ? 'advanced' : experience === 'intermediate' ? 'intermediate' : 'beginner'

    let exercises = (db[difficultyLevel as keyof typeof db] as any[]) || []

    // Filter by available equipment
    exercises = exercises.filter((ex: any) =>
      ex.equipment.some((eq: string) => availableEquipment.includes(eq) || eq === 'bodyweight')
    )

    // Return requested count
    const selected = exercises.slice(0, count)

    return selected.map((ex: any, idx: number): Exercise => ({
      id: `${muscleGroup}-${idx}`,
      name: ex.name,
      targetMuscles: [muscleGroup],
      equipment: ex.equipment,
      difficulty: difficultyLevel,
      sets: difficultyLevel === 'beginner' ? 3 : difficultyLevel === 'intermediate' ? 4 : 5,
      reps: muscleGroup.includes('arm') || muscleGroup === 'shoulders' ? '10-15' : '6-12',
      restSeconds: difficultyLevel === 'beginner' ? 90 : difficultyLevel === 'intermediate' ? 60 : 45,
    }))
  }
}
