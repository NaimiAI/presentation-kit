import { motion } from 'framer-motion'
import type { SlideProps } from './index'
import eventNetworking from '../assets/event-networking.webp'

const stats = [
  { value: '1,200', label: 'in-person attendees', note: 'sold out two years running' },
  { value: '64%', label: 'director+ and founders', note: 'VPs of product, growth, and eng' },
  { value: '340', label: 'companies', note: 'from Fortune 500 to fast-growing startups' },
  { value: '25,000', label: 'livestream viewers', note: '+ on-demand replays' },
]

const profile = [
  'SaaS & product companies',
  'Growth & marketing teams',
  'Fintech & payments',
  'Developer tools',
]

/** The event audience in numbers. */
export default function Slide02Audience(_: SlideProps) {
  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-5xl px-6 py-14 md:px-8">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-semibold uppercase tracking-[0.4em] text-accent-ink">
          Audience
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 max-w-2xl font-display text-3xl font-extrabold leading-tight text-ink md:text-5xl"
        >
          Two days beside the people who make the call
        </motion.h2>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.1 }}
              className="rounded-2xl border border-edge bg-card p-6 backdrop-blur-sm"
            >
              <p
                className="font-display text-4xl font-black tabular-nums bg-clip-text text-transparent"
                style={{ backgroundImage: 'var(--nk-gradient)' }}
              >
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-semibold text-ink">{stat.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-faint">{stat.note}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 overflow-hidden rounded-2xl border border-edge"
        >
          <div className="relative aspect-[16/6]">
            <img src={eventNetworking} alt="Attendees networking at the summit" className="h-full w-full object-cover" />
            {/* Aubergine wash keeps the photo inside the velvet-night palette. */}
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{ background: 'linear-gradient(90deg, rgba(23,16,41,0.55) 0%, rgba(23,16,41,0.15) 45%, rgba(23,16,41,0.55) 100%)' }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-ink-faint">Who's in the room</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {profile.map((item) => (
              <span key={item} className="rounded-full border border-edge bg-card px-5 py-2.5 text-sm text-ink-soft">
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
