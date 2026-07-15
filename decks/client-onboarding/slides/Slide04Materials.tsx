import { motion } from 'framer-motion'
import { Activity, ExternalLink, FolderOpen, MessagesSquare, Timer } from 'lucide-react'
import { Kicker, SlideShell } from '../kit/components'
import { personalizationValue } from '../kit/host'
import { COMPANY } from './content'
import type { SlideProps } from './index'

const materials = [
  {
    icon: FolderOpen,
    title: 'Shared drive',
    text: 'Contracts, onboarding docs, and every deliverable in one place. Updated as we go.',
    href: COMPANY.sharedDrive,
    linkLabel: 'Open the drive',
  },
  {
    icon: MessagesSquare,
    title: 'Slack Connect channel',
    text: 'A shared channel with your team and ours — real people, quick answers, no ticket queue.',
    href: COMPANY.slackChannel,
    linkLabel: 'Join the channel',
  },
  {
    icon: Activity,
    title: 'Status page',
    text: 'Live system status and maintenance notices, so you always know what\'s up.',
    href: COMPANY.statusPage,
    linkLabel: 'View status',
  },
]

export default function Slide04Materials({ personalization }: SlideProps) {
  const managerName = personalizationValue(personalization, 'managerName', 'your manager')
  const managerContact = personalizationValue(personalization, 'managerContact')

  return (
    <SlideShell width="wide">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <Kicker>Resources</Kicker>
        <h2 className="font-display text-3xl font-bold text-ink md:text-4xl">
          Everything you'll reach for in month one
        </h2>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-3">
        {materials.map((item, index) => (
          <motion.a
            key={item.title}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.08 }}
            className="group flex flex-col rounded-2xl border border-edge bg-card p-6 shadow-sm transition-all duration-200 hover:border-accent-edge hover:shadow-md"
          >
            <item.icon className="mb-4 h-7 w-7 text-accent-ink" />
            <h3 className="text-base font-semibold text-ink">{item.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{item.text}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-ink">
              {item.linkLabel}
              <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </motion.a>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-positive-edge bg-positive-soft px-6 py-5"
      >
        <div className="flex items-start gap-3">
          <Timer className="mt-0.5 h-5 w-5 shrink-0 text-positive-ink" />
          <p className="max-w-xl text-sm leading-relaxed text-ink">{COMPANY.slaText}</p>
        </div>
        <p className="text-sm text-ink-soft">
          Can't find it? Reach out to {managerName}
          {managerContact && <>: <span className="font-semibold text-ink">{managerContact}</span></>}
        </p>
      </motion.div>
    </SlideShell>
  )
}
