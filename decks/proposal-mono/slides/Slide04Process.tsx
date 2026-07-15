import { motion } from 'framer-motion'
import { getOffer } from './content'
import type { SlideProps } from './index'

const steps = [
  { title: 'Contract & kickoff', text: 'We lock the estimate, timeline and sign-off criteria. Work starts within 3 business days of the deposit.' },
  { title: 'Work in stages', text: 'Each stage ships a clear result. Weekly status: done / next / decisions we need from you.' },
  { title: 'Sign-off', text: 'We demo the result against the contract criteria. Two revision rounds are included in the price.' },
  { title: 'Launch & warranty', text: 'We hand off the result, train your team, and stay on call through the warranty window.' },
]

/** How we work: four steps and the timeline. */
export default function Slide04Process({ personalization }: SlideProps) {
  const offer = getOffer(personalization)

  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-5xl px-6 py-12 md:px-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-baseline justify-between gap-6 border-b-4 border-ink pb-4">
          <div className="flex items-baseline gap-6">
            <span className="font-display text-5xl font-black tracking-tighter text-accent">03</span>
            <h2 className="font-display text-3xl font-black uppercase tracking-tight text-ink md:text-4xl">
              How we work
            </h2>
          </div>
          <p className="hidden font-display text-sm font-bold uppercase tracking-widest text-ink-faint sm:block">
            timeline: <span className="text-ink">{offer.projectDuration}</span>
          </p>
        </motion.div>

        <div className="mt-10 grid gap-px overflow-hidden border-2 border-ink bg-ink sm:grid-cols-2">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12 + index * 0.1 }}
              className="bg-surface p-6 md:p-8"
            >
              <p className="font-display text-4xl font-black tracking-tighter text-accent">
                {String(index + 1).padStart(2, '0')}
              </p>
              <p className="mt-3 font-display text-lg font-black uppercase tracking-tight text-ink">
                {step.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="mt-6 text-sm text-ink-faint sm:hidden"
        >
          Total timeline — {offer.projectDuration}.
        </motion.p>
      </div>
    </div>
  )
}
