import { motion } from 'framer-motion'
import { CalendarDays, GraduationCap, KeyRound, Rocket, Trophy } from 'lucide-react'
import { Kicker, SlideShell } from '../kit/components'
import { addDays, formatDay, resolveStartDate } from './content'
import type { SlideProps } from './index'

const milestones = [
  {
    icon: KeyRound,
    offsetDays: 0,
    title: 'Kickoff & access',
    text: 'We set up your workspace, grant access to the team, and connect to your systems.',
  },
  {
    icon: GraduationCap,
    offsetDays: 7,
    title: 'Team training',
    text: 'Two live 45-minute sessions plus recordings. After these, your team runs on its own.',
  },
  {
    icon: Rocket,
    offsetDays: 14,
    title: 'Go live',
    text: 'We move real work over. For the first two weeks we\'re in your channel every day.',
  },
  {
    icon: Trophy,
    offsetDays: 30,
    title: 'First review',
    text: 'We look at early metrics, gather feedback, and plan out the next month together.',
  },
]

/** First-month plan: dates are calculated from the startDate in personalization. */
export default function Slide03Plan({ personalization }: SlideProps) {
  const startDate = resolveStartDate(personalization)

  return (
    <SlideShell width="default">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <Kicker>First 30 days</Kicker>
        <h2 className="font-display text-3xl font-bold text-ink md:text-4xl">Your first month, mapped out</h2>
        <p className="mt-2 text-ink-soft">Dates are already counted from kickoff — drop them straight into your calendar.</p>
      </motion.div>

      <div className="relative space-y-2">
        <div aria-hidden="true" className="absolute bottom-6 left-[1.4rem] top-6 w-px bg-edge" />
        {milestones.map((milestone, index) => (
          <motion.div
            key={milestone.title}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12 + index * 0.1 }}
            className="relative flex gap-5 py-2"
          >
            <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-accent-edge bg-card shadow-sm">
              <milestone.icon className="h-5 w-5 text-accent-ink" />
            </div>
            <div className="flex-1 rounded-2xl border border-edge bg-card p-4 shadow-sm md:px-5">
              <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-semibold text-ink">{milestone.title}</h3>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-edge bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-ink">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatDay(addDays(startDate, milestone.offsetDays))}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-ink-soft">{milestone.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </SlideShell>
  )
}
