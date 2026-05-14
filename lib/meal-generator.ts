import type { OnboardingData } from '@/app/(app)/onboarding/page'

/**
 * Comprehensive meal database with nutritional info and attributes
 */
export interface Meal {
  id: string
  name: string
  protein: number
  carbs: number
  fats: number
  calories: number
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  attributes: {
    vegetarian: boolean
    vegan: boolean
    glutenFree: boolean
    dairyFree: boolean
    nutFree: boolean
    beefFree: boolean
    porkFree: boolean
    fishFree: boolean
  }
  cuisines: string[]
}

const MEAL_DATABASE: Meal[] = [
  // Breakfast
  {
    id: 'oats-berries',
    name: 'Oatmeal with Berries & Almonds',
    protein: 12,
    carbs: 45,
    fats: 8,
    calories: 290,
    category: 'breakfast',
    attributes: { vegetarian: true, vegan: true, glutenFree: false, dairyFree: true, nutFree: false, beefFree: true, porkFree: true, fishFree: true },
    cuisines: ['american'],
  },
  {
    id: 'egg-toast',
    name: 'Scrambled Eggs on Toast',
    protein: 16,
    carbs: 35,
    fats: 11,
    calories: 320,
    category: 'breakfast',
    attributes: { vegetarian: true, vegan: false, glutenFree: false, dairyFree: false, nutFree: true, beefFree: true, porkFree: true, fishFree: true },
    cuisines: ['american'],
  },
  {
    id: 'greek-yogurt',
    name: 'Greek Yogurt Parfait',
    protein: 20,
    carbs: 40,
    fats: 5,
    calories: 290,
    category: 'breakfast',
    attributes: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false, nutFree: true, beefFree: true, porkFree: true, fishFree: true },
    cuisines: ['greek'],
  },
  {
    id: 'pancakes',
    name: 'Protein Pancakes',
    protein: 25,
    carbs: 50,
    fats: 6,
    calories: 380,
    category: 'breakfast',
    attributes: { vegetarian: true, vegan: false, glutenFree: false, dairyFree: false, nutFree: true, beefFree: true, porkFree: true, fishFree: true },
    cuisines: ['american'],
  },

  // Lunch
  {
    id: 'chicken-rice',
    name: 'Grilled Chicken with Brown Rice',
    protein: 35,
    carbs: 50,
    fats: 8,
    calories: 450,
    category: 'lunch',
    attributes: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: true, nutFree: true, beefFree: true, porkFree: true, fishFree: true },
    cuisines: ['american'],
  },
  {
    id: 'salmon-broccoli',
    name: 'Baked Salmon with Broccoli',
    protein: 32,
    carbs: 25,
    fats: 14,
    calories: 420,
    category: 'lunch',
    attributes: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: true, nutFree: true, beefFree: true, porkFree: true, fishFree: false },
    cuisines: ['american'],
  },
  {
    id: 'turkey-wrap',
    name: 'Turkey Whole Wheat Wrap',
    protein: 28,
    carbs: 45,
    fats: 9,
    calories: 420,
    category: 'lunch',
    attributes: { vegetarian: false, vegan: false, glutenFree: false, dairyFree: false, nutFree: true, beefFree: true, porkFree: true, fishFree: true },
    cuisines: ['american'],
  },
  {
    id: 'veggie-bowl',
    name: 'Quinoa Buddha Bowl (vegetarian)',
    protein: 18,
    carbs: 52,
    fats: 10,
    calories: 420,
    category: 'lunch',
    attributes: { vegetarian: true, vegan: true, glutenFree: true, dairyFree: true, nutFree: false, beefFree: true, porkFree: true, fishFree: true },
    cuisines: ['indian', 'middle-eastern'],
  },
  {
    id: 'tofu-noodles',
    name: 'Tofu Noodle Stir-Fry',
    protein: 22,
    carbs: 48,
    fats: 8,
    calories: 400,
    category: 'lunch',
    attributes: { vegetarian: true, vegan: true, glutenFree: false, dairyFree: true, nutFree: true, beefFree: true, porkFree: true, fishFree: true },
    cuisines: ['asian'],
  },
  {
    id: 'tuna-salad',
    name: 'Tuna Salad with Olive Oil',
    protein: 30,
    carbs: 15,
    fats: 12,
    calories: 340,
    category: 'lunch',
    attributes: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: true, nutFree: true, beefFree: true, porkFree: true, fishFree: false },
    cuisines: ['american'],
  },
  {
    id: 'paneer-rice',
    name: 'Paneer Curry with Rice',
    protein: 24,
    carbs: 48,
    fats: 11,
    calories: 450,
    category: 'lunch',
    attributes: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false, nutFree: true, beefFree: true, porkFree: true, fishFree: true },
    cuisines: ['indian'],
  },

  // Dinner
  {
    id: 'beef-steak',
    name: 'Lean Beef Steak with Vegetables',
    protein: 38,
    carbs: 18,
    fats: 12,
    calories: 420,
    category: 'dinner',
    attributes: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: true, nutFree: true, beefFree: false, porkFree: true, fishFree: true },
    cuisines: ['american'],
  },
  {
    id: 'pork-chops',
    name: 'Pork Chops with Sweet Potato',
    protein: 34,
    carbs: 35,
    fats: 10,
    calories: 430,
    category: 'dinner',
    attributes: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: true, nutFree: true, beefFree: true, porkFree: false, fishFree: true },
    cuisines: ['american'],
  },
  {
    id: 'pasta-marinara',
    name: 'Whole Wheat Pasta with Marinara',
    protein: 14,
    carbs: 60,
    fats: 5,
    calories: 370,
    category: 'dinner',
    attributes: { vegetarian: true, vegan: true, glutenFree: false, dairyFree: true, nutFree: true, beefFree: true, porkFree: true, fishFree: true },
    cuisines: ['italian'],
  },
  {
    id: 'chickpea-curry',
    name: 'Chickpea Tikka Masala',
    protein: 16,
    carbs: 48,
    fats: 9,
    calories: 400,
    category: 'dinner',
    attributes: { vegetarian: true, vegan: true, glutenFree: true, dairyFree: true, nutFree: true, beefFree: true, porkFree: true, fishFree: true },
    cuisines: ['indian'],
  },
  {
    id: 'cod-asparagus',
    name: 'Baked Cod with Asparagus',
    protein: 30,
    carbs: 20,
    fats: 8,
    calories: 320,
    category: 'dinner',
    attributes: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: true, nutFree: true, beefFree: true, porkFree: true, fishFree: false },
    cuisines: ['american'],
  },

  // Snacks
  {
    id: 'protein-bar',
    name: 'Protein Bar',
    protein: 20,
    carbs: 28,
    fats: 8,
    calories: 250,
    category: 'snack',
    attributes: { vegetarian: true, vegan: false, glutenFree: false, dairyFree: false, nutFree: true, beefFree: true, porkFree: true, fishFree: true },
    cuisines: [],
  },
  {
    id: 'greek-yogurt-snack',
    name: 'Greek Yogurt with Honey',
    protein: 15,
    carbs: 25,
    fats: 3,
    calories: 180,
    category: 'snack',
    attributes: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false, nutFree: true, beefFree: true, porkFree: true, fishFree: true },
    cuisines: [],
  },
  {
    id: 'nuts-seeds',
    name: 'Mixed Nuts & Seeds',
    protein: 8,
    carbs: 12,
    fats: 16,
    calories: 200,
    category: 'snack',
    attributes: { vegetarian: true, vegan: true, glutenFree: true, dairyFree: true, nutFree: false, beefFree: true, porkFree: true, fishFree: true },
    cuisines: [],
  },
  {
    id: 'banana-peanut',
    name: 'Banana with Peanut Butter',
    protein: 8,
    carbs: 35,
    fats: 8,
    calories: 220,
    category: 'snack',
    attributes: { vegetarian: true, vegan: true, glutenFree: true, dairyFree: true, nutFree: false, beefFree: true, porkFree: true, fishFree: true },
    cuisines: [],
  },
]

