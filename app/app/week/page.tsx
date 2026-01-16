'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DEFAULT_TEMPLATE } from '@/lib/constants/default-template'
import { WeeklyTemplate, DayName } from '@/types/workout'

const DAYS: DayName[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const getDayName = (date: Date): DayName => {
  const days: DayName[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return days[date.getDay()]
}

export default function WeekPage() {
  const router = useRouter()
  const [template, setTemplate] = useState<WeeklyTemplate>(DEFAULT_TEMPLATE)
  const todayName = getDayName(new Date())

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

  const navigateToDay = (day: DayName) => {
    const today = new Date()
    const currentDayIndex = today.getDay()
    const daysMap: DayName[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const targetDayIndex = daysMap.indexOf(day)
    const dayDiff = targetDayIndex - currentDayIndex

    // Navigate to daily page - the date will be handled there
    router.push('/app/daily')
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-6">This Week&apos;s Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {DAYS.map(day => {
            const schedule = template[day]
            const isToday = day === todayName
            const hasBasketball = schedule.sections.cardio.some(
              ex => ex.toLowerCase().includes('basketball')
            )

            return (
              <button
                key={day}
                onClick={() => navigateToDay(day)}
                className={`p-5 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                  isToday
                    ? 'border-neutral-900 bg-neutral-50'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg text-neutral-900 capitalize">{day}</h3>
                  {isToday && (
                    <span className="px-2 py-1 text-xs font-medium bg-neutral-900 text-white rounded">
                      Today
                    </span>
                  )}
                </div>
                
                <p className="font-medium text-neutral-700 mb-4">{schedule.name}</p>
                
                <div className="space-y-2 text-sm">
                  {schedule.sections.strength.length > 0 && (
                    <div className="flex items-center gap-2 text-blue-700">
                      <span>💪</span>
                      <span>{schedule.sections.strength.length} strength</span>
                    </div>
                  )}
                  {schedule.sections.stability.length > 0 && (
                    <div className="flex items-center gap-2 text-violet-700">
                      <span>🎯</span>
                      <span>{schedule.sections.stability.length} stability</span>
                    </div>
                  )}
                  {schedule.sections.cardio.length > 0 && (
                    <div className="flex items-center gap-2 text-rose-700">
                      <span>❤️</span>
                      <span>{schedule.sections.cardio.join(', ')}</span>
                    </div>
                  )}
                  {schedule.sections.mobility.length > 0 && (
                    <div className="flex items-center gap-2 text-amber-700">
                      <span>🧘</span>
                      <span>{schedule.sections.mobility.length} mobility</span>
                    </div>
                  )}
                  {schedule.sections.rehab.length > 0 && (
                    <div className="flex items-center gap-2 text-pink-700">
                      <span>🩹</span>
                      <span>{schedule.sections.rehab.length} rehab</span>
                    </div>
                  )}
                </div>

                {hasBasketball && (
                  <div className="mt-4 px-3 py-2 bg-amber-100 text-amber-800 rounded-lg text-xs font-medium inline-flex items-center gap-1">
                    🏀 Basketball scheduled
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Weekly Constraints */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h3 className="font-bold text-neutral-900 mb-4">Weekly Constraints</h3>
        <ul className="space-y-2 text-sm text-neutral-700">
          <li className="flex items-start gap-2">
            <span className="text-amber-600">•</span>
            Max 2 high-intensity days (basketball + Norwegian 4x4, or 2x basketball)
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600">•</span>
            48 hours between full-body strength sessions (Mon/Thu/Fri)
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600">•</span>
            Zone 2 target: ~3 hours weekly (Mon 30min, Thu 35min, Sat 45min, Sun 40-60min)
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600">•</span>
            Achilles rehab: Daily (5 min minimum)
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600">•</span>
            Steam: 3x weekly post-workout (Mon/Thu/Fri)
          </li>
        </ul>
      </div>
    </div>
  )
}
