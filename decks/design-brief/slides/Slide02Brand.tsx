import { motion } from 'framer-motion'
import UnderlineField from './UnderlineField'
import type { SlideProps } from './index'

/** Section 01: the brand and references — free text from the client. */
export default function Slide02Brand({ personalization }: SlideProps) {
  const companyName = personalization.companyName.trim() || 'your brand'

  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-3xl px-6 py-14 md:px-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-baseline gap-6 border-b border-edge pb-5">
          <span className="font-display text-5xl italic text-accent">01</span>
          <h2 className="font-display text-3xl lowercase text-ink md:text-4xl">the brand</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-12"
        >
          <p className="font-display text-xl text-ink md:text-2xl">
            Tell us about {companyName} the way you'd introduce a close friend.
          </p>
          <p className="mt-2 text-sm text-ink-faint">
            what you do, who it's for, what you're proud of, what you'd rather hide — 3–5 sentences
          </p>
          <div className="mt-6">
            <UnderlineField
              fieldKey="brandEssence"
              placeholder="We make…"
              rows={5}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <p className="font-display text-xl text-ink md:text-2xl">What do you love — and what's a hard no?</p>
          <p className="mt-2 text-sm text-ink-faint">
            links to brands, sites, packaging; the anti-examples help even more
          </p>
          <div className="mt-6">
            <UnderlineField
              fieldKey="references"
              placeholder="Love… Can't stand…"
              rows={4}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
