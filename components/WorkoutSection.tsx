'use client'

import { ExerciseRow } from './ExerciseRow'
import { SectionConfig } from '@/lib/constants/section-configs'
import { ExerciseData, ExerciseState, OtherItem } from '@/types/workout'

interface WorkoutSectionProps {
  config: SectionConfig
  exercises: string[]
  otherItems?: OtherItem[]
  exerciseDatabase: Record<string, ExerciseData>
  workoutState: Record<string, ExerciseState>
  onComplete: (exerciseName: string, completed: boolean) => void
  onDataChange: (exerciseName: string, field: string, value: string) => void
  onPush: (exerciseName: string) => void
}

export function WorkoutSection({
  config,
  exercises,
  otherItems,
  exerciseDatabase,
  workoutState,
  onComplete,
  onDataChange,
  onPush
}: WorkoutSectionProps) {
  if (config.key === 'other') {
    if (!otherItems || otherItems.length === 0) return null

    return (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">{config.icon}</span>
          <h3 className={`text-sm font-semibold uppercase tracking-wide ${config.color}`}>
            {config.label}
          </h3>
        </div>
        <div className="space-y-2">
          {otherItems.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-lg border ${config.bgColor} border-neutral-200 p-4`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={workoutState[item.name]?.completed || false}
                  onChange={(e) => onComplete(item.name, e.target.checked)}
                  className="w-5 h-5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-500 cursor-pointer"
                />
                <span className="font-medium text-neutral-900">{item.name}</span>
                <span className="text-sm text-neutral-500">({item.duration})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!exercises || exercises.length === 0) return null

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">{config.icon}</span>
        <h3 className={`text-sm font-semibold uppercase tracking-wide ${config.color}`}>
          {config.label}
        </h3>
        <span className="text-xs text-neutral-400 ml-2">
          {exercises.length} exercise{exercises.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="space-y-2">
        {exercises.map((exerciseName) => (
          <ExerciseRow
            key={exerciseName}
            exerciseName={exerciseName}
            exerciseData={exerciseDatabase[exerciseName] || null}
            state={workoutState[exerciseName] || { completed: false }}
            onComplete={onComplete}
            onDataChange={onDataChange}
            onPush={onPush}
          />
        ))}
      </div>
    </div>
  )
}
