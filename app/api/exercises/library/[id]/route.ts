import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Add type definition for the exercise update
type ExerciseUpdate = {
  name?: string
  category?: string
  form_cue?: string
  sets?: number
  reps?: string
  duration?: number
  rest_sec?: number
  intensity_percent?: number
  alternatives?: string[]
  tags?: string[]
  source?: string
  source_url?: string
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json() as ExerciseUpdate
    
    const { data, error } = await supabase
      .from('exercise_library')
      .update({
        name: body.name,
        category: body.category,
        form_cue: body.form_cue,
        sets: body.sets,
        reps: body.reps,
        duration: body.duration,
        rest_sec: body.rest_sec,
        intensity_percent: body.intensity_percent,
        alternatives: body.alternatives,
        tags: body.tags,
        source: body.source,
        source_url: body.source_url
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true, exercise: data })
  } catch (error) {
    console.error('Update exercise error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Soft delete - set is_active to false
    const { error } = await supabase
      .from('exercise_library')
      .update({ is_active: false })
      .eq('id', id)
      .eq('user_id', user.id)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete exercise error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
