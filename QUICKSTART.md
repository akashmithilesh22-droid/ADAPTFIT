# 🚀 AdaptFit AI - Quick Start Guide

## 5-Minute Setup

### Step 1: Import Services
```typescript
import { 
  AIService, 
  WorkoutGenerator,
  ScheduleAdapter,
  DietPlanner,
  FatigueAdjuster,
  GamificationService,
  RecommendationEngine,
  NotificationService
} from '@/lib/services'
import { FitnessCalcs } from '@/lib/utils/fitness-calcs'
```

### Step 2: Use the Store
```typescript
import { useFitnessStore } from '@/lib/store/fitness-store'

const store = useFitnessStore()

// Save user profile
store.setUserProfile({
  id: 'user1',
  age: 25,
  gender: 'male',
  heightCm: 180,
  weightKg: 85,
  bodyFatPct: 22,
  fitnessExperience: 'intermediate',
  injuries: [],
  gymAccess: 'full-gym',
  activityLevel: 'moderately-active',
  createdAt: new Date(),
  updatedAt: new Date(),
})

// Save goal
store.setFitnessGoal({
  id: 'goal1',
  userId: 'user1',
  primaryGoal: 'body-recomposition',
  strength: 'muscle-gain-focused',
  aestheticPreferences: ['bigger-arms', 'wider-shoulders'],
  timeline: 12,
  commitment: 8,
  createdAt: new Date(),
})
```

### Step 3: Generate Workout Plan
```typescript
// Get optimal split
const split = AIService.predictOptimalWorkoutSplit(
  store.userProfile!,
  store.fitnessGoal!,
  5 // days available
) // Returns: 'push-pull-legs'

// Generate workouts
const workouts = WorkoutGenerator.generateWorkoutSplit(
  store.userProfile!,
  store.fitnessGoal!,
  5,
  split
)

const schedule: WeeklySchedule = {
  id: 'week1',
  userId: 'user1',
  split,
  workouts,
  cardioAllocation: 200,
  createdAt: new Date(),
}

store.setWeeklySchedule(schedule)
```

### Step 4: Generate Meal Plan
```typescript
const macros = AIService.calculateMacroTargets(
  store.userProfile!,
  store.fitnessGoal!
)

const dietPlans = DietPlanner.generateMealPlan(
  store.userProfile!,
  store.fitnessGoal!,
  {
    dietType: 'non-vegetarian',
    allergies: [],
    culturalRestrictions: '',
    budget: 'medium',
    cuisinePreferences: ['Italian', 'Asian'],
    mealsPerDay: 4,
  },
  macros.calories
)

store.setDietPlans(dietPlans)
```

### Step 5: Check Recovery
```typescript
const recovery = AIService.calculateRecoveryScore({
  userId: 'user1',
  date: new Date(),
  sleepDuration: 7.5,
  sorenessLevel: 3,
  stressLevel: 4,
  previousWorkoutIntensity: 8,
  mood: 'good',
})

console.log(`Recovery Score: ${recovery.score}`)
console.log(`Readiness: ${recovery.readiness}`)
console.log(`Suggested Intensity: ${recovery.suggestedIntensity}`)
```

### Step 6: Handle Missed Workout
```typescript
const missedWorkout = schedule.workouts[0] // Leg day

const adapted = ScheduleAdapter.adaptScheduleForMissedWorkout(
  schedule,
  missedWorkout.id,
  1 // Tuesday (day 1)
)

store.setWeeklySchedule(adapted)
```

### Step 7: Check Recommendations
```typescript
const recs = RecommendationEngine.analyzeProgressAndRecommend(
  store.progressHistory,
  store.userStats!
)

recs.forEach(rec => {
  console.log(`${rec.type}: ${rec.title}`)
  console.log(`  ${rec.description}`)
  console.log(`  ${rec.reason}`)
})
```

### Step 8: Send Notifications
```typescript
// Missed workout notification
const notif1 = NotificationService.generateMissedWorkoutNotification(
  'user1',
  'Leg Day',
  1,
  'Tuesday'
)

// Recovery tip
const notif2 = NotificationService.generateRecoveryTipNotification(
  'user1',
  6, // sleep hours
  8, // stress level
  5  // soreness
)

// Achievement
const notif3 = NotificationService.generateAchievementNotification(
  'user1',
  'Week Warrior',
  50 // XP points
)
```

### Step 9: Update Gamification
```typescript
const userStats: UserStats = {
  userId: 'user1',
  level: 1,
  totalPoints: 0,
  workoutStreak: 0,
  longestStreak: 0,
  totalWorkouts: 0,
  completionRate: 0,
  achievements: [],
}

// Workout completed
let updated = GamificationService.updateStreak(userStats, true)
updated = GamificationService.addXP(updated, 50)

const achievements = GamificationService.checkAchievements(
  updated,
  'workout-completed'
)

store.setUserStats(updated)
```

---

## Common Use Cases

### Calculate BMR & TDEE
```typescript
const bmr = FitnessCalcs.calculateBMR(85, 180, 25, 'male')
const tdee = FitnessCalcs.calculateTDEE(bmr, 'moderately-active')
```

### Estimate 1RM
```typescript
const oneRepMax = FitnessCalcs.estimateOneRepMax(
  80,  // weight (kg)
  8    // reps completed
) // Returns estimated 1RM
```

