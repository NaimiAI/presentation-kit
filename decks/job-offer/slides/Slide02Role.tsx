import { motion } from 'framer-motion'
import { Compass, Lightbulb, Rocket, Users } from 'lucide-react'
import { Kicker } from '../kit/components'
import { personalizationValue } from '../kit/host'
import { COMPANY } from './content'
import type { SlideProps } from './index'

const rolePoints = [
  {
    icon: Compass,
    title: 'Own the surface',
    text: 'You lead your product area end to end — from research to shipped design — with no micromanagement.',
  },
  {
    icon: Lightbulb,
    title: 'Real product influence',
    text: 'Designers shape product decisions here: your "what if we tried this instead" actually moves the roadmap.',
  },
  {
    icon: Rocket,
    title: 'No design-debt swamp',
    text: 'A living design system, components in code, and a team that ships to production several times a day.',
  },
  {
    icon: Users,
    title: 'Great people around you',
    text: 'Kind, sharp critique, biweekly demos, and colleagues you actually want to learn from.',
  },
]

/** Role: what you'll do and who with — plus the hiring-manager card. */
export default function Slide02Role({ personalization }: SlideProps) {
  const managerName = personalizationValue(personalization, 'managerName', 'Hiring manager')

  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-5xl px-6 py-12 md:px-8">
        <Kicker>Your role</Kicker>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl font-extrabold tracking-tight text-ink md:text-5xl"
        >
          Work you'll be proud to talk about
        </motion.h2>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {rolePoints.map((point, index) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.1 }}
                className="rounded-3xl border border-edge bg-card p-6 shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft">
                  <point.icon className="h-5 w-5 text-accent-ink" />
                </div>
                <p className="mt-4 font-display text-lg font-bold text-ink">{point.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{point.text}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex flex-col justify-center rounded-3xl border border-accent-edge bg-card p-7 text-center shadow-sm"
          >
            <div
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full font-display text-xl font-bold text-white"
              style={{ background: 'var(--nk-gradient)' }}
            >
              {managerName.trim().charAt(0).toUpperCase() || 'M'}
            </div>
            <p className="mt-4 font-display text-xl font-bold text-ink">{managerName}</p>
            <p className="text-sm text-ink-faint">your manager</p>
            <p className="mt-4 rounded-2xl bg-surface px-4 py-3 text-sm leading-relaxed text-ink-soft">
              A weekly 1:1, honest feedback, and a growth plan — from day one.
            </p>
            <p className="mt-6 border-t border-edge pt-5 text-sm text-ink-soft">
              Working style —{' '}
              <span className="font-semibold text-ink">hybrid, 2 days a week in the SF office</span>:
              the {COMPANY.name} studio is always open, but nobody's counting your badge-ins.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
