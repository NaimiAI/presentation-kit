import type { ReactNode } from 'react'
import Orbs from './Orbs'

interface SlideShellProps {
  children: ReactNode
  /** Blurred gradient orbs in the background (hero slides). */
  orbs?: boolean
  /** Center content vertically and horizontally (title/CTA slides). */
  center?: boolean
  width?: 'narrow' | 'default' | 'wide'
  className?: string
}

const widthClass = {
  narrow: 'max-w-3xl',
  default: 'max-w-5xl',
  wide: 'max-w-6xl',
}

/**
 * Full-bleed slide wrapper: theme background, bottom padding that clears the
 * deck navigation, and a centered content container.
 */
export default function SlideShell({ children, orbs = false, center = false, width = 'default', className = '' }: SlideShellProps) {
  return (
    <div className={`min-h-full w-full bg-surface relative overflow-hidden pb-24 ${center ? 'flex items-center justify-center' : ''} ${className}`}>
      {orbs && <Orbs />}
      <div className={`relative z-10 ${widthClass[width]} mx-auto px-6 md:px-8 ${center ? 'text-center py-12' : 'py-10'} w-full`}>
        {children}
      </div>
    </div>
  )
}
