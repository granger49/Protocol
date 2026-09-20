import type { Show } from '../types'

export default function ShowPoster({ show, size = 'md' }: { show: Show; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-12 h-16 text-xl rounded-lg',
    md: 'w-20 h-28 text-3xl rounded-xl',
    lg: 'w-full aspect-[2/3] text-6xl rounded-2xl',
  }[size]

  return (
    <div
      className={`flex-shrink-0 flex items-center justify-center bg-gradient-to-br ${show.color} ${sizeClasses} shadow-lg shadow-black/40 select-none`}
    >
      <span>{show.emoji}</span>
    </div>
  )
}
