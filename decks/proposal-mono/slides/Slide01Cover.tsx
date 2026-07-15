import { motion } from 'framer-motion'
import { SENDER, getOffer } from './content'
import type { SlideProps } from './index'

/** Cover: Swiss grid — brand line, oversized title, key facts along the bottom. */
export default function Slide01Cover({ personalization }: SlideProps) {
  const offer = getOffer(personalization)

  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-5xl flex-col px-6 py-10 md:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-baseline justify-between border-b-4 border-ink pb-4"
        >
          <div>
            <p className="font-display text-lg font-black uppercase tracking-tight text-ink">{SENDER.name}</p>
            <p className="text-xs uppercase tracking-[0.25em] text-ink-faint">{SENDER.tagline}</p>
          </div>
          <p className="font-display text-sm font-bold uppercase tracking-widest text-accent">
            {offer.offerNumber}
          </p>
        </motion.div>

        <div className="flex flex-1 flex-col justify-center py-12">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-semibold uppercase tracking-[0.35em] text-accent"
          >
            Proposal
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 font-display text-4xl font-black uppercase leading-[0.95] tracking-tighter text-ink sm:text-5xl md:text-7xl"
          >
            {offer.projectTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 max-w-2xl text-xl text-ink-soft md:text-2xl"
          >
            Prepared for <span className="font-semibold text-ink">{offer.companyName}</span>
            {offer.contactName && <span className="text-ink-faint"> · {offer.contactName}</span>}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="grid gap-6 border-t-2 border-ink pt-5 sm:grid-cols-3"
        >
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-ink-faint">Date</p>
            <p className="mt-1 font-display text-base font-bold text-ink">{offer.proposalDateText}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-ink-faint">Timeline</p>
            <p className="mt-1 font-display text-base font-bold text-ink">{offer.projectDuration}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-ink-faint">Valid through</p>
            <p className="mt-1 font-display text-base font-bold text-accent">
              {offer.validUntilText || 'by agreement'}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
