import { motion } from 'framer-motion'
import { Kicker, RangeField, SlideShell } from '../kit/components'
import { useDemoField } from '../kit/hooks'
import { ROUND, formatDate, formatUsd, formatUsdCompact } from './content'
import { personalizationValue } from '../kit/host'
import type { SlideProps } from './index'

/** Round: target, use of funds, and the investor's ticket calculator. */
export default function Slide05Round({ personalization }: SlideProps) {
  // Ticket in whole US dollars ($50K–$1M, $50K steps).
  const [ticket, setTicket] = useDemoField<number>('ticketK', { defaultValue: 250_000 })
  const closingText = formatDate(personalizationValue(personalization, 'roundClosing'))

  const roundShare = Math.min(100, (ticket / ROUND.target) * 100)
  const equityShare = (ticket / (ROUND.preMoney + ROUND.target)) * 100

  return (
    <SlideShell width="default">
      <Kicker>Round</Kicker>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink md:text-5xl">
          Raising {formatUsdCompact(ROUND.target)}
        </h2>
        <p className="text-sm text-ink-faint">
          {formatUsdCompact(ROUND.preMoney)} pre-money
          {closingText && <> · closing by <span className="font-semibold text-ink">{closingText}</span></>}
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-3xl border border-white/60 bg-white/55 p-7 backdrop-blur-md"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-ink-faint">Use of funds</p>
          <div className="mt-6 space-y-5">
            {ROUND.useOfFunds.map((item, index) => (
              <div key={item.label}>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-medium text-ink">{item.label}</span>
                  <span className="font-semibold tabular-nums text-accent-ink">{item.share}%</span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-accent-soft">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.share}%` }}
                    transition={{ delay: 0.3 + index * 0.15, duration: 0.5 }}
                    className="h-full rounded-full"
                    style={{ background: 'var(--nk-gradient)' }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm leading-relaxed text-ink-soft">
            This round funds 20 months of growth to operating break-even at current unit economics.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl border border-accent-edge bg-white/70 p-7 shadow-lg shadow-accent-soft backdrop-blur-md"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-accent-ink">Your participation</p>
          <div className="mt-6">
            <RangeField
              label="Ticket size"
              value={ticket}
              min={50_000}
              max={1_000_000}
              step={50_000}
              onChange={setTicket}
              displayValue={formatUsd(ticket)}
            />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-accent-soft px-4 py-4">
              <p className="text-xs uppercase tracking-wider text-ink-faint">Share of round</p>
              <p className="mt-1 font-display text-2xl font-extrabold tabular-nums text-accent-ink">
                {roundShare.toFixed(0)}%
              </p>
            </div>
            <div className="rounded-2xl bg-positive-soft px-4 py-4">
              <p className="text-xs uppercase tracking-wider text-ink-faint">Share of company</p>
              <p className="mt-1 font-display text-2xl font-extrabold tabular-nums text-positive-ink">
                ≈{equityShare.toFixed(1)}%
              </p>
            </div>
          </div>
          <p className="mt-5 text-xs leading-relaxed text-ink-faint">
            Move the slider to your check size — it's saved to this presentation, and we'll
            pick it up again in the term sheet.
          </p>
        </motion.div>
      </div>
    </SlideShell>
  )
}
