import { motion } from 'framer-motion'
import { Bell, Filter, Share2 } from 'lucide-react'
import { BulletItem, Kicker, SlideShell } from '../kit/components'
import type { SlideProps } from './index'

// Bar heights for the CSS "revenue by month" dashboard mockup.
const chartBars = [34, 48, 42, 60, 55, 72, 66, 84, 78, 95]

const kpis = [
  { label: 'Revenue, mo', value: '$112K', delta: '+12%' },
  { label: 'Active accounts', value: '1,286', delta: '+38' },
  { label: 'Churn risk', value: '17 accounts', delta: '−5' },
]

/** Product slide: the interface is drawn in CSS — no screenshots. */
export default function Slide03Product(_props: SlideProps) {
  return (
    <SlideShell width="wide">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Kicker>Product</Kicker>
        <h2 className="font-display text-3xl font-bold text-ink md:text-4xl">
          One screen instead of five exports
        </h2>
      </motion.div>

      <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="overflow-hidden rounded-2xl border border-edge bg-card shadow-2xl backdrop-blur-sm"
        >
          <div className="flex items-center gap-1.5 border-b border-edge px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-critical/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#facc15]/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-positive/70" />
            <span className="ml-3 rounded-md bg-surface/60 px-3 py-0.5 text-[10px] text-ink-faint">
              relay.app / dashboard
            </span>
          </div>

          <div className="p-5">
            <div className="grid grid-cols-3 gap-3">
              {kpis.map((kpi) => (
                <div key={kpi.label} className="rounded-xl border border-edge bg-surface/40 p-3">
                  <p className="text-[10px] uppercase tracking-wide text-ink-faint">{kpi.label}</p>
                  <p className="mt-1 text-sm font-bold tabular-nums text-ink md:text-base">{kpi.value}</p>
                  <p className="text-[10px] font-semibold text-positive-ink">{kpi.delta}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-edge bg-surface/40 p-4">
              <p className="mb-3 text-[10px] uppercase tracking-wide text-ink-faint">Revenue by month</p>
              <div className="flex h-28 items-end gap-2">
                {chartBars.map((height, index) => (
                  <motion.div
                    key={index}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: 0.3 + index * 0.05, type: 'spring', damping: 18 }}
                    className="flex-1 rounded-t-md"
                    style={{
                      background: index === chartBars.length - 1 ? 'var(--nk-gradient)' : 'var(--nk-accent-soft)',
                      border: '1px solid var(--nk-accent-edge)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-5"
        >
          <div className="space-y-3">
            <BulletItem>Dashboards update in real time</BulletItem>
            <BulletItem>Cohorts, LTV, and pipeline — no setup</BulletItem>
            <BulletItem>Role-based access: sales, marketing, leadership</BulletItem>
          </div>

          <div className="space-y-3 border-t border-edge pt-5">
            {[
              { icon: Bell, text: 'Slack alerts the moment a metric crosses a threshold' },
              { icon: Filter, text: 'Segment customers in two clicks — no SQL' },
              { icon: Share2, text: 'Share any report with the board via a single link' },
            ].map((feature) => (
              <div key={feature.text} className="flex items-start gap-3">
                <feature.icon className="mt-0.5 h-4 w-4 shrink-0 text-accent-ink" />
                <p className="text-sm leading-relaxed text-ink-soft">{feature.text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </SlideShell>
  )
}
