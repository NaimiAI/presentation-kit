import { motion } from 'framer-motion'
import { Orbs } from '../kit/components'
import { EVENT } from './content'
import type { SlideProps } from './index'
import eventStage from '../assets/event-stage.webp'

/** Poster: the event + "sponsorship package for {company}". */
export default function Slide01Poster({ personalization }: SlideProps) {
  const companyName = personalization.companyName.trim() || 'your brand'

  return (
    <div className="relative min-h-full w-full overflow-hidden bg-surface pb-24">
      {/* Full-bleed stage photo, dimmed and graded into the velvet-night palette
          so the poster type stays the hero on top of it. */}
      <img
        src={eventStage}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(23,16,41,0.72) 0%, rgba(23,16,41,0.86) 55%, rgba(23,16,41,0.97) 100%)',
        }}
      />
      <Orbs />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: 'rgba(245, 158, 11, 0.1)' }}
      />
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-6rem)] max-w-4xl flex-col items-center justify-center px-6 py-12 text-center md:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs font-semibold uppercase tracking-[0.5em] text-ink-faint"
        >
          {EVENT.kind}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="mt-6 font-display text-6xl font-black uppercase leading-[0.9] tracking-tight text-ink md:text-8xl"
        >
          Forward
          <span className="block bg-clip-text text-transparent" style={{ backgroundImage: 'var(--nk-gradient)' }}>
            Summit
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-ink-soft"
        >
          <span className="rounded-full border border-edge bg-card px-4 py-2 backdrop-blur-sm">{EVENT.date}</span>
          <span className="rounded-full border border-edge bg-card px-4 py-2 backdrop-blur-sm">{EVENT.place}</span>
          <span className="rounded-full border border-edge bg-card px-4 py-2 backdrop-blur-sm">1,200 attendees</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-14 border border-accent-edge bg-accent-soft px-8 py-5 backdrop-blur-sm"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-accent-ink">
            Sponsorship package for
          </p>
          <p className="mt-2 font-display text-2xl font-bold text-ink md:text-3xl">
            {companyName}
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 max-w-md text-sm leading-relaxed text-ink-faint"
        >
          Three ways to partner, a room full of product and growth decision-makers,
          and clear returns — the details are on the next four screens.
        </motion.p>
      </div>
    </div>
  )
}
