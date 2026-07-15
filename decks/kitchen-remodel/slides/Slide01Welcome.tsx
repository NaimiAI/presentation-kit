import { motion } from 'framer-motion'
import { Gift, Ruler, Sofa, Wallet } from 'lucide-react'
import { personalizationValue } from '../kit/host'
import kitchenHero from '../assets/kitchen-hero.webp'
import { STUDIO } from './content'
import type { SlideProps } from './index'

const palette = [
  { name: 'Terracotta', color: '#bf5b2b' },
  { name: 'Cream', color: '#f1e3cf' },
  { name: 'Sage', color: '#8fa876' },
  { name: 'Walnut', color: '#6f4f35' },
  { name: 'Graphite', color: '#3d4247' },
]

const reasons = [
  { icon: Ruler, text: 'Designed around your walls and how you cook — down to the counter height.' },
  { icon: Wallet, text: 'Honest pricing straight from the configurator — you can price it yourself on slide three.' },
  { icon: Sofa, text: 'One accountable team from design through install — no juggling contractors.' },
]

/** Warm welcome: client name, hero photo, mood palette, why us. */
export default function Slide01Welcome({ personalization }: SlideProps) {
  const clientName = personalization.companyName.trim() || 'Welcome'
  const specialOffer = personalizationValue(personalization, 'specialOffer')

  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-5xl flex-col justify-center px-6 py-12 md:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs uppercase tracking-[0.35em] text-accent-ink"
        >
          {STUDIO.name} · {STUDIO.tagline}
        </motion.p>

        <div className="mt-6 grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="font-display text-4xl leading-tight text-ink md:text-6xl"
            >
              {clientName}, your kitchen
              <br />
              starts <span className="italic text-accent-ink">on this page</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
              className="mt-8 flex items-center gap-3"
            >
              {palette.map((swatch, index) => (
                <motion.div
                  key={swatch.name}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.35 + index * 0.07 }}
                  className="group relative"
                >
                  <div
                    className="h-11 w-11 rounded-2xl shadow-sm ring-1 ring-black/5 md:h-12 md:w-12"
                    style={{ background: swatch.color }}
                  />
                  <p className="mt-1.5 text-center text-[10px] text-ink-faint">{swatch.name}</p>
                </motion.div>
              ))}
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-3 max-w-sm text-xs leading-relaxed text-ink-faint"
            >
              Our favorite pairings this season — we'll tune them to your home and light.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="overflow-hidden rounded-3xl border border-edge shadow-sm"
          >
            <img
              src={kitchenHero}
              alt="Warm modern kitchen with custom cabinetry"
              className="aspect-[4/3] w-full object-cover"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 grid gap-4 sm:grid-cols-3"
        >
          {reasons.map((reason) => (
            <div key={reason.text} className="rounded-3xl border border-edge bg-card p-5 shadow-sm">
              <reason.icon className="h-5 w-5 text-accent-ink" />
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{reason.text}</p>
            </div>
          ))}
        </motion.div>

        {specialOffer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="mt-6 inline-flex items-center gap-3 self-start rounded-full border border-accent-edge bg-accent-soft px-5 py-3"
          >
            <Gift className="h-4 w-4 text-accent-ink" />
            <p className="text-sm font-medium text-accent-ink">{specialOffer}</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
