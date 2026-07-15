import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { Badge, GradientText, Orbs } from '../kit/components'
import { PRODUCT } from './content'
import type { SlideProps } from './index'

const metrics = [
  { value: '1,200+', label: 'teams on the platform' },
  { value: '4.8 / 5', label: 'support rating' },
  { value: '99.9%', label: 'uptime last 12 months' },
]

export default function Slide01Hero({ personalization }: SlideProps) {
  const companyName = personalization.companyName.trim() || 'your team'

  return (
    <div className="relative min-h-full w-full overflow-hidden bg-surface pb-24 flex items-center justify-center">
      <Orbs />
      <div
        aria-hidden="true"
        className="absolute -top-40 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
        style={{ background: 'var(--nk-gradient)' }}
      />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 py-12 text-center md:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Badge icon={Sparkles} size="sm">Prepared for {companyName}</Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8 font-display text-5xl font-bold leading-[1.05] text-ink md:text-7xl"
        >
          Every customer conversation,
          <br />
          <GradientText>in one place</GradientText>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-ink-soft md:text-xl"
        >
          {PRODUCT.name} is {PRODUCT.tagline}: one shared inbox, a full
          history for every account, and AI that flags churn before it happens.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-2xl border border-edge bg-card px-4 py-5 backdrop-blur-sm">
              <p className="text-2xl font-bold tabular-nums text-ink">{metric.value}</p>
              <p className="mt-1 text-xs text-ink-faint">{metric.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
