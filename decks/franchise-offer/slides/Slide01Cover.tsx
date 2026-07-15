import { motion } from 'framer-motion'
import { Coffee } from 'lucide-react'
import { Badge, GradientText, Orbs, StatCard } from '../kit/components'
import { personalizationValue } from '../kit/host'
import cafeInterior from '../assets/cafe-interior.webp'
import { FRANCHISE } from './content'
import type { SlideProps } from './index'

/** Cover: the franchise for a specific partner and their city + network numbers. */
export default function Slide01Cover({ personalization }: SlideProps) {
  const partner = personalization.companyName.trim() || 'Partner'
  const cityName = personalizationValue(personalization, 'cityName')

  const networkStats = [
    { label: 'Locations', value: String(FRANCHISE.locations), sub: `across ${FRANCHISE.region}` },
    { label: 'Average unit volume', value: `$${Math.round(FRANCHISE.auv / 1000)}k/yr`, sub: 'gross sales per location' },
    { label: 'In business', value: `${FRANCHISE.years} yrs`, sub: 'own roastery and standards' },
  ]

  return (
    <div className="relative min-h-full w-full overflow-hidden bg-surface pb-24">
      <Orbs />
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-6rem)] max-w-6xl items-center gap-10 px-6 py-10 md:px-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Badge icon={Coffee}>Franchise · {FRANCHISE.format}</Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-6 font-display text-4xl font-extrabold leading-tight tracking-tight text-ink md:text-5xl"
          >
            A {FRANCHISE.name} franchise
            <br />
            <GradientText>{cityName ? `in ${cityName}` : 'in your city'}</GradientText>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26 }}
            className="mt-5 max-w-2xl text-base leading-relaxed text-ink-soft md:text-lg"
          >
            A personal offer for {partner}. A coffee shop that earns from its first quarter — run the
            numbers for your own location on slide three.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42 }}
            className="mt-8 grid gap-4 sm:grid-cols-3"
          >
            {networkStats.map((stat) => (
              <StatCard key={stat.label} label={stat.label} value={stat.value} sub={stat.sub} />
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative hidden overflow-hidden rounded-3xl border border-edge shadow-lg lg:block"
        >
          <img
            src={cafeInterior}
            alt={`Inside a ${FRANCHISE.name} location`}
            className="h-[520px] w-full object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-24"
            style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(10,30,20,0.55) 100%)' }}
          />
          <p className="absolute bottom-4 left-5 right-5 text-sm font-medium text-white">
            {FRANCHISE.name} · a neighborhood location in {FRANCHISE.region}
          </p>
        </motion.div>
      </div>
    </div>
  )
}
