import { NextRequest, NextResponse } from 'next/server'
import { createAuthenticatedClient } from '@/lib/server-supabase'

// Calculate XP based on duration (10 XP per minute) and base completion (50 XP)
function calculateXP(duration: number) {
  const baseXP = 50;
  const durationXP = (duration || 0) * 10;
  return baseXP + durationXP;
}

// Level formula: level = floor(sqrt(total_xp / 100)) + 1
// Every level requires increasingly more XP
function calculateLevel(xp: number) {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createAuthenticatedClient(req)
    
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

    console.log('[/api/workouts/complete] Received Token:', token ? 'Bearer <hidden>' : 'null');

    if (!token) {
        console.error('[/api/workouts/complete] No token found in request headers');
        return NextResponse.json({ error: 'Missing authorization token' }, { status: 401 });
    }

    // Get user from token explicitly because getSession() fails without cookies
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    console.log('[/api/workouts/complete] Auth.getUser() response:', { 
        userId: user?.id, 
        authError: authError?.message || null 
    });

    if (authError || !user) {
        console.error('[/api/workouts/complete] Auth error:', authError);
        return NextResponse.json({ error: 'Unauthorized: Invalid token or session' }, { status: 401 });
    }
    const userId = user.id;

    const body = await req.json()
    const { workoutId, workoutName, workoutType, duration, calories, exercises } = body

    if (!workoutName || !workoutType) {
      return NextResponse.json({ error: 'Missing required workout data' }, { status: 400 })
    }

    console.log(`[/api/workouts/complete] Completing workout for user ${userId}:`, workoutName)

    // 1. Check if a workout was already completed today
    // To prevent farming, only 1 workout completion per day is allowed.
    // (We look at the server's current date, or ideally the user's timezone date)
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    const { data: existingCompleted, error: checkError } = await supabase
      .from('completed_workouts')
      .select('id')
      .eq('user_id', userId)
      .eq('date', today)
      .limit(1);

    if (checkError) {
        console.error('[/api/workouts/complete] Exact error checking existing completions:', checkError);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (existingCompleted && existingCompleted.length > 0) {
        return NextResponse.json({ error: 'You have already completed a workout today.' }, { status: 400 });
    }

    console.log('[/api/workouts/complete] Attempting insert into completed_workouts with user_id:', userId);

    // 2. Insert into completed_workouts
    const { error: insertError } = await supabase
      .from('completed_workouts')
      .insert({
        user_id: userId,
        workout_name: workoutName,
        workout_type: workoutType,
        duration: duration || 0,
        calories: calories || 0,
        exercises_completed: exercises || [],
        date: today
      });

    if (insertError) {
      console.error('[/api/workouts/complete] Exact insertError for completed_workouts:', insertError);
      return NextResponse.json({ error: `Failed to save workout: ${insertError.message}` }, { status: 500 })
    }

    console.log('[/api/workouts/complete] Successfully saved completed workout.');

    // 3. Update or Insert user_stats
    const { data: currentStats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

    // Calculate new values
    const earnedXP = calculateXP(duration);
    let newXP = earnedXP;
    let newStreak = 1;
    let newLongestStreak = 1;
    let newTotalWorkouts = 1;
    let newCalories = calories || 0;

    if (currentStats) {
        newXP = currentStats.xp + earnedXP;
        newTotalWorkouts = currentStats.total_workouts + 1;
        newCalories = currentStats.calories_burned + (calories || 0);

        // Streak logic
        if (currentStats.last_workout_date) {
            const lastDate = new Date(currentStats.last_workout_date);
            const currentDate = new Date(today);
            const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

            if (diffDays === 1) {
                // Consecutive day
                newStreak = currentStats.workout_streak + 1;
            } else if (diffDays > 1) {
                // Streak broken
                newStreak = 1;
            } else {
                // Same day (should be caught by the check above, but just in case)
                newStreak = currentStats.workout_streak;
            }
        }
        
        newLongestStreak = Math.max(currentStats.longest_streak, newStreak);
    }

    const newLevel = calculateLevel(newXP);
    const leveledUp = currentStats ? newLevel > currentStats.level : newLevel > 1;

    const statsPayload = {
        user_id: userId,
        xp: newXP,
        level: newLevel,
        total_workouts: newTotalWorkouts,
        workout_streak: newStreak,
        longest_streak: newLongestStreak,
        calories_burned: newCalories,
        last_workout_date: today
    };

    console.log('[/api/workouts/complete] Attempting upsert to user_stats with payload:', statsPayload);

    const { data: updatedStats, error: updateStatsError } = await supabase
        .from('user_stats')
        .upsert(statsPayload, { onConflict: 'user_id' })
        .select()
        .single();

    if (updateStatsError) {
        console.error('[/api/workouts/complete] Exact updateStatsError (RLS or DB issue):', updateStatsError, statsPayload);
        // We do not throw an error here so the user at least gets their workout marked as complete
    } else {
        console.log('[/api/workouts/complete] Successfully updated user_stats:', updatedStats);
    }

    return NextResponse.json({ 
        success: true, 
        earnedXP, 
        leveledUp, 
        newLevel, 
        stats: updatedStats || statsPayload 
    })
  } catch (err: any) {
    console.error('[/api/workouts/complete] Unhandled error:', err)
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
  }
}
