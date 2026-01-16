'use client'

import { useState, useEffect } from 'react'
import { SECTION_CONFIGS } from '@/lib/constants/section-configs'

interface Exercise {
  id: string
  name: string
  category: string
  form_cue: string | null
  sets: number | null
  reps: string | null
  duration: string | null
  rest_sec: number | null
  intensity_percent: string | null
  tags: string[] | null
  user_id: string | null
  source: string | null
}

const CATEGORIES = ['warmup', 'strength', 'stability', 'cardio', 'mobility', 'tone', 'rehab']

export default function LibraryPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newExercise, setNewExercise] = useState({
    name: '',
    category: 'strength',
    form_cue: '',
    sets: '',
    reps: '',
    duration: '',
    rest_sec: '',
    intensity_percent: ''
  })

  useEffect(() => {
    loadExercises()
  }, [])

  const loadExercises = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/exercises/library')
      const data = await response.json()
      if (data.exercises) {
        setExercises(data.exercises)
      }
    } catch (error) {
      console.error('Failed to load exercises:', error)
    }
    setIsLoading(false)
  }

  const handleAddExercise = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/exercises/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newExercise.name,
          category: newExercise.category,
          form_cue: newExercise.form_cue || null,
          sets: newExercise.sets ? parseInt(newExercise.sets) : null,
          reps: newExercise.reps || null,
          duration: newExercise.duration || null,
          rest_sec: newExercise.rest_sec ? parseInt(newExercise.rest_sec) : null,
          intensity_percent: newExercise.intensity_percent || null,
          source: 'Custom'
        })
      })

      if (response.ok) {
        setShowAddForm(false)
        setNewExercise({
          name: '',
          category: 'strength',
          form_cue: '',
          sets: '',
          reps: '',
          duration: '',
          rest_sec: '',
          intensity_percent: ''
        })
        loadExercises()
      }
    } catch (error) {
      console.error('Failed to add exercise:', error)
    }
  }

  const filteredExercises = selectedCategory === 'all'
    ? exercises
    : exercises.filter(ex => ex.category === selectedCategory)

  const globalExercises = filteredExercises.filter(ex => ex.user_id === null)
  const customExercises = filteredExercises.filter(ex => ex.user_id !== null)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-neutral-500">Loading exercise library...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-neutral-900">Exercise Library</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors"
          >
            + Add Exercise
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            All ({exercises.length})
          </button>
          {CATEGORIES.map(cat => {
            const config = SECTION_CONFIGS[cat]
            const count = exercises.filter(ex => ex.category === cat).length
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {config?.icon} {cat} ({count})
              </button>
            )
          })}
        </div>

        {/* Custom Exercises */}
        {customExercises.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-4">
              Your Custom Exercises ({customExercises.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {customExercises.map(ex => {
                const config = SECTION_CONFIGS[ex.category]
                return (
                  <div
                    key={ex.id}
                    className={`p-4 rounded-lg border ${config?.bgColor || 'bg-neutral-50'} border-neutral-200`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">{config?.icon}</span>
                      <span className="font-medium text-neutral-900">{ex.name}</span>
                    </div>
                    {ex.form_cue && (
                      <p className="text-xs text-neutral-600 line-clamp-2">{ex.form_cue}</p>
                    )}
                    <div className="text-xs text-neutral-500 mt-2">
                      {ex.sets && `${ex.sets}×${ex.reps || ex.duration}`}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Global Exercises */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-4">
            Default Exercises ({globalExercises.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {globalExercises.map(ex => {
              const config = SECTION_CONFIGS[ex.category]
              return (
                <div
                  key={ex.id}
                  className={`p-4 rounded-lg border ${config?.bgColor || 'bg-neutral-50'} border-neutral-200`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm">{config?.icon}</span>
                    <span className="font-medium text-neutral-900">{ex.name}</span>
                  </div>
                  {ex.form_cue && (
                    <p className="text-xs text-neutral-600 line-clamp-2">{ex.form_cue}</p>
                  )}
                  <div className="text-xs text-neutral-500 mt-2">
                    {ex.sets && `${ex.sets}×${ex.reps || ex.duration}`}
                    {ex.intensity_percent && ` @ ${ex.intensity_percent}`}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Add Exercise Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-neutral-900">Add Custom Exercise</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddExercise} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Exercise Name *
                </label>
                <input
                  type="text"
                  required
                  value={newExercise.name}
                  onChange={(e) => setNewExercise(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-200"
                  placeholder="e.g., Barbell Hip Thrust"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Category *
                </label>
                <select
                  value={newExercise.category}
                  onChange={(e) => setNewExercise(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-200"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Form Cue
                </label>
                <textarea
                  value={newExercise.form_cue}
                  onChange={(e) => setNewExercise(prev => ({ ...prev, form_cue: e.target.value }))}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-200 resize-none"
                  rows={3}
                  placeholder="Describe proper form..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Sets
                  </label>
                  <input
                    type="number"
                    value={newExercise.sets}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, sets: e.target.value }))}
                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-200"
                    placeholder="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Reps
                  </label>
                  <input
                    type="text"
                    value={newExercise.reps}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, reps: e.target.value }))}
                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-200"
                    placeholder="10 or 10/side"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={newExercise.duration}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-200"
                    placeholder="30 sec"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Rest (sec)
                  </label>
                  <input
                    type="number"
                    value={newExercise.rest_sec}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, rest_sec: e.target.value }))}
                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-200"
                    placeholder="60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Intensity
                </label>
                <input
                  type="text"
                  value={newExercise.intensity_percent}
                  onChange={(e) => setNewExercise(prev => ({ ...prev, intensity_percent: e.target.value }))}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-200"
                  placeholder="70-75% 1RM"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border border-neutral-200 rounded-lg font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800"
                >
                  Add Exercise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
