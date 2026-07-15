import { motion } from 'framer-motion'
import { CalendarDays, Gift, RefreshCw, TrendingUp, Wallet } from 'lucide-react'
import { Kicker } from '../kit/components'
import { personalizationValue } from '../kit/host'
import { formatDate } from './content'
import type { SlideProps } from './index'

/** Total comp: base, equity, optional signing bonus, and the start date. */
export default function Slide03Comp({ personalization }: SlideProps) {
  const baseSalary = personalizationValue(personalization, 'baseSalary', "we'll confirm on the call")
  const equityText = personalizationValue(personalization, 'equityText')
  const signingBonus = personalizationValue(personalization, 'signingBonus')
  const startDateText = formatDate(personalizationValue(personalization, 'startDate'), "we'll pick together")

  // Base is always shown; equity and signing bonus render only when filled in.
  const compCards = [
    { icon: Wallet, label: 'Base salary', value: baseSalary },
    ...(equityText ? [{ icon: TrendingUp, label: 'Equity', value: equityText }] : []),
    ...(signingBonus ? [{ icon: Gift, label: 'Signing bonus', value: signingBonus }] : []),
  ]

  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-4xl px-6 py-12 md:px-8">
        <Kicker>Total compensation</Kicker>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl font-extrabold tracking-tight text-ink md:text-5xl"
        >
          The numbers, laid out plainly
        </motion.h2>

        <div className={`mt-10 grid gap-4 ${compCards.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
          {compCards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.12 }}
              className="rounded-3xl border border-edge bg-card p-7 shadow-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft">
                <card.icon className="h-5 w-5 text-accent-ink" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-ink-faint">{card.label}</p>
              <p className="mt-2 font-display text-xl font-bold leading-snug text-ink md:text-2xl">{card.value}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-4 flex items-center gap-4 rounded-3xl border border-edge bg-card p-6 shadow-sm"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent-soft">
            <CalendarDays className="h-5 w-5 text-accent-ink" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Start date</p>
            <p className="mt-1 font-display text-xl font-bold text-ink">{startDateText}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 flex items-start gap-3 rounded-3xl border border-positive-edge bg-positive-soft px-5 py-4"
        >
          <RefreshCw className="mt-0.5 h-5 w-5 shrink-0 text-positive-ink" />
          <p className="text-sm leading-relaxed text-positive-ink">
            <span className="font-semibold">Comp reviews twice a year</span> — against clear criteria,
            not "we'll see." You can grow your pay without changing companies.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
