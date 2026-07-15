import { motion } from 'framer-motion'
import { personalizationValue } from '../kit/host'
import type { SlideProps } from './index'

/** Cover: a gallery sheet — oversized serif, hairline rules, an issue number. */
export default function Slide01Cover({ personalization }: SlideProps) {
  const companyName = personalization.companyName.trim() || 'your brand'
  const contactName = personalizationValue(personalization, 'contactName')

  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-4xl flex-col px-6 py-12 md:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-baseline justify-between border-b border-edge pb-4 text-xs uppercase tracking-[0.3em] text-ink-faint"
        >
          <span>format &amp; co</span>
          <span>no. 2026 / 07</span>
        </motion.div>

        <div className="flex flex-1 flex-col justify-center py-10">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="font-display text-7xl lowercase italic leading-[0.95] tracking-tight text-ink md:text-9xl"
          >
            the brief<span className="text-accent">.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 max-w-lg font-display text-2xl leading-snug text-ink md:text-3xl"
          >
            a conversation about <span className="italic text-accent-ink">{companyName}</span> —
            before the first sketch
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-8 max-w-md text-sm leading-relaxed text-ink-soft"
          >
            {contactName ? `${contactName}, there are` : 'There are'} no right answers here — write
            it the way you feel it. Everything saves itself; come back and add more anytime.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-3 gap-6 border-t border-edge pt-4 text-[11px] uppercase tracking-[0.25em] text-ink-faint"
        >
          <span>01 — the brand</span>
          <span>02 — the mood</span>
          <span>03 — scope &amp; limits</span>
        </motion.div>
      </div>
    </div>
  )
}
