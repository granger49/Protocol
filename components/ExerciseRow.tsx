'use client'

import { InfoIcon } from './InfoIcon'
import { ExerciseData, ExerciseState } from '@/types/workout'

interface ExerciseRowProps {
  exerciseName: string
  exerciseData: ExerciseData | null
  state: ExerciseState
  onComplete: (exerciseName: string, completed: boolean) => void
  onDataChange: (exerciseName: string, field: string, value: string) => void
  onPush: (exerciseName: string) => void
}

export function ExerciseRow({
  exerciseName,
  exerciseData,
  state,
  onComplete,
  onDataChange,
  onPush
}: ExerciseRowProps) {
  const isStrength = exerciseData?.category === 'strength'
  const completed = state?.completed || false

  const formatPrescription = () => {
    if (!exerciseData) return null
    const parts = []
    if (exerciseData.sets) {
      parts.push(`${exerciseData.sets}×${exerciseData.reps || exerciseData.duration}`)
    } else if (exerciseData.duration) {
      parts.push(exerciseData.duration)
    }
    if (exerciseData.intensityPercent) {
      parts.push(`@ ${exerciseData.intensityPercent}`)
    }
    if (exerciseData.restSec) {
      parts.push(`Rest: ${exerciseData.restSec}s`)
    }
    return parts.length > 0 ? parts.join(' • ') : null
  }

  return (
    <div
      className={`rounded-lg border transition-all ${
        completed
          ? 'bg-neutral-50 border-neutral-200 opacity-60'
          : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-sm'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Left side - checkbox and exercise info */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => onComplete(exerciseName, e.target.checked)}
              disabled={completed}
              className="w-5 h-5 mt-0.5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-500 cursor-pointer disabled:cursor-not-allowed"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`font-medium ${
                    completed ? 'text-neutral-500 line-through' : 'text-neutral-900'
                  }`}
                >
                  {exerciseName}
                </span>
                {exerciseData?.formCue && <InfoIcon formCue={exerciseData.formCue} />}
              </div>
              {formatPrescription() && (
                <div className="text-sm text-neutral-500 mt-1">
                  {formatPrescription()}
                </div>
              )}
            </div>
          </div>

          {/* Right side - inputs and push button */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {isStrength && !completed && (
              <>
                <input
                  type="text"
                  placeholder="Weight"
                  value={state?.weight || ''}
                  onChange={(e) => onDataChange(exerciseName, 'weight', e.target.value)}
                  className="w-20 px-3 py-1.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-200 focus:border-neutral-400"
                />
                <input
                  type="text"
                  placeholder="Reps"
                  value={state?.reps || ''}
                  onChange={(e) => onDataChange(exerciseName, 'reps', e.target.value)}
                  className="w-16 px-3 py-1.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-200 focus:border-neutral-400"
                />
              </>
            )}
            {completed && isStrength && state?.weight && (
              <span className="text-sm text-neutral-500 font-medium">
                {state.weight}×{state.reps}
              </span>
            )}
            <button
              onClick={() => onPush(exerciseName)}
              className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
              title="Push to tomorrow"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
