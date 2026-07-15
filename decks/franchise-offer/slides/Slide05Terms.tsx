import { motion } from 'framer-motion'
import { MessageSquareQuote, ShieldCheck } from 'lucide-react'
import { Kicker, StatCard } from '../kit/components'
import { personalizationValue } from '../kit/host'
import { ENTRY, FRANCHISE, INVESTMENT_BREAKDOWN, INVESTMENT_MID, formatUsd } from './content'
import type { SlideProps } from './index'

const steps = [
  { title: 'Discovery call', text: '30 minutes on you and the numbers' },
  { title: 'FDD review', text: 'the disclosure document, no obligation' },
  { title: 'Discovery day', text: 'visit HQ, meet the team, tour a location' },
  { title: 'Signing', text: 'agreement, fee and a protected territory' },
  { title: 'Open in 90 days', text: 'site, buildout, training and opening' },
]

/** Terms, steps to open, personal note and the franchise director. */
export default function Slide05Terms({ personalization }: SlideProps) {
  const personalNote = personalizationValue(personalization, 'personalNote')
  const managerName = personalizationValue(personalization, 'managerName', 'Franchise director')
  const managerContact = personalizationValue(personalization, 'managerContact')

  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-5xl px-6 py-10 md:px-8">
        <Kicker>Terms to sign on</Kicker>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl font-extrabold tracking-tight text-ink md:text-4xl"
        >
          Clear terms — no hidden fees
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-7 grid gap-4 sm:grid-cols-3"
        >
          <StatCard label="Franchise fee" value={formatUsd(ENTRY.franchiseFee)} sub="brand, standards, training" />
          <StatCard label="Royalty + brand fund" value="6% + 2%" sub="of gross sales" />
          <StatCard label="Total investment" value="$285k–$420k" sub="turnkey, all-in" accent />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-5 rounded-3xl border border-edge bg-card p-5 shadow-sm md:px-6"
        >
          <p className="text-sm font-medium uppercase tracking-wider text-ink-faint">What the investment covers</p>
          <div className="mt-3 space-y-2.5">
            {INVESTMENT_BREAKDOWN.map((item, index) => {
              const share = (item.value / INVESTMENT_MID) * 100
              return (
                <div key={item.label} className="flex items-center gap-4">
                  <span className="w-48 shrink-0 text-sm text-ink-soft">{item.label}</span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(share, 100)}%` }}
                      transition={{ delay: 0.4 + index * 0.12, duration: 0.5 }}
                      className="h-full rounded-full"
                      style={{ background: 'var(--nk-gradient)' }}
                    />
                  </div>
                  <span className="w-24 shrink-0 text-right text-sm font-semibold tabular-nums text-ink">
                    {formatUsd(item.value)}
                  </span>
                </div>
              )
            })}
          </div>
          <p className="mt-3 text-xs text-ink-faint">Midpoint of the {formatUsd(ENTRY.investmentLow)}–{formatUsd(ENTRY.investmentHigh)} range; the final number depends on your space and market.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-7"
        >
          <p className="text-sm font-medium uppercase tracking-wider text-ink-faint">Five steps to opening</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 md:grid-cols-5">
            {steps.map((step, index) => (
              <div key={step.title} className="flex gap-3 md:block">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold text-white" style={{ background: 'var(--nk-gradient)' }}>
                  {index + 1}
                </div>
                <div className="md:mt-3">
                  <p className="font-display text-base font-bold text-ink">{step.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-soft">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.42 }}
          className="mt-6 flex items-start gap-3 rounded-2xl border border-positive-edge bg-positive-soft px-5 py-4"
        >
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-positive-ink" />
          <p className="text-sm leading-relaxed text-positive-ink">
            Every location gets a <span className="font-semibold">protected territory</span> — we
            won't open or license another {FRANCHISE.name} inside your radius.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-5 md:grid-cols-[1.4fr_1fr]">
          {personalNote ? (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="rounded-3xl border border-accent-edge bg-accent-soft p-6"
            >
              <div className="flex items-center gap-2 text-accent-ink">
                <MessageSquareQuote className="h-4 w-4" />
                <p className="text-xs font-semibold uppercase tracking-wider">A personal note</p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink">{personalNote}</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="rounded-3xl border border-edge bg-card p-6 shadow-sm"
            >
              <p className="text-sm leading-relaxed text-ink-soft">
                Next step is simple: a short discovery call on your city and the numbers from the
                calculator — no obligation.
              </p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="flex flex-col rounded-3xl border border-edge bg-card p-6 text-center shadow-sm"
          >
            <div
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-full font-display text-lg font-bold text-white"
              style={{ background: 'var(--nk-gradient)' }}
            >
              {managerName.trim().charAt(0).toUpperCase() || 'D'}
            </div>
            <p className="mt-3 font-display text-lg font-bold text-ink">{managerName}</p>
            <p className="text-xs text-ink-faint">franchising · {FRANCHISE.name}</p>
            {managerContact && (
              <p className="mt-3 rounded-2xl bg-surface px-4 py-2.5 text-sm font-semibold text-accent-ink">
                {managerContact}
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
