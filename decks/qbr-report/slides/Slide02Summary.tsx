import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Kicker, SlideShell } from '../kit/components'
import { getReport } from './content'
import type { SlideProps } from './index'

/** Executive summary: wins vs watch-outs, plus a one-line TL;DR bar. */
export default function Slide02Summary({ personalization }: SlideProps) {
  const report = getReport(personalization)
  const hasWatchouts = report.watchouts.length > 0

  return (
    <SlideShell width="wide">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Kicker>Executive summary</Kicker>
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
          Where {report.companyName} landed this quarter
        </h2>
      </motion.div>

      <div className={`grid gap-6 ${hasWatchouts ? 'lg:grid-cols-2' : ''}`}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-edge bg-card p-6 shadow-sm"
        >
          <div className="mb-4 flex items-center gap-2 text-positive-ink">
            <CheckCircle2 className="h-5 w-5" />
            <h3 className="font-display text-lg font-semibold text-ink">Wins this quarter</h3>
          </div>
          <ul className="space-y-3">
            {report.wins.map((win, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-positive" />
                <span className="text-sm leading-relaxed text-ink-soft">{win}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {hasWatchouts && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="rounded-2xl border border-critical-edge bg-critical-soft p-6 shadow-sm"
          >
            <div className="mb-4 flex items-center gap-2 text-critical">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="font-display text-lg font-semibold text-ink">Watch-outs</h3>
            </div>
            <ul className="space-y-3">
              {report.watchouts.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-critical" />
                  <span className="text-sm leading-relaxed text-ink-soft">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>

      {report.summaryNote && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="mt-6 rounded-2xl border border-edge bg-card py-5 pl-6 pr-6 shadow-sm"
        >
          <div className="border-l-2 border-accent pl-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent-ink">TL;DR</p>
            <p className="mt-2 text-lg leading-relaxed text-ink-soft md:text-xl">{report.summaryNote}</p>
          </div>
        </motion.div>
      )}
    </SlideShell>
  )
}
