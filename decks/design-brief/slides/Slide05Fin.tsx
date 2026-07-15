import { motion } from 'framer-motion'
import { personalizationValue } from '../kit/host'
import type { SlideProps } from './index'

/** Closer: thank you, what happens next, the art director's contact. */
export default function Slide05Fin({ personalization }: SlideProps) {
  const managerName = personalizationValue(personalization, 'managerName', 'your art director')
  const managerContact = personalizationValue(personalization, 'managerContact')

  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-3xl flex-col justify-center px-6 py-12 md:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-6xl lowercase italic leading-none text-ink md:text-8xl"
        >
          thank you<span className="text-accent">.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 max-w-lg font-display text-xl leading-relaxed text-ink md:text-2xl"
        >
          Your answers are saved. Now it's our turn to get to work.
        </motion.p>

        <div className="mt-12 space-y-0 border-t border-edge">
          {[
            ['within a day', 'your art director reads the brief and follows up with a few questions'],
            ['in 3–4 days', "we'll come back with a direction, a scope of work and an estimate"],
            ['then', "a 30-minute call — and if we're a fit, we start"],
          ].map(([when, what], index) => (
            <motion.div
              key={when}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.12 }}
              className="grid gap-2 border-b border-edge py-5 sm:grid-cols-[160px_1fr]"
            >
              <span className="text-xs uppercase tracking-[0.25em] text-accent-ink">{when}</span>
              <span className="text-sm leading-relaxed text-ink-soft">{what}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 flex flex-wrap items-baseline justify-between gap-4"
        >
          <div>
            <p className="font-display text-xl lowercase text-ink">{managerName}</p>
            {managerContact && <p className="mt-1 text-sm text-ink-soft">{managerContact}</p>}
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-ink-faint">format &amp; co · formatandco.studio</p>
        </motion.div>
      </div>
    </div>
  )
}
