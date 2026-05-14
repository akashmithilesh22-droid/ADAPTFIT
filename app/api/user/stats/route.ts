import { NextRequest, NextResponse } from 'next/server'
import { createAuthenticatedClient } from '@/lib/server-supabase'

export async function GET(req: NextRequest) {
  try {
    const supabase = createAuthenticatedClient(req)
    
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (!token) {
        return NextResponse.json({ error: 'Missing authorization token' }, { status: 401 });
    }

    // Get user from token explicitly because getSession() fails without cookies
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
        console.error('[/api/user/stats] Auth error:', authError);
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = user.id;

    // Fetch user stats
    const { data: stats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

    let userStats = stats;

    if (statsError && statsError.code === 'PGRST116') {
        // Automatically initialize stats if they don't exist
        const defaultStats = {
            user_id: userId,
            level: 1,
            xp: 0,
            total_workouts: 0,
            workout_streak: 0,
            longest_streak: 0,
            calories_burned: 0,
            last_workout_date: null
        };

        const { data: newStats, error: insertError } = await supabase
            .from('user_stats')
            .insert(defaultStats)
            .select()
            .single();

        if (insertError) {
            console.error('[/api/user/stats] Error initializing user stats:', insertError);
            userStats = defaultStats; // Fallback to sending defaults to client
        } else {
            userStats = newStats;
        }
    } else if (statsError) {
        console.error('[/api/user/stats] Error fetching user stats:', statsError);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Fetch recent completed workouts
    const { data: recentWorkouts, error: workoutsError } = await supabase
        .from('completed_workouts')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(10);

    if (workoutsError) {
        console.error('[/api/user/stats] Error fetching completed workouts:', workoutsError);
        // Don't fail the whole request, just return empty workouts
    }

    return NextResponse.json({ 
        stats: userStats,
        recentWorkouts: recentWorkouts || []
    });

  } catch (err: any) {
    console.error('[/api/user/stats] Unhandled error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
