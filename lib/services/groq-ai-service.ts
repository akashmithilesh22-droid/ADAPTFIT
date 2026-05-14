import Groq from 'groq-sdk'
import type { OnboardingData } from '@/app/(app)/onboarding/page'
import { calculateNutritionTargets } from '@/lib/fitness-calculations'

// ─── Shared JSON schemas ────────────────────────────────────────────────────

export interface AIExercise {
  name: string
  sets: number
  reps: string        // e.g. "8-12" or "15"
  muscle: string
  notes?: string      // injury-safe cues or form tips
}

export interface AIWorkoutDay {
  day: string         // e.g. "Monday"
  name: string        // e.g. "Push Day"
  type: 'strength' | 'cardio' | 'hiit' | 'recovery' | 'rest'
  duration: number    // minutes
  calories: number    // estimated burn
  exercises: AIExercise[]
  aiTip: string       // single personalised coaching note
}

export interface AIWorkoutPlan {
  split: string                 // e.g. "Push/Pull/Legs"
  weeklyPlan: AIWorkoutDay[]
  coachNote: string             // overall programme rationale
}

// ─────────────────────────────────────────────────────────────────────────────

export interface AIMeal {
  name: string
  meal: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Pre-Workout' | 'Post-Workout'
  time: string
  calories: number
  protein: number   // grams
  carbs: number
  fats: number
  ingredients: string[]
  prepTime: number  // minutes
  dietaryNote?: string
}

export interface AIMealSuggestion {
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
  match: number        // 0–100 compatibility score
  note: string
}

export interface AIDietPlan {
  targets: {
    calories: number
    protein: number
    carbs: number
    fats: number
    water: number   // glasses
  }
  meals: AIMeal[]
  suggestions: AIMealSuggestion[]
  weeklyTips: string[]
  dietaryCompliance: string   // confirmation that restrictions were respected
}

// ─────────────────────────────────────────────────────────────────────────────

export interface AIRecoveryTip {
  category: 'sleep' | 'nutrition' | 'active-recovery' | 'stress' | 'injury'
  tip: string
  priority: 'high' | 'medium' | 'low'
}

export interface AIRecoveryPlan {
  readinessScore: number       // 0–100 based on profile data
  readinessLabel: 'Low' | 'Moderate' | 'High'
  todaySuggestion: string      // one-line recommendation for today
  sleepTarget: number          // hours
  personalizedTips: AIRecoveryTip[]
  injuryModifications: string[]  // specific modifications for stated injuries
  weeklyRecoveryPlan: {
    day: string
    activity: string
    duration: number   // minutes
    notes: string
  }[]
}

// ─── Validation helpers ─────────────────────────────────────────────────────

function isValidWorkoutPlan(obj: unknown): obj is AIWorkoutPlan {
  if (!obj || typeof obj !== 'object') return false
  const p = obj as Record<string, unknown>
  return (
    typeof p.split === 'string' &&
    Array.isArray(p.weeklyPlan) &&
    p.weeklyPlan.length > 0 &&
    typeof p.coachNote === 'string'
  )
}

function isValidDietPlan(obj: unknown): obj is AIDietPlan {
  if (!obj || typeof obj !== 'object') return false
  const p = obj as Record<string, unknown>
  return (
    typeof p.targets === 'object' &&
    p.targets !== null &&
    Array.isArray(p.meals) &&
    p.meals.length > 0 &&
    Array.isArray(p.suggestions) &&
    Array.isArray(p.weeklyTips)
  )
}

function isValidRecoveryPlan(obj: unknown): obj is AIRecoveryPlan {
  if (!obj || typeof obj !== 'object') return false
  const p = obj as Record<string, unknown>
  return (
    typeof p.readinessScore === 'number' &&
    typeof p.readinessLabel === 'string' &&
    typeof p.todaySuggestion === 'string' &&
    Array.isArray(p.personalizedTips) &&
    Array.isArray(p.weeklyRecoveryPlan)
  )
}

// ─── Prompt builders ────────────────────────────────────────────────────────

function buildUserContext(o: OnboardingData): string {
  return `
USER PROFILE:
- Age: ${o.age}, Gender: ${o.gender}
- Height: ${o.heightCm} cm, Weight: ${o.weightKg} kg
- Body fat: ${o.bodyFatPct}%
- Fitness experience: ${o.fitnessExperience}
- Activity level: ${o.activityLevel}
- Gym access: ${o.gymAccess}
- Primary goal: ${o.primaryGoal}
- Timeline: ${o.timeline}
- Commitment level: ${o.commitment}/10
- Workout days per week: ${o.workoutDays?.length ?? 3} (${o.workoutDays?.join(', ') ?? 'flexible'})
- Workout duration: ${o.workoutDuration} minutes per session
- Preferred workout time: ${o.workoutTime}
- Injuries / limitations: ${o.injuries?.length ? o.injuries.join(', ') : 'none'}
- Diet type: ${o.dietType}
- Allergies: ${o.allergies?.length ? o.allergies.join(', ') : 'none'}
- Cultural restrictions: ${o.culturalRestrictions || 'none'}
- Budget: ${o.budget}
- Cuisine preferences: ${o.cuisinePreferences?.length ? o.cuisinePreferences.join(', ') : 'any'}
- Meals per day: ${o.mealsPerDay}
- Macro preference: ${o.macroPreference}
- Calorie target preference: ${o.calorieTarget}
`.trim()
}

