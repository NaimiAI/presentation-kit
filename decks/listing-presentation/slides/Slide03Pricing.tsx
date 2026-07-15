import { motion } from 'framer-motion'
import { RangeField } from '../kit/components'
import { useDemoField } from '../kit/hooks'
import {
  CLOSING_COST_RATE,
  COMMISSION_RATE,
  PRICING_STRATEGIES,
  formatUsd,
  getListing,
} from './content'
import type { SlideProps } from './index'

/** Strategy picker + net-proceeds calculator — both persist on the presentation. */
export default function Slide03Pricing({ personalization }: SlideProps) {
  const { recommendedPrice, recommendedPriceText } = getListing(personalization)

  const [strategy, setStrategy] = useDemoField<string>('pricingStrategy', { defaultValue: 'market' })
  // Slider seeds from the personalized recommendation; range is ±15% around it.
  const [listPrice, setListPrice] = useDemoField<number>('listPrice', { defaultValue: recommendedPrice })
  const priceValue = listPrice > 0 ? listPrice : recommendedPrice

  const min = Math.round((recommendedPrice * 0.85) / 5000) * 5000
  const max = Math.round((recommendedPrice * 1.15) / 5000) * 5000

  const commission = priceValue * COMMISSION_RATE
  const closing = priceValue * CLOSING_COST_RATE
  const netProceeds = priceValue - commission - closing

  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-5xl px-6 py-14 md:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-[11px] font-semibold uppercase tracking-[0.4em]"
          style={{ color: 'var(--estate-brass)' }}
        >
          Pricing strategy
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.6 }}
          className="mt-4 font-display text-3xl leading-snug text-ink md:text-4xl"
        >
          Pick the approach — then see what lands in your pocket
        </motion.h2>

        {/* Strategy picker */}
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {PRICING_STRATEGIES.map((option, index) => {
            const active = strategy === option.key
            return (
              <motion.button
                key={option.key}
                type="button"
                onClick={() => setStrategy(option.key)}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.08, duration: 0.5 }}
                className={`flex flex-col rounded-2xl border p-6 text-left transition-all ${
                  active
                    ? 'border-accent bg-accent-soft shadow-sm'
                    : 'border-edge bg-card hover:border-accent-edge'
                }`}
              >
                <span
                  className="text-[10px] font-semibold uppercase tracking-[0.3em]"
                  style={{ color: 'var(--estate-brass)' }}
                >
                  {option.tagline}
                </span>
                <span className="mt-2 font-display text-2xl text-ink">{option.name}</span>
                <span className="mt-3 text-sm leading-relaxed text-ink-soft">{option.tradeoff}</span>
                <span
                  className={`mt-5 text-xs font-semibold uppercase tracking-widest ${
                    active ? 'text-accent-ink' : 'text-ink-faint'
                  }`}
                >
                  {active ? '✓ Selected' : 'Choose'}
                </span>
              </motion.button>
            )
          })}
        </div>

        {/* Net-proceeds calculator */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="rounded-2xl border border-edge bg-card p-6 shadow-sm md:p-7"
          >
            <RangeField
              label="List price"
              value={priceValue}
              min={min}
              max={max}
              step={5000}
              onChange={setListPrice}
              displayValue={formatUsd(priceValue)}
            />
            <p className="mt-4 text-sm text-ink-faint">
              Recommended list:{' '}
              <span className="font-medium text-accent-ink">{recommendedPriceText}</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="flex flex-col rounded-2xl border border-accent-edge bg-card p-7 shadow-sm"
          >
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-ink-faint">
              Estimated net to you
            </p>
            <p className="mt-3 font-display text-4xl tabular-nums text-accent-ink md:text-5xl">
              {formatUsd(netProceeds)}
            </p>
            <div className="mt-5 space-y-2 border-t border-edge pt-4 text-sm text-ink-soft">
              <div className="flex justify-between">
                <span>List price</span>
                <span className="tabular-nums text-ink">{formatUsd(priceValue)}</span>
              </div>
              <div className="flex justify-between">
                <span>Commission (5.5%)</span>
                <span className="tabular-nums">−{formatUsd(commission)}</span>
              </div>
              <div className="flex justify-between">
                <span>Closing costs (1.5%)</span>
                <span className="tabular-nums">−{formatUsd(closing)}</span>
              </div>
            </div>
            <p className="mt-auto pt-5 text-xs leading-relaxed text-ink-faint">
              Estimate only — excludes mortgage payoff, prorated taxes and any concessions. We
              build a line-by-line net sheet before you sign.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
