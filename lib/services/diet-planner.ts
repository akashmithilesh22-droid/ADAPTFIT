import { UserProfile, FitnessGoal, MealPlan, DailyDietPlan, DietPreferences } from '@/types'

/**
 * AI Diet Planner
 * Generates personalized meal plans with:
 * - Automatic macro calculation
 * - Dietary restriction support
 * - Budget-based meal suggestions
 * - Cultural and personal preferences
 */

export class DietPlanner {
  private static readonly MEAL_DATABASE = {
    breakfast: [
      { name: 'Oatmeal with Protein', calories: 350, protein: 30, carbs: 45, fats: 8, budget: 'low', diet: ['vegetarian', 'non-vegetarian', 'vegan', 'eggetarian'], prepTime: 10 },
      { name: 'Eggs & Toast', calories: 400, protein: 20, carbs: 30, fats: 20, budget: 'low', diet: ['vegetarian', 'non-vegetarian', 'eggetarian'], prepTime: 15 },
      { name: 'Greek Yogurt Bowl', calories: 350, protein: 25, carbs: 40, fats: 5, budget: 'medium', diet: ['vegetarian', 'eggetarian'], prepTime: 5 },
      { name: 'Smoothie Bowl', calories: 320, protein: 20, carbs: 50, fats: 3, budget: 'medium', diet: ['vegetarian', 'non-vegetarian', 'vegan', 'eggetarian'], prepTime: 5 },
      { name: 'Pancakes & Berries', calories: 450, protein: 15, carbs: 60, fats: 12, budget: 'low', diet: ['vegetarian', 'eggetarian'], prepTime: 20 },
    ],
    lunch: [
      { name: 'Chicken Breast & Rice', calories: 650, protein: 50, carbs: 70, fats: 8, budget: 'medium', diet: ['non-vegetarian'], prepTime: 30 },
      { name: 'Tuna Salad', calories: 420, protein: 45, carbs: 20, fats: 15, budget: 'medium', diet: ['non-vegetarian'], prepTime: 15 },
      { name: 'Vegetable Curry & Rice', calories: 580, protein: 18, carbs: 75, fats: 15, budget: 'low', diet: ['vegetarian', 'vegan', 'eggetarian'], prepTime: 35 },
      { name: 'Grilled Salmon & Quinoa', calories: 700, protein: 55, carbs: 60, fats: 18, budget: 'high', diet: ['non-vegetarian'], prepTime: 25 },
      { name: 'Lentil & Chickpea Bowl', calories: 520, protein: 22, carbs: 65, fats: 12, budget: 'low', diet: ['vegetarian', 'vegan', 'eggetarian'], prepTime: 25 },
    ],
    dinner: [
      { name: 'Beef Steak & Potatoes', calories: 800, protein: 60, carbs: 50, fats: 25, budget: 'high', diet: ['non-vegetarian'], prepTime: 30 },
      { name: 'Pasta with Meat Sauce', calories: 750, protein: 45, carbs: 75, fats: 20, budget: 'medium', diet: ['non-vegetarian'], prepTime: 35 },
      { name: 'Tofu Stir Fry', calories: 520, protein: 30, carbs: 45, fats: 18, budget: 'medium', diet: ['vegetarian', 'vegan', 'eggetarian'], prepTime: 25 },
      { name: 'Baked Cod & Vegetables', calories: 480, protein: 50, carbs: 30, fats: 12, budget: 'medium', diet: ['non-vegetarian'], prepTime: 30 },
      { name: 'Black Bean Burgers', calories: 620, protein: 28, carbs: 65, fats: 18, budget: 'low', diet: ['vegetarian', 'vegan', 'eggetarian'], prepTime: 25 },
    ],
    snack: [
      { name: 'Protein Bar', calories: 200, protein: 20, carbs: 20, fats: 6, budget: 'low', diet: ['vegetarian', 'non-vegetarian', 'vegan', 'eggetarian'], prepTime: 0 },
      { name: 'Greek Yogurt & Nuts', calories: 250, protein: 20, carbs: 15, fats: 12, budget: 'medium', diet: ['vegetarian', 'eggetarian'], prepTime: 2 },
      { name: 'Apple & Peanut Butter', calories: 200, protein: 8, carbs: 25, fats: 9, budget: 'low', diet: ['vegetarian', 'vegan', 'eggetarian'], prepTime: 2 },
      { name: 'Hummus & Veggies', calories: 180, protein: 6, carbs: 20, fats: 8, budget: 'low', diet: ['vegetarian', 'vegan', 'eggetarian'], prepTime: 5 },
    ],
    'pre-workout': [
      { name: 'Banana & Almonds', calories: 200, protein: 7, carbs: 27, fats: 9, budget: 'low', diet: ['vegetarian', 'vegan', 'eggetarian'], prepTime: 2 },
      { name: 'Rice Cakes & Jam', calories: 150, protein: 3, carbs: 33, fats: 1, budget: 'low', diet: ['vegetarian', 'vegan', 'eggetarian'], prepTime: 2 },
      { name: 'Oatmeal', calories: 150, protein: 5, carbs: 27, fats: 3, budget: 'low', diet: ['vegetarian', 'vegan', 'eggetarian'], prepTime: 10 },
    ],
    'post-workout': [
      { name: 'Protein Shake', calories: 250, protein: 30, carbs: 30, fats: 3, budget: 'medium', diet: ['vegetarian', 'non-vegetarian', 'vegan', 'eggetarian'], prepTime: 3 },
      { name: 'Chicken & White Rice', calories: 400, protein: 40, carbs: 45, fats: 5, budget: 'low', diet: ['non-vegetarian'], prepTime: 20 },
      { name: 'Greek Yogurt & Granola', calories: 350, protein: 25, carbs: 40, fats: 8, budget: 'medium', diet: ['vegetarian', 'eggetarian'], prepTime: 3 },
    ],
  }

