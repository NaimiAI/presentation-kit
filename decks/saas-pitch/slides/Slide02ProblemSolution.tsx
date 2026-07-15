import { motion } from 'framer-motion'
import { ArrowRight, Brain, FileSpreadsheet, Layers, LineChart, ShieldAlert, Zap } from 'lucide-react'
import { Card, Kicker, SlideShell } from '../kit/components'
import type { SlideProps } from './index'

const problems = [
  { icon: Layers, title: 'Conversations are scattered', text: 'Email, chat, and social live in separate tools — no single thread per customer.' },
  { icon: FileSpreadsheet, title: 'Reporting is manual', text: 'Every Monday someone pulls exports by hand instead of acting on the numbers.' },
  { icon: ShieldAlert, title: 'Churn shows up too late', text: 'You see an account leave only after it happens — when winning it back is expensive.' },
]

const solutions = [
  { icon: Zap, title: 'One thread per customer', text: 'Every message, deal, and payment syncs automatically from the tools you already use.' },
  { icon: LineChart, title: 'Reports build themselves', text: 'Live dashboards for revenue, cohorts, and reps — no exports, no spreadsheets.' },
  { icon: Brain, title: 'AI flags churn early', text: 'The model surfaces at-risk accounts 3–4 weeks before they slip away.' },
]

export default function Slide02ProblemSolution({ personalization }: SlideProps) {
  const companyName = personalization.companyName.trim() || 'your team'

  return (
    <SlideShell width="wide">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <Kicker>Problem → solution for {companyName}</Kicker>
        <h2 className="font-display text-3xl font-bold text-ink md:text-4xl">
          What hurts today — and how Relay fixes it
        </h2>
      </motion.div>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_auto_1fr]">
        <div className="space-y-4">
          {problems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <Card icon={item.icon} title={item.title} tone="critical">
                {item.text}
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="hidden self-center rounded-full border border-accent-edge bg-accent-soft p-3 lg:block"
        >
          <ArrowRight className="h-6 w-6 text-accent-ink" />
        </motion.div>

        <div className="space-y-4">
          {solutions.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card icon={item.icon} title={item.title} tone="positive">
                {item.text}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideShell>
  )
}