### Get Training Volume
```typescript
const volume = FitnessCalcs.calculateVolume(
  4,  // sets
  8,  // reps
  80  // weight
) // Returns total volume
```

### Adjust for Fatigue
```typescript
const adjusted = FatigueAdjuster.adjustWorkoutForFatigue(
  workout,
  7, // fatigue level 1-10
  ['poor-sleep', 'high-stress']
)
```

### Get Recovery Recommendations
```typescript
const recs = FatigueAdjuster.getRecoveryRecommendations(
  7, // fatigue level
  ['poor-sleep', 'soreness']
)
// Returns array of recommendations
```

---

## Component Integration

### Use Missed Workout Handler
```typescript
import { MissedWorkoutHandler } from '@/components/dashboard/missed-workout-handler'

<MissedWorkoutHandler 
  missedWorkout={missedWorkout}
  weeklySchedule={schedule}
  currentDay={1}
  onScheduleUpdate={(newSchedule) => {
    store.setWeeklySchedule(newSchedule)
  }}
/>
```

### Use Recovery Adjuster
```typescript
import { RecoveryAdjuster } from '@/components/dashboard/recovery-adjuster'

<RecoveryAdjuster 
  currentWorkout={workout}
  onWorkoutAdjusted={(adjusted) => {
    // Show adjusted workout or save it
  }}
/>
```

---

## Data Flow Example

```
User Onboarding
    ↓
Save Profile → store.setUserProfile()
Save Goal → store.setFitnessGoal()
    ↓
Generate Workouts
    ↓
AIService.predictOptimalWorkoutSplit()
WorkoutGenerator.generateWorkoutSplit()
    ↓
Generate Nutrition
    ↓
AIService.calculateMacroTargets()
DietPlanner.generateMealPlan()
    ↓
Save to Store
    ↓
store.setWeeklySchedule()
store.setDietPlans()
    ↓
Display to User
    ↓
User Completes Workout
    ↓
GamificationService.updateStreak()
GamificationService.checkAchievements()
RecommendationEngine.analyzeProgress()
    ↓
Update Stats & Send Notifications
```

---

## Testing Each Service

### Test AI Service
```typescript
const profile: UserProfile = {
  id: '1', age: 25, gender: 'male', heightCm: 180, 
  weightKg: 85, bodyFatPct: 22, fitnessExperience: 'intermediate',
  injuries: [], gymAccess: 'full-gym', activityLevel: 'moderately-active',
  createdAt: new Date(), updatedAt: new Date()
}

const goal: FitnessGoal = {
  id: '1', userId: '1', primaryGoal: 'body-recomposition',
  strength: 'muscle-gain-focused', aestheticPreferences: [],
  timeline: 12, commitment: 8, createdAt: new Date()
}

// Test split prediction
console.assert(
  AIService.predictOptimalWorkoutSplit(profile, goal, 5) !== null,
  'Should predict split'
)

// Test macro calculation
const macros = AIService.calculateMacroTargets(profile, goal)
console.assert(macros.calories > 0, 'Calories should be positive')
console.assert(macros.protein > 0, 'Protein should be positive')
```

### Test Workout Generator
```typescript
const workouts = WorkoutGenerator.generateWorkoutSplit(
  profile, goal, 5, 'push-pull-legs'
)

console.assert(workouts.length === 3, 'PPL should have 3 workouts')
console.assert(
  workouts.every(w => w.exercises.length > 0),
  'Each workout should have exercises'
)
```

### Test Schedule Adapter
```typescript
const adapted = ScheduleAdapter.adaptScheduleForMissedWorkout(
  schedule, workouts[0].id, 0
)

console.assert(adapted !== schedule, 'Should create new schedule')
console.assert(
  adapted.workouts.length >= schedule.workouts.length - 1,
  'Should not lose workouts'
)
```

---

## Debugging Tips

### View Store State
```typescript
import { useFitnessStore } from '@/lib/store/fitness-store'

const state = useFitnessStore.getState()
console.log(state)
```

### Check Service Output
```typescript
const result = AIService.calculateRecoveryScore({...})
console.log('Recovery Score:', result)
```

### Validate Data Types
```typescript
const isSafeDeficit = FitnessCalcs.isSafeDeficit(2000, 2400)
console.log('Deficit is safe:', isSafeDeficit)
```

---

## Performance Tips

1. **Memoize expensive calculations**
   ```typescript
   const memoizedSplit = useMemo(
     () => AIService.predictOptimalWorkoutSplit(...),
     [userProfile, goal, days]
   )
   ```

2. **Batch notifications**
   ```typescript
   const batched = NotificationService.batchNotifications(
     userId, notifications
   )
   ```

3. **Cache meal database**
   ```typescript
   const mealCache = useMemo(
     () => DietPlanner.getMealDatabase(),
     []
   )
   ```

---

## Next Steps

1. ✅ Services are ready - use them!
2. ✅ Type safety - TypeScript will guide you
3. ✅ Store is ready - manage state easily
4. ✅ Components exist - integrate them
5. Next: Add backend API to persist data
6. Next: Add authentication
7. Next: Deploy to production!

---

**Everything is ready to use. Start building! 🚀**
