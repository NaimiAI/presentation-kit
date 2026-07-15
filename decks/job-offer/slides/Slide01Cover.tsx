import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { Badge, GradientText, Orbs } from '../kit/components'
import { personalizationValue } from '../kit/host'
import teamCulture from '../assets/team-culture.webp'
import { COMPANY } from './content'
import type { SlideProps } from './index'

/** Cover: a warm "we want to work with you" + a personal note from the team. */
export default function Slide01Cover({ personalization }: SlideProps) {
  const candidateName = personalization.companyName.trim()
  const roleTitle = personalizationValue(personalization, 'roleTitle')
  const welcomeNote = personalizationValue(personalization, 'welcomeNote')

  return (
    <div className="relative min-h-full w-full overflow-hidden bg-surface pb-24">
      <Orbs />
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-6rem)] max-w-3xl flex-col justify-center px-6 py-12 md:px-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Badge icon={Heart}>
            Offer · {COMPANY.name} — {COMPANY.tagline}
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="mt-6 font-display text-4xl font-extrabold leading-tight tracking-tight text-ink md:text-6xl"
        >
          {candidateName ? `${candidateName}, we'd love` : "We'd love"}
          <br />
          to work <GradientText>with you</GradientText>
        </motion.h1>

        {roleTitle && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26 }}
            className="mt-6 text-lg text-ink-soft md:text-xl"
          >
            <span className="font-semibold text-ink">{roleTitle}</span> · {COMPANY.name},{' '}
            {COMPANY.size}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34 }}
          className="mt-8 overflow-hidden rounded-3xl border border-edge shadow-sm"
        >
          <img
            src={teamCulture}
            alt="The Cadence team collaborating in the studio"
            className="h-52 w-full object-cover md:h-64"
          />
        </motion.div>

        {welcomeNote && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.46 }}
            className="mt-6 rounded-3xl border border-accent-edge bg-card p-6 shadow-sm md:p-7"
          >
            <p className="text-base leading-relaxed text-ink-soft">“{welcomeNote}”</p>
            <p className="mt-4 text-sm font-medium text-accent-ink">— the {COMPANY.name} team</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
