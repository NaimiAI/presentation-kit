import { motion } from 'framer-motion'
import SectionHeading from './SectionHeading'
import type { SlideProps } from './index'

const phases = [
  {
    numeral: 'I',
    title: 'Discovery',
    text: 'Team interviews, an audit of the current site and its metrics, and a competitive review.',
    term: 'weeks 1–2',
  },
  {
    numeral: 'II',
    title: 'Concept',
    text: 'Structure, prototypes of the key pages, and sign-off on the design direction.',
    term: 'weeks 2–3',
  },
  {
    numeral: 'III',
    title: 'Design & build',
    text: 'Design system, layouts, responsive build, and CMS integration.',
    term: 'weeks 4–6',
  },
  {
    numeral: 'IV',
    title: 'Launch',
    text: 'Testing, content migration, team training, and handoff of access.',
    term: 'week 7',
  },
]

export default function Slide03Process(_props: SlideProps) {
  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-5xl px-6 py-12 md:px-8">
        <SectionHeading
          index="02"
          title="How we work"
          lead="Every stage closes with a demo and a written recap — you always know which week the project is in and what comes next."
        />

        <div className="divide-y divide-ink/10 border-y border-ink/20">
          {phases.map((phase, index) => (
            <motion.div
              key={phase.numeral}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="grid grid-cols-[3rem_1fr] items-baseline gap-x-4 gap-y-1 py-6 md:grid-cols-[4rem_1fr_auto]"
            >
              <span className="font-display text-2xl md:text-3xl text-accent-ink/70">{phase.numeral}</span>
              <div>
                <h3 className="font-display text-xl md:text-2xl text-ink">{phase.title}</h3>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink-soft">{phase.text}</p>
              </div>
              <span className="col-start-2 text-xs uppercase tracking-[0.2em] text-ink-faint md:col-start-3 md:text-right">
                {phase.term}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="mt-8 max-w-2xl text-sm leading-relaxed text-ink-faint"
        >
          What we’ll need from you: a point of contact on the business side, access to
          your analytics, and two 30-minute calls a week. We handle the rest.
        </motion.p>
      </div>
    </div>
  )
}
