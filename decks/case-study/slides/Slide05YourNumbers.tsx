import { motion } from 'framer-motion'
import { ArrowRight, Calculator } from 'lucide-react'
import { Kicker, RangeField, SlideShell } from '../kit/components'
import { useDemoField } from '../kit/hooks'
import {
  AVOIDED_SHARE,
  HANDLING_COST,
  clampNumber,
  formatNumber,
  formatUsd,
  getProspect,
} from './content'
import type { SlideProps } from './index'

/** What this means for the prospect: an interactive savings projection + CTA. */
export default function Slide05YourNumbers({ personalization }: SlideProps) {
  const { companyName, personalNote, bookingUrl, managerName, managerContact } =
    getProspect(personalization)

  const [monthlyTickets, setMonthlyTickets] = useDemoField<number>('monthlyTickets', {
    defaultValue: 2000,
  })
  const safeTickets = Math.round(clampNumber(monthlyTickets, 200, 20000, 2000))

  const avoidedPerMonth = Math.round(safeTickets * AVOIDED_SHARE)
  const yearlySavings = avoidedPerMonth * 12 * HANDLING_COST

  return (
    <SlideShell width="wide">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Kicker>What this means for {companyName}</Kicker>
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
          Run your numbers through the same math
        </h2>
      </motion.div>

      <div className="mt-9 grid items-start gap-6 lg:grid-cols-2">
        {/* Calculator input. */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="rounded-2xl border border-edge bg-card p-6"
        >
          <div className="mb-5 flex items-center gap-2 text-ink-soft">
            <Calculator className="h-4 w-4" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em]">Your inputs</span>
          </div>
          <RangeField
            label="Your support tickets per month"
            value={safeTickets}
            min={200}
            max={20000}
            step={100}
            displayValue={formatNumber(safeTickets)}
            onChange={(value) => setMonthlyTickets(Math.round(value))}
          />
          <p className="mt-5 text-xs leading-relaxed text-ink-faint">
            Assumes the same 38% reduction Ironwood saw, at $14 to handle one ticket
            end to end. Move the slider to fit your volume.
          </p>
        </motion.div>

        {/* Projected outcome cards. */}
        <div className="grid content-start gap-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="rounded-2xl border border-edge bg-card p-6"
          >
            <p className="text-xs uppercase tracking-wide text-ink-faint">Tickets avoided / month</p>
            <p className="cs-metric mt-2 text-4xl text-ink md:text-5xl">
              {formatNumber(avoidedPerMonth)}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-positive-edge bg-positive-soft p-6"
          >
            <p className="text-xs uppercase tracking-wide text-ink-faint">Projected savings / year</p>
            <p className="cs-metric mt-2 text-4xl text-positive-ink md:text-5xl">
              {formatUsd(yearlySavings)}
            </p>
          </motion.div>
        </div>
      </div>

      {/* CTA + handoff note + signature. */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.26 }}
        className="mt-8 rounded-2xl border border-edge bg-card p-6"
      >
        {personalNote && (
          <p className="max-w-prose border-l-2 border-accent-edge pl-4 text-[15px] leading-relaxed text-ink-soft">
            {personalNote}
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            {managerName && <p className="text-sm font-semibold text-ink">{managerName}</p>}
            {managerContact && <p className="text-sm text-ink-faint">{managerContact}</p>}
          </div>

          {bookingUrl && (
            <a
              href={bookingUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Book a 20-min walkthrough
              <ArrowRight className="h-4 w-4" />
            </a>
          )}
        </div>
      </motion.div>
    </SlideShell>
  )
}
