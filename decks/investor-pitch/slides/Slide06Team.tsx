import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import { GradientText, Kicker, SlideShell } from '../kit/components'
import { personalizationValue } from '../kit/host'
import { STARTUP } from './content'
import type { SlideProps } from './index'
import founderCeo from '../assets/founder-ceo.webp'
import founderCto from '../assets/founder-cto.webp'
import founderCoo from '../assets/founder-coo.webp'

const team = [
  { photo: founderCeo, name: 'Sarah Lin', role: 'CEO', note: 'Ex-Shopify; led post-purchase product for 20k+ merchants' },
  { photo: founderCto, name: 'Marcus Bell', role: 'CTO', note: 'Ex-Stripe infrastructure; scaled payments to billions of requests' },
  { photo: founderCoo, name: 'Rachel Ortiz', role: 'COO', note: '2× ops leader; built support & logistics orgs from scratch' },
]

/** Team, a per-investor note, and the next step. */
export default function Slide06Team({ personalization }: SlideProps) {
  const investorName = personalization.companyName.trim() || 'you'
  const contactName = personalizationValue(personalization, 'contactName')
  const personalNote = personalizationValue(personalization, 'personalNote')
  const managerName = personalizationValue(personalization, 'managerName', 'The Loop team')
  const managerContact = personalizationValue(personalization, 'managerContact')

  return (
    <SlideShell orbs width="default">
      <Kicker>Team</Kicker>
      <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink md:text-5xl">
        The people behind <GradientText>{STARTUP.name}</GradientText>
      </h2>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {team.map((member, index) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 + index * 0.1 }}
            className="rounded-3xl border border-white/60 bg-white/55 p-6 backdrop-blur-md"
          >
            <img
              src={member.photo}
              alt={`${member.name}, ${member.role}`}
              className="h-16 w-16 rounded-2xl object-cover shadow-sm ring-2 ring-white/70"
              style={{ outline: '1px solid var(--nk-edge)', outlineOffset: '-1px' }}
            />
            <p className="mt-4 font-display text-lg font-bold text-ink">{member.name}</p>
            <p className="text-sm font-semibold text-accent-ink">{member.role}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{member.note}</p>
          </motion.div>
        ))}
      </div>

      {personalNote && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-8 rounded-3xl border border-accent-edge bg-accent-soft p-6"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-accent-ink">
            Why we're talking to {investorName}
          </p>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink">{personalNote}</p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/60 bg-white/70 p-6 backdrop-blur-md"
      >
        <div>
          <p className="font-display text-lg font-bold text-ink">
            {contactName ? `${contactName}, next step` : 'Next step'} — 30 minutes with the founders
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            We'll walk the product live and open up the metrics and data room.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-accent-soft px-5 py-3">
          <Mail className="h-5 w-5 text-accent-ink" />
          <div className="text-sm">
            <p className="font-semibold text-ink">{managerName}</p>
            {managerContact && <p className="text-ink-soft">{managerContact}</p>}
          </div>
        </div>
      </motion.div>
    </SlideShell>
  )
}
