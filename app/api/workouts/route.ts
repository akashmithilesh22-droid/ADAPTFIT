import { NextRequest, NextResponse } from 'next/server'
import { createAuthenticatedClient } from '@/lib/server-supabase'

export async function POST(req: NextRequest) {
  try {
    const supabase = createAuthenticatedClient(req)
    const body = await req.json()
    const { userId, workout } = body

    if (!userId || !workout) {
      return NextResponse.json({ error: 'userId and workout are required' }, { status: 400 })
    }

    console.log(`[/api/workouts] Saving workout for user ${userId}:`, workout.name)

    const { data, error } = await supabase
      .from('workouts')
      .insert({
        user_id: userId,
        name: workout.name,
        type: workout.type,
        duration: parseInt(workout.duration),
        calories: workout.calories,
        exercises: workout.exercises,
        ai_tip: workout.aiAdjustment || workout.aiTip,
        status: 'in-progress'
      })
      .select('id')
      .single()

    if (error) {
      console.error('[/api/workouts] Error saving workout:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (err: any) {
    console.error('[/api/workouts] Unhandled error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = createAuthenticatedClient(req)
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Workout ID is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('[/api/workouts] Error fetching workout:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (err: any) {
    console.error('[/api/workouts] Unhandled error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
