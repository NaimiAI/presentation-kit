import { motion } from 'framer-motion'
import { Baby, GraduationCap, HeartPulse, Home, Laptop, MapPin, PiggyBank, Sun } from 'lucide-react'
import { Kicker } from '../kit/components'
import type { SlideProps } from './index'

const benefits = [
  {
    icon: HeartPulse,
    title: 'Medical, dental & vision',
    text: '100% covered for you — from day one, no waiting period.',
  },
  {
    icon: PiggyBank,
    title: '401(k) with 4% match',
    text: 'We match your contributions dollar-for-dollar up to 4% of salary.',
  },
  {
    icon: Sun,
    title: '20 days PTO',
    text: '20 paid days off plus company holidays — and we actually expect you to take them.',
  },
  {
    icon: Baby,
    title: '16 weeks parental leave',
    text: 'Fully paid, for every new parent — birth, adoption or foster.',
  },
  {
    icon: Home,
    title: '$1,500 home-office stipend',
    text: 'Desk, chair, monitor — set up your remote days exactly how you like.',
  },
  {
    icon: GraduationCap,
    title: '$1,000 learning budget',
    text: 'Courses, conferences and books each year — one-click approval, no red tape.',
  },
  {
    icon: Laptop,
    title: 'Your pick of hardware',
    text: 'MacBook Pro or a Windows machine, plus whatever you need to do your best work.',
  },
  {
    icon: MapPin,
    title: 'Hybrid, SF office',
    text: 'Two days a week in a bright office in SoMa — the rest, wherever you focus best.',
  },
]

/** Benefits: the everyday things that make people stay. */
export default function Slide04Benefits(_: SlideProps) {
  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-5xl px-6 py-12 md:px-8">
        <Kicker>Benefits</Kicker>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl font-extrabold tracking-tight text-ink md:text-5xl"
        >
          The details that add up to "I'm glad I'm here"
        </motion.h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + index * 0.06 }}
              className="rounded-3xl border border-edge bg-card p-6 shadow-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft">
                <benefit.icon className="h-5 w-5 text-accent-ink" />
              </div>
              <p className="mt-4 font-display text-base font-bold text-ink">{benefit.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{benefit.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
