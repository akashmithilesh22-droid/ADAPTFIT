# AdaptFit AI - Your Fitness, Redesigned by AI

A next-generation fitness platform powered by intelligent AI that adapts to your life, not the other way around.

## 🎯 Core Features

### 1. **Smart Onboarding & Personalization**
- Comprehensive user profile collection (age, gender, body metrics)
- Fitness experience level assessment (Beginner, Intermediate, Advanced)
- Equipment availability mapping (Full Gym, Home Gym, Dumbbells Only, Bodyweight)
- Goal-oriented setup (Bulking, Cutting, Maintenance, Body Recomposition)
- Aesthetic preference tracking (Bigger Arms, Wider Shoulders, Lean Physique, etc.)

**Key File**: `app/(app)/onboarding/page.tsx`

### 2. **AI Workout Routine Generator** 🏋️
Generates personalized workout programs with intelligent exercise selection:

- **Split Types**:
  - Push/Pull/Legs (5-6 days)
  - Arnold Split (Chest+Back, Shoulders+Arms, Legs)
  - Upper/Lower (4 days)
  - Full Body (3 days)
  - Hybrid (Custom)

- **Features**:
  - Exercise selection based on equipment availability
  - Injury awareness (avoids compromising exercises)
  - Progressive overload logic
  - Difficulty scaling (beginner→advanced)
  - Sets, reps, and rest time optimization

**Implementation**: 
- `lib/services/workout-generator.ts` - Intelligent workout split selection
- Exercise database with 50+ exercises across 8 muscle groups
- Equipment-based filtering

### 3. **Adaptive AI Scheduling System** ⭐ (Main Highlight)
The crown jewel - intelligently handles life's unpredictability:

#### Missed Workout Recovery
When you miss a session, the system:
- 🔄 Restructures remaining week automatically
- ⚖️ Prevents overtraining (maintains weekly volume targets)
- 🎯 Redistributes muscle groups intelligently
- 📊 Maintains progression trajectory

#### Schedule Flexibility
- Supports irregular schedules (3-day, 5-day, student schedules)
- Multiple missed days handling
- Time-limited workout suggestions
- Deload week auto-scheduling

**Implementation**:
- `lib/services/schedule-adapter.ts` - Core adaptation engine
- `components/dashboard/missed-workout-handler.tsx` - UI for missed workouts

### 4. **Personalized AI Diet Planner** 🍽️
Comprehensive nutrition management:

- **Diet Types Support**:
  - Vegetarian, Non-Vegetarian, Eggetarian, Vegan
  - Cultural/Personal constraints (no non-veg on Tuesdays, fasting days, lactose intolerance)

- **Auto Macro Calculation**:
  - BMR calculation (Mifflin-St Jeor formula)
  - TDEE estimation based on activity level
  - Goal-based macro distribution
  - Variable caloric intake (prevents metabolic adaptation)

- **Meal Suggestions**:
  - 50+ meal database
  - Pre/Post-workout optimization
  - Budget-based options (Low/Medium/High)
  - Prep time considerations

**Implementation**: `lib/services/diet-planner.ts`

### 5. **AI Recovery & Readiness System** 💪
Daily recovery scoring with intelligent recommendations:

- **Recovery Score Calculation**:
  - Sleep duration (35% weight)
  - Soreness level (20% weight)
  - Stress level (25% weight)
  - Previous workout intensity (20% weight)
  - Mood indicator (bonus)

- **Dynamic Adjustments**:
  - Auto-adjusts workout intensity based on recovery
  - Suggests lighter alternatives
  - Deload week detection
  - Rest day recommendations

**Implementation**:
- `lib/services/ai-service.ts` - Recovery scoring
- `lib/services/fatigue-adjuster.ts` - Intensity adjustment
- `components/dashboard/recovery-adjuster.tsx` - UI

### 6. **Progress Tracking Dashboard** 📊
Comprehensive analytics:

- **Tracked Metrics**:
  - Weight trends (weekly charts)
  - Body fat percentage
  - Body measurements (chest, arms, waist, thighs)
  - Personal records (PRs)
  - Workout consistency score
  - Strength progression

