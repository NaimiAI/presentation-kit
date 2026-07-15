import type { ReactNode } from 'react'

interface KickerProps {
  children: ReactNode
  tone?: 'accent' | 'positive' | 'critical'
}

const tones = {
  accent: 'text-accent-ink',
  positive: 'text-positive-ink',
  critical: 'text-critical',
}

/** Small uppercase section label above a slide heading. */
export default function Kicker({ children, tone = 'accent' }: KickerProps) {
  return (
    <p className={`text-sm uppercase tracking-wider font-semibold mb-3 ${tones[tone]}`}>
      {children}
    </p>
  )
}
