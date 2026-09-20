import type { Platform } from '../types'

const PLATFORM_STYLES: Record<Platform, string> = {
  Netflix: 'bg-red-600/20 text-red-400 border-red-600/30',
  Hulu: 'bg-green-500/20 text-green-400 border-green-500/30',
  Max: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  'Disney+': 'bg-blue-600/20 text-blue-300 border-blue-600/30',
  'Prime Video': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'Apple TV+': 'bg-slate-400/20 text-slate-200 border-slate-400/30',
  'Paramount+': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Peacock: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  FX: 'bg-neutral-500/20 text-neutral-200 border-neutral-500/30',
  AMC: 'bg-red-800/20 text-red-300 border-red-800/30',
}

export default function PlatformBadge({ platform }: { platform: Platform }) {
  return (
    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${PLATFORM_STYLES[platform]}`}>
      {platform}
    </span>
  )
}
