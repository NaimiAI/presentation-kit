import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  icon?: LucideIcon
  tone?: 'accent' | 'positive' | 'neutral'
  size?: 'sm' | 'md'
}

const tones = {
  accent: 'bg-accent-soft border-accent-edge text-accent-ink',
  positive: 'bg-positive-soft border-positive-edge text-positive-ink',
  neutral: 'bg-card border-edge text-ink-soft',
}

/** Rounded pill with an optional icon — for slide badges and metric chips. */
export default function Badge({ children, icon: Icon, tone = 'accent', size = 'md' }: BadgeProps) {
  const sizing = size === 'md' ? 'px-4 py-2 text-sm' : 'px-3 py-1.5 text-xs'
  const iconSize = size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5'
  return (
    <div className={`inline-flex items-center gap-2 rounded-full border font-medium ${sizing} ${tones[tone]}`}>
      {Icon && <Icon className={iconSize} />}
      <span>{children}</span>
    </div>
  )
}
