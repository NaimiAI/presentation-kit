import { CheckCircle2 } from 'lucide-react'
import type { ReactNode } from 'react'

interface BulletItemProps {
  children: ReactNode
  /** Right-aligned value (for "label — value" rows). */
  value?: string
}

/** Check-mark bullet row, optionally with a right-aligned value. */
export default function BulletItem({ children, value }: BulletItemProps) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2 className="w-4 h-4 text-positive shrink-0" />
      <div className="flex-1 flex items-baseline justify-between gap-3">
        <span className="text-sm text-ink-soft">{children}</span>
        {value !== undefined && <span className="text-sm font-semibold tabular-nums text-ink">{value}</span>}
      </div>
    </div>
  )
}
