import { motion } from 'framer-motion'
import { CalendarCheck, MessageCircle, Rocket } from 'lucide-react'
import { Badge, GradientText, Orbs } from '../kit/components'
import { personalizationValue } from '../kit/host'
import type { SlideProps } from './index'

const steps = [
  { icon: Rocket, title: 'Day 1', text: 'Get access and import your data — no engineering required.' },
  { icon: CalendarCheck, title: 'Week 1', text: 'We configure dashboards and alerts around how your team works.' },
  { icon: MessageCircle, title: 'Day 14', text: 'We review the first results and measure the impact together.' },
]

export default function Slide05CTA({ personalization }: SlideProps) {
  const companyName = personalization.companyName.trim() || 'your team'
  const managerName = personalizationValue(personalization, 'managerName', 'your account lead')
  const managerContact = personalizationValue(personalization, 'managerContact')

  return (
    <div className="relative min-h-full w-full overflow-hidden bg-surface pb-24 flex items-center justify-center">
      <Orbs />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 py-12 text-center md:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Badge tone="positive" size="sm">Free 14-day pilot</Badge>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 font-display text-4xl font-bold leading-tight text-ink md:text-5xl"
        >
          We'll get {companyName} live on Relay <GradientText>in two weeks</GradientText>
        </motion.h2>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="rounded-2xl border border-edge bg-card p-5 text-left backdrop-blur-sm"
            >
              <step.icon className="mb-3 h-5 w-5 text-accent-ink" />
              <p className="text-sm font-semibold uppercase tracking-wide text-accent-ink">{step.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mx-auto mt-12 inline-flex flex-col items-center gap-1 rounded-2xl border border-accent-edge bg-accent-soft px-8 py-5"
        >
          <p className="text-sm text-ink-soft">Next step — a quick call with {managerName}</p>
          {managerContact && <p className="text-lg font-semibold text-ink">{managerContact}</p>}
        </motion.div>
      </div>
    </div>
  )
}
