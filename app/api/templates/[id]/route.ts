import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

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

    // Check if template is active
    const { data: template } = await supabase
      .from('workout_templates')
      .select('is_active')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (template?.is_active) {
      return NextResponse.json(
        { error: 'Cannot delete active template. Activate another template first.' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('workout_templates')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete template error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
