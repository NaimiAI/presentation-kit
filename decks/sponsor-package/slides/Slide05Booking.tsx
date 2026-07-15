import { motion } from 'framer-motion'
import { CalendarClock, Handshake, Sparkles } from 'lucide-react'
import { useDemoField } from '../kit/hooks'
import { personalizationValue } from '../kit/host'
import { EVENT, TIERS, formatDate, formatUsd } from './content'
import type { SlideProps } from './index'

/** Booking: special terms, deadline, and contact. */
export default function Slide05Booking({ personalization }: SlideProps) {
  const [selectedTier] = useDemoField<string>('selectedTier', { defaultValue: '' })
  const tier = TIERS.find((item) => item.key === selectedTier)

  const companyName = personalization.companyName.trim() || 'Your team'
  const specialTerms = personalizationValue(personalization, 'specialTerms')
  const validUntilText = formatDate(personalizationValue(personalization, 'validUntil'))
  const managerName = personalizationValue(personalization, 'managerName', 'Partnerships lead')
  const managerContact = personalizationValue(personalization, 'managerContact')

  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-4xl flex-col justify-center px-6 py-12 md:px-8">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-semibold uppercase tracking-[0.4em] text-accent-ink">
          Booking
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 font-display text-3xl font-extrabold leading-tight text-ink md:text-5xl"
        >
          {tier
            ? <>{companyName}: holding your {tier.label} spot</>
            : <>{companyName}: your spot is still open</>}
        </motion.h2>

        {tier && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-sm text-ink-soft"
          >
            Selected package: {tier.label} · {formatUsd(tier.priceUsd)} — saved to this presentation.
          </motion.p>
        )}

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {specialTerms && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="rounded-2xl border border-accent-edge bg-accent-soft p-6 backdrop-blur-sm sm:col-span-2"
            >
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-accent-ink" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
                    Your terms
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink">{specialTerms}</p>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-2xl border border-edge bg-card p-6 backdrop-blur-sm"
          >
            <CalendarClock className="h-5 w-5 text-accent-ink" />
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.25em] text-ink-faint">Booking deadline</p>
            <p className="mt-2 font-display text-xl font-bold text-ink">
              {validUntilText || "we'll set it on the call"}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-ink-faint">
              After the deadline the package opens up again — a competitor could take the category.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="rounded-2xl border border-edge bg-card p-6 backdrop-blur-sm"
          >
            <Handshake className="h-5 w-5 text-positive-ink" />
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.25em] text-ink-faint">Your contact</p>
            <p className="mt-2 font-display text-xl font-bold text-ink">{managerName}</p>
            {managerContact && <p className="mt-1 text-sm text-ink-soft">{managerContact}</p>}
            <p className="mt-2 text-xs text-ink-faint">{EVENT.organizer}</p>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-sm leading-relaxed text-ink-faint"
        >
          Next step — 20 minutes on a call: we'll align on goals, walk the floor plan, and
          lock in your package by email.
        </motion.p>
      </div>
    </div>
  )
}
