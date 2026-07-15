import { motion } from 'framer-motion'
import { Coffee, GraduationCap, MapPin, Megaphone, MonitorSmartphone, Package } from 'lucide-react'
import { Kicker } from '../kit/components'
import { FRANCHISE } from './content'
import type { SlideProps } from './index'

const supportItems = [
  {
    icon: MapPin,
    title: 'Site selection & buildout',
    text: 'We model foot traffic and forecast sales for every space — you only sign a lease after the numbers work, then we manage the buildout.',
  },
  {
    icon: GraduationCap,
    title: '3-week training academy',
    text: 'Baristas, shift leads and the owner-operator: coffee craft, service standards, food safety and the books.',
  },
  {
    icon: Coffee,
    title: 'Opening team on-site',
    text: 'A lead trainer works your first two weeks — dialing in the espresso, calibrating equipment and getting the crew to standard.',
  },
  {
    icon: Megaphone,
    title: 'Marketing playbook',
    text: 'National brand campaigns plus a local grand-opening plan built for your specific location.',
  },
  {
    icon: Package,
    title: 'Supply chain',
    text: 'House-roasted beans and dairy at network pricing — no chasing down vendors on your own.',
  },
  {
    icon: MonitorSmartphone,
    title: 'POS & app, day one',
    text: 'Point of sale, the loyalty app and reporting are wired up from opening — you see the location in numbers.',
  },
]

/** Network support: what the partner gets along with the brand. */
export default function Slide04Support(_: SlideProps) {
  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-5xl px-6 py-12 md:px-8">
        <Kicker>Network support</Kicker>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl font-extrabold tracking-tight text-ink md:text-5xl"
        >
          You're not alone: {FRANCHISE.locations} locations have done this
        </motion.h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {supportItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.08 }}
              className="rounded-3xl border border-edge bg-card p-6 shadow-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft">
                <item.icon className="h-5 w-5 text-accent-ink" />
              </div>
              <p className="mt-4 font-display text-lg font-bold text-ink">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
