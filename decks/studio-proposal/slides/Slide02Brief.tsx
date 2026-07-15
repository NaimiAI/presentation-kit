import { motion } from 'framer-motion'
import { Compass, PenTool, Rocket } from 'lucide-react'
import SectionHeading from './SectionHeading'
import { getProposal } from './content'
import type { SlideProps } from './index'

const deliverables = [
  {
    icon: Compass,
    title: 'Strategy',
    text: 'Audit, behavior analytics, a customer-journey map, and the structure of the new site.',
  },
  {
    icon: PenTool,
    title: 'Design',
    text: 'A design system and layouts for every key page — from the homepage to the service detail.',
  },
  {
    icon: Rocket,
    title: 'Launch',
    text: 'Build, CMS, content migration, and training your team to run the site.',
  },
]

export default function Slide02Brief({ personalization }: SlideProps) {
  const proposal = getProposal(personalization)

  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-5xl px-6 py-12 md:px-8">
        <SectionHeading index="01" title="Our understanding" />

        <motion.blockquote
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl border-l-2 border-accent pl-6"
        >
          <p className="font-display text-xl md:text-2xl leading-relaxed text-ink">{proposal.projectOverview}</p>
        </motion.blockquote>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {deliverables.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.1 }}
              className="border-t-2 border-ink pt-5"
            >
              <item.icon className="mb-3 h-5 w-5 text-accent-ink" />
              <h3 className="mb-2 font-display text-xl text-ink">{item.title}</h3>
              <p className="text-sm leading-relaxed text-ink-soft">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
