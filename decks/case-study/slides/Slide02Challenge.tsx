import { motion } from 'framer-motion'
import { AlertTriangle, Check } from 'lucide-react'
import { Card, Kicker, SlideShell } from '../kit/components'
import { CHALLENGES, CUSTOMER, getProspect } from './content'
import type { SlideProps } from './index'

/** The challenge: the customer's pains on the left, the prospect's on the right. */
export default function Slide02Challenge({ personalization }: SlideProps) {
  const { companyName, pains } = getProspect(personalization)

  return (
    <SlideShell width="wide">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Kicker>The challenge</Kicker>
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
          Support couldn't keep up with the orders
        </h2>
      </motion.div>

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
        >
          <p className="max-w-prose text-[15px] leading-relaxed text-ink-soft">{CUSTOMER.summary}</p>

          <div className="mt-7 space-y-3">
            {CHALLENGES.map((pain, index) => (
              <motion.div
                key={pain}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + index * 0.06 }}
                className="flex items-center gap-3 rounded-xl border border-critical-edge bg-critical-soft px-4 py-3"
              >
                <AlertTriangle className="h-4 w-4 shrink-0 text-critical" />
                <span className="text-sm font-medium text-ink">{pain}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
        >
          <Card title={`Where ${companyName} is today`} tone="accent">
            {pains.length > 0 ? (
              <ul className="space-y-2.5">
                {pains.map((line) => (
                  <li key={line} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-ink" />
                    <span className="text-sm text-ink-soft">{line}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm italic text-ink-faint">
                Ask us how this maps to your support volume.
              </p>
            )}
          </Card>
          <p className="mt-3 pl-1 text-xs leading-relaxed text-ink-faint">
            The same three questions surface in almost every support team we meet — the
            details differ, the shape rarely does.
          </p>
        </motion.div>
      </div>
    </SlideShell>
  )
}
