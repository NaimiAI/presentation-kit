import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { PACKAGES, findPackage, formatUsd } from './content'
import { usePricing } from './pricing'
import type { SlideProps } from './index'

/** Packages: three tiers. The couple picks one — the choice drives the whole deck. */
export default function Slide03Packages(_props: SlideProps) {
  const { packageKey, setPackageKey } = usePricing()
  const selected = findPackage(packageKey)

  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-6xl px-6 py-14 md:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[11px] uppercase tracking-[0.4em] text-accent-ink"
        >
          Collections
        </motion.p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl leading-tight text-ink md:text-5xl"
          >
            Choose your collection
          </motion.h2>
          <p className="text-sm text-ink-faint">Tap a collection — it carries through to your total.</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {PACKAGES.map((pkg, index) => {
            const active = packageKey === pkg.key
            return (
              <motion.button
                key={pkg.key}
                type="button"
                onClick={() => setPackageKey(pkg.key)}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.1 }}
                className={`relative flex flex-col rounded-sm border p-7 text-left transition-all duration-200 ${
                  active
                    ? 'border-accent bg-accent-soft ring-1 ring-accent shadow-[0_18px_40px_-28px_rgba(43,39,36,0.5)]'
                    : 'border-edge bg-card hover:border-accent-edge'
                }`}
              >
                {pkg.flagship && (
                  <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-card">
                    Most booked
                  </span>
                )}

                <p className="font-display text-xl text-ink">{pkg.label}</p>
                <p className={`mt-3 font-display text-4xl tabular-nums ${active ? 'text-accent-ink' : 'text-ink'}`}>
                  {formatUsd(pkg.price)}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-ink-faint">{pkg.hours} of coverage</p>

                <ul className="mt-6 space-y-2.5 border-t border-edge pt-5">
                  {pkg.includes.map((line) => (
                    <li key={line} className="flex items-start gap-2.5 text-sm text-ink-soft">
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${active ? 'text-accent-ink' : 'text-ink-faint'}`} />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>

                <span
                  className={`mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest ${
                    active ? 'text-accent-ink' : 'text-ink-faint'
                  }`}
                >
                  {active ? '✓ Selected' : 'Select'}
                </span>
              </motion.button>
            )
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 font-display text-lg italic text-ink-soft"
        >
          You're looking at the {selected.label} collection — {formatUsd(selected.price)}.
        </motion.p>
      </div>
    </div>
  )
}
