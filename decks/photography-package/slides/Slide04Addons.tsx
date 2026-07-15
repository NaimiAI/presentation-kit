import { motion } from 'framer-motion'
import { Check, Minus, Plus } from 'lucide-react'
import reception from '../assets/port-reception.webp'
import { ADDONS, EXTRA_HOUR_RATE, RETAINER_PCT, findPackage, formatUsd } from './content'
import { usePricing, type AddonState } from './pricing'
import type { SlideProps } from './index'

/** Add-ons + live total. Add-ons already in the package show as "included", never double-count. */
export default function Slide04Addons(_props: SlideProps) {
  const pricing = usePricing()
  const selected = findPackage(pricing.packageKey)
  const addonState = new Map<string, AddonState>(pricing.addons.map((a) => [a.key, a]))

  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-6xl px-6 py-14 md:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[11px] uppercase tracking-[0.4em] text-accent-ink"
        >
          Make it yours
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 font-display text-3xl leading-tight text-ink md:text-5xl"
        >
          Add-ons &amp; your total
        </motion.h2>
        <p className="mt-2 text-sm text-ink-faint">
          Building on the {selected.label} collection — check what you'd like; the total updates as you go.
        </p>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Add-on cards + stepper */}
          <div className="grid gap-3">
            {ADDONS.map((addon, index) => {
              const state = addonState.get(addon.key)
              const covered = state?.covered ?? false
              const checked = state?.checked ?? false
              const active = !covered && checked

              return (
                <motion.div
                  key={addon.key}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.06 }}
                >
                  {covered ? (
                    // Already bundled into the selected collection — show, don't charge.
                    <div className="flex items-center justify-between gap-4 rounded-sm border border-positive-edge bg-positive-soft px-5 py-4">
                      <div>
                        <p className="text-base font-semibold text-ink">{addon.label}</p>
                        <p className="mt-0.5 text-xs text-ink-soft">{addon.note}</p>
                      </div>
                      <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-positive-ink">
                        Included in your collection
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={state?.toggle}
                      className={`flex w-full items-center justify-between gap-4 rounded-sm border px-5 py-4 text-left transition-all ${
                        active
                          ? 'border-accent bg-accent-soft'
                          : 'border-edge bg-card hover:border-accent-edge'
                      }`}
                    >
                      <div>
                        <p className="text-base font-semibold text-ink">{addon.label}</p>
                        <p className="mt-0.5 text-xs text-ink-soft">{addon.note}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="font-display text-lg tabular-nums text-ink">+{formatUsd(addon.price)}</span>
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                            active ? 'border-accent bg-accent text-card' : 'border-edge text-transparent'
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </button>
                  )}
                </motion.div>
              )
            })}

            {/* Extra hours stepper */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + ADDONS.length * 0.06 }}
              className="flex items-center justify-between gap-4 rounded-sm border border-edge bg-card px-5 py-4"
            >
              <div>
                <p className="text-base font-semibold text-ink">Extra hours of coverage</p>
                <p className="mt-0.5 text-xs text-ink-soft">Stay a little longer — {formatUsd(EXTRA_HOUR_RATE)} per hour.</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => pricing.setExtraHours(pricing.extraHours - 1)}
                  disabled={pricing.extraHours <= 0}
                  aria-label="One fewer hour"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-edge text-ink transition-colors hover:border-accent disabled:opacity-40"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-6 text-center font-display text-xl tabular-nums text-ink">{pricing.extraHours}</span>
                <button
                  type="button"
                  onClick={() => pricing.setExtraHours(pricing.extraHours + 1)}
                  disabled={pricing.extraHours >= 4}
                  aria-label="One more hour"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-edge text-ink transition-colors hover:border-accent disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Total + side image */}
          <div className="grid gap-5">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-sm border border-accent-edge bg-card p-6 shadow-[0_18px_40px_-30px_rgba(43,39,36,0.5)]"
            >
              <p className="text-xs uppercase tracking-[0.25em] text-ink-faint">Your total</p>
              <p className="mt-3 font-display text-5xl tabular-nums text-ink">{formatUsd(pricing.total)}</p>

              <div className="mt-5 space-y-1.5 border-t border-edge pt-4 text-sm">
                <div className="flex justify-between text-ink-soft">
                  <span>{selected.label} collection</span>
                  <span className="tabular-nums">{formatUsd(pricing.packagePrice)}</span>
                </div>
                {pricing.billedAddonKeys.map((key) => {
                  const def = ADDONS.find((a) => a.key === key)
                  if (!def) return null
                  return (
                    <div key={key} className="flex justify-between text-ink-soft">
                      <span>{def.label}</span>
                      <span className="tabular-nums">+{formatUsd(def.price)}</span>
                    </div>
                  )
                })}
                {pricing.extraHours > 0 && (
                  <div className="flex justify-between text-ink-soft">
                    <span>
                      Extra hours (×{pricing.extraHours})
                    </span>
                    <span className="tabular-nums">+{formatUsd(pricing.extraHoursTotal)}</span>
                  </div>
                )}
              </div>

              <p className="mt-5 border-t border-edge pt-4 text-xs leading-relaxed text-ink-faint">
                Booking retainer: {RETAINER_PCT}% to hold your date. The balance is due one month before the wedding.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="photo-mat overflow-hidden rounded-sm"
            >
              <div className="overflow-hidden rounded-sm">
                <img src={reception} alt="A wedding reception moment" className="aspect-[4/3] w-full object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
