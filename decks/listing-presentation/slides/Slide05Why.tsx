import { motion } from 'framer-motion'
import { Mail, Phone } from 'lucide-react'
import agentHeadshot from '../assets/agent-headshot.webp'
import { AGENT, CAREER_STATS, TESTIMONIAL } from './content'
import type { SlideProps } from './index'

/** Track record, a pull-quote and a static contact block for the agent. */
export default function Slide05Why(_: SlideProps) {
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
          Why {AGENT.name.split(' ')[0]}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.6 }}
          className="mt-4 font-display text-3xl leading-snug text-ink md:text-4xl"
        >
          A track record that speaks for itself
        </motion.h2>

        {/* Stat row */}
        <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {CAREER_STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.08, duration: 0.5 }}
              className="border-l-2 pl-4"
              style={{ borderColor: 'var(--estate-brass)' }}
            >
              <p className="font-display text-4xl tabular-nums text-ink md:text-5xl">{stat.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-ink-faint">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          {/* Testimonial */}
          <motion.figure
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="rounded-2xl border border-edge bg-card p-8 shadow-sm md:p-10"
          >
            <blockquote className="font-display text-2xl leading-snug text-ink md:text-3xl">
              &ldquo;{TESTIMONIAL.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-6 border-t border-edge pt-4 text-sm text-ink-soft">
              <span className="font-medium text-ink">{TESTIMONIAL.author}</span>
              <span className="mx-2 text-ink-faint">·</span>
              {TESTIMONIAL.neighborhood}
            </figcaption>
          </motion.figure>

          {/* Contact block */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col items-center rounded-2xl border border-accent-edge bg-card p-8 text-center shadow-sm"
          >
            <img
              src={agentHeadshot}
              alt=""
              className="h-20 w-20 rounded-full object-cover ring-1 ring-edge"
            />
            <p className="mt-4 font-display text-xl text-ink">{AGENT.name}</p>
            <p className="text-sm text-ink-faint">{AGENT.blurb}</p>
            <div className="mt-6 w-full space-y-2 border-t border-edge pt-5 text-sm">
              <a
                href={`tel:${AGENT.phone.replace(/[^\d]/g, '')}`}
                className="flex items-center justify-center gap-2 text-ink-soft"
              >
                <Phone className="h-4 w-4 text-accent-ink" />
                {AGENT.phone}
              </a>
              <a
                href={`mailto:${AGENT.email}`}
                className="flex items-center justify-center gap-2 text-ink-soft"
              >
                <Mail className="h-4 w-4 text-accent-ink" />
                {AGENT.email}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
