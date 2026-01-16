'use client'

import { useState, useEffect } from 'react'
import { InfoIcon } from '@/components/InfoIcon'
import { SECTION_CONFIGS } from '@/lib/constants/section-configs'
import { DEFAULT_TEMPLATE } from '@/lib/constants/default-template'
import { WeeklyTemplate, DayName, ExerciseData } from '@/types/workout'

const DAYS: DayName[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

export default function ProgramPage() {
  const [template, setTemplate] = useState<WeeklyTemplate>(DEFAULT_TEMPLATE)
  const [templateName, setTemplateName] = useState('Athletic Longevity v1')
  const [exerciseDatabase, setExerciseDatabase] = useState<Record<string, ExerciseData>>({})

  useEffect(() => {
    const loadData = async () => {
      // Load template
      try {
        const response = await fetch('/api/templates')
        const data = await response.json()
        
        if (data.templates && data.templates.length > 0) {
          const activeTemplate = data.templates.find((t: { is_active: boolean }) => t.is_active)
          if (activeTemplate) {
            setTemplate(activeTemplate.schedule as WeeklyTemplate)
            setTemplateName(activeTemplate.name)
          }
        }
      } catch (error) {
        console.error('Failed to load template:', error)
      }

      // Load exercise library
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
          }) => {
            db[ex.name] = {
              name: ex.name,
              category: ex.category,
              formCue: ex.form_cue || '',
              sets: ex.sets || undefined,
              reps: ex.reps || undefined,
              duration: ex.duration || undefined,
              restSec: ex.rest_sec || undefined,
              intensityPercent: ex.intensity_percent || undefined
            }
          })
          setExerciseDatabase(db)
        }
      } catch (error) {
        console.error('Failed to load exercise library:', error)
      }
    }

    loadData()
  }, [])

  const renderSection = (
    sectionKey: string,
    exercises: string[]
  ) => {
    if (!exercises || exercises.length === 0) return null
    const config = SECTION_CONFIGS[sectionKey]
    if (!config) return null

    return (
      <div className="mb-4">
        <h4 className={`font-semibold text-sm uppercase tracking-wide ${config.color} mb-2`}>
          {config.icon} {config.label}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {exercises.map(exerciseName => {
            const data = exerciseDatabase[exerciseName]
            return (
              <div
                key={exerciseName}
                className={`text-sm ${config.bgColor} p-3 rounded-lg`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-neutral-900">{exerciseName}</span>
                  {data?.formCue && <InfoIcon formCue={data.formCue} />}
                </div>
                {data && (
                  <div className="text-neutral-600 text-xs mt-1">
                    {data.sets && `${data.sets}×${data.reps || data.duration}`}
                    {data.intensityPercent && ` @ ${data.intensityPercent}`}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-neutral-900">Complete Training Program</h2>
          <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium">
            {templateName}
          </span>
        </div>

        <div className="space-y-8">
          {DAYS.map(day => {
            const schedule = template[day]

            return (
              <div key={day} className="border-b border-neutral-200 pb-6 last:border-b-0">
                <h3 className="text-lg font-bold text-neutral-900 capitalize mb-4">
                  {day}: <span className="text-primary-600">{schedule.name}</span>
                </h3>

                {renderSection('warmup', schedule.sections.warmup)}
                {renderSection('strength', schedule.sections.strength)}
                {renderSection('stability', schedule.sections.stability)}
                {renderSection('cardio', schedule.sections.cardio)}
                {renderSection('mobility', schedule.sections.mobility)}
                {renderSection('tone', schedule.sections.tone)}
                {renderSection('rehab', schedule.sections.rehab)}

                {/* Other items */}
                {schedule.sections.other && schedule.sections.other.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm uppercase tracking-wide text-neutral-700 mb-2">
                      📋 OTHER
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {schedule.sections.other.map((item, idx) => (
                        <div
                          key={idx}
                          className="text-sm bg-neutral-100 px-3 py-2 rounded-lg"
                        >
                          <span className="font-medium">{item.name}</span>
                          <span className="text-neutral-500 ml-2">({item.duration})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
