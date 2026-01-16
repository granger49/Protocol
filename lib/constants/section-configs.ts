export interface SectionConfig {
  key: string
  label: string
  color: string
  bgColor: string
  borderColor: string
  icon: string
}

export const SECTION_CONFIGS: Record<string, SectionConfig> = {
  warmup: {
    key: 'warmup',
    label: 'WARMUP',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-500',
    icon: '🔥'
  },
  strength: {
    key: 'strength',
    label: 'STRENGTH',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
    icon: '💪'
  },
  stability: {
    key: 'stability',
    label: 'STABILITY',
    color: 'text-violet-700',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-500',
    icon: '🎯'
  },
  cardio: {
    key: 'cardio',
    label: 'CARDIO',
    color: 'text-rose-700',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-500',
    icon: '❤️'
  },
  mobility: {
    key: 'mobility',
    label: 'MOBILITY',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-500',
    icon: '🧘'
  },
  tone: {
    key: 'tone',
    label: 'TONE / TENDON HEALTH',
    color: 'text-teal-700',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-500',
    icon: '✨'
  },
  rehab: {
    key: 'rehab',
    label: 'REHAB: Achilles Recovery',
    color: 'text-pink-700',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-500',
    icon: '🩹'
  },
  other: {
    key: 'other',
    label: 'OTHER',
    color: 'text-neutral-700',
    bgColor: 'bg-neutral-100',
    borderColor: 'border-neutral-400',
    icon: '📋'
  }
}

export const SECTION_ORDER = ['warmup', 'strength', 'stability', 'cardio', 'mobility', 'tone', 'rehab', 'other']
