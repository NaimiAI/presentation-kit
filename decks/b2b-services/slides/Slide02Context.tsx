import { motion } from 'framer-motion'
import { getContext } from './content'
import type { SlideProps } from './index'

const fallbackPains = [
  'Fill in the "What we heard" field when you create the presentation — the client\'s challenges, in their own words, land right here.',
]

/** Context: what we heard from the client — a numbered serif list. */
export default function Slide02Context({ personalization }: SlideProps) {
  const ctx = getContext(personalization)
  const pains = ctx.painPoints.length > 0 ? ctx.painPoints : fallbackPains

  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-4xl px-6 py-10 md:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs uppercase tracking-[0.45em] text-accent-ink"
        >
          Context
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 font-display text-3xl leading-snug text-ink md:text-5xl"
        >
          What we heard from {ctx.companyName}
        </motion.h2>

        <div className="mt-8 space-y-0">
          {pains.map((pain, index) => (
            <motion.div
              key={`${pain}-${index}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.12 }}
              className="flex gap-8 border-t border-edge py-6 last:border-b"
            >
              <span className="font-display text-3xl italic text-accent-ink">{`0${index + 1}`}</span>
              <p className="max-w-2xl text-base leading-relaxed text-ink md:text-lg">{pain}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 max-w-2xl text-sm leading-relaxed text-ink-faint"
        >
          If we've got any of this wrong, set us straight on our call. We always start a
          diagnostic by pressure-testing these with data — not with a canned solution.
        </motion.p>
      </div>
    </div>
  )
}
