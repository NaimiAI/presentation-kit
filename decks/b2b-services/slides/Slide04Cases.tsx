import { motion } from 'framer-motion'
import type { SlideProps } from './index'

const cases = [
  {
    industry: 'Logistics SaaS · $40M revenue',
    task: 'CRM re-implementation and a forecast the board could trust',
    results: [['−31%', 'sales cycle in two quarters'], ['92%', 'CRM adoption (was 54%)']],
  },
  {
    industry: 'Industrial distribution · $120M revenue',
    task: 'Pipeline analytics and marketing–sales alignment',
    results: [['+18%', 'win rate on qualified deals'], ['±4%', 'forecast accuracy (was ±28%)']],
  },
  {
    industry: 'Healthcare software · $22M revenue',
    task: 'Sales enablement and rep onboarding rebuild',
    results: [['46 days', 'new-rep ramp (was 111)'], ['+$2.4M', 'net-new pipeline in six months']],
  },
]

/** Cases: industry, the work, and the result in numbers. */
export default function Slide04Cases(_: SlideProps) {
  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-5xl px-6 py-10 md:px-8">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs uppercase tracking-[0.45em] text-accent-ink">
          Cases
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-3 font-display text-3xl leading-snug text-ink md:text-4xl"
        >
          We've solved this before
        </motion.h2>

        <div className="mt-8 space-y-4">
          {cases.map((item, index) => (
            <motion.div
              key={item.industry}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.12 }}
              className="grid gap-6 border border-edge bg-card p-5 md:grid-cols-[1.3fr_1fr] md:px-7"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-ink-faint">{item.industry}</p>
                <p className="mt-3 font-display text-xl leading-snug text-ink">{item.task}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 md:border-l md:border-edge md:pl-6">
                {item.results.map(([value, note]) => (
                  <div key={note}>
                    <p className="font-display text-2xl italic text-accent-ink md:text-3xl">{value}</p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-soft">{note}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-sm text-ink-faint"
        >
          We're glad to connect you with a reference on any of these — a call with the client's
          own RevOps lead.
        </motion.p>
      </div>
    </div>
  )
}
