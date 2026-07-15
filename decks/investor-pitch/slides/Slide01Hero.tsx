import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { Badge, GradientText, SlideShell } from '../kit/components'
import { STARTUP } from './content'
import type { SlideProps } from './index'

const heroStats = [
  { label: 'MRR', value: '$46K' },
  { label: 'MRR growth, 12 mo', value: '5.8×' },
  { label: 'Brands on the platform', value: '47' },
]

/** Hero: startup name, one-liner, and three headline metrics. */
export default function Slide01Hero({ personalization }: SlideProps) {
  const investorName = personalization.companyName.trim() || 'a future partner'

  return (
    <SlideShell orbs center width="default">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
        <Badge icon={Sparkles} size="sm">
          {STARTUP.stage} round · prepared for {investorName}
        </Badge>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-8 font-display text-6xl font-extrabold tracking-tight text-ink md:text-8xl"
      >
        <GradientText>{STARTUP.name}</GradientText>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.22 }}
        className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft md:text-xl"
      >
        {STARTUP.oneliner}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3"
      >
        {heroStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-white/60 bg-white/55 p-5 shadow-lg shadow-accent-soft backdrop-blur-md"
          >
            <p className="text-xs uppercase tracking-wider text-ink-faint">{stat.label}</p>
            <p className="mt-2 font-display text-2xl font-bold tabular-nums text-ink md:text-3xl">{stat.value}</p>
          </div>
        ))}
      </motion.div>
    </SlideShell>
  )
}
