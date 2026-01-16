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
    const exerciseName = searchParams.get('exercise_name')

    let query = supabase
      .from('personal_records')
      .select('*')
      .eq('user_id', user.id)

    if (exerciseName) {
      query = query.eq('exercise_name', exerciseName)
    }

    const { data, error } = await query.order('date', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ records: data })
  } catch (error) {
    console.error('Get PRs error:', error)
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
    const { exercise_name, weight, reps, sets, date } = body

    const { data, error } = await supabase
      .from('personal_records')
      .upsert({
        user_id: user.id,
        exercise_name,
        weight,
        reps,
        sets,
        date
      }, {
        onConflict: 'user_id,exercise_name,weight,reps,sets'
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, record: data })
  } catch (error) {
    console.error('Create PR error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
