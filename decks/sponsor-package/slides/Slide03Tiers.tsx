import { motion } from 'framer-motion'
import { useDemoField } from '../kit/hooks'
import { TIERS, formatUsd } from './content'
import type { SlideProps } from './index'

/** Tiers: three levels; the choice is saved to the presentation. */
export default function Slide03Tiers(_: SlideProps) {
  const [selectedTier, setSelectedTier] = useDemoField<string>('selectedTier', { defaultValue: '' })

  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-5xl px-6 py-14 md:px-8">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-semibold uppercase tracking-[0.4em] text-accent-ink">
          Packages
        </motion.p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl font-extrabold leading-tight text-ink md:text-5xl"
          >
            Three ways to partner
          </motion.h2>
          <p className="text-sm text-ink-faint">tap a package — your choice is saved</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {TIERS.map((tier, index) => {
            const active = selectedTier === tier.key
            const flagship = tier.key === 'general'
            return (
              <motion.button
                key={tier.key}
                type="button"
                onClick={() => setSelectedTier(active ? '' : tier.key)}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.1 }}
                className={`relative flex flex-col rounded-2xl border p-7 text-left backdrop-blur-sm transition-all duration-200 ${
                  active
                    ? 'border-accent bg-accent-soft shadow-[0_0_45px_rgba(245,158,11,0.18)]'
                    : 'border-edge bg-card hover:border-accent-edge'
                }`}
              >
                {flagship && (
                  <span
                    className="absolute -top-3 left-6 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#171029]"
                    style={{ background: 'var(--nk-gradient)' }}
                  >
                    flagship
                  </span>
                )}
                <p className="text-sm font-semibold uppercase tracking-wider text-ink-soft">{tier.label}</p>
                <p className={`mt-4 font-display text-3xl font-black tabular-nums ${active ? 'text-accent-ink' : 'text-ink'}`}>
                  {formatUsd(tier.priceUsd)}
                </p>
                <p className="mt-1 text-xs text-ink-faint">{tier.seats}</p>
                <p className="mt-5 text-sm leading-relaxed text-ink-soft">{tier.vibe}</p>
                <span
                  className={`mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest ${
                    active ? 'text-accent-ink' : 'text-ink-faint'
                  }`}
                >
                  {active ? '✓ selected' : 'select'}
                </span>
              </motion.button>
            )
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-sm leading-relaxed text-ink-faint"
        >
          What's in each package is on the next screen. Any tier can be tailored to your
          goals — add a workshop, a lounge, or badge branding.
        </motion.p>
      </div>
    </div>
  )
}
