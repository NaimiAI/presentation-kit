import { motion } from 'framer-motion'
import type { SlideProps } from './index'

const steps = [
  { period: 'Day 1 · free', title: 'In-home consult', text: 'Your designer measures with a laser, notes plumbing and electrical, and walks your must-haves.' },
  { period: 'Week 1', title: 'Design & 3D', text: 'A photoreal 3D design in two layout options — revise as many times as you like before we cut a thing.' },
  { period: '5–6 weeks', title: 'Fabrication', text: 'Cabinets, doors and countertops are built to your design in our shop — not pulled from whatever is in stock.' },
  { period: '1–2 days', title: 'Install', text: 'Our own crew: hook up the sink and appliances, haul away the old kitchen, and clean up after.' },
]

/** The client journey: from in-home consult to a finished kitchen. */
export default function Slide02Process(_: SlideProps) {
  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-4xl px-6 py-14 md:px-8">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs uppercase tracking-[0.35em] text-accent-ink">
          How it works
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 font-display text-3xl leading-snug text-ink md:text-5xl"
        >
          Seven weeks to cooking
          <br />
          in your new kitchen
        </motion.h2>

        <div className="relative mt-12">
          <div className="absolute bottom-4 left-[19px] top-4 w-px bg-edge md:hidden" />
          <div className="grid gap-6 md:grid-cols-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 + index * 0.12 }}
                className="relative flex gap-4 md:block"
              >
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent font-display text-base text-white shadow-sm">
                  {index + 1}
                </div>
                <div className="md:mt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-positive-ink">{step.period}</p>
                  <p className="mt-1 font-display text-xl text-ink">{step.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 rounded-3xl border border-positive-edge bg-positive-soft px-6 py-5"
        >
          <p className="text-sm leading-relaxed text-positive-ink">
            <span className="font-semibold">Lifetime warranty</span> on cabinet boxes and doors, 2 years on
            hardware. If a hinge sags or a drawer sticks, we come back and fix it — no charge.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