/**
 * Check if a meal respects all user dietary restrictions
 */
export function isMealAllowed(meal: Meal, onboarding: OnboardingData): boolean {
  // Check vegetarian/vegan
  if (onboarding.dietaryRestriction === 'vegan' && !meal.attributes.vegan) {
    return false
  }
  if (onboarding.dietaryRestriction === 'vegetarian' && !meal.attributes.vegetarian) {
    return false
  }

  // Check excluded foods
  const excludedFoods = (onboarding.excludedFoods || []) as string[]
  if (excludedFoods.includes('beef') && !meal.attributes.beefFree) {
    return false
  }
  if (excludedFoods.includes('pork') && !meal.attributes.porkFree) {
    return false
  }
  if (excludedFoods.includes('fish') && !meal.attributes.fishFree) {
    return false
  }

  // Check allergies
  const allergies = (onboarding.allergies || []) as string[]
  for (const allergy of allergies) {
    if (allergy === 'nuts' && !meal.attributes.nutFree) {
      return false
    }
    if (allergy === 'gluten' && !meal.attributes.glutenFree) {
      return false
    }
    if (allergy === 'dairy' && !meal.attributes.dairyFree) {
      return false
    }
  }

  // Check cultural/religious restrictions
  const culturalRestrictions = (onboarding.culturalRestrictions || []) as string[]
  if (culturalRestrictions.includes('no-beef') && !meal.attributes.beefFree) {
    return false
  }
  if (culturalRestrictions.includes('no-pork') && !meal.attributes.porkFree) {
    return false
  }

  return true
}

