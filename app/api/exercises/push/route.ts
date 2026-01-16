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
    const { exercise_name, from_date, to_date } = body

    const { data, error } = await supabase
      .from('pushed_exercises')
      .insert({
        user_id: user.id,
        exercise_name,
        from_date,
        to_date
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, pushed: data })
  } catch (error) {
    console.error('Push exercise error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
