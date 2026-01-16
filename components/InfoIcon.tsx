'use client'

interface InfoIconProps {
  formCue: string | null
}

export function InfoIcon({ formCue }: InfoIconProps) {
  if (!formCue) return null

  return (
    <span className="tooltip ml-2 cursor-help">
      <span className="inline-flex items-center justify-center w-4 h-4 text-xs text-primary-600 bg-primary-50 rounded-full font-medium">
        i
      </span>
      <span className="tooltiptext">{formCue}</span>
    </span>
  )
}