/**
 * Filter meals by category and check dietary restrictions
 */
export function filterMealsByCategory(
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack',
  onboarding: OnboardingData
): Meal[] {
  return MEAL_DATABASE.filter(
    (meal) => meal.category === category && isMealAllowed(meal, onboarding)
  )
}

/**
 * Find meals matching a macro target
 */
export interface MacroTarget {
  protein: number
  carbs: number
  fats: number
  calories: number
}

export function findMealsMatchingMacros(
  meals: Meal[],
  target: MacroTarget,
  tolerance: number = 50 // +/- 50 calories
): Meal[] {
  return meals.filter((meal) => {
    const calorieMatch = Math.abs(meal.calories - target.calories) <= tolerance
    return calorieMatch
  })
}

/**
 * Generate a day's meal plan with matched macros
 */
export interface DayMealPlan {
  breakfast: Meal | null
  lunch: Meal | null
  dinner: Meal | null
  snack: Meal | null
  totalProtein: number
  totalCarbs: number
  totalFats: number
  totalCalories: number
}

export function generateDailyMealPlan(
  onboarding: OnboardingData,
  dailyCalories: number,
  dailyProtein: number,
  dailyCarbs: number,
  dailyFats: number
): DayMealPlan {
  // Macro split: Breakfast 25%, Lunch 35%, Dinner 30%, Snack 10%
  const breakfastCals = Math.round(dailyCalories * 0.25)
  const lunchCals = Math.round(dailyCalories * 0.35)
  const dinnerCals = Math.round(dailyCalories * 0.30)
  const snackCals = Math.round(dailyCalories * 0.10)

  const breakfastOptions = filterMealsByCategory('breakfast', onboarding)
  const lunchOptions = filterMealsByCategory('lunch', onboarding)
  const dinnerOptions = filterMealsByCategory('dinner', onboarding)
  const snackOptions = filterMealsByCategory('snack', onboarding)

  // Simple matching: find closest calorie match for each meal
  const breakfast =
    breakfastOptions.reduce((closest, meal) => {
      if (!closest) return meal
      return Math.abs(meal.calories - breakfastCals) < Math.abs(closest.calories - breakfastCals)
        ? meal
        : closest
    }, null as Meal | null) ?? null

  const lunch =
    lunchOptions.reduce((closest, meal) => {
      if (!closest) return meal
      return Math.abs(meal.calories - lunchCals) < Math.abs(closest.calories - lunchCals)
        ? meal
        : closest
    }, null as Meal | null) ?? null

  const dinner =
    dinnerOptions.reduce((closest, meal) => {
      if (!closest) return meal
      return Math.abs(meal.calories - dinnerCals) < Math.abs(closest.calories - dinnerCals)
        ? meal
        : closest
    }, null as Meal | null) ?? null

  const snack =
    snackOptions.reduce((closest, meal) => {
      if (!closest) return meal
      return Math.abs(meal.calories - snackCals) < Math.abs(closest.calories - snackCals)
        ? meal
        : closest
    }, null as Meal | null) ?? null

  const totalProtein = (breakfast?.protein ?? 0) + (lunch?.protein ?? 0) + (dinner?.protein ?? 0) + (snack?.protein ?? 0)
  const totalCarbs = (breakfast?.carbs ?? 0) + (lunch?.carbs ?? 0) + (dinner?.carbs ?? 0) + (snack?.carbs ?? 0)
  const totalFats = (breakfast?.fats ?? 0) + (lunch?.fats ?? 0) + (dinner?.fats ?? 0) + (snack?.fats ?? 0)
  const totalCalories = (breakfast?.calories ?? 0) + (lunch?.calories ?? 0) + (dinner?.calories ?? 0) + (snack?.calories ?? 0)

  return {
    breakfast,
    lunch,
    dinner,
    snack,
    totalProtein,
    totalCarbs,
    totalFats,
    totalCalories,
  }
}

/**
 * Get meal suggestions (alternative meals for same macro target)
 */
export function getMealSuggestions(
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack',
  onboarding: OnboardingData,
  targetCalories: number,
  count: number = 3
): Meal[] {
  const options = filterMealsByCategory(category, onboarding)

  // Sort by closest calorie match
  const sorted = options.sort((a, b) => {
    return Math.abs(a.calories - targetCalories) - Math.abs(b.calories - targetCalories)
  })

  return sorted.slice(0, count)
}
