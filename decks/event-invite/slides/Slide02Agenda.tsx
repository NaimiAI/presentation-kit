import { motion } from 'framer-motion'
import { AGENDA } from './content'
import type { SlideProps } from './index'

const speakers = [
  { name: 'Chris Novak', role: 'VP Revenue, scaled two SaaS teams past $50M' },
  { name: 'Nina Alvarez', role: 'Founder & CEO, 3x go-to-market leader' },
]

function speakerInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
}

export default function Slide02Agenda(_props: SlideProps) {
  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-4xl px-6 py-12 md:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="text-sm uppercase tracking-[0.35em] text-accent-ink">Program</p>
          <h2 className="mt-4 font-display text-3xl font-black uppercase text-ink md:text-5xl">
            One evening, real conversations
          </h2>
        </motion.div>

        <div className="divide-y divide-edge border-y border-edge">
          {AGENDA.map((item, index) => (
            <motion.div
              key={`${item.time}-${item.topic}`}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.08 }}
              className="grid grid-cols-[4.5rem_1fr] items-baseline gap-x-6 gap-y-1 py-5 md:grid-cols-[5rem_1fr_auto]"
            >
              <span className="font-display text-xl font-black tabular-nums text-accent-ink">{item.time}</span>
              <p className="text-base font-medium text-ink md:text-lg">{item.topic}</p>
              {item.speaker && (
                <span className="col-start-2 text-sm text-ink-faint md:col-start-3 md:text-right">{item.speaker}</span>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-10 flex flex-wrap gap-6"
        >
          {speakers.map((speaker) => (
            <div key={speaker.name} className="flex items-center gap-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full font-bold"
                style={{ background: 'var(--nk-accent)', color: 'var(--nk-surface)' }}
              >
                {speakerInitials(speaker.name)}
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{speaker.name}</p>
                <p className="text-xs text-ink-faint">{speaker.role}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
