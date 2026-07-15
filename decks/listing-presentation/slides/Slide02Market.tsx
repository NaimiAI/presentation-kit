import { motion } from 'framer-motion'
import { formatUsd, getListing, median } from './content'
import type { SlideProps } from './index'

/** Warm intro + personalized highlights (left); nearby-sales table + medians (right). */
export default function Slide02Market({ personalization }: SlideProps) {
  const { highlights, comps } = getListing(personalization)

  const medianPrice = median(comps.map((c) => c.soldPrice))
  const medianDays = median(comps.map((c) => c.daysOnMarket))

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
          Your home & the market
        </motion.p>

        <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_1.05fr]">
          {/* Left: intro + highlights */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <h2 className="font-display text-3xl leading-snug text-ink md:text-4xl">
              Selling a home you love is a big decision.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-soft">
              You only get one chance at a first impression on the market, so we plan the launch
              carefully and price it with the data. Here is what makes your home stand out.
            </p>

            {highlights.length > 0 && (
              <ul className="mt-8 space-y-3.5">
                {highlights.map((item, index) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + index * 0.07, duration: 0.5 }}
                    className="flex items-start gap-3 text-base leading-relaxed text-ink"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45"
                      style={{ background: 'var(--estate-brass)' }}
                    />
                    {item}
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>

          {/* Right: comps table */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="rounded-2xl border border-edge bg-card p-6 shadow-sm md:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ink-faint">
                Nearby sales
              </p>

              <div className="mt-5">
                <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 pb-2 text-[11px] font-medium uppercase tracking-wider text-ink-faint">
                  <span>Address</span>
                  <span className="text-right">Sold</span>
                  <span className="text-right">Days</span>
                </div>
                {comps.map((comp) => (
                  <div
                    key={comp.address}
                    className="grid grid-cols-[1fr_auto_auto] items-baseline gap-x-4 border-t border-edge py-3 text-sm"
                  >
                    <span className="text-ink">{comp.address}</span>
                    <span className="text-right font-semibold tabular-nums text-ink">
                      {formatUsd(comp.soldPrice)}
                    </span>
                    <span className="text-right tabular-nums text-ink-soft">{comp.daysOnMarket}</span>
                  </div>
                ))}
              </div>
            </div>

            {comps.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-accent-edge bg-accent-soft px-5 py-4">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
                    Median sold price
                  </p>
                  <p className="mt-1 font-display text-2xl tabular-nums text-accent-ink">
                    {formatUsd(medianPrice)}
                  </p>
                </div>
                <div className="rounded-2xl border border-edge bg-card px-5 py-4">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
                    Median days on market
                  </p>
                  <p className="mt-1 font-display text-2xl tabular-nums text-ink">{medianDays}</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
