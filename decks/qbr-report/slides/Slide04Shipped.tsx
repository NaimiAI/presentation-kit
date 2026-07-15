import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, CircleDashed } from 'lucide-react'
import { Kicker, SlideShell } from '../kit/components'
import { getReport } from './content'
import type { SlideProps } from './index'

/** What we shipped: two columns — delivered vs in flight. */
export default function Slide04Shipped({ personalization }: SlideProps) {
  const report = getReport(personalization)
  const hasInFlight = report.inFlight.length > 0

  return (
    <SlideShell width="wide">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Kicker>Delivery</Kicker>
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
          What we shipped
        </h2>
      </motion.div>

      <div className={`grid gap-6 ${hasInFlight ? 'lg:grid-cols-2' : ''}`}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-edge bg-card p-6 shadow-sm"
        >
          <div className="mb-5 flex items-center gap-2 text-positive-ink">
            <CheckCircle2 className="h-5 w-5" />
            <h3 className="font-display text-lg font-semibold text-ink">Delivered</h3>
          </div>
          <ul className="space-y-4">
            {report.delivered.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-positive" />
                <span className="text-sm leading-relaxed text-ink-soft">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {hasInFlight && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="rounded-2xl border border-edge bg-surface p-6"
          >
            <div className="mb-5 flex items-center gap-2 text-ink-soft">
              <CircleDashed className="h-5 w-5" />
              <h3 className="font-display text-lg font-semibold text-ink">In flight</h3>
            </div>
            <ul className="space-y-4">
              {report.inFlight.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <ArrowRight className="mt-0.5 h-5 w-5 shrink-0 text-ink-faint" />
                  <span className="text-sm leading-relaxed text-ink-soft">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </SlideShell>
  )
}
