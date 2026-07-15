import { motion } from 'framer-motion'
import { PartyPopper } from 'lucide-react'
import { Badge, GradientText, Orbs } from '../kit/components'
import { personalizationValue } from '../kit/host'
import { formatDay, resolveStartDate } from './content'
import type { SlideProps } from './index'

// Decorative "confetti" — fixed positions so it doesn't jump between renders.
const confetti = [
  { left: '12%', top: '18%', size: 10, delay: 0 },
  { left: '85%', top: '14%', size: 8, delay: 0.4 },
  { left: '74%', top: '70%', size: 12, delay: 0.8 },
  { left: '20%', top: '74%', size: 7, delay: 1.2 },
  { left: '50%', top: '8%', size: 9, delay: 1.6 },
  { left: '92%', top: '46%', size: 7, delay: 2 },
  { left: '6%', top: '48%', size: 11, delay: 2.4 },
]

export default function Slide01Welcome({ personalization }: SlideProps) {
  const companyName = personalization.companyName.trim() || 'New client'
  const managerName = personalizationValue(personalization, 'managerName', 'your account manager')
  const startDay = formatDay(resolveStartDate(personalization))

  return (
    <div className="relative min-h-full w-full overflow-hidden bg-surface pb-24 flex items-center justify-center">
      <Orbs />
      {confetti.map((dot, index) => (
        <motion.span
          key={index}
          aria-hidden="true"
          className="absolute rounded-full"
          style={{
            left: dot.left,
            top: dot.top,
            width: dot.size,
            height: dot.size,
            background: index % 2 === 0 ? 'var(--nk-accent)' : 'var(--nk-positive)',
            opacity: 0.35,
          }}
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, delay: dot.delay, ease: 'easeInOut' }}
        />
      ))}

      <div className="relative z-10 mx-auto w-full max-w-3xl px-6 py-12 text-center md:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Badge icon={PartyPopper} size="sm">Contract signed</Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8 font-display text-4xl font-bold leading-tight text-ink md:text-6xl"
        >
          {companyName}, <GradientText>welcome aboard!</GradientText>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-soft"
        >
          I'm {managerName}, and I'll be running your project. This pack has
          everything you need for a smooth start: your team, the first-month plan,
          and the resources to lean on.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 inline-flex items-baseline gap-3 rounded-2xl border border-accent-edge bg-accent-soft px-8 py-5"
        >
          <span className="text-sm text-ink-soft">Kickoff</span>
          <span className="text-2xl font-bold text-accent-ink">{startDay}</span>
        </motion.div>
      </div>
    </div>
  )
}
