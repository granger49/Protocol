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

    const { data, error } = await supabase
      .from('pushed_exercises')
      .select('*')
      .eq('user_id', user.id)
      .eq('to_date', date)
      .eq('completed', false)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ pushed: data })
  } catch (error) {
    console.error('Get pushed exercises error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
