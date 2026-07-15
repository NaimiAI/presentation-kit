import { motion } from 'framer-motion'
import { ArrowRight, Boxes, Clock3, TrendingDown } from 'lucide-react'
import { Kicker, SlideShell } from '../kit/components'
import type { SlideProps } from './index'

const pains = [
  { icon: TrendingDown, text: 'Returns cost online brands 15–20% of revenue — and most of it leaves as a refund, never a re-purchase' },
  { icon: Boxes, text: 'Returned inventory sits in limbo: on average 24% is never resold, tying up working capital' },
  { icon: Clock3, text: 'Support teams handle returns by hand across email, spreadsheets, and store credit — slow and error-prone' },
]

const solutions = [
  'A branded self-service portal that steers shoppers to exchanges and store credit first',
  'Automated routing, restocking, and refunds — one rule engine instead of manual case work',
  'Live in 2 weeks on Shopify or your existing stack, no re-platforming required',
]

/** Problem → solution: two glass panels with an arrow between them. */
export default function Slide02Problem(_: SlideProps) {
  return (
    <SlideShell orbs width="wide">
      <Kicker>Problem → solution</Kicker>
      <h2 className="max-w-3xl font-display text-3xl font-extrabold tracking-tight text-ink md:text-5xl">
        Every return is a refund waiting to happen
      </h2>

      <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-[1fr_auto_1fr]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-3xl border border-critical-edge bg-white/55 p-7 backdrop-blur-md"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-critical">Today</p>
          <div className="mt-5 space-y-5">
            {pains.map((pain) => (
              <div key={pain.text} className="flex gap-3">
                <pain.icon className="mt-0.5 h-5 w-5 shrink-0 text-critical" />
                <p className="text-sm leading-relaxed text-ink-soft">{pain.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="hidden items-center lg:flex">
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="rounded-full border border-accent-edge bg-accent-soft p-3"
          >
            <ArrowRight className="h-6 w-6 text-accent-ink" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl border border-positive-edge bg-white/55 p-7 backdrop-blur-md"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-positive-ink">With Loop</p>
          <div className="mt-5 space-y-5">
            {solutions.map((item) => (
              <div key={item} className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-positive" />
                <p className="text-sm leading-relaxed text-ink-soft">{item}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 max-w-3xl rounded-2xl border border-accent-edge bg-accent-soft px-5 py-4 text-sm leading-relaxed text-accent-ink"
      >
        Why now: online returns hit an all-time high, shipping costs keep climbing, and shoppers
        expect a one-tap returns experience — brands can no longer absorb this by hand.
      </motion.p>
    </SlideShell>
  )
}
