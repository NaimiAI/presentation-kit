import { motion } from 'framer-motion'
import { STUDIO, getProposal } from './content'
import type { SlideProps } from './index'

/** Title cover: a double frame, like a printed document. */
export default function Slide01Cover({ personalization }: SlideProps) {
  const proposal = getProposal(personalization)

  return (
    <div className="min-h-full w-full bg-surface pb-24 flex items-stretch p-6 md:p-10">
      <div className="relative flex flex-1 border border-ink/30">
        <div className="absolute inset-2 border border-ink/15 pointer-events-none" />

        <div className="relative z-10 flex flex-1 flex-col justify-between gap-10 p-8 md:p-14">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap items-baseline justify-between gap-4"
          >
            <p className="font-display text-xl text-ink">{STUDIO.name}</p>
            {proposal.proposalDateText && (
              <p className="text-xs uppercase tracking-[0.2em] text-ink-faint">{proposal.proposalDateText}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="max-w-3xl"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-accent-ink mb-6">Proposal</p>
            <h1 className="font-display text-4xl md:text-6xl leading-[1.1] text-ink">{proposal.projectTitle}</h1>
            <p className="mt-6 text-lg md:text-xl text-ink-soft">
              Prepared for <span className="font-semibold text-ink">{proposal.companyName}</span>
              {proposal.contactName && <> · attn. {proposal.contactName}</>}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-end justify-between gap-4 border-t border-ink/20 pt-6"
          >
            <div>
              <p className="text-sm text-ink">{STUDIO.tagline}</p>
              <p className="mt-1 text-sm text-ink-faint">{STUDIO.contact} · {STUDIO.phone}</p>
            </div>
            {proposal.validUntilText && (
              <p className="text-xs uppercase tracking-[0.2em] text-ink-faint">
                Valid through {proposal.validUntilText}
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
