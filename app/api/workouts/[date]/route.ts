import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ date: string }> }
) {
  try {
    const { date } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get workout log for date
    const { data: workoutLog, error: workoutError } = await supabase
      .from('workout_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', date)
      .single()

    if (workoutError && workoutError.code !== 'PGRST116') {
      return NextResponse.json({ error: workoutError.message }, { status: 500 })
    }

    // Get exercise logs if workout exists
    let exercises: {
      exercise_name: string
      category: string
      completed: boolean
      weight: string | null
      reps: string | null
      notes: string | null
    }[] = []
    
    if (workoutLog) {
      const { data: exerciseLogs } = await supabase
        .from('exercise_logs')
        .select('exercise_name, category, completed, weight, reps, notes')
        .eq('workout_log_id', workoutLog.id)

      exercises = exerciseLogs || []
    }

    // Get pushed exercises for this date
    const { data: pushedExercises } = await supabase
      .from('pushed_exercises')
      .select('*')
      .eq('user_id', user.id)
      .eq('to_date', date)
      .eq('completed', false)

    return NextResponse.json({
      workout: workoutLog || null,
      exercises,
      pushed: pushedExercises || []
    })
  } catch (error) {
    console.error('Get workout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
