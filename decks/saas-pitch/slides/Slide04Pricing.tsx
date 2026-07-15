import { motion } from 'framer-motion'
import { Check, Wallet } from 'lucide-react'
import { Badge, Kicker, RangeField, SlideShell } from '../kit/components'
import { useDemoField } from '../kit/hooks'
import { ANNUAL_DISCOUNT, PLANS, formatUsd, planById } from './content'
import type { SlideProps } from './index'

/**
 * Interactive pricing configurator: the chosen plan, seat count, and billing
 * cycle are saved to the demo — the rep returns to them when drafting the order.
 */
export default function Slide04Pricing({ personalization }: SlideProps) {
  const companyName = personalization.companyName.trim() || 'your team'

  const [planId, setPlanId] = useDemoField<string>('plan', { defaultValue: 'growth' })
  const [seats, setSeats] = useDemoField<number>('seats', { defaultValue: 25 })
  const [billingAnnual, setBillingAnnual] = useDemoField<boolean>('billingAnnual', { defaultValue: true })

  const plan = planById(planId)
  const safeSeats = Math.min(500, Math.max(1, Math.round(Number(seats) || 1)))

  // Enterprise is a "let's talk" tier (pricePerSeat === null) — no live total.
  const isCustom = plan.pricePerSeat == null
  const baseMonthly = isCustom ? 0 : safeSeats * (plan.pricePerSeat as number)
  const monthly = billingAnnual ? baseMonthly * (1 - ANNUAL_DISCOUNT) : baseMonthly
  const yearly = monthly * 12
  const savings = billingAnnual ? baseMonthly * ANNUAL_DISCOUNT * 12 : 0

  return (
    <SlideShell width="wide">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Kicker>Pricing</Kicker>
        <h2 className="font-display text-3xl font-bold text-ink md:text-4xl">
          Build a plan for {companyName}
        </h2>
        <p className="mt-2 text-ink-soft">
          Your choice is saved to the demo — we'll draft the order from these same numbers.
        </p>
      </motion.div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {PLANS.map((item, index) => {
          const selected = item.id === plan.id
          return (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => setPlanId(item.id)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.08 }}
              className={`relative rounded-2xl border p-5 text-left transition-all duration-200 ${
                selected
                  ? 'border-accent-edge bg-accent-soft shadow-lg'
                  : 'border-edge bg-card hover:border-accent-edge/60'
              }`}
            >
              {item.popular && (
                <span className="absolute -top-3 right-4 rounded-full border border-accent-edge bg-surface px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-ink">
                  Popular
                </span>
              )}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-ink">{item.name}</h3>
                {selected && (
                  <span className="rounded-full bg-accent p-1">
                    <Check className="h-3.5 w-3.5 text-surface" />
                  </span>
                )}
              </div>
              <p className="mt-1 text-2xl font-bold tabular-nums text-ink">
                {item.pricePerSeat == null ? (
                  "Let's talk"
                ) : (
                  <>
                    {formatUsd(item.pricePerSeat)}
                    <span className="text-sm font-normal text-ink-faint"> / seat · mo</span>
                  </>
                )}
              </p>
              <ul className="mt-4 space-y-1.5">
                {item.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-xs text-ink-soft">
                    <Check className="mt-0.5 h-3 w-3 shrink-0 text-positive" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.button>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6 rounded-2xl border border-edge bg-card p-6"
        >
          <RangeField
            label="Seats"
            value={safeSeats}
            min={1}
            max={500}
            step={1}
            displayValue={String(safeSeats)}
            onChange={(value) => setSeats(Math.round(value))}
          />

          <div>
            <p className="mb-2 text-sm font-medium text-ink-soft">Billing</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setBillingAnnual(false)}
                className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                  billingAnnual ? 'border-edge bg-surface/40 text-ink-faint' : 'border-accent-edge bg-accent-soft text-accent-ink'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingAnnual(true)}
                className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                  billingAnnual ? 'border-accent-edge bg-accent-soft text-accent-ink' : 'border-edge bg-surface/40 text-ink-faint'
                }`}
              >
                Annual · 2 mo free
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="flex flex-col justify-between gap-4 rounded-2xl border border-positive-edge bg-positive-soft p-6"
        >
          <div className="flex items-center gap-2 text-positive-ink">
            <Wallet className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wide">
              {plan.name} · {safeSeats} seats
            </span>
          </div>
          {isCustom ? (
            <>
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-faint">Per month</p>
                <p className="mt-1 text-4xl font-bold text-ink">Let's talk</p>
                <p className="mt-1 text-sm text-ink-faint">Custom pricing for {safeSeats}+ seats</p>
              </div>
              <p className="text-xs text-ink-faint">
                We'll scope SSO, security review, and SLA together — book a call below.
              </p>
            </>
          ) : (
            <>
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-faint">Per month</p>
                <p className="mt-1 text-4xl font-bold tabular-nums text-ink">{formatUsd(monthly)}</p>
                <p className="mt-1 text-sm text-ink-faint">{formatUsd(yearly)} / year</p>
              </div>
              {savings > 0 ? (
                <Badge tone="positive" size="sm">Save {formatUsd(savings)} a year</Badge>
              ) : (
                <p className="text-xs text-ink-faint">Switch to annual billing to see the savings.</p>
              )}
            </>
          )}
        </motion.div>
      </div>
    </SlideShell>
  )
}
