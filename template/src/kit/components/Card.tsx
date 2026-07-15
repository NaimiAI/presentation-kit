import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  title?: string
  icon?: LucideIcon
  tone?: 'default' | 'accent' | 'positive' | 'critical'
  className?: string
}

const tones = {
  default: 'border-edge bg-card',
  accent: 'border-accent-edge bg-accent-soft',
  positive: 'border-positive-edge bg-positive-soft',
  critical: 'border-critical-edge bg-critical-soft',
}

const iconTones = {
  default: 'text-ink-soft',
  accent: 'text-accent-ink',
  positive: 'text-positive-ink',
  critical: 'text-critical',
}

/** Content card: rounded surface with border, optional icon and title. */
export default function Card({ children, title, icon: Icon, tone = 'default', className = '' }: CardProps) {
  return (
    <div className={`rounded-2xl border p-6 shadow-sm ${tones[tone]} ${className}`}>
      {(Icon || title) && (
        <div className="flex items-center gap-3 mb-3">
          {Icon && <Icon className={`w-5 h-5 shrink-0 ${iconTones[tone]}`} />}
          {title && <h3 className="text-lg font-semibold text-ink">{title}</h3>}
        </div>
      )}
      <div className="text-ink-soft text-sm leading-relaxed [&_ul]:mt-2 [&_ul]:space-y-1 [&_li]:flex [&_li]:gap-2">
        {children}
      </div>
    </div>
  )
}
