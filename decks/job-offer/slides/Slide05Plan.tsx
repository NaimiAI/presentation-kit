import { motion } from 'framer-motion'
import { Kicker } from '../kit/components'
import type { SlideProps } from './index'

const phases = [
  {
    days: '30',
    title: 'Onboarding & your buddy',
    points: [
      'Meet the team and get into the product — a buddy is on hand for every question',
      'Your first small designs ship in week one',
      'Learn how we work: rituals, critique, release cadence',
    ],
  },
  {
    days: '60',
    title: 'Your first solo project',
    points: [
      'Own a feature end to end: from discovery with PM to shipped design',
      'Get fluent in your area’s metrics and how design moves them',
      'Give us your first feedback on process — we genuinely want it',
    ],
  },
  {
    days: '90',
    title: 'Owning your surface',
    points: [
      'Take the surface: roadmap, quality and design debt are yours',
      'Build a year-long growth plan together with your manager',
      'Wrap the ramp with no surprises — we’ll have talked it through all along',
    ],
  },
]

/** First 90 days: a clear plan instead of an anxious "what now?". */
export default function Slide05Plan(_: SlideProps) {
  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-5xl px-6 py-12 md:px-8">
        <Kicker>First 90 days</Kicker>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl font-extrabold tracking-tight text-ink md:text-5xl"
        >
          A plan, so you never wonder "what's next?"
        </motion.h2>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {phases.map((phase, index) => (
            <motion.div
              key={phase.days}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.12 }}
              className="rounded-3xl border border-edge bg-card p-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl font-display text-lg font-extrabold text-white"
                  style={{ background: 'var(--nk-gradient)' }}
                >
                  {phase.days}
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">days</p>
              </div>
              <p className="mt-4 font-display text-lg font-bold text-ink">{phase.title}</p>
              <ul className="mt-3 space-y-2.5">
                {phase.points.map((point) => (
                  <li key={point} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
