import { motion } from 'framer-motion'
import { Brush, Camera, Home, Megaphone } from 'lucide-react'
import homeLiving from '../assets/home-living.webp'
import homeKitchen from '../assets/home-kitchen.webp'
import type { SlideProps } from './index'

const STEPS = [
  {
    icon: Brush,
    week: 'Week 1',
    title: 'Prep & staging',
    detail: 'Declutter, light repairs and a staging plan that makes each room photograph well.',
  },
  {
    icon: Camera,
    week: 'Week 1–2',
    title: 'Photography + film',
    detail: 'Magazine-grade stills, a walkthrough film and a floor plan — shot at golden hour.',
  },
  {
    icon: Megaphone,
    week: 'Week 2',
    title: 'Launch everywhere',
    detail: 'Live on the MLS and every major portal, plus a targeted email to my buyer list.',
  },
  {
    icon: Home,
    week: 'Week 2+',
    title: 'Open house & private tours',
    detail: 'A launch-weekend open house followed by private showings for serious buyers.',
  },
]

/** Week-by-week marketing timeline (left) beside two stacked listing photos (right). */
export default function Slide04Marketing(_: SlideProps) {
  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-5xl px-6 py-14 md:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-[11px] font-semibold uppercase tracking-[0.4em]"
          style={{ color: 'var(--estate-brass)' }}
        >
          The marketing plan
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.6 }}
          className="mt-4 font-display text-3xl leading-snug text-ink md:text-4xl"
        >
          From prep to open house in about two weeks
        </motion.h2>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          {/* Timeline */}
          <div className="space-y-4">
            {STEPS.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.1, duration: 0.5 }}
                className="flex items-start gap-4 rounded-2xl border border-edge bg-card p-5 shadow-sm md:p-6"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-soft">
                  <step.icon className="h-5 w-5 text-accent-ink" />
                </div>
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-lg text-ink">
                      {index + 1}. {step.title}
                    </span>
                    <span
                      className="text-[10px] font-semibold uppercase tracking-[0.2em]"
                      style={{ color: 'var(--estate-brass)' }}
                    >
                      {step.week}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{step.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stacked photos */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="flex flex-col gap-4"
          >
            <div className="overflow-hidden rounded-2xl border-4 border-white shadow-sm ring-1 ring-edge">
              <img src={homeLiving} alt="" className="h-56 w-full object-cover md:h-64" />
            </div>
            <div className="overflow-hidden rounded-2xl border-4 border-white shadow-sm ring-1 ring-edge">
              <img src={homeKitchen} alt="" className="h-56 w-full object-cover md:h-64" />
            </div>
            <p className="px-1 text-sm leading-relaxed text-ink-faint">
              Magazine-grade photography comes standard — no upsells, no per-photo fees.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
