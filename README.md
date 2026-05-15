**🚀 AdaptFit: The AI-Powered Adaptive Fitness Engine**

AdaptFit is a next-generation personal fitness companion that uses Generative AI to bridge the gap between static workout plans and the
dynamic reality of human life.


**💡 The Problem**

Most fitness apps provide "cookie-cutter" plans. They don't account for your specific body metrics (Mifflin-St Jeor),
your dietary allergies, or your daily energy levels. Users often feel overwhelmed by data but underserved by actual guidance.

**✅ Our Solution**

**AdaptFit creates a dynamic feedback loop:**

Scientific Onboarding: Precise BMR and TDEE calculations based on real body metrics.
AI Workout Generation: Real-time workout plans powered by Gemini/Groq that adapt to your goals.
Smart Nutrition: Macro-tracking and meal suggestions that respect your dietary restrictions.
Seamless Persistence: Every glass of water and every rep is saved to Supabase, ensuring your journey is tracked.


**🛠️ Tech Stack**

We chose a modern, scalable stack to ensure the project "actually works":
**Framework:** Next.js 14 (App Router)
**Language:** TypeScript (for type-safety and fewer "explosions")
**Database & Auth:** Supabase (Real-time data persistence & Secure Auth)
**AI Engine:** Google Gemini / Groq API
**Styling:** Tailwind CSS + Lucide Icons

Deployment: Vercel

🚀 LIVE LINK: https://adaptfit-3a47.vercel.app/



Follow these steps to run AdaptFit locally in under 2 minutes:

**1. Clone the Repository**

bash
git clone https://github.com/akashmithilesh22-droid/ADAPTFIT.git

cd adaptfit

**2. Install Dependencies**

bash
npm install

**4. Environment Setup**

Create a  .env.local file in the root directory and add your keys:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url

NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

GROQ_API_KEY=your_groq_api_key

**4. Run the Development Server**

bash
npm run dev




