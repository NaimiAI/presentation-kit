import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import { Badge, Kicker, SlideShell } from '../kit/components'
import type { SlideProps } from './index'

const marketLayers = [
  { label: 'TAM', value: '$8.5B', note: 'post-purchase & returns software for US e-commerce', width: '100%', tone: 'bg-accent-soft border-accent-edge' },
  { label: 'SAM', value: '$2.4B', note: 'DTC brands doing 100+ orders a day', width: '62%', tone: 'bg-accent-soft border-accent-edge' },
  { label: 'SOM', value: '$310M', note: 'reachable in 4 years at current unit economics', width: '30%', tone: 'bg-positive-soft border-positive-edge' },
]

/** Market: TAM / SAM / SOM as shrinking bars + growth drivers. */
export default function Slide03Market(_: SlideProps) {
  return (
    <SlideShell width="default">
      <Kicker>Market</Kicker>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="max-w-2xl font-display text-3xl font-extrabold tracking-tight text-ink md:text-4xl">
          Returns are growing faster than brands can handle
        </h2>
        <Badge icon={TrendingUp} tone="positive">+22% a year</Badge>
      </div>

      <div className="mt-8 space-y-4">
        {marketLayers.map((layer, index) => (
          <motion.div
            key={layer.label}
            initial={{ opacity: 0, scaleX: 0.7 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.15 + index * 0.15 }}
            style={{ width: layer.width, transformOrigin: 'left' }}
            className={`rounded-2xl border px-6 py-4 backdrop-blur-sm ${layer.tone}`}
          >
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="font-display text-sm font-bold uppercase tracking-widest text-ink-faint">
                {layer.label}
              </span>
              <span className="font-display text-2xl font-extrabold tabular-nums text-ink md:text-3xl">
                {layer.value}
              </span>
              <span className="text-sm text-ink-soft">{layer.note}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 grid gap-4 sm:grid-cols-3"
      >
        {[
          ['$890B', 'in US goods returned every year'],
          ['70%', 'of shoppers check the return policy before they buy'],
          ['3×', 'more likely to re-order after a smooth exchange'],
        ].map(([value, note]) => (
          <div key={note} className="rounded-3xl border border-white/60 bg-white/55 p-5 backdrop-blur-md">
            <p className="font-display text-2xl font-extrabold text-accent-ink">{value}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{note}</p>
          </div>
        ))}
      </motion.div>
    </SlideShell>
  )
}
