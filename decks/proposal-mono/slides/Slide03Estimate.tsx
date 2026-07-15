import { motion } from 'framer-motion'
import { formatUsd, getOffer } from './content'
import type { SlideProps } from './index'

/** Staged estimate from stagesJson (the stages editor in the create form). */
export default function Slide03Estimate({ personalization }: SlideProps) {
  const offer = getOffer(personalization)

  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-5xl px-6 py-12 md:px-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-baseline gap-6 border-b-4 border-ink pb-4">
          <span className="font-display text-5xl font-black tracking-tighter text-accent">02</span>
          <h2 className="font-display text-3xl font-black uppercase tracking-tight text-ink md:text-4xl">
            Estimate
          </h2>
        </motion.div>

        {offer.stages.length > 0 ? (
          <div className="mt-8">
            {offer.stages.map((stage, stageIndex) => (
              <motion.section
                key={`${stage.title}-${stageIndex}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + stageIndex * 0.1 }}
                className="border-b border-edge py-6 first:pt-2"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-lg font-black uppercase tracking-tight text-ink md:text-xl">
                    {stage.title}
                  </h3>
                  <span className="font-display text-lg font-black tabular-nums text-ink md:text-xl whitespace-nowrap">
                    {formatUsd(stage.cost)}
                  </span>
                </div>
                <div className="mt-3 space-y-1.5">
                  {stage.rows.map((row, rowIndex) => (
                    <div key={`${row.work}-${rowIndex}`} className="grid gap-x-8 text-sm md:grid-cols-[1fr_1.1fr]">
                      <span className="font-medium text-ink">— {row.work}</span>
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
              className="mt-6 flex items-baseline justify-between gap-4 border-t-4 border-ink pt-5"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-ink">Total</p>
              <p className="font-display text-4xl font-black tabular-nums tracking-tight text-accent md:text-5xl">
                {formatUsd(offer.total)}
              </p>
            </motion.div>
            {offer.validUntilText && (
              <p className="mt-2 text-right text-xs uppercase tracking-[0.2em] text-ink-faint">
                Price held through {offer.validUntilText}
              </p>
            )}
          </div>
        ) : (
          <div className="mt-8 border-2 border-accent-edge bg-accent-soft px-5 py-4 text-sm text-accent-ink">
            No stages added yet. Add them in the stages editor when you create the
            presentation — the table and the total will build automatically.
          </div>
        )}
      </div>
    </div>
  )
}