function buildWorkoutPrompt(o: OnboardingData): string {
  const injuryLine =
    o.injuries?.length
      ? `IMPORTANT: User has the following injuries/limitations: ${o.injuries.join(', ')}. NEVER include exercises that stress these areas.`
      : ''

  const homeWorkoutLine = o.aiPreferences?.preferHomeWorkouts 
    ? 'STRICT REQUIREMENT: The user prefers HOME WORKOUTS. Only use bodyweight exercises or minimal equipment (dumbbells/bands if they have them). Do not prescribe heavy gym machines.'
    : `4. Only uses equipment available in: ${o.gymAccess}`

  const advancedLine = o.aiPreferences?.avoidAdvancedExercises
    ? 'STRICT REQUIREMENT: Avoid advanced or highly technical exercises (e.g. Olympic lifts, heavy deadlifts, complex gymnastics). Keep movements simple, safe, and foundational.'
    : ''

  return `
You are an expert personal trainer creating a personalised weekly workout plan.

${buildUserContext(o)}

${injuryLine}
${advancedLine}

Generate a complete weekly workout plan that:
1. STRICTLY fits these days: ${o.workoutDays?.join(', ') || '3 random days'}. All other days MUST be type "rest".
2. Each session lasts ~${o.workoutDuration || 60} minutes
3. Matches the goal "${o.primaryGoal}" and experience level "${o.fitnessExperience}"
${o.aiPreferences?.preferHomeWorkouts ? homeWorkoutLine : `4. Only uses equipment available in: ${o.gymAccess}`}
5. Rest days should have type "rest" and minimal or no exercises. Do not skip the ${7 - (o.workoutDays?.length || 3)} rest days.

Return ONLY valid JSON matching this exact schema (no markdown, no code blocks):
{
  "split": "string describing the split",
  "weeklyPlan": [
    {
      "day": "Monday",
      "name": "Session name",
      "type": "strength|cardio|hiit|recovery|rest",
      "duration": 60,
      "calories": 350,
      "exercises": [
        {
          "name": "Exercise name",
          "sets": 4,
          "reps": "8-12",
          "muscle": "Primary muscle",
          "notes": "Optional form tip or modification"
        }
      ],
      "aiTip": "One personalised coaching note for this session"
    }
  ],
  "coachNote": "Overall rationale for the programme"
}
`.trim()
}

function buildDietPrompt(o: OnboardingData): string {
  const targets = calculateNutritionTargets(o)
  const allergyWarning =
    o.allergies?.length
      ? `CRITICAL ALLERGY ALERT: NEVER include any of these ingredients in any meal: ${o.allergies.join(', ')}. This is a strict requirement.`
      : ''

  const dietRule = (() => {
    switch (o.dietType) {
      case 'vegetarian':
        return 'STRICT VEGETARIAN: No meat, poultry, or seafood. Dairy and eggs are allowed.'
      case 'vegan':
        return 'STRICT VEGAN: No animal products whatsoever — no meat, fish, eggs, dairy, honey.'
      case 'eggetarian':
        return 'EGGETARIAN: No meat or seafood. Eggs and dairy are allowed.'
      case 'non-vegetarian':
        return 'Non-vegetarian diet allowed. Include a healthy mix of proteins.'
      default:
        return `Diet type: ${o.dietType}`
    }
  })()

  const budgetLine = o.aiPreferences?.preferBudgetMeals
    ? 'STRICT REQUIREMENT: The user prefers BUDGET-FRIENDLY meals. Prioritise cheap, highly accessible ingredients like rice, beans, lentils, eggs, oats, and seasonal vegetables. Avoid expensive cuts of meat, rare supplements, or exotic produce.'
    : `Cuisine preferences: ${o.cuisinePreferences?.join(', ') || 'any'}`

  return `
You are an expert nutritionist creating a personalised daily meal plan.

${buildUserContext(o)}

DIETARY RULES (non-negotiable):
- ${dietRule}
- ${allergyWarning || 'No known allergies.'}
- Cultural/religious restrictions: ${o.culturalRestrictions || 'none'}
- ${budgetLine}
- Budget: ${o.budget}
- Meals per day: ${o.mealsPerDay}

Calculate accurate macro targets based on these strict requirements:
- Calories: ${targets.calories}
- Protein: ${targets.protein}g
- Carbs: ${targets.carbs}g
- Fats: ${targets.fats}g

The sum of (Protein*4 + Carbs*4 + Fats*9) MUST equal the Calorie target.
Generate meals that hit those targets exactly.

Return ONLY valid JSON matching this exact schema (no markdown, no code blocks):
{
  "targets": {
    "calories": ${targets.calories},
    "protein": ${targets.protein},
    "carbs": ${targets.carbs},
    "fats": ${targets.fats},
    "water": ${targets.water}
  },
  "meals": [
    {
      "name": "Meal name",
      "meal": "Breakfast|Lunch|Dinner|Snack|Pre-Workout|Post-Workout",
      "time": "8:00 AM",
      "calories": 450,
      "protein": 35,
      "carbs": 45,
      "fats": 12,
      "ingredients": ["ingredient 1", "ingredient 2"],
      "prepTime": 15,
      "dietaryNote": "Why this meal fits the user's profile"
    }
  ],
  "suggestions": [
    {
      "name": "Alternative meal name",
      "calories": 400,
      "protein": 30,
      "carbs": 40,
      "fats": 10,
      "match": 95,
      "note": "Why this is a good match"
    }
  ],
  "weeklyTips": ["Tip 1", "Tip 2", "Tip 3"],
  "dietaryCompliance": "Confirmation that all dietary restrictions were followed"
}
`.trim()
}