- **Goal Prediction**:
  - AI estimates fat loss/muscle gain timeline
  - Exponential growth model with deceleration
  - Confidence scoring

**Page**: `app/(app)/progress/page.tsx`

### 7. **Gamification & Achievement System** 🏆
Motivational engagement mechanics:

- **Achievements** (examples):
  - Getting Started (1st workout)
  - Week Warrior (7 consecutive workouts)
  - Month Master (30 consecutive workouts)
  - Strength Seeker (3 new PRs)
  - Body Transformer (10kg fat loss)
  - Century (100-day streak)

- **Leveling System**:
  - XP-based progression
  - 100 XP = 1 Level
  - Special badges & rewards

- **Streaks**:
  - Workout streaks
  - Nutrition tracking streaks
  - Consistency scoring

**Implementation**: `lib/services/gamification.ts`

### 8. **Smart Recommendations Engine** 🧠
AI-powered suggestions for:

- Exercise replacements based on equipment/injuries
- Split adjustments based on performance
- Recovery improvement strategies
- Nutrition modifications
- Plateau-breaking tactics

**Implementation**: `lib/services/recommendation-engine.ts`

### 9. **Intelligent Notification System** 📬
Smart, non-intrusive reminders:

- Missed workout alerts with rescheduling options
- Recovery tips (poor sleep, high stress, soreness)
- Nutrition reminders (meal logging)
- Achievement unlocks with XP
- Streak congratulations
- Motivational messages (time-of-day aware)

**Implementation**: `lib/services/notification-service.ts`

### 10. **Advanced ML Features** 🤖

#### Workout Split Prediction
- Analyzes user recovery ability (age + activity level)
- Considers training volume tolerance
- Recommends optimal split based on goals

#### Adherence Prediction
- Predicts likelihood of burnout
- Identifies unrealistic schedules proactively
- Suggests adaptive plan modifications

#### Macro Calculation Engine
- Advanced formula: Mifflin-St Jeor for BMR
- Activity-based TDEE adjustment
- Goal-specific macro distribution
- Tracks adherence accuracy

**All in**: `lib/services/ai-service.ts`

---

## 📁 Architecture

### Services (`lib/services/`)
- `ai-service.ts` - ML models, prediction, macro calculation
- `workout-generator.ts` - Intelligent exercise selection
- `schedule-adapter.ts` - Missed workout handling
- `diet-planner.ts` - Nutrition planning
- `gamification.ts` - Achievements, streaks, XP
- `recommendation-engine.ts` - Smart suggestions
- `notification-service.ts` - Intelligent alerts
- `fatigue-adjuster.ts` - Recovery-based adjustments

### State Management (`lib/store/`)
- `fitness-store.ts` - Zustand global state for user profile, goals, workouts, diet, stats

### Types (`types/index.ts`)
Comprehensive TypeScript interfaces for:
- User profiles, fitness goals
- Workouts, exercises, schedules
- Diet plans, meals
- Recovery metrics, gamification
- Notifications, recommendations
- Progress tracking

### Components (`components/dashboard/`)
- `missed-workout-handler.tsx` - Missed workout UI
- `recovery-adjuster.tsx` - Recovery check-in modal
- Other existing dashboard components

### Pages
- `app/(app)/onboarding/` - User setup flow
- `app/(app)/dashboard/` - Main dashboard
- `app/(app)/progress/` - Progress tracking
- `app/(app)/diet/` - Nutrition planning
- `app/(app)/achievements/` - Achievements & badges
- `app/(app)/recovery/` - Recovery insights

---

## 🚀 Hackathon Demo Flow

The ultimate "wow moment":

