import { motion } from 'framer-motion'
import { getOffer } from './content'
import type { SlideProps } from './index'

const promises = [
  { title: 'Fixed-price scope', text: 'The price per stage is locked in the contract — no mid-project surprises.' },
  { title: 'Transparent timeline', text: 'Weekly status: what shipped, what’s next, where we need a call from your side.' },
  { title: 'Outcomes, not hours', text: 'Every stage closes with sign-off against criteria agreed up front.' },
]

/** Our understanding of the problem + what the client gets. */
export default function Slide02Scope({ personalization }: SlideProps) {
  const offer = getOffer(personalization)

  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-5xl px-6 py-12 md:px-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-baseline gap-6 border-b-4 border-ink pb-4">
          <span className="font-display text-5xl font-black tracking-tighter text-accent">01</span>
          <h2 className="font-display text-3xl font-black uppercase tracking-tight text-ink md:text-4xl">
            The problem
          </h2>
        </motion.div>

        <div className="mt-10 grid gap-12 md:grid-cols-[1.2fr_1fr]">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <p className="text-[11px] uppercase tracking-[0.25em] text-ink-faint">How we read it</p>
            <p className="mt-4 text-lg leading-relaxed text-ink md:text-xl">
              {offer.projectOverview}
            </p>
            <p className="mt-6 border-l-4 border-accent pl-4 text-sm leading-relaxed text-ink-soft">
              If we got anything wrong, tell your account owner and we’ll send an
              updated proposal the same day.
            </p>
          </motion.div>

          <div className="space-y-0">
            {promises.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="border-t-2 border-ink py-5 last:border-b-2"
              >
                <p className="font-display text-base font-black uppercase tracking-tight text-ink">
                  {item.title}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
