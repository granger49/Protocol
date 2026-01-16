'use client'

interface DayNavigatorProps {
  currentDate: Date
  dayName: string
  scheduleName: string
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
}

export function DayNavigator({
  currentDate,
  dayName,
  scheduleName,
  onPrevious,
  onNext,
  onToday
}: DayNavigatorProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isToday = () => {
    const today = new Date()
    return (
      currentDate.getDate() === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onPrevious}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          aria-label="Previous day"
        >
          <svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-neutral-900 capitalize">{dayName}</h2>
            {!isToday() && (
              <button
                onClick={onToday}
                className="px-2 py-1 text-xs font-medium text-primary-600 bg-primary-50 rounded-md hover:bg-primary-100 transition-colors"
              >
                Today
              </button>
            )}
            {isToday() && (
              <span className="px-2 py-1 text-xs font-medium text-white bg-neutral-900 rounded-md">
                Today
              </span>
            )}
          </div>
          <p className="text-sm text-neutral-500">{formatDate(currentDate)}</p>
          <p className="text-sm font-medium text-primary-600 mt-1">{scheduleName}</p>
        </div>

        <button
          onClick={onNext}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          aria-label="Next day"
        >
          <svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
