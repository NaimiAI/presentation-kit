import { motion } from 'framer-motion'
import teamOffice from '../assets/team-office.webp'
import { FIRM } from './content'
import type { SlideProps } from './index'

const phases = [
  {
    title: 'Diagnostic',
    period: '2 weeks',
    price: '$9,500',
    text: 'Interviews, data and funnel teardown. You get a map of what\'s costing you revenue, with dollar impact.',
  },
  {
    title: 'Roadmap sprint',
    period: '4 weeks',
    price: '$24,000',
    text: 'A prioritized plan: quick wins first, bigger bets scoped and sequenced. Presented to your leadership team.',
  },
  {
    title: 'Transformation retainer',
    period: 'from $12k/mo',
    price: '',
    text: 'We work alongside your team — CRM, analytics, enablement — in two-week sprints until the change sticks.',
  },
]

const principles = [
  'A partner in the room for every working session — no "sold and vanished"',
  'An NDA before the first data conversation',
  'Impact measured in dollars, with the "before" baselines locked on day one',
]

/** Engagement model: three priced stages, the team, and how we work. */
export default function Slide05Process(_: SlideProps) {
  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-5xl px-6 py-10 md:px-8">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs uppercase tracking-[0.45em] text-accent-ink">
          Engagement model
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-3 font-display text-3xl leading-snug text-ink md:text-4xl"
        >
          From diagnostic to durable results
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="relative mt-7 overflow-hidden rounded-none border border-edge"
        >
          <img
            src={teamOffice}
            alt={`The ${FIRM.name} team at work`}
            className="h-40 w-full object-cover md:h-44"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, rgba(12,22,38,0.35) 0%, rgba(12,22,38,0.82) 100%)' }}
          />
          <p className="absolute bottom-4 left-6 right-6 font-display text-lg italic text-ink md:text-xl">
            A small, senior team — partners do the work, not just the pitch.
          </p>
        </motion.div>

        <div className="mt-6 grid gap-px overflow-hidden border border-edge bg-edge md:grid-cols-3">
          {phases.map((phase, index) => (
            <motion.div
              key={phase.title}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 + index * 0.1 }}
              className="bg-surface p-5"
            >
              <div className="flex items-baseline gap-3">
                <p className="font-display text-xl italic text-accent-ink">{`0${index + 1}`}</p>
                <p className="font-display text-lg text-ink">{phase.title}</p>
              </div>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-ink-faint">
                {phase.period}
                {phase.price && <span className="ml-2 font-display text-base normal-case tracking-normal text-accent-ink">{phase.price}</span>}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{phase.text}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {principles.map((principle, index) => (
            <motion.div
              key={principle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 + index * 0.08 }}
              className="flex gap-3 border-l-2 border-accent pl-4"
            >
              <p className="text-sm leading-relaxed text-ink-soft">{principle}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
