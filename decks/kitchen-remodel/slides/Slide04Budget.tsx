import { motion } from 'framer-motion'
import { MessageCircleHeart } from 'lucide-react'
import { useDemoField } from '../kit/hooks'
import type { SlideProps } from './index'

// Budget chips store a representative midpoint in the number field, so the answer
// still promotes to the client card as a usable figure.
const budgetOptions = [
  { value: 40000, label: '$30–50k' },
  { value: 65000, label: '$50–80k' },
  { value: 90000, label: '$80k+' },
]

const timingOptions = [
  { key: 'asap', label: 'ASAP' },
  { key: 'quarter', label: '1–3 months' },
  { key: 'half', label: '3–6 months' },
  { key: 'exploring', label: 'Just exploring' },
]

/** Two questions for the client: budget and timeline — answers are saved (self-fill). */
export default function Slide04Budget(_: SlideProps) {
  const [budget, setBudget] = useDemoField<number>('clientBudget', { defaultValue: 0 })
  const [timing, setTiming] = useDemoField<string>('projectTiming', { defaultValue: '' })

  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-3xl px-6 py-10 md:px-8">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs uppercase tracking-[0.35em] text-accent-ink">
          Two questions from your designer
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 font-display text-3xl leading-snug text-ink md:text-5xl"
        >
          Help us tailor the options
          <br />
          <span className="italic text-accent-ink">to you</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-8 rounded-3xl border border-edge bg-card p-6 shadow-sm"
        >
          <p className="font-display text-lg text-ink">What budget are you working toward?</p>
          <p className="mt-1 text-xs text-ink-faint">
            we'll fit the materials to your budget — not the other way around
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {budgetOptions.map((option) => {
              const active = budget === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setBudget(active ? 0 : option.value)}
                  className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? 'border-accent bg-accent text-white shadow-sm'
                      : 'border-edge bg-card text-ink-soft hover:border-accent-edge'
                  }`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          className="mt-5 rounded-3xl border border-edge bg-card p-6 shadow-sm"
        >
          <p className="font-display text-lg text-ink">When are you planning the remodel?</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {timingOptions.map((option) => {
              const active = timing === option.key
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setTiming(active ? '' : option.key)}
                  className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? 'border-accent bg-accent text-white shadow-sm'
                      : 'border-edge bg-card text-ink-soft hover:border-accent-edge'
                  }`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex items-start gap-3 rounded-3xl border border-positive-edge bg-positive-soft px-5 py-4"
        >
          <MessageCircleHeart className="mt-0.5 h-5 w-5 shrink-0 text-positive-ink" />
          <p className="text-sm leading-relaxed text-positive-ink">
            Your answers save right here on this page — nothing to send. Your designer sees them and
            shows up to the call with two or three options that already fit.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
