export interface ExerciseData {
  name: string
  category: string
  formCue: string
  sets?: number
  reps?: string
  duration?: string
  restSec?: number
  intensityPercent?: string
  alternatives?: string[]
  tags?: string[]
}

export interface ExerciseState {
  completed: boolean
  weight?: string
  reps?: string
  notes?: string
}

export interface WorkoutState {
  [exerciseName: string]: ExerciseState
}

export interface OtherItem {
  name: string
  duration: string
  type: string
}

export interface DaySections {
  warmup: string[]
  strength: string[]
  stability: string[]
  cardio: string[]
  mobility: string[]
  tone: string[]
  rehab: string[]
  other: OtherItem[]
}

export interface DaySchedule {
  name: string
  sections: DaySections
}

export interface WeeklyTemplate {
  monday: DaySchedule
  tuesday: DaySchedule
  wednesday: DaySchedule
  thursday: DaySchedule
  friday: DaySchedule
  saturday: DaySchedule
  sunday: DaySchedule
}

export type DayName = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export interface WorkoutLogWithExercises {
  id: string
  date: string
  day_of_week: string
  scheduled_workout: string
  achilles_pain: number
  notes: string | null
  exercises: {
    exercise_name: string
    category: string
    completed: boolean
    weight: string | null
    reps: string | null
  }[]
}

export interface PushedExercise {
  id: string
  exercise_name: string
  from_date: string
  to_date: string
  completed: boolean
}