  /**
   * Generate 7-day personalized meal plan
   */
  static generateMealPlan(
    profile: UserProfile,
    goal: FitnessGoal,
    preferences: DietPreferences,
    calorieTarget: number,
    mealsPerDay: number = 3
  ): DailyDietPlan[] {
    const weekPlans: DailyDietPlan[] = []
    const macros = this.calculateMacroDistribution(calorieTarget, goal.primaryGoal)

    for (let day = 0; day < 7; day++) {
      const dayPlan = this.generateDailyPlan(
        day,
        calorieTarget,
        macros,
        mealsPerDay,
        preferences,
        goal.primaryGoal
      )
      weekPlans.push(dayPlan)
    }

    return weekPlans
  }

  /**
   * Suggest meal replacements based on preferences
   */
  static suggestMealReplacement(
    originalMeal: MealPlan,
    preferences: DietPreferences,
    constraints: { budget?: boolean; allergyFree?: boolean } = {}
  ): MealPlan | null {
    const mealType = originalMeal.meal as keyof typeof this.MEAL_DATABASE
    const database = this.MEAL_DATABASE[mealType] || []

    let suggestions = database
      .filter((meal: any) => preferences.dietType === 'non-vegetarian' || meal.diet.includes(preferences.dietType))
      .filter((meal: any) => !preferences.allergies.some(allergy => meal.name.toLowerCase().includes(allergy.toLowerCase())))
      .filter((meal: any) => !constraints.budget || meal.budget === preferences.budget || meal.budget === 'low')

    if (suggestions.length === 0) return null

    // Pick random from filtered suggestions
    const selected = suggestions[Math.floor(Math.random() * suggestions.length)] as any

    return {
      id: `meal-${Date.now()}`,
      userId: '',
      meal: originalMeal.meal,
      name: selected.name,
      calories: selected.calories,
      protein: selected.protein,
      carbs: selected.carbs,
      fats: selected.fats,
      ingredients: [selected.name],
      cost: Math.round(Math.random() * 20 + 5),
      prepTime: selected.prepTime,
    }
  }

  /**
   * Calculate daily calorie and macro needs
   */
  static calculateNutritionNeeds(
    profile: UserProfile,
    goal: FitnessGoal,
    workoutIntensity: 'light' | 'moderate' | 'heavy' = 'moderate'
  ): { calories: number; protein: number; carbs: number; fats: number } {
    // Adjusted TDEE
    const bmr = this.calculateBMR(profile)
    const activityMultipliers = {
      'sedentary': 1.2,
      'lightly-active': 1.375,
      'moderately-active': 1.55,
      'very-active': 1.725,
    }

    const tdee = bmr * (activityMultipliers[profile.activityLevel] || 1.375)

    // Goal adjustment
    let calorieMultiplier = 1.0
    if (goal.primaryGoal === 'bulking') calorieMultiplier = 1.1
    if (goal.primaryGoal === 'cutting') calorieMultiplier = 0.85
    if (goal.primaryGoal === 'body-recomposition') calorieMultiplier = 1.0

    const calories = Math.round(tdee * calorieMultiplier)
    const macros = this.calculateMacroDistribution(calories, goal.primaryGoal)

    return {
      calories,
      ...macros,
    }
  }