function buildRecoveryPrompt(o: OnboardingData): string {
  return `
You are an expert sports recovery coach creating a personalised recovery plan.

${buildUserContext(o)}

Generate a recovery plan that:
1. Estimates a readiness score (0–100) based on the user's profile — considering activity level, experience, and injuries
2. Provides personalised recovery tips specific to their injuries and goals
3. Creates a 7-day recovery schedule that complements their ${o.workoutDays?.length ?? 3} workout days
4. Gives specific injury modification advice for: ${o.injuries?.length ? o.injuries.join(', ') : 'no injuries'}

Return ONLY valid JSON matching this exact schema (no markdown, no code blocks):
{
  "readinessScore": 75,
  "readinessLabel": "High|Moderate|Low",
  "todaySuggestion": "One sentence about what to do today",
  "sleepTarget": 8,
  "personalizedTips": [
    {
      "category": "sleep|nutrition|active-recovery|stress|injury",
      "tip": "Specific actionable tip",
      "priority": "high|medium|low"
    }
  ],
  "injuryModifications": [
    "Specific modification for stated injury"
  ],
  "weeklyRecoveryPlan": [
    {
      "day": "Monday",
      "activity": "Activity name",
      "duration": 20,
      "notes": "Brief note"
    }
  ]
}
`.trim()
}

// ─── Groq AI Service ────────────────────────────────────────────────────────

async function callGroq(prompt: string): Promise<unknown> {
  const apiKey = process.env.GROQ_API_KEY
  console.log('[GroqService] Initialising generation. API Key present:', !!apiKey)
  
  if (!apiKey) {
    throw new Error('AI generation temporarily unavailable: GROQ_API_KEY is not configured.')
  }

  try {
    const groq = new Groq({ apiKey })
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an API that ONLY responds with valid JSON objects. Do not include markdown formatting or conversational text.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: 'json_object' }
    })

    const text = completion.choices[0]?.message?.content || '{}'
    return JSON.parse(text)
  } catch (error: any) {
    console.error('[GroqService] API Error:', error)
    
    const msg = error?.message?.toLowerCase() || ''
    
    // Catch quota / 429 errors
    if (msg.includes('429') || msg.includes('rate limit') || msg.includes('quota')) {
      throw new Error(
        'AI generation temporarily unavailable. The Groq API rate limit is exhausted. Please wait a moment and try again.'
      )
    }
    
    // Catch invalid key errors
    if (msg.includes('401') || msg.includes('api_key_invalid') || msg.includes('unauthorized')) {
      throw new Error('AI generation temporarily unavailable. The Groq API key is invalid.')
    }

    throw new Error('AI generation temporarily unavailable. Groq API encountered an unexpected error.')
  }
}

// ─── Public API ─────────────────────────────────────────────────────────────

export async function generateWorkoutPlan(
  onboarding: OnboardingData
): Promise<AIWorkoutPlan> {
  const prompt = buildWorkoutPrompt(onboarding)
  const raw = await callGroq(prompt)

  if (!isValidWorkoutPlan(raw)) {
    throw new Error('Groq returned an invalid workout plan structure')
  }
  return raw
}

export async function generateDietPlan(
  onboarding: OnboardingData
): Promise<AIDietPlan> {
  const prompt = buildDietPrompt(onboarding)
  const raw = await callGroq(prompt)

  if (!isValidDietPlan(raw)) {
    throw new Error('Groq returned an invalid diet plan structure')
  }
  return raw
}

export async function generateRecoveryPlan(
  onboarding: OnboardingData
): Promise<AIRecoveryPlan> {
  const prompt = buildRecoveryPrompt(onboarding)
  const raw = await callGroq(prompt)

  if (!isValidRecoveryPlan(raw)) {
    throw new Error('Groq returned an invalid recovery plan structure')
  }
  return raw
}
