import { motion } from 'framer-motion'
import { Kicker, SlideShell } from '../kit/components'
import { personalizationValue } from '../kit/host'
import accountManagerPhoto from '../assets/team-account-manager.webp'
import implementationPhoto from '../assets/team-implementation.webp'
import technicalPhoto from '../assets/team-technical.webp'
import { initials } from './content'
import type { SlideProps } from './index'

// The team lineup — swap in your own structure.
const restOfTeam = [
  {
    name: 'David Park',
    role: 'Implementation lead',
    scope: 'Setup, integrations with your systems, and data migration',
    contact: 'david@northmark.co',
    photo: implementationPhoto,
  },
  {
    name: 'Priya Shah',
    role: 'Technical specialist',
    scope: 'Access, security, and the "why isn\'t this working" questions',
    contact: 'priya@northmark.co',
    photo: technicalPhoto,
  },
  {
    name: 'Care team',
    role: '24/7 support',
    scope: 'Any question, any time — answered by a real person',
    contact: 'help@northmark.co',
    photo: '',
  },
]

export default function Slide02Team({ personalization }: SlideProps) {
  const managerName = personalizationValue(personalization, 'managerName', 'Your manager')
  const managerContact = personalizationValue(personalization, 'managerContact', '—')

  const team = [
    {
      name: managerName,
      role: 'Account manager',
      scope: 'Your single point of contact: project status, timelines, anything logistical',
      contact: managerContact,
      photo: accountManagerPhoto,
      lead: true,
    },
    ...restOfTeam.map((person) => ({ ...person, lead: false })),
  ]

  return (
    <SlideShell width="wide">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <Kicker>Your team</Kicker>
        <h2 className="font-display text-3xl font-bold text-ink md:text-4xl">
          The people accountable for your results
        </h2>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {team.map((person, index) => (
          <motion.div
            key={person.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.08 }}
            className={`rounded-2xl border p-5 shadow-sm ${
              person.lead ? 'border-accent-edge bg-accent-soft' : 'border-edge bg-card'
            }`}
          >
            {person.photo ? (
              <img
                src={person.photo}
                alt={person.name}
                className="mb-4 h-14 w-14 rounded-full object-cover ring-2 ring-white ring-offset-2 ring-offset-transparent [box-shadow:0_0_0_1px_var(--nk-edge)]"
              />
            ) : (
              <div
                className="mb-4 flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-white"
                style={{ background: 'var(--nk-gradient)' }}
              >
                {initials(person.name)}
              </div>
            )}
            <h3 className="text-base font-semibold text-ink">{person.name}</h3>
            <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-accent-ink">{person.role}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{person.scope}</p>
            <p className="mt-3 border-t border-edge pt-3 text-xs font-medium text-ink-faint">{person.contact}</p>
          </motion.div>
        ))}
      </div>
    </SlideShell>
  )
}
