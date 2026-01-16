'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DayNavigator } from '@/components/DayNavigator'
import { WorkoutSection } from '@/components/WorkoutSection'
import { SECTION_CONFIGS, SECTION_ORDER } from '@/lib/constants/section-configs'
import { DEFAULT_TEMPLATE } from '@/lib/constants/default-template'
import { ExerciseState, WeeklyTemplate, DayName, ExerciseData } from '@/types/workout'

const getDayName = (date: Date): DayName => {
  const days: DayName[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return days[date.getDay()]
}

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

const formatDateKey = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

export default function DailyPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [workoutState, setWorkoutState] = useState<Record<string, ExerciseState>>({})
  const [pushedExercises, setPushedExercises] = useState<string[]>([])
  const [achillesPain, setAchillesPain] = useState('0')
  const [workoutNotes, setWorkoutNotes] = useState('')
  const [agentResponse, setAgentResponse] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [template, setTemplate] = useState<WeeklyTemplate>(DEFAULT_TEMPLATE)
  const [exerciseDatabase, setExerciseDatabase] = useState<Record<string, ExerciseData>>({})

  const supabase = createClient()
  const dayName = getDayName(currentDate)
  const dateKey = formatDateKey(currentDate)
  const todaySchedule = template[dayName]

  // Load exercise database from library
  useEffect(() => {
    const loadExerciseLibrary = async () => {
      try {
        const response = await fetch('/api/exercises/library')
        const data = await response.json()
        
        if (data.exercises) {
          const db: Record<string, ExerciseData> = {}
          data.exercises.forEach((ex: {
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
          }) => {
            db[ex.name] = {
              name: ex.name,
              category: ex.category,
              formCue: ex.form_cue || '',
              sets: ex.sets || undefined,
              reps: ex.reps || undefined,
              duration: ex.duration || undefined,
              restSec: ex.rest_sec || undefined,
              intensityPercent: ex.intensity_percent || undefined,
              alternatives: ex.alternatives || undefined,
              tags: ex.tags || undefined
            }
          })
          setExerciseDatabase(db)
        }
      } catch (error) {
        console.error('Failed to load exercise library:', error)
      }
    }

    loadExerciseLibrary()
  }, [])

  // Load active template
  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const response = await fetch('/api/templates')
        const data = await response.json()
        
        if (data.templates && data.templates.length > 0) {
          const activeTemplate = data.templates.find((t: { is_active: boolean }) => t.is_active)
          if (activeTemplate) {
            setTemplate(activeTemplate.schedule as WeeklyTemplate)
          }
        }
      } catch (error) {
        console.error('Failed to load template:', error)
      }
    }

    loadTemplate()
  }, [])

  // Load workout data for current date
  const loadWorkoutData = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/workouts/${dateKey}`)
      const data = await response.json()

      if (data.workout) {
        setAchillesPain(String(data.workout.achilles_pain || 0))
        setWorkoutNotes(data.workout.notes || '')
      } else {
        setAchillesPain('0')
        setWorkoutNotes('')
      }

      if (data.exercises && data.exercises.length > 0) {
        const state: Record<string, ExerciseState> = {}
        data.exercises.forEach((ex: {
          exercise_name: string
          completed: boolean
          weight: string | null
          reps: string | null
        }) => {
          state[ex.exercise_name] = {
            completed: ex.completed,
            weight: ex.weight || undefined,
            reps: ex.reps || undefined
          }
        })
        setWorkoutState(state)
      } else {
        setWorkoutState({})
      }

      if (data.pushed) {
        setPushedExercises(data.pushed.map((p: { exercise_name: string }) => p.exercise_name))
      } else {
        setPushedExercises([])
      }
    } catch (error) {
      console.error('Failed to load workout:', error)
      setWorkoutState({})
      setPushedExercises([])
    }
    setIsLoading(false)
  }, [dateKey])

  useEffect(() => {
    loadWorkoutData()
  }, [loadWorkoutData])

  const handleComplete = (exerciseName: string, completed: boolean) => {
    setWorkoutState(prev => ({
      ...prev,
      [exerciseName]: {
        ...prev[exerciseName],
        completed
      }
    }))
  }

  const handleDataChange = (exerciseName: string, field: string, value: string) => {
    setWorkoutState(prev => ({
      ...prev,
      [exerciseName]: {
        ...prev[exerciseName],
        [field]: value
      }
    }))
  }

  const handlePush = async (exerciseName: string) => {
    const tomorrow = addDays(currentDate, 1)
    const tomorrowKey = formatDateKey(tomorrow)

    try {
      const response = await fetch('/api/exercises/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exercise_name: exerciseName,
          from_date: dateKey,
          to_date: tomorrowKey
        })
      })

      if (response.ok) {
        alert(`${exerciseName} pushed to tomorrow`)
      }
    } catch (error) {
      console.error('Failed to push exercise:', error)
    }
  }

  const handleSubmit = async () => {
    if (!window.confirm('Submit workout log?')) return

    setIsSaving(true)

    // Build exercises array
    const allExercises: string[] = []
    SECTION_ORDER.forEach(sectionKey => {
      if (sectionKey === 'other') {
        todaySchedule.sections.other?.forEach(item => allExercises.push(item.name))
      } else {
        const exercises = todaySchedule.sections[sectionKey as keyof typeof todaySchedule.sections]
        if (Array.isArray(exercises)) {
          allExercises.push(...(exercises as string[]))
        }
      }
    })
    pushedExercises.forEach(ex => {
      if (!allExercises.includes(ex)) allExercises.push(ex)
    })

    const exerciseLogs = allExercises
      .filter(ex => workoutState[ex]?.completed)
      .map(ex => ({
        exercise_name: ex,
        category: exerciseDatabase[ex]?.category || 'other',
        completed: true,
        weight: workoutState[ex]?.weight,
        reps: workoutState[ex]?.reps
      }))

    try {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: dateKey,
          day_of_week: dayName,
          scheduled_workout: todaySchedule.name,
          achilles_pain: parseInt(achillesPain) || 0,
          notes: workoutNotes,
          exercises: exerciseLogs
        })
      })

      if (response.ok) {
        const completedNames = exerciseLogs.map(e => {
          if (e.weight && e.reps) {
            return `${e.exercise_name} ${e.weight}x${e.reps}`
          }
          return e.exercise_name
        })

        setAgentResponse(
          `Workout logged successfully!\n\n` +
          `Completed: ${completedNames.join(', ')}\n` +
          `Achilles Pain: ${achillesPain}/10\n` +
          (workoutNotes ? `Notes: ${workoutNotes}` : '')
        )
      }
    } catch (error) {
      console.error('Failed to save workout:', error)
      setAgentResponse('Error saving workout. Please try again.')
    }

    setIsSaving(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-neutral-500">Loading workout...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DayNavigator
        currentDate={currentDate}
        dayName={dayName}
        scheduleName={todaySchedule.name}
        onPrevious={() => setCurrentDate(addDays(currentDate, -1))}
        onNext={() => setCurrentDate(addDays(currentDate, 1))}
        onToday={() => setCurrentDate(new Date())}
      />

      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        {/* Pushed exercises from previous days */}
        {pushedExercises.length > 0 && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">➕</span>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-700">
                ADDED EXERCISES (Pushed from previous days)
              </h3>
            </div>
            <div className="space-y-2">
              {pushedExercises.map(exerciseName => (
                <div
                  key={`pushed-${exerciseName}`}
                  className={`rounded-lg border transition-all ${
                    workoutState[exerciseName]?.completed
                      ? 'bg-neutral-50 border-neutral-200 opacity-60'
                      : 'bg-white border-neutral-200'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={workoutState[exerciseName]?.completed || false}
                        onChange={(e) => handleComplete(exerciseName, e.target.checked)}
                        className="w-5 h-5 rounded border-neutral-300"
                      />
                      <span className="font-medium text-neutral-900">{exerciseName}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Workout sections */}
        {SECTION_ORDER.map(sectionKey => {
          const config = SECTION_CONFIGS[sectionKey]
          const exercises = sectionKey === 'other'
            ? []
            : (todaySchedule.sections[sectionKey as keyof typeof todaySchedule.sections] as string[] || [])
          const otherItems = sectionKey === 'other' ? todaySchedule.sections.other : undefined

          return (
            <WorkoutSection
              key={sectionKey}
              config={config}
              exercises={exercises}
              otherItems={otherItems}
              exerciseDatabase={exerciseDatabase}
              workoutState={workoutState}
              onComplete={handleComplete}
              onDataChange={handleDataChange}
              onPush={handlePush}
            />
          )
        })}

        {/* Workout notes section */}
        <div className="border-t border-neutral-200 pt-6 mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Achilles Pain Level (0-10)
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={achillesPain}
              onChange={(e) => setAchillesPain(e.target.value)}
              className="w-24 px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-200 focus:border-neutral-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Workout Notes
            </label>
            <textarea
              value={workoutNotes}
              onChange={(e) => setWorkoutNotes(e.target.value)}
              placeholder="Energy level, how exercises felt, any issues..."
              rows={3}
              className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-200 focus:border-neutral-400 resize-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="w-full py-3 px-4 bg-neutral-900 text-white font-medium rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Submit Workout Log'}
          </button>
        </div>

        {/* Agent Response */}
        {agentResponse && (
          <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
            <h3 className="font-semibold text-primary-900 mb-2">Workout Summary</h3>
            <div className="whitespace-pre-wrap text-neutral-700 text-sm">
              {agentResponse}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
