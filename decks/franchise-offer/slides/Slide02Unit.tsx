import { motion } from 'framer-motion'
import { Kicker } from '../kit/components'
import { ECONOMICS, FRANCHISE, MEDIAN_REVENUE, formatUsd, monthlyProfit } from './content'
import type { SlideProps } from './index'

// Expense bars are computed from the ECONOMICS model — the numbers always agree
// with the calculator on the next slide.
const expenseRows = [
  { label: 'Cost of goods: beans, milk, cups', value: MEDIAN_REVENUE * ECONOMICS.cogsShare, note: '30% of sales' },
  { label: 'Team payroll', value: MEDIAN_REVENUE * ECONOMICS.payrollShare, note: '26% of sales' },
  { label: 'Rent', value: ECONOMICS.rentFixed, note: 'fixed per month' },
  { label: 'Royalty', value: MEDIAN_REVENUE * ECONOMICS.royaltyShare, note: '6% of sales' },
  { label: 'National brand fund', value: MEDIAN_REVENUE * ECONOMICS.brandFundShare, note: '2% of sales' },
  { label: 'Other: card fees, utilities', value: MEDIAN_REVENUE * ECONOMICS.otherShare, note: '6% of sales' },
]

/** Median location's unit economics: sales → expense bars → profit. */
export default function Slide02Unit(_: SlideProps) {
  const profit = monthlyProfit(MEDIAN_REVENUE)

  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-4xl px-6 py-12 md:px-8">
        <Kicker>Unit economics</Kicker>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl font-extrabold tracking-tight text-ink md:text-5xl"
        >
          Where a location's sales go
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-10 rounded-3xl border border-edge bg-card p-6 shadow-sm md:p-7"
        >
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-sm font-medium text-ink-soft">Monthly gross sales, median location</p>
            <p className="font-display text-2xl font-extrabold tabular-nums text-ink md:text-3xl">
              {formatUsd(MEDIAN_REVENUE)}
            </p>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-accent-soft">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="h-full rounded-full"
              style={{ background: 'var(--nk-gradient)' }}
            />
          </div>

          <div className="mt-7 space-y-4">
            {expenseRows.map((row, index) => {
              const share = (row.value / MEDIAN_REVENUE) * 100
              return (
                <div key={row.label}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="text-ink-soft">
                      {row.label} <span className="text-ink-faint">· {row.note}</span>
                    </span>
                    <span className="font-semibold tabular-nums text-ink">−{formatUsd(row.value)}</span>
                  </div>
                  <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-surface">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${share}%` }}
                      transition={{ delay: 0.45 + index * 0.12, duration: 0.5 }}
                      className="h-full rounded-full bg-accent/70"
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-7 rounded-2xl border border-positive-edge bg-positive-soft px-5 py-4">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm font-semibold text-positive-ink">Owner's cash flow</p>
              <p className="font-display text-2xl font-extrabold tabular-nums text-positive-ink md:text-3xl">
                ≈ {formatUsd(profit)} / mo
              </p>
            </div>
            <div className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-card">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(profit / MEDIAN_REVENUE) * 100}%` }}
                transition={{ delay: 1.1, duration: 0.6 }}
                className="h-full rounded-full bg-positive"
              />
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 text-xs text-ink-faint"
        >
          Median of {FRANCHISE.locations} network locations, before owner's salary and taxes; the
          expense model is the same one used by the calculator on the next slide. Figures reflect
          2025 franchise disclosure document, Item 19. Individual results vary.
        </motion.p>
      </div>
    </div>
  )
}
