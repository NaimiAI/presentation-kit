import { motion } from 'framer-motion'
import { ArrowRight, CalendarCheck2 } from 'lucide-react'
import { useDemoField } from '../kit/hooks'
import { AGENT, getListing } from './content'
import type { SlideProps } from './index'

const PATH = [
  { title: 'Walkthrough & prep list', detail: 'I tour the home and leave a room-by-room punch list.' },
  { title: 'Sign the listing agreement', detail: 'We lock the price, timeline and marketing plan.' },
  { title: 'Launch in ~2 weeks', detail: 'Photos, staging and a full-market launch weekend.' },
]

const TIMELINE_OPTIONS = [
  { key: 'asap', label: 'ASAP' },
  { key: '1-3', label: '1–3 months' },
  { key: '3-6', label: '3–6 months' },
  { key: 'exploring', label: 'Just exploring' },
]

/** Numbered path (left) + seller self-fill card with a CTA (right). */
export default function Slide06Next({ personalization }: SlideProps) {
  const { sellerNames, bookingUrl } = getListing(personalization)

  const [timeline, setTimeline] = useDemoField<string>('moveTimeline', { defaultValue: '' })
  const [questions, setQuestions] = useDemoField<string>('sellerQuestions', { defaultValue: '' })

  const firstName = sellerNames === 'the owners' ? '' : sellerNames

  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-5xl px-6 py-14 md:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-[11px] font-semibold uppercase tracking-[0.4em]"
          style={{ color: 'var(--estate-brass)' }}
        >
          Next steps
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.6 }}
          className="mt-4 font-display text-3xl leading-snug text-ink md:text-4xl"
        >
          {firstName ? `${firstName}, here's how we start` : "Here's how we start"}
        </motion.h2>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.05fr]">
          {/* Path */}
          <div className="space-y-4">
            {PATH.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + index * 0.1, duration: 0.5 }}
                className="flex items-start gap-4"
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-base text-white"
                  style={{ background: 'var(--nk-gradient)' }}
                >
                  {index + 1}
                </div>
                <div className="pt-0.5">
                  <p className="font-display text-lg text-ink">{step.title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">{step.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Self-fill card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="rounded-2xl border border-edge bg-card p-6 shadow-sm md:p-7"
          >
            <p className="font-display text-xl text-ink">Tell me about your timeline</p>

            <div className="mt-4 flex flex-wrap gap-2.5">
              {TIMELINE_OPTIONS.map((option) => {
                const active = timeline === option.key
                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setTimeline(active ? '' : option.key)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
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

            <label className="mt-6 block text-sm font-medium text-ink-soft" htmlFor="seller-questions">
              Questions before we talk?
            </label>
            <input
              id="seller-questions"
              type="text"
              value={questions}
              onChange={(event) => setQuestions(event.target.value)}
              placeholder="Anything on your mind…"
              className="mt-2 w-full rounded-xl border border-edge bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
            />

            <p className="mt-3 text-xs text-ink-faint">Your answers reach me instantly.</p>

            {bookingUrl ? (
              <a
                href={bookingUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Book your walkthrough
                <ArrowRight className="h-4 w-4" />
              </a>
            ) : (
              <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-accent-soft px-5 py-3.5 text-sm font-medium text-accent-ink">
                <CalendarCheck2 className="h-4 w-4" />
                Call or text {AGENT.name.split(' ')[0]} at {AGENT.phone}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
