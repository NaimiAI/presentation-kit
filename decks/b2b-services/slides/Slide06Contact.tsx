import { motion } from 'framer-motion'
import { FIRM, getContext } from './content'
import type { SlideProps } from './index'

/** Close: the next step and the partner's contact details. */
export default function Slide06Contact({ personalization }: SlideProps) {
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

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-10 max-w-3xl font-display text-3xl leading-snug text-ink md:text-5xl"
        >
          Next step — a one-hour working session
          <br />
          on the <span className="italic text-accent-ink">{ctx.companyName}</span> pipeline
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft"
        >
          We'll dig into the items from slide two, walk you through a comparable case from the
          inside, and tell you honestly where we can help and where you're fine without us. Free,
          no strings.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-12 border border-accent-edge bg-accent-soft px-10 py-6"
        >
          {ctx.managerName && <p className="font-display text-xl text-ink">{ctx.managerName}</p>}
          <p className="mt-1 text-sm text-ink-soft">engagement partner · {FIRM.name}</p>
          {ctx.managerContact && (
            <p className="mt-3 text-sm font-medium tracking-wide text-accent-ink">{ctx.managerContact}</p>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 text-xs uppercase tracking-[0.3em] text-ink-faint"
        >
          {FIRM.contact} · {FIRM.phone}
        </motion.p>
      </div>
    </div>
  )
}
