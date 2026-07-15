import { motion } from 'framer-motion'
import SectionHeading from './SectionHeading'
import { formatUsd, getProposal } from './content'
import type { SlideProps } from './index'

/** Staged estimate from stagesJson (the stages editor in the create form). */
export default function Slide04Estimate({ personalization }: SlideProps) {
  const proposal = getProposal(personalization)

  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-5xl px-6 py-12 md:px-8">
        <SectionHeading index="03" title="Project estimate" />

        {proposal.stages.length > 0 ? (
          <div className="space-y-10">
            {proposal.stages.map((stage, stageIndex) => (
              <motion.section
                key={`${stage.title}-${stageIndex}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + stageIndex * 0.12 }}
              >
                <div className="flex items-baseline justify-between gap-4 border-b-2 border-ink pb-2">
                  <h3 className="font-display text-xl text-ink">{stage.title}</h3>
                  <span className="font-display text-xl tabular-nums text-ink whitespace-nowrap">
                    {formatUsd(stage.cost)}
                  </span>
                </div>
                <div className="divide-y divide-ink/10">
                  {stage.rows.map((row, rowIndex) => (
                    <div
                      key={`${row.work}-${rowIndex}`}
                      className="grid gap-x-8 py-2.5 text-sm md:grid-cols-[1.1fr_1fr]"
                    >
                      <span className="text-ink">{row.work}</span>
                      <span className="text-ink-soft">{row.description}</span>
                    </div>
                  ))}
                </div>
              </motion.section>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="border-t-2 border-ink pt-4"
            >
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-sm uppercase tracking-[0.3em] text-ink-faint">Total</p>
                <p className="font-display text-3xl md:text-4xl tabular-nums text-ink">
                  {formatUsd(proposal.total)}
                </p>
              </div>
              <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm italic text-ink-faint">{proposal.pricingDisclaimer}</p>
                {proposal.validUntilText && (
                  <p className="text-xs uppercase tracking-[0.2em] text-accent-ink">
                    Price held through {proposal.validUntilText}
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="border border-accent-edge bg-accent-soft px-5 py-4 text-sm text-accent-ink">
            No stages added yet. Add them in the stages editor when you create the
            presentation — the table and the total will build automatically.
          </div>
        )}
      </div>
    </div>
  )
}
