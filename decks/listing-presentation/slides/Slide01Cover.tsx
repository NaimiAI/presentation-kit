import { motion } from 'framer-motion'
import homeExterior from '../assets/home-exterior.webp'
import agentHeadshot from '../assets/agent-headshot.webp'
import { AGENT, getListing } from './content'
import type { SlideProps } from './index'

/** Full-bleed exterior with a bottom linen panel: address, seller, agent chip. */
export default function Slide01Cover({ personalization }: SlideProps) {
  const { propertyAddress, sellerNames, presentDate } = getListing(personalization)

  return (
    <div className="relative min-h-full w-full overflow-hidden bg-surface">
      {/* Hero photo — slow scale-in behind the linen panel. */}
      <motion.img
        src={homeExterior}
        alt=""
        initial={{ scale: 1.04, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(34,37,31,0) 38%, rgba(34,37,31,0.55) 100%)' }}
      />

      {/* Agent chip, top-left. */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6 }}
        className="absolute left-6 top-6 flex items-center gap-3 rounded-full border border-white/25 bg-white/15 px-3 py-2 backdrop-blur-md md:left-10 md:top-10"
      >
        <img src={agentHeadshot} alt="" className="h-9 w-9 rounded-full object-cover ring-1 ring-white/40" />
        <div className="pr-2 leading-tight">
          <p className="text-sm font-semibold text-white">{AGENT.name}</p>
          <p className="text-[11px] text-white/75">{AGENT.brokerage}</p>
        </div>
      </motion.div>

      {/* Bottom linen panel with the engraved address line. */}
      <div className="absolute inset-x-0 bottom-0">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7, ease: 'easeOut' }}
          className="mx-4 mb-4 rounded-t-2xl border border-b-0 border-edge bg-surface/95 px-6 py-8 backdrop-blur-md md:mx-10 md:mb-10 md:rounded-2xl md:border-b md:px-12 md:py-10"
        >
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.4em]"
            style={{ color: 'var(--estate-brass)' }}
          >
            Listing presentation
          </p>
          <h1 className="mt-4 font-display text-3xl leading-tight text-ink md:text-5xl">
            A marketing plan for
            <br />
            <span className="text-accent-ink">{propertyAddress}</span>
          </h1>
          <p className="mt-5 border-t border-edge pt-4 text-sm tracking-wide text-ink-soft md:text-base">
            Prepared for <span className="font-medium text-ink">{sellerNames}</span>
            <span className="mx-2 text-ink-faint">·</span>
            {presentDate}
          </p>
        </motion.div>
      </div>
    </div>
  )
}
