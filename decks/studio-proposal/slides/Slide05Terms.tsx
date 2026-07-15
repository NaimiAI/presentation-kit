import { motion } from 'framer-motion'
import SectionHeading from './SectionHeading'
import { STUDIO, getProposal } from './content'
import type { SlideProps } from './index'

const defaultConditions = [
  'Payment: 50% to start per stage, 50% on acceptance · Net 15',
  'Two revision rounds included on every stage',
  'Design source files handed over on final payment',
  'Warranty support: 30 days after launch',
]

const nextSteps = [
  'Confirm the scope and estimate — a reply by email is enough',
  'We prepare the contract and an invoice for the first stage (1 business day)',
  'We start within a week of the deposit clearing',
]

export default function Slide05Terms({ personalization }: SlideProps) {
  const proposal = getProposal(personalization)
  const conditions = proposal.workConditions.length > 0 ? proposal.workConditions : defaultConditions

  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-5xl px-6 py-12 md:px-8">
        <SectionHeading index="04" title="Terms & next step" />

        <div className="grid gap-10 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="mb-4 text-xs uppercase tracking-[0.3em] text-ink-faint">Working terms</h3>
            <div className="divide-y divide-ink/10 border-y border-ink/20">
              {conditions.map((condition, index) => (
                <div key={`${condition}-${index}`} className="flex gap-3 py-3 text-sm text-ink-soft">
                  <span className="text-accent-ink">—</span>
                  <span>{condition}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <h3 className="mb-4 text-xs uppercase tracking-[0.3em] text-ink-faint">Next step</h3>
            <ol className="space-y-4">
              {nextSteps.map((step, index) => (
                <li key={step} className="flex gap-4">
                  <span className="font-display text-2xl text-accent-ink/70 tabular-nums">{index + 1}</span>
                  <p className="pt-1 text-sm leading-relaxed text-ink-soft">{step}</p>
                </li>
              ))}
            </ol>
            <p className="mt-6 border-l-2 border-accent pl-4 text-sm leading-relaxed text-ink">
              Questions on the estimate are easiest on a short call —
              email {STUDIO.contact} and we’ll propose a time the same day.
            </p>
          </motion.div>
        </div>

        {/* Signature block: authorized signatures from both sides. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-16 grid gap-x-10 gap-y-8 md:grid-cols-2"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent-ink">Prepared by</p>
            <p className="mt-1 font-display text-lg text-ink">{STUDIO.name}</p>
            <div className="mt-10 h-px bg-ink/40" />
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-ink-faint">
              Authorized signature · Date
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent-ink">Accepted by</p>
            <p className="mt-1 font-display text-lg text-ink">
              {proposal.companyName}
              {proposal.contactName && ` · ${proposal.contactName}`}
            </p>
            <div className="mt-10 h-px bg-ink/40" />
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-ink-faint">
              Authorized signature · Date
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
