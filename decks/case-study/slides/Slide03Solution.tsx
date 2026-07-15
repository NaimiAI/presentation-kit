import { motion } from 'framer-motion'
import { BellRing, Inbox, Workflow } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Kicker, SlideShell } from '../kit/components'
import { CAPABILITIES, TIMELINE, VENDOR } from './content'
import type { SlideProps } from './index'

const ICONS: Record<string, LucideIcon> = {
  workflow: Workflow,
  inbox: Inbox,
  'bell-ring': BellRing,
}

/** The solution: a 3-phase rollout timeline over three product capabilities. */
export default function Slide03Solution(_props: SlideProps) {
  return (
    <SlideShell width="wide">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Kicker>The solution</Kicker>
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
          {VENDOR.name} put the status updates on autopilot
        </h2>
      </motion.div>

      {/* Rollout timeline — horizontal steps with number chips. */}
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {TIMELINE.map((phase, index) => (
          <motion.div
            key={phase.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 + index * 0.06 }}
            className="relative"
          >
            {index < TIMELINE.length - 1 && (
              <span className="absolute left-9 top-4 hidden h-px w-full bg-edge md:block" aria-hidden />
            )}
            <div className="flex items-center gap-3">
              <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
                {index + 1}
              </span>
              <span className="relative z-10 bg-surface pr-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-ink">
                {phase.weeks}
              </span>
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-ink">{phase.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{phase.body}</p>
          </motion.div>
        ))}
      </div>

      <div className="my-9 border-t border-edge" />

      {/* Capability cards. */}
      <div className="grid gap-5 md:grid-cols-3">
        {CAPABILITIES.map((cap, index) => {
          const Icon = ICONS[cap.icon]
          return (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 + index * 0.06 }}
              className="rounded-2xl border border-edge bg-card p-6"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft">
                {Icon && <Icon className="h-5 w-5 text-accent-ink" />}
              </span>
              <h3 className="mt-4 font-display text-base font-semibold text-ink">{cap.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{cap.body}</p>
            </motion.div>
          )
        })}
      </div>
    </SlideShell>
  )
}
