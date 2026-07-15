import { motion } from 'framer-motion'
import { CalendarClock, CheckCircle2, Gauge, Users } from 'lucide-react'
import { Badge, Card, Kicker, SlideShell } from '../kit/components'
import { personalizationValue } from '../kit/host'
import type { SlideProps } from './index'

const conclusions = [
  {
    icon: Gauge,
    title: 'Speed',
    text: 'Orders clear in minutes, not the better part of an hour — fewer bottlenecks and less overtime at peak.',
  },
  {
    icon: CheckCircle2,
    title: 'Deflection',
    text: 'Auto-resolution held steady: the back half of the pilot stayed well above the first.',
  },
  {
    icon: Users,
    title: 'The team',
    text: 'The ops team is off the repetitive tickets and focused on the exceptions that actually need a human.',
  },
]

const rollout = [
  { term: 'Week 1', text: 'Move the pilot workflow to production and roll out to the returns team next' },
  { term: 'Weeks 2–3', text: 'Connect your ERP and inventory feed, and stand up reporting for team leads' },
  { term: 'Week 4', text: 'Checkpoint: reconcile the metrics against your quarterly targets' },
]

export default function Slide05Next({ personalization }: SlideProps) {
  const companyName = personalization.companyName.trim() || 'your company'
  const managerName = personalizationValue(personalization, 'managerName', 'your account lead')

  return (
    <SlideShell width="wide">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Kicker>Takeaways & recommendations</Kicker>
        <h2 className="font-display text-3xl font-bold text-ink md:text-4xl">
          The pilot proved out — we recommend a full rollout
        </h2>
      </motion.div>

      <div className="mb-10 grid gap-4 md:grid-cols-3">
        {conclusions.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
          >
            <Card icon={item.icon} title={item.title}>
              {item.text}
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1.2fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl border border-edge bg-card p-6 shadow-sm"
        >
          <div className="mb-4 flex items-center gap-2 text-ink-soft">
            <CalendarClock className="h-4 w-4" />
            <span className="text-sm font-semibold uppercase tracking-wide">
              Full-rollout plan for {companyName}
            </span>
          </div>
          <div className="space-y-4">
            {rollout.map((step) => (
              <div key={step.term} className="flex gap-4">
                <span className="w-24 shrink-0 text-sm font-semibold text-accent-ink">{step.term}</span>
                <p className="text-sm leading-relaxed text-ink-soft">{step.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="rounded-2xl border border-positive-edge bg-positive-soft p-6"
        >
          <Badge tone="positive" size="sm">Next step</Badge>
          <p className="mt-4 text-sm leading-relaxed text-ink">
            Lock the rollout terms on a call with {managerName}. Every number in this
            report is already saved — the contract will be built from them.
          </p>
        </motion.div>
      </div>
    </SlideShell>
  )
}
