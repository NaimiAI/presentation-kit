import { motion } from 'framer-motion'
import { personalizationValue } from '../kit/host'
import heroImage from '../assets/port-couple-golden.webp'
import { STUDIO, formatWeddingDate } from './content'
import type { SlideProps } from './index'

/** Cover: golden-hour hero in an ivory mat, serif couple's names, a handwritten note. */
export default function Slide01Cover({ personalization }: SlideProps) {
  const couple = personalization.companyName.trim() || 'Your names here'
  const weddingDate = formatWeddingDate(personalizationValue(personalization, 'weddingDate'))
  const venueName = personalizationValue(personalization, 'venueName')
  const personalNote = personalizationValue(personalization, 'personalNote')

  // "Jun 14, 2026 · Cedar Lakes Estate" — render gracefully when either is empty.
  const meta = [weddingDate, venueName].filter(Boolean).join(' · ')

  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-6xl items-center gap-10 px-6 py-12 md:grid-cols-[1.15fr_1fr] md:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="photo-mat rounded-sm"
        >
          <div className="overflow-hidden rounded-sm">
            <motion.img
              src={heroImage}
              alt="A couple photographed at golden hour"
              initial={{ scale: 1.03 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.6, ease: 'easeOut' }}
              className="aspect-[16/9] w-full object-cover"
            />
          </div>
        </motion.div>

        <div className="flex flex-col">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[11px] uppercase tracking-[0.4em] text-accent-ink"
          >
            {STUDIO.name}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
            className="mt-5 font-display leading-[1.02] text-ink"
            style={{ fontSize: 'clamp(2.6rem, 5.5vw, 4.75rem)' }}
          >
            {couple}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.44 }}
            className="mt-3 font-display text-2xl italic text-accent-ink md:text-3xl"
          >
            — your wedding, told honestly
          </motion.p>

          {meta && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.56 }}
              className="mt-6 text-sm uppercase tracking-[0.2em] text-ink-soft"
            >
              {meta}
            </motion.p>
          )}

          {personalNote && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-8 max-w-md border-l-2 border-accent-edge pl-4 font-display text-lg italic leading-relaxed text-ink-soft"
            >
              {personalNote}
            </motion.p>
          )}
        </div>
      </div>
    </div>
  )
}
