export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      workout_logs: {
        Row: {
          id: string
          user_id: string
          date: string
          day_of_week: string
          scheduled_workout: string
          achilles_pain: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          day_of_week: string
          scheduled_workout: string
          achilles_pain?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          day_of_week?: string
          scheduled_workout?: string
          achilles_pain?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      exercise_logs: {
        Row: {
          id: string
          workout_log_id: string | null
          user_id: string
          exercise_name: string
          category: string
          completed: boolean
          weight: string | null
          reps: string | null
          sets: string | null
          notes: string | null
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          workout_log_id?: string | null
          user_id: string
          exercise_name: string
          category: string
          completed?: boolean
          weight?: string | null
          reps?: string | null
          sets?: string | null
          notes?: string | null
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          workout_log_id?: string | null
          user_id?: string
          exercise_name?: string
          category?: string
          completed?: boolean
          weight?: string | null
          reps?: string | null
          sets?: string | null
          notes?: string | null
          completed_at?: string | null
          created_at?: string
        }
      }
      personal_records: {
        Row: {
          id: string
          user_id: string
          exercise_name: string
          weight: number
          reps: number
          sets: number
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          exercise_name: string
          weight: number
          reps: number
          sets: number
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          exercise_name?: string
          weight?: number
          reps?: number
          sets?: number
          date?: string
          created_at?: string
        }
      }
      pushed_exercises: {
        Row: {
          id: string
          user_id: string
          exercise_name: string
          from_date: string
          to_date: string
          completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          exercise_name: string
          from_date: string
          to_date: string
          completed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          exercise_name?: string
          from_date?: string
          to_date?: string
          completed?: boolean
          created_at?: string
        }
      }
      user_preferences: {
        Row: {
          user_id: string
          basketball_days: string[]
          equipment_available: Json
          custom_exercises: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          basketball_days?: string[]
          equipment_available?: Json
          custom_exercises?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          basketball_days?: string[]
          equipment_available?: Json
          custom_exercises?: Json
          created_at?: string
          updated_at?: string
        }
      }
      exercise_library: {
        Row: {
          id: string
          user_id: string | null
          name: string
          category: string
          form_cue: string | null
          sets: number | null
          reps: string | null
          duration: string | null
          rest_sec: number | null
          intensity_percent: string | null
          alternatives: string[] | null
          tags: string[] | null
          source: string | null
          source_url: string | null
          created_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          category: string
          form_cue?: string | null
          sets?: number | null
          reps?: string | null
          duration?: string | null
          rest_sec?: number | null
          intensity_percent?: string | null
          alternatives?: string[] | null
          tags?: string[] | null
          source?: string | null
          source_url?: string | null
          created_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          category?: string
          form_cue?: string | null
          sets?: number | null
          reps?: string | null
          duration?: string | null
          rest_sec?: number | null
          intensity_percent?: string | null
          alternatives?: string[] | null
          tags?: string[] | null
          source?: string | null
          source_url?: string | null
          created_at?: string
          is_active?: boolean
        }
      }
      workout_templates: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          schedule: Json
          is_active: boolean
          created_by: string
          version: number
          parent_template_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          schedule: Json
          is_active?: boolean
          created_by?: string
          version?: number
          parent_template_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          schedule?: Json
          is_active?: boolean
          created_by?: string
          version?: number
          parent_template_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