```
1. User enters:
   - Height: 180cm, Weight: 85kg, Body Fat: 22%
   - Goal: Cut (fat loss) + Muscle Gain
   - Diet: Non-veg, vegetarian friendly
   - Equipment: Full gym, 5 days/week

2. AI Instantly Generates:
   - Workout Split: Push/Pull/Legs (optimal for volume)
   - Calories: 2100 (15% deficit)
   - Macros: 190g protein, 210g carbs, 65g fats
   - Weekly Schedule with exercises

3. Simulate Missing Leg Day:
   - User marks "Leg Day" as missed
   - AI detects: "Oops! Missed workout"
   
4. AI Reschedules Intelligently:
   - Merges key leg exercises with next day
   - Adjusts upper body volume
   - Shows: "Updated Schedule" with visualization
   - Prevents overtraining
   
5. Result: Complete personalized plan adapts in real-time ✨
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 + React 19
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Charts**: Recharts
- **Form Handling**: React Hook Form + Zod
- **Animations**: Framer Motion
- **UI Components**: Radix UI (custom built-in)
- **Icons**: Lucide React

---

## 📦 Key Dependencies

```json
{
  "zustand": "State management",
  "react-hook-form": "Form handling",
  "zod": "Validation",
  "recharts": "Data visualization",
  "framer-motion": "Animations",
  "lucide-react": "Icons",
  "@radix-ui/*": "Accessible UI components"
}
```

---

## 💡 Usage Examples

### Generate Personalized Workout
```typescript
import { AIService, WorkoutGenerator } from '@/lib/services'

const splitType = AIService.predictOptimalWorkoutSplit(
  userProfile,
  fitnessGoal,
  availableDays
) // Returns: 'push-pull-legs'

const workouts = WorkoutGenerator.generateWorkoutSplit(
  userProfile,
  fitnessGoal,
  availableDays,
  splitType
)
```

### Handle Missed Workout
```typescript
import { ScheduleAdapter } from '@/lib/services'

const adaptedSchedule = ScheduleAdapter.adaptScheduleForMissedWorkout(
  weeklySchedule,
  missedWorkoutId,
  currentDay
)
```

### Calculate Macro Targets
```typescript
import { AIService } from '@/lib/services'

const macros = AIService.calculateMacroTargets(userProfile, goal)
// Returns: { calories: 2100, protein: 190, carbs: 210, fats: 65 }
```

### Get Recovery Score
```typescript
import { AIService } from '@/lib/services'

const recovery = AIService.calculateRecoveryScore({
  sleepDuration: 7.5,
  sorenessLevel: 3,
  stressLevel: 4,
  previousWorkoutIntensity: 8,
  mood: 'good'
})
// Returns: { score: 78, readiness: 'high', recommendation: "...", suggestedIntensity: 'heavy' }
```

### Check for Plateau
```typescript
import { RecommendationEngine } from '@/lib/services'

const isPlateau = RecommendationEngine.suggestPlateauBusting(
  'Bench Press',
  100,
  progressHistory
)
```

---

## 🎨 UI/UX Highlights

- ✅ Smooth animations with Framer Motion
- ✅ Dark theme optimized
- ✅ Mobile responsive
- ✅ Accessible Radix UI components
- ✅ Gradient elements for visual appeal
- ✅ Interactive charts and progress visualization
- ✅ Real-time notifications
- ✅ Modal dialogs for complex interactions

---

## 🔮 Future Expansion Ideas

- **Wearable Integration**: Apple Watch, Fitbit sync
- **Computer Vision**: Form correction, rep counting
- **AI Coach Chatbot**: "What should I eat?" "Why am I not progressing?"
- **Voice Assistant**: Voice-guided workouts
- **Social Features**: Friend challenges, leaderboards
- **Nutrition Scanning**: Meal recognition from photos
- **Posture Detection**: Real-time form feedback

---

## 📝 Notes for Developers

1. **Services are stateless** - Easy to test and mock
2. **TypeScript throughout** - Full type safety
3. **Modular components** - Each service is independent
4. **AI logic is transparent** - No black boxes, clear algorithms
5. **Extensible design** - Easy to add new features

---

## 🎯 Key Metrics & KPIs

Track these in production:
- User onboarding completion rate
- Workout adherence rate
- Missed workout adaptation success
- User engagement with gamification
- Diet plan compliance
- Recovery score accuracy
- Achievement unlock distribution

---

**Built with ❤️ for fitness enthusiasts who value AI-driven personalization.**
