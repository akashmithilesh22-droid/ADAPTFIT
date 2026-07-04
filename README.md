# 🚀 AdaptFit

AdaptFit is an AI-powered adaptive fitness platform built to replace cookie-cutter plans with personalized, science-backed guidance.
It combines structured onboarding, Supabase persistence, and Groq AI-powered workout, diet, and recovery planning.

---

## 💡 What AdaptFit Does

AdaptFit turns your goals, body metrics, daily schedule, diet preferences, and recovery needs into a living fitness experience.

- **Smart onboarding:** collects age, height, weight, body fat, activity level, injuries, goals, workout preferences, diet restrictions, macros, and lifestyle details.
- **AI workout plans:** generates real-time weekly workouts tailored to your experience, gym access, schedule, and goals.
- **Adaptive nutrition:** builds macro-aware meals and meal suggestions that respect allergies, cultural restrictions, and budget preferences.
- **Recovery coaching:** produces recovery recommendations, readiness scoring, and daily rest guidance.
- **Persistent tracking:** saves onboarding data, AI plans, and user progress to Supabase so the app remembers your journey.

---

## 🧭 How the Website Works (A → Z)

### 1. Landing page

The homepage showcases AdaptFit features, benefits, and the value proposition.
It is a marketing-led landing experience built with modern React components and animated UI sections.

### 2. Authentication

Users can sign up and log in using Supabase authentication.
The app stores user metadata like full name and creates a Supabase `profiles` record after signup.

### 3. Onboarding wizard

After logging in, users complete a multi-step onboarding flow:

- Welcome
- Body metrics (height, weight, age, body fat)
- Fitness background and injuries
- Goals and commitment timeline
- Workout schedule and availability
- Diet preferences and allergies
- Macro targets and nutritional priorities

This data shapes every AI-generated plan.

### 4. AI generation

Once onboarding is saved, the app calls server-side AI endpoints:

- `/api/ai/workout`
- `/api/ai/diet`
- `/api/ai/recovery`

Each endpoint does the following:

1. validates the authenticated user
2. fetches onboarding data from Supabase
3. sends a prompt to the Groq AI service
4. stores the generated plan in Supabase
5. returns structured JSON to the client

### 5. Plan caching and regeneration

AI plans are cached in Supabase for up to 24 hours.
If the user requests a regenerate action, the app re-runs the AI workflow and updates the plan.

### 6. Dashboard and tracking

The dashboard surfaces workout schedules, nutrition targets, recovery advice, and progress summaries.
UI components read from the cached AI plans and Supabase-backed user state.

---

## 🧩 Tech Stack

- **Next.js 16** with App Router
- **TypeScript** for compile-time safety
- **Supabase** for auth, database, and persistence
- **Groq AI** for workout, diet, and recovery plan generation
- **Tailwind CSS** for styling
- **Lucide Icons** + **Framer Motion** for polished UI
- **React Query / Zustand** patterns for state management

---

## 🚀 Run AdaptFit Locally

### 1. Clone the repo

```bash
git clone https://github.com/akashmithilesh22-droid/ADAPTFIT.git
cd adaptfit
```

### 2. Install dependencies

Use either npm or pnpm depending on your preference.

```bash
npm install
# or
pnpm install
```

### 3. Add environment variables

Create a `.env.local` file in the project root and add:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
```

### 4. Start the development server

```bash
npm run dev
# or
pnpm dev
```

Open `http://localhost:3000` in your browser.

---

## 🔧 Required Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL` — your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public Supabase anon key used by the client
- `GROQ_API_KEY` — Groq API key used by server-side AI generation

> Note: `GROQ_API_KEY` is only used on the server. The public Supabase keys are safe for client-side use with proper RLS policies.

---

## 📁 Key Files and Folders

- `app/page.tsx` — landing page
- `app/(auth)/signup/page.tsx` and `app/(auth)/login/page.tsx` — auth screens
- `app/(app)/onboarding/page.tsx` — onboarding wizard
- `app/api/ai/workout/route.ts` — workout plan generation endpoint
- `app/api/ai/diet/route.ts` — diet plan generation endpoint
- `app/api/ai/recovery/route.ts` — recovery plan endpoint
- `lib/services/groq-ai-service.ts` — AI prompt builder and Groq call logic
- `lib/server-supabase.ts` — authenticated Supabase helper and plan cache logic
- `hooks/use-ai-plan.ts` — client hook to fetch and regenerate AI plans

---

## 📝 Available Scripts

- `npm run dev` — start development server
- `npm run build` — build production output
- `npm run start` — run production server
- `npm run lint` — run Next.js lint checks

---

## 🌟 Why AdaptFit Works

AdaptFit is not just another fitness website. It is designed to:

- create a personalized plan from real user data
- avoid generic workout templates
- adapt nutrition to allergies, culture, budget, and macros
- help users track progress with persistent state
- keep AI generation safe, structured, and cacheable

If you want a complete adaptive fitness demo powered by AI, this repo is the entire end-to-end experience.

---

## 🔗 Live Demo

https://adaptfit-3a47.vercel.app/




