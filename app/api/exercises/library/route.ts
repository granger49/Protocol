import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    let query = supabase
      .from('exercise_library')
      .select('*')
      .or(`user_id.is.null,user_id.eq.${user.id}`)
      .eq('is_active', true)

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query.order('name')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ exercises: data })
  } catch (error) {
    console.error('Get exercise library error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      category,
      form_cue,
      sets,
      reps,
      duration,
      rest_sec,
      intensity_percent,
      alternatives,
      tags,
      source,
      source_url
    } = body

    const { data, error } = await supabase
      .from('exercise_library')
      .insert({
        user_id: user.id,
        name,
        category,
        form_cue,
        sets,
        reps,
        duration,
        rest_sec,
        intensity_percent,
        alternatives,
        tags,
        source,
        source_url
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, exercise: data })
  } catch (error) {
    console.error('Create exercise error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
