import { motion } from 'framer-motion'
import { Lightbulb, Sparkles } from 'lucide-react'
import { Kicker, SlideShell } from '../kit/components'
import { getReport } from './content'
import type { SlideProps } from './index'

/** Next quarter: numbered priorities plus a recommendation / upsell card. */
export default function Slide05Next({ personalization }: SlideProps) {
  const report = getReport(personalization)

  return (
    <SlideShell width="wide">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Kicker>Looking ahead</Kicker>
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
          Priorities for {report.nextPeriodLabel}
        </h2>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          {report.plan.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + index * 0.06 }}
              className="flex items-start gap-4 rounded-2xl border border-edge bg-card p-5 shadow-sm"
            >
              <span className="font-display text-2xl font-bold tabular-nums text-accent-ink">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="pt-1 text-sm leading-relaxed text-ink-soft">{item}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-4 rounded-2xl border border-edge bg-card p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 text-accent-ink">
            <Lightbulb className="h-5 w-5" />
            <h3 className="font-display text-lg font-semibold text-ink">Our recommendation</h3>
          </div>
          {report.recommendationNote && (
            <p className="text-sm leading-relaxed text-ink-soft">{report.recommendationNote}</p>
          )}
          {report.upsellLine && (
            <div className="flex items-start gap-3 rounded-xl border border-accent-edge bg-accent-soft px-4 py-3">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent-ink" />
              <span className="text-sm font-semibold text-accent-ink">{report.upsellLine}</span>
            </div>
          )}
        </motion.div>
      </div>
    </SlideShell>
  )
}
