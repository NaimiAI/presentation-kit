import { motion } from 'framer-motion'
import { ArrowRight, CalendarCheck } from 'lucide-react'
import { useDemoField } from '../kit/hooks'
import { personalizationValue } from '../kit/host'
import engagement from '../assets/port-engagement.webp'
import { STUDIO } from './content'
import type { SlideProps } from './index'

const timeline = [
  { when: 'Book your date', what: 'A 30% retainer holds your date on my calendar.' },
  { when: 'Engagement session', what: 'A relaxed shoot a few months out (if included).' },
  { when: 'The wedding day', what: 'I photograph the day as it unfolds.' },
  { when: 'Sneak peek in 72h', what: 'A first handful of images while it’s all still fresh.' },
  { when: 'Full gallery in 6 weeks', what: 'Every keeper, edited and ready to share and print.' },
  { when: 'Album design', what: 'We design your heirloom album together (if included).' },
]

const flexOptions = [
  { key: 'set', label: 'Date is set' },
  { key: 'shift', label: 'Might shift' },
]

/** How it works + booking, with the couple's self-fill and a live availability note. */
export default function Slide05Booking({ personalization }: SlideProps) {
  const [dateFlexible, setDateFlexible] = useDemoField<string>('dateFlexible', { defaultValue: '' })
  const [questions, setQuestions] = useDemoField<string>('couplesQuestions', { defaultValue: '' })

  const availabilityNote = personalizationValue(personalization, 'availabilityNote')
  const bookingUrl = personalizationValue(personalization, 'bookingUrl')
  const couple = personalization.companyName.trim()

  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-6xl px-6 py-14 md:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[11px] uppercase tracking-[0.4em] text-accent-ink"
        >
          How it works
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 font-display text-3xl leading-tight text-ink md:text-5xl"
        >
          From held date to heirloom album
        </motion.h2>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1fr_1fr]">
          {/* Timeline */}
          <div className="border-t border-edge">
            {timeline.map((step, index) => (
              <motion.div
                key={step.when}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + index * 0.08 }}
                className="grid gap-1 border-b border-edge py-4 sm:grid-cols-[42px_1fr]"
              >
                <span className="font-display text-lg italic text-accent-ink">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <p className="font-display text-lg text-ink">{step.when}</p>
                  <p className="mt-0.5 text-sm text-ink-soft">{step.what}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Image + self-fill + booking */}
          <div className="grid gap-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="photo-mat overflow-hidden rounded-sm"
            >
              <div className="overflow-hidden rounded-sm">
                <img src={engagement} alt="An engagement session portrait" className="aspect-[3/4] w-full object-cover" />
              </div>
            </motion.div>

            {/* Self-fill card */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-sm border border-edge bg-card p-6"
            >
              <p className="font-display text-xl text-ink">Almost there</p>

              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-ink-faint">Is your date locked in?</p>
              <div className="mt-2.5 flex flex-wrap gap-2.5">
                {flexOptions.map((option) => {
                  const active = dateFlexible === option.key
                  return (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setDateFlexible(active ? '' : option.key)}
                      className={`rounded-full border px-4 py-1.5 text-sm transition-all ${
                        active
                          ? 'border-accent bg-accent text-card'
                          : 'border-edge bg-surface text-ink-soft hover:border-accent-edge'
                      }`}
                    >
                      {option.label}
                    </button>
                  )
                })}
              </div>

              <p className="mt-5 text-xs uppercase tracking-[0.2em] text-ink-faint">Anything you want to ask?</p>
              <textarea
                value={questions}
                onChange={(event) => setQuestions(event.target.value)}
                placeholder="Two ceremonies, a surprise first dance, travel — tell me anything."
                rows={3}
                className="mt-2 w-full resize-none rounded-sm border border-edge bg-surface px-3 py-2 text-sm leading-relaxed text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-accent"
              />
            </motion.div>

            {availabilityNote && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-start gap-3 rounded-sm border border-accent-edge bg-accent-soft p-5"
              >
                <CalendarCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent-ink" />
                <p className="text-sm leading-relaxed text-accent-ink">{availabilityNote}</p>
              </motion.div>
            )}

            {bookingUrl ? (
              <motion.a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-accent px-6 py-3.5 text-base font-semibold text-card transition-opacity hover:opacity-90"
              >
                Reserve your date
                <ArrowRight className="h-4 w-4" />
              </motion.a>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-sm leading-relaxed text-ink-soft"
              >
                {couple ? `${couple}, when` : 'When'} you're ready, reach out to {STUDIO.photographer} at{' '}
                <span className="text-ink">hello@wrenandfield.co</span> or{' '}
                <span className="text-ink">(415) 555-0142</span> and we'll get your date on the calendar.
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
