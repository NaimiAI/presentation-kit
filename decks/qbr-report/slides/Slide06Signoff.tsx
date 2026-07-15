import { motion } from 'framer-motion'
import { CalendarClock, Check, UserRound } from 'lucide-react'
import { Kicker } from '../kit/components'
import { useDemoField } from '../kit/hooks'
import { getReport } from './content'
import FeedbackTextarea from './FeedbackTextarea'
import type { SlideProps } from './index'

const RATINGS = [1, 2, 3, 4, 5]

/** Feedback & sign-off: client rating + notes (self-fill) and the next review. */
export default function Slide06Signoff({ personalization }: SlideProps) {
  const report = getReport(personalization)
  const [rating, setRating] = useDemoField<number>('qbrRating', { defaultValue: 0 })

  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-8">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Kicker>Feedback &amp; sign-off</Kicker>
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
            How did we do this quarter?
          </h2>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-edge bg-card p-6 shadow-sm"
          >
            <p className="font-display text-lg font-semibold text-ink">Rate the quarter</p>
            <p className="mt-1 text-xs text-ink-faint">Tap a number — 1 is rough, 5 is excellent.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {RATINGS.map((score) => {
                const active = rating === score
                return (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setRating(active ? 0 : score)}
                    className={`h-14 w-14 rounded-2xl border text-lg font-bold tabular-nums transition-all ${
                      active
                        ? 'border-accent bg-accent text-white shadow-sm'
                        : 'border-edge bg-card text-ink-soft hover:border-accent-edge'
                    }`}
                  >
                    {score}
                  </button>
                )
              })}
            </div>

            <p className="mt-7 font-display text-lg font-semibold text-ink">Anything we should change?</p>
            <p className="mb-4 mt-1 text-xs text-ink-faint">
              Priorities, cadence, reporting — tell us what would make next quarter better.
            </p>
            <FeedbackTextarea
              fieldKey="qbrFeedback"
              placeholder="Write it here — your account lead will read it before the call…"
              rows={4}
            />

            <div className="mt-4 flex items-center gap-2 text-xs text-ink-faint">
              <Check className="h-4 w-4 text-positive" />
              Your answers are saved automatically.
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="flex flex-col gap-4"
          >
            {report.nextReviewDate && (
              <div className="rounded-2xl border border-accent-edge bg-accent-soft p-5">
                <div className="flex items-center gap-2 text-accent-ink">
                  <CalendarClock className="h-5 w-5" />
                  <p className="text-xs font-semibold uppercase tracking-wider">Next review</p>
                </div>
                <p className="mt-2 font-display text-2xl font-bold text-ink">{report.nextReviewDate}</p>
              </div>
            )}

            <div className="rounded-2xl border border-edge bg-card p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-ink-soft">
                  <UserRound className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display text-base font-semibold text-ink">{report.managerName}</p>
                  {report.managerContact && (
                    <p className="text-sm text-ink-soft">{report.managerContact}</p>
                  )}
                </div>
              </div>
              {report.bookingUrl && (
                <a
                  href={report.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex w-full items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
                >
                  Book the review call
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
