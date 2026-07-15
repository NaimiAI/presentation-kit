import { motion } from 'framer-motion'
import { ReceiptText, Sparkles } from 'lucide-react'
import { Kicker, SlideShell, StatCard } from '../kit/components'
import { personalizationValue } from '../kit/host'
import { discountPct, formatServicePrice, formatUsd, useServiceSelection } from './services'
import type { SlideProps } from './index'

/** Final estimate: assembled from the selection on the previous slide. */
export default function Slide03Summary({ personalization }: SlideProps) {
  const companyName = personalization.companyName.trim() || 'your company'
  const contactName = personalizationValue(personalization, 'contactName')
  const offerNote = personalizationValue(personalization, 'offerNote')
  const { chosen, subtotal, discount, discountUsd, total, maxWeeks } = useServiceSelection()

  const nextDiscountAt = chosen.length < 3 ? 3 : chosen.length < 5 ? 5 : null

  return (
    <SlideShell width="wide">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Kicker tone="positive">Summary</Kicker>
        <h2 className="font-display text-3xl font-bold text-ink md:text-4xl">
          Estimate for {companyName}
        </h2>
        {contactName && <p className="mt-2 text-ink-soft">Prepared for {contactName}</p>}
      </motion.div>

      {chosen.length > 0 ? (
        <div className="grid items-start gap-6 lg:grid-cols-[1.3fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-edge bg-card p-6 shadow-sm"
          >
            <div className="mb-4 flex items-center gap-2 text-ink-soft">
              <ReceiptText className="h-4 w-4" />
              <span className="text-sm font-semibold uppercase tracking-wide">What's included</span>
            </div>
            <div className="divide-y divide-edge">
              {chosen.map(({ def }) => (
                <div key={def.key} className="flex items-center justify-between gap-4 py-3">
                  <div className="flex items-center gap-3">
                    <def.icon className="h-4 w-4 shrink-0 text-accent-ink" />
                    <span className="text-sm text-ink">{def.title}</span>
                  </div>
                  <span className="whitespace-nowrap text-sm font-semibold tabular-nums text-ink">{formatServicePrice(def)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 space-y-1.5 border-t border-edge pt-3 text-sm">
              <div className="flex justify-between text-ink-soft">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatUsd(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between font-medium text-positive-ink">
                  <span>Bundle discount ({discount}%)</span>
                  <span className="tabular-nums">−{formatUsd(discountUsd)}</span>
                </div>
              )}
              <div className="flex justify-between pt-1 text-lg font-bold text-ink">
                <span>First-month total</span>
                <span className="tabular-nums">{formatUsd(total)}</span>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-4">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <StatCard label="First-month total" value={formatUsd(total)} sub={offerNote || 'Retainers billed monthly, setup fees one-time'} accent />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <StatCard
                label="Time to launch"
                value={`~${maxWeeks} wk`}
                sub="services run in parallel wherever possible"
              />
            </motion.div>
            {nextDiscountAt && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-start gap-3 rounded-2xl border border-accent-edge bg-accent-soft p-5"
              >
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent-ink" />
                <p className="text-sm leading-relaxed text-accent-ink">
                  Add {nextDiscountAt - chosen.length === 1 ? 'one more service' : `${nextDiscountAt - chosen.length} more services`} and
                  the discount jumps to {discountPct(nextDiscountAt)}%.
                </p>
              </motion.div>
            )}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="px-2 text-xs leading-relaxed text-ink-faint"
            >
              This exact mix is saved on the link — the contract and invoice will match it line for line.
            </motion.p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-accent-edge bg-accent-soft px-6 py-5 text-sm text-accent-ink">
          Nothing selected yet — head back a slide and tap the cards you need.
        </div>
      )}
    </SlideShell>
  )
}
