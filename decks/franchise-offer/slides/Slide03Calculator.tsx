import { motion } from 'framer-motion'
import { Kicker, RangeField } from '../kit/components'
import { useDemoField } from '../kit/hooks'
import { INVESTMENT_MID, formatUsd, monthlyProfit } from './content'
import type { SlideProps } from './index'

/** Payback calculator: partner's ticket and traffic → profit and months to return. */
export default function Slide03Calculator(_: SlideProps) {
  const [avgTicket, setAvgTicket] = useDemoField<number>('avgTicket', { defaultValue: 9.5 })
  const [dailyGuests, setDailyGuests] = useDemoField<number>('dailyGuests', { defaultValue: 260 })

  const revenue = avgTicket * dailyGuests * 30
  const profit = monthlyProfit(revenue)
  const paybackMonths = profit > 0 ? Math.ceil(INVESTMENT_MID / profit) : null

  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-5xl px-6 py-12 md:px-8">
        <Kicker>Calculator</Kicker>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl font-extrabold tracking-tight text-ink md:text-5xl"
        >
          Run the numbers on your location
        </motion.h2>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-3xl border border-edge bg-card p-6 shadow-sm"
            >
              <RangeField
                label="Average ticket"
                value={avgTicket}
                min={6}
                max={14}
                step={0.5}
                onChange={setAvgTicket}
                displayValue={`$${avgTicket.toFixed(2)}`}
                suffix="$"
              />
              <p className="mt-3 text-xs text-ink-faint">
                across the network — from $8 in the suburbs to $12 in dense downtown blocks
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="rounded-3xl border border-edge bg-card p-6 shadow-sm"
            >
              <RangeField
                label="Daily customers"
                value={dailyGuests}
                min={150}
                max={450}
                step={10}
                onChange={setDailyGuests}
                displayValue={`${dailyGuests.toLocaleString('en-US')} cust`}
                suffix="cust"
              />
              <p className="mt-3 text-xs text-ink-faint">
                we'll help you land a high-traffic site — site selection is part of the franchise
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="rounded-3xl border border-edge bg-card px-6 py-4 text-sm text-ink-soft"
            >
              Model: sales − goods 30% − payroll 26% − other 6% − royalty 6% − brand fund 2% − rent{' '}
              {formatUsd(6500)}. The same model as the unit-economics slide.
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col rounded-3xl border border-accent-edge bg-card p-7 shadow-sm lg:sticky lg:top-6"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-ink-faint">Your location</p>

            <p className="mt-5 text-sm text-ink-soft">Monthly sales</p>
            <p className="font-display text-2xl font-extrabold tabular-nums text-ink">{formatUsd(revenue)}</p>

            <p className="mt-5 text-sm text-ink-soft">Owner's cash flow / mo</p>
            {profit > 0 ? (
              <p className="font-display text-4xl font-extrabold tabular-nums text-positive-ink md:text-5xl">
                {formatUsd(profit)}
              </p>
            ) : (
              <p className="font-display text-4xl font-extrabold text-ink-faint md:text-5xl">—</p>
            )}

            <div className="mt-6 rounded-2xl bg-accent-soft px-5 py-4">
              <p className="text-xs uppercase tracking-wider text-ink-faint">
                Payback on {formatUsd(INVESTMENT_MID)}
              </p>
              <p className="mt-1 font-display text-2xl font-extrabold tabular-nums text-accent-ink">
                {paybackMonths !== null ? `≈ ${paybackMonths} mo` : '—'}
              </p>
              {paybackMonths === null && (
                <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
                  at these numbers the location runs at a loss — nudge the ticket or traffic up, or
                  let's find a stronger site
                </p>
              )}
            </div>

            <p className="mt-auto pt-6 text-xs leading-relaxed text-ink-faint">
              Measured from the ramp to planned sales. Your values save in this proposal — we'll walk
              through them on a call.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
