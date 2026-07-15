import { motion } from 'framer-motion'
import { SENDER, getOffer } from './content'
import type { SlideProps } from './index'

const fallbackConditions = [
  'Payment: 50% to start, 50% on acceptance · Net 15',
  'Weekly status call and a written progress report',
  'Two revision rounds included on every stage',
]

/** Terms, contacts, and the document "signature". */
export default function Slide05Terms({ personalization }: SlideProps) {
  const offer = getOffer(personalization)
  const conditions = offer.workConditions.length > 0 ? offer.workConditions : fallbackConditions

  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-5xl px-6 py-12 md:px-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-baseline gap-6 border-b-4 border-ink pb-4">
          <span className="font-display text-5xl font-black tracking-tighter text-accent">04</span>
          <h2 className="font-display text-3xl font-black uppercase tracking-tight text-ink md:text-4xl">
            Terms
          </h2>
        </motion.div>

        <div className="mt-10 grid gap-12 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-ink-faint">Working terms</p>
            <div className="mt-4">
              {conditions.map((line, index) => (
                <motion.div
                  key={`${line}-${index}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.08 }}
                  className="flex gap-4 border-b border-edge py-3.5 text-sm leading-relaxed text-ink"
                >
                  <span className="font-display font-black text-accent">/</span>
                  <span>{line}</span>
                </motion.div>
              ))}
            </div>

            {offer.validUntilText && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 inline-block border-2 border-accent px-5 py-3"
              >
                <p className="font-display text-sm font-black uppercase tracking-widest text-accent">
                  {/* Keep the phrase on one line so the date doesn't orphan onto its own row. */}
                  {`This proposal is valid through ${offer.validUntilText}`.replace(/ /g, ' ')}
                </p>
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="border-t-2 border-ink pt-5"
          >
            <p className="text-[11px] uppercase tracking-[0.25em] text-ink-faint">Prepared by</p>
            <p className="mt-3 font-display text-xl font-black uppercase tracking-tight text-ink">{SENDER.name}</p>
            <p className="text-sm text-ink-soft">{SENDER.tagline}</p>

            <div className="mt-6 space-y-1 text-sm text-ink">
              {offer.managerName && <p className="font-semibold">{offer.managerName}</p>}
              {offer.managerContact && <p className="text-ink-soft">{offer.managerContact}</p>}
              <p className="text-ink-soft">{SENDER.contact}</p>
              <p className="text-ink-soft">{SENDER.phone}</p>
            </div>

            <div className="mt-8 border-t border-edge pt-4">
              <p className="text-xs leading-relaxed text-ink-faint">
                Happy to walk through the details and tune the estimate to your budget.
                Reply to the email or message your account owner — a call takes 20 minutes.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
