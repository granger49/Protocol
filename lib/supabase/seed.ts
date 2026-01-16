import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'
import { DEFAULT_TEMPLATE, DEFAULT_TEMPLATE_NAME, DEFAULT_TEMPLATE_DESCRIPTION } from '@/lib/constants/default-template'

export async function seedUserTemplate(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<boolean> {
  // Check if user already has a template
  const { data: existingTemplates } = await supabase
    .from('workout_templates')
    .select('id')
    .eq('user_id', userId)
    .limit(1)

  if (existingTemplates && existingTemplates.length > 0) {
    return false // Already has templates
  }

  // Create default template for user
  const { error } = await supabase
    .from('workout_templates')
    .insert({
      user_id: userId,
      name: DEFAULT_TEMPLATE_NAME,
      description: DEFAULT_TEMPLATE_DESCRIPTION,
      schedule: DEFAULT_TEMPLATE as unknown as Database['public']['Tables']['workout_templates']['Insert']['schedule'],
      is_active: true,
      created_by: 'system'
    })

  if (error) {
    console.error('Error seeding template:', error)
    return false
  }

  return true
}
