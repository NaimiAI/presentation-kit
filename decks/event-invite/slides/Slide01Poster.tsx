import { motion } from 'framer-motion'
import { CalendarDays, MapPin } from 'lucide-react'
import eventHero from '../assets/event-hero.webp'
import { EVENT_DEFAULTS, formatEventDate, getEvent } from './content'
import type { SlideProps } from './index'

/** Poster: bold typography over a moody rooftop photo, outlined line, tilted lime sticker. */
export default function Slide01Poster({ personalization }: SlideProps) {
  const event = getEvent(personalization)
  const titleWords = event.title.split(/\s+/).filter(Boolean)
  const splitAt = Math.ceil(titleWords.length / 2)
  const firstLine = titleWords.slice(0, splitAt).join(' ')
  const secondLine = titleWords.slice(splitAt).join(' ')

  return (
    <div className="relative min-h-full w-full overflow-hidden bg-surface pb-24 flex items-center">
      {/* Full-bleed hero photo at low opacity — the type stays the hero. */}
      <img
        src={eventHero}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover opacity-25"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(12,12,10,0.55) 0%, rgba(12,12,10,0.82) 100%)' }}
      />
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: 'var(--nk-gradient)' }}
      />
      <p
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-6 left-0 select-none whitespace-nowrap text-[18vw] font-black uppercase leading-none opacity-[0.06] text-ink"
      >
        invite · invite · invite
      </p>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-10 md:px-8">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm uppercase tracking-[0.35em] text-accent-ink"
        >
          Private event
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="mt-5 font-display font-black uppercase leading-[0.95] text-ink"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)' }}
        >
          {firstLine}
          {secondLine && (
            <>
              <br />
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: '2px var(--nk-accent)' }}
              >
                {secondLine}
              </span>
            </>
          )}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, rotate: -6, scale: 0.9 }}
          animate={{ opacity: 1, rotate: -3, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', damping: 14 }}
          className="mt-8 inline-block rounded-xl px-6 py-3 font-bold uppercase tracking-wide"
          style={{ background: 'var(--nk-accent)', color: 'var(--nk-surface)' }}
        >
          {formatEventDate(event.dateIso)}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-ink-soft"
        >
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-accent-ink" />
            {event.time}
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 text-accent-ink" />
            {EVENT_DEFAULTS.place}
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 border-t border-edge pt-5 text-base text-ink-soft"
        >
          A personal invitation
          {event.contactName && <> for <span className="font-semibold text-ink">{event.contactName}</span></>}
          {event.companyName && <> · {event.companyName}</>}
        </motion.p>
      </div>
    </div>
  )
}
