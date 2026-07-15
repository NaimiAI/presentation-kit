import { motion } from 'framer-motion'
import { FIRM, getContext } from './content'
import type { SlideProps } from './index'

/** Cover: a spare serif composition with gold hairlines. */
export default function Slide01Cover({ personalization }: SlideProps) {
  const ctx = getContext(personalization)

  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-4xl flex-col items-center justify-center px-6 py-12 text-center md:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-px w-24"
          style={{ background: 'var(--nk-gradient)' }}
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-6 text-xs uppercase tracking-[0.45em] text-accent-ink"
        >
          {FIRM.name}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10 font-display text-4xl leading-tight text-ink md:text-6xl"
        >
          A revenue-operations proposal
          <br />
          for <span className="italic text-accent-ink">{ctx.companyName}</span>
        </motion.h1>

        {ctx.industry && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-6 text-base text-ink-soft md:text-lg"
          >
            {ctx.industry}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex items-center gap-6 text-xs uppercase tracking-[0.3em] text-ink-faint"
        >
          <span className="h-px w-10 bg-edge" />
          <span>{FIRM.tagline}</span>
          <span className="h-px w-10 bg-edge" />
        </motion.div>

        {ctx.contactName && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10 text-sm text-ink-soft"
          >
            Prepared for {ctx.contactName}
          </motion.p>
        )}
      </div>
    </div>
  )
}
