import type { ReactNode } from 'react'

/** Text filled with the theme gradient (sky→violet→pink in the Naimi themes). */
export default function GradientText({ children }: { children: ReactNode }) {
  return <span className="gradient-text">{children}</span>
}
