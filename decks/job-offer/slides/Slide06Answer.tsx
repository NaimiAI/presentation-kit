import { motion } from 'framer-motion'
import { MessageCircleHeart } from 'lucide-react'
import { Kicker } from '../kit/components'
import { useDemoField } from '../kit/hooks'
import { personalizationValue } from '../kit/host'
import OfferTextarea from './OfferTextarea'
import { formatDate } from './content'
import type { SlideProps } from './index'

const answerOptions = [
  { key: 'accept', label: 'Accept offer 🎉' },
  { key: 'questions', label: 'I have questions' },
  { key: 'thinking', label: 'Need a little time' },
]

/** Candidate replies right on the page: chips + a free-text question (self-fill). */
export default function Slide06Answer({ personalization }: SlideProps) {
  const [answer, setAnswer] = useDemoField<string>('candidateAnswer', { defaultValue: '' })
  const validUntilText = formatDate(personalizationValue(personalization, 'validUntil'))
  const recruiterName = personalizationValue(personalization, 'recruiterContact', 'your recruiter')

  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-3xl px-6 py-10 md:px-8">
        <Kicker>Your move</Kicker>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl font-extrabold tracking-tight text-ink md:text-5xl"
        >
          {validUntilText ? `This offer is valid through ${validUntilText}` : "We're excited to hear from you"}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 rounded-3xl border border-edge bg-card p-6 shadow-sm"
        >
          <p className="font-display text-lg font-bold text-ink">What do you think?</p>
          <p className="mt-1 text-xs text-ink-faint">
            tap again to clear your choice — it's fine to change your mind
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {answerOptions.map((option) => {
              const active = answer === option.key
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setAnswer(active ? '' : option.key)}
                  className={`rounded-full border px-6 py-3 text-sm font-semibold transition-all ${
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
          transition={{ delay: 0.32 }}
          className="mt-5 rounded-3xl border border-edge bg-card p-6 shadow-sm"
        >
          <p className="font-display text-lg font-bold text-ink">Any questions?</p>
          <p className="mb-4 mt-1 text-xs text-ink-faint">
            about the team, comp, equity, or the schedule — ask us anything
          </p>
          <OfferTextarea
            fieldKey="candidateQuestion"
            placeholder="Write it right here — we'll get back to you personally…"
            rows={3}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-6 flex items-start gap-3 rounded-3xl border border-positive-edge bg-positive-soft px-5 py-4"
        >
          <MessageCircleHeart className="mt-0.5 h-5 w-5 shrink-0 text-positive-ink" />
          <p className="text-sm leading-relaxed text-positive-ink">
            Your reply saves itself — nothing to submit. Reach out anytime:{' '}
            <span className="font-semibold">{recruiterName}</span>.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
