import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

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

    // Deactivate all templates first
    await supabase
      .from('workout_templates')
      .update({ is_active: false })
      .eq('user_id', user.id)

    // Activate the specified template
    const { data, error } = await supabase
      .from('workout_templates')
      .update({ is_active: true })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, template: data })
  } catch (error) {
    console.error('Activate template error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
