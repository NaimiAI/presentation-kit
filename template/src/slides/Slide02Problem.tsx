import { motion } from 'framer-motion'
import { AlertTriangle, Clock3, Wallet } from 'lucide-react'
import { Card, Kicker, SlideShell } from '../kit/components'
import type { SlideProps } from './index'

const problems = [
  {
    icon: Clock3,
    title: 'Slow responses',
    text: 'Customers write 24/7, but the team replies during business hours — the hottest inquiries go cold.',
  },
  {
    icon: Wallet,
    title: 'Expensive people on routine tasks',
    text: 'Most inquiries are repetitive questions that do not require an expert.',
  },
  {
    icon: AlertTriangle,
    title: 'Inconsistent quality',
    text: 'Answers depend on the workload and mood of whoever happens to reply.',
  },
]

export default function Slide02Problem({ personalization }: SlideProps) {
  const companyName = personalization.companyName.trim() || 'your company'

  return (
    <SlideShell width="wide">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Kicker tone="critical">The problem</Kicker>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-8">
          What keeps {companyName} from growing faster?
        </h2>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        {problems.map((problem, index) => (
          <motion.div
            key={problem.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
          >
            <Card icon={problem.icon} title={problem.title}>
              <p>{problem.text}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </SlideShell>
  )
}
