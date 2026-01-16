import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { date, day_of_week, scheduled_workout, achilles_pain, notes, exercises } = body

    // Upsert workout log
    const { data: workoutLog, error: workoutError } = await supabase
      .from('workout_logs')
      .upsert({
        user_id: user.id,
        date,
        day_of_week,
        scheduled_workout,
        achilles_pain: achilles_pain || 0,
        notes: notes || null
      }, {
        onConflict: 'user_id,date'
      })
      .select()
      .single()

    if (workoutError) {
      console.error('Workout log error:', workoutError)
      return NextResponse.json({ error: workoutError.message }, { status: 500 })
    }

    // Delete existing exercise logs for this workout
    await supabase
      .from('exercise_logs')
      .delete()
      .eq('workout_log_id', workoutLog.id)

    // Insert new exercise logs
    if (exercises && exercises.length > 0) {
      const exerciseLogs = exercises.map((ex: {
        exercise_name: string
        category: string
        completed: boolean
        weight?: string
        reps?: string
        notes?: string
      }) => ({
        workout_log_id: workoutLog.id,
        user_id: user.id,
        exercise_name: ex.exercise_name,
        category: ex.category,
        completed: ex.completed,
        weight: ex.weight || null,
        reps: ex.reps || null,
        notes: ex.notes || null,
        completed_at: ex.completed ? new Date().toISOString() : null
      }))

      const { error: exerciseError } = await supabase
        .from('exercise_logs')
        .insert(exerciseLogs)

      if (exerciseError) {
        console.error('Exercise logs error:', exerciseError)
        return NextResponse.json({ error: exerciseError.message }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true, workout: workoutLog })
  } catch (error) {
    console.error('Workout save error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
