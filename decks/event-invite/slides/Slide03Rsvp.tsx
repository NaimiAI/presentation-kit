import { motion } from 'framer-motion'
import { CalendarPlus, Check, ExternalLink, PlayCircle, Users, X } from 'lucide-react'
import { RangeField } from '../kit/components'
import { useDemoField } from '../kit/hooks'
import { EVENT_DEFAULTS, calendarUrl, getEvent } from './content'
import type { SlideProps } from './index'

/** RSVP: the reply and guest count save to the presentation — the host sees them right away. */
export default function Slide03Rsvp({ personalization }: SlideProps) {
  const event = getEvent(personalization)
  const [going, setGoing] = useDemoField<boolean>('rsvpGoing', { defaultValue: false })
  const [attendees, setAttendees] = useDemoField<number>('attendeeCount', { defaultValue: 2 })

  const safeAttendees = Math.min(20, Math.max(1, Math.round(Number(attendees) || 1)))
  const addToCalendar = calendarUrl(event.title, event.dateIso)

  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-4xl px-6 py-12 md:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="text-sm uppercase tracking-[0.35em] text-accent-ink">RSVP</p>
          <h2 className="mt-4 font-display text-3xl font-black uppercase text-ink md:text-5xl">
            Let us know you're in
          </h2>
          <p className="mt-3 text-ink-soft">
            Your reply saves right here — we'll hold seats
            {event.companyName && <> for {event.companyName}</>}.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6 rounded-2xl border border-edge bg-card p-6"
          >
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGoing(true)}
                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-4 text-sm font-bold uppercase tracking-wide transition-all ${
                  going
                    ? 'border-accent-edge shadow-lg'
                    : 'border-edge bg-surface/40 text-ink-faint hover:border-accent-edge/60'
                }`}
                style={going ? { background: 'var(--nk-accent)', color: 'var(--nk-surface)' } : undefined}
              >
                <Check className="h-4 w-4" />
                We'll be there
              </button>
              <button
                type="button"
                onClick={() => setGoing(false)}
                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-4 text-sm font-bold uppercase tracking-wide transition-all ${
                  going ? 'border-edge bg-surface/40 text-ink-faint hover:border-edge' : 'border-accent-edge bg-accent-soft text-accent-ink'
                }`}
              >
                <X className="h-4 w-4" />
                Still deciding
              </button>
            </div>

            {going && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <RangeField
                  label="How many guests"
                  value={safeAttendees}
                  min={1}
                  max={20}
                  step={1}
                  displayValue={String(safeAttendees)}
                  onChange={(value) => setAttendees(Math.round(value))}
                />
              </motion.div>
            )}

            <div className="flex items-start gap-3 border-t border-edge pt-4">
              <Users className="mt-0.5 h-4 w-4 shrink-0 text-accent-ink" />
              <p className="text-xs leading-relaxed text-ink-faint">
                Seating is limited to 60. Priority goes to guests who reply first.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            {event.joinUrl && (
              <a
                href={event.joinUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-2xl border border-accent-edge bg-accent-soft px-6 py-5 transition-all hover:shadow-lg"
              >
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-accent-ink">Confirm your seat</p>
                  <p className="mt-1 text-xs text-ink-soft">Details and directions inside</p>
                </div>
                <ExternalLink className="h-5 w-5 text-accent-ink transition-transform group-hover:translate-x-0.5" />
              </a>
            )}

            {addToCalendar && (
              <a
                href={addToCalendar}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-2xl border border-edge bg-card px-6 py-5 transition-all hover:border-accent-edge"
              >
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-ink">Add to calendar</p>
                  <p className="mt-1 text-xs text-ink-soft">Google Calendar, one click</p>
                </div>
                <CalendarPlus className="h-5 w-5 text-ink-soft transition-transform group-hover:translate-x-0.5" />
              </a>
            )}

            <a
              href={EVENT_DEFAULTS.pastRecordingUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between rounded-2xl border border-edge bg-card px-6 py-5 transition-all hover:border-accent-edge"
            >
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-ink">Last time</p>
                <p className="mt-1 text-xs text-ink-soft">Highlights from our last evening on YouTube</p>
              </div>
              <PlayCircle className="h-5 w-5 text-ink-soft transition-transform group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
