import { motion } from 'framer-motion'
import { ListChecks, MousePointerClick, Percent, ReceiptText } from 'lucide-react'
import { Badge, GradientText, SlideShell } from '../kit/components'
import type { SlideProps } from './index'

const howItWorks = [
  { icon: MousePointerClick, text: 'Toggle services on with a tap — right on the call' },
  { icon: Percent, text: 'Bundle 3 services for 5% off, 5 for a full 10%' },
  { icon: ReceiptText, text: 'The estimate builds on the last slide and saves' },
]

export default function Slide01Title({ personalization }: SlideProps) {
  const companyName = personalization.companyName.trim() || 'your company'

  return (
    <SlideShell orbs center width="default">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Badge icon={ListChecks} size="sm">Interactive offer</Badge>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mx-auto mt-6 max-w-3xl font-display text-4xl font-bold leading-tight text-ink md:text-6xl"
      >
        Build your marketing plan <GradientText>for {companyName}</GradientText>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mx-auto mt-4 max-w-xl text-lg text-ink-soft"
      >
        No “three fixed plans” — pick only what you actually need and see the
        bundled price update as you go.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mx-auto mt-12 grid max-w-3xl gap-4 text-left sm:grid-cols-3"
      >
        {howItWorks.map((item) => (
          <div key={item.text} className="rounded-2xl border border-edge bg-card p-5 shadow-sm">
            <item.icon className="mb-3 h-5 w-5 text-accent-ink" />
            <p className="text-sm leading-relaxed text-ink-soft">{item.text}</p>
          </div>
        ))}
      </motion.div>
    </SlideShell>
  )
}
