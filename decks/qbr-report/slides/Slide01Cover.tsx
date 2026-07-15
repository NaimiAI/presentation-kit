import { motion } from 'framer-motion'
import { Activity, CalendarDays, UserRound } from 'lucide-react'
import { SlideShell } from '../kit/components'
import { AGENCY, getReport, healthTone } from './content'
import type { SlideProps } from './index'

/** Cover: period + client, meta chips, and a large account-health badge. */
export default function Slide01Cover({ personalization }: SlideProps) {
  const report = getReport(personalization)
  const tone = healthTone(report.healthStatus)

  const chips = [
    report.managerName && { icon: UserRound, text: `Prepared by ${report.managerName}` },
    report.presentDate && { icon: CalendarDays, text: report.presentDate },
    { icon: Activity, text: AGENCY.name },
  ].filter(Boolean) as Array<{ icon: typeof UserRound; text: string }>

  return (
    <SlideShell orbs width="wide" className="flex items-center">
      <div className="grid w-full items-center gap-12 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-faint"
          >
            Quarterly business review
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-4 font-display text-5xl font-bold tracking-tight text-ink md:text-7xl"
          >
            {report.periodLabel}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="mt-3 font-display text-2xl font-semibold text-ink-soft md:text-3xl"
          >
            {report.companyName}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="mt-8 flex flex-wrap gap-2.5"
          >
            {chips.map((chip, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 rounded-full border border-edge bg-card px-4 py-2 text-sm text-ink-soft shadow-sm"
              >
                <chip.icon className="h-4 w-4 text-ink-faint" />
                {chip.text}
              </span>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="justify-self-start lg:justify-self-end"
        >
          <div
            className={`rounded-3xl border px-8 py-7 shadow-sm ${
              tone === 'positive'
                ? 'border-positive-edge bg-positive-soft'
                : 'border-critical-edge bg-critical-soft'
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Account health</p>
            <p
              className={`mt-3 font-display text-3xl font-bold tracking-tight ${
                tone === 'positive' ? 'text-positive-ink' : 'text-critical'
              }`}
            >
              {report.healthStatus}
            </p>
          </div>
        </motion.div>
      </div>
    </SlideShell>
  )
}
