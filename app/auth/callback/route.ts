import { createClient } from '@/lib/supabase/server'
import { seedUserTemplate } from '@/lib/supabase/seed'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/app/daily'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // Seed default template for new users
      await seedUserTemplate(supabase, data.user.id)
      
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return to home page on error
  return NextResponse.redirect(`${origin}/?error=auth_callback_error`)
}