  /**
   * Track daily nutrition against targets
   */
  static analyzeDailyNutrition(
    dayPlan: DailyDietPlan,
    targets: { calories: number; protein: number; carbs: number; fats: number }
  ): {
    macroAccuracy: number // 0-100%
    caloricBalance: number // actual - target
    macroBalance: { protein: number; carbs: number; fats: number }
    recommendations: string[]
  } {
    const recommendations: string[] = []

    const caloricBalance = dayPlan.totalCalories - targets.calories
    const macroAccuracy = 100 - (Math.abs(caloricBalance) / targets.calories) * 50

    const proteinDiff = dayPlan.totalProtein - targets.protein
    const carbsDiff = dayPlan.totalCarbs - targets.carbs
    const fatsDiff = dayPlan.totalFats - targets.fats

    if (dayPlan.totalProtein < targets.protein * 0.9) {
      recommendations.push(`Increase protein by ${Math.round((targets.protein - dayPlan.totalProtein) / 10) * 10}g`)
    }
    if (caloricBalance > 200) {
      recommendations.push(`You\'re ${Math.round(caloricBalance)} calories over target`)
    }
    if (caloricBalance < -200) {
      recommendations.push(`Add ${Math.round(-caloricBalance)} calories for better performance`)
    }

    return {
      macroAccuracy: Math.max(0, Math.min(100, macroAccuracy)),
      caloricBalance,
      macroBalance: {
        protein: proteinDiff,
        carbs: carbsDiff,
        fats: fatsDiff,
      },
      recommendations,
    }
  }

  /**
   * Generate budget-based meal suggestions
   */
  static calculateMealCost(meals: MealPlan[], currency: string = 'USD'): {
    dailyCost: number
    weeklyCost: number
    perMealCost: number
  } {
    const totalCost = meals.reduce((sum, meal) => sum + (meal.cost || 0), 0)

    return {
      dailyCost: totalCost,
      weeklyCost: totalCost * 7,
      perMealCost: totalCost / meals.length,
    }
  }

  // ============ PRIVATE HELPERS ============

  private static generateDailyPlan(
    dayOfWeek: number,
    calorieTarget: number,
    macros: { protein: number; carbs: number; fats: number },
    mealsPerDay: number,
    preferences: DietPreferences,
    goal: string
  ): DailyDietPlan {
    const meals: MealPlan[] = []
    const caloriesPerMeal = calorieTarget / mealsPerDay
    let totalCalories = 0
    let totalProtein = 0
    let totalCarbs = 0
    let totalFats = 0

    // Ensure pre/post workout meals if training
    const hasPreWorkout = mealsPerDay >= 5
    const hasPostWorkout = mealsPerDay >= 5

    // Select meal types
    const mealTypes: Array<'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre-workout' | 'post-workout'> = ['breakfast', 'lunch', 'dinner']
    if (mealsPerDay >= 4) mealTypes.push('snack')
    if (hasPreWorkout) mealTypes.splice(mealTypes.length - 1, 0, 'pre-workout')
    if (hasPostWorkout) mealTypes.push('post-workout')

    for (const mealType of mealTypes.slice(0, mealsPerDay)) {
      const mealDb = this.MEAL_DATABASE[mealType] || []
      const compatible = mealDb.filter((m: any) =>
        preferences.dietType === 'non-vegetarian' ||
        m.diet.includes(preferences.dietType)
      )

      if (compatible.length === 0) continue

      const selectedMeal = compatible[Math.floor(Math.random() * compatible.length)]

      const meal: MealPlan = {
        id: `meal-${dayOfWeek}-${mealType}`,
        userId: '',
        meal: mealType,
        name: selectedMeal.name,
        calories: selectedMeal.calories,
        protein: selectedMeal.protein,
        carbs: selectedMeal.carbs,
        fats: selectedMeal.fats,
        ingredients: [selectedMeal.name],
        cost: Math.round(Math.random() * 20 + 5),
        prepTime: selectedMeal.prepTime,
      }

      meals.push(meal)
      totalCalories += meal.calories
      totalProtein += meal.protein
      totalCarbs += meal.carbs
      totalFats += meal.fats
    }

    return {
      id: `day-${dayOfWeek}`,
      userId: '',
      date: new Date(new Date().getTime() + dayOfWeek * 24 * 60 * 60 * 1000),
      meals,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFats,
    }
  }

  private static calculateMacroDistribution(
    calorieTarget: number,
    goal: string
  ): { protein: number; carbs: number; fats: number } {
    let proteinPercentage = 0.3
    let carbPercentage = 0.45
    let fatPercentage = 0.25

    if (goal === 'bulking') {
      carbPercentage = 0.55
      proteinPercentage = 0.25
      fatPercentage = 0.2
    } else if (goal === 'cutting') {
      proteinPercentage = 0.4
      carbPercentage = 0.35
      fatPercentage = 0.25
    }

    const protein = Math.round((calorieTarget * proteinPercentage) / 4)
    const carbs = Math.round((calorieTarget * carbPercentage) / 4)
    const fats = Math.round((calorieTarget * fatPercentage) / 9)

    return { protein, carbs, fats }
  }

  private static calculateBMR(profile: UserProfile): number {
    const weight = profile.weightKg
    const height = profile.heightCm
    const age = profile.age

    if (profile.gender === 'male') {
      return 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161
    }
  }
}
