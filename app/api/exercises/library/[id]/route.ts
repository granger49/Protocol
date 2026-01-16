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
    
    const updateData: Partial<ExerciseUpdate> = {}
    if (body.name !== undefined) updateData.name = body.name
    if (body.category !== undefined) updateData.category = body.category
    if (body.form_cue !== undefined) updateData.form_cue = body.form_cue
    if (body.sets !== undefined) updateData.sets = body.sets
    if (body.reps !== undefined) updateData.reps = body.reps
    if (body.duration !== undefined) updateData.duration = body.duration
    if (body.rest_sec !== undefined) updateData.rest_sec = body.rest_sec
    if (body.intensity_percent !== undefined) updateData.intensity_percent = body.intensity_percent
    if (body.alternatives !== undefined) updateData.alternatives = body.alternatives
    if (body.tags !== undefined) updateData.tags = body.tags
    if (body.source !== undefined) updateData.source = body.source
    if (body.source_url !== undefined) updateData.source_url = body.source_url

    const { data, error } = await supabase
      .from('exercise_library')
      .update(updateData as any)
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
