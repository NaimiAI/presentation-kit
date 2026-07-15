import { motion } from 'framer-motion'
import { useDemoField } from '../kit/hooks'
import type { SlideProps } from './index'

const deliverables = [
  { key: 'deliverableLogo', label: 'logo & mark' },
  { key: 'deliverableIdentity', label: 'identity & guidelines' },
  { key: 'deliverableWebsite', label: 'website' },
  { key: 'deliverablePackaging', label: 'packaging' },
  { key: 'deliverableSmm', label: 'social kit & templates' },
]

const budgets = [
  { key: 'lt10k', label: '< $10k' },
  { key: '10-25k', label: '$10–25k' },
  { key: '25-50k', label: '$25–50k' },
  { key: 'gt50k', label: '$50k +' },
]

const deadlines = [
  { key: 'month', label: 'a month' },
  { key: 'quarter', label: '2–3 months' },
  { key: 'halfyear', label: 'six months' },
  { key: 'norush', label: 'no rush' },
]

function DeliverableRow({ item, index }: { item: (typeof deliverables)[number]; index: number }) {
  const [selected, setSelected] = useDemoField<boolean>(item.key, { defaultValue: false })
  return (
    <motion.button
      type="button"
      onClick={() => setSelected(!selected)}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15 + index * 0.06 }}
      className="flex w-full items-center justify-between border-b border-edge py-4 text-left transition-colors hover:bg-accent-soft/50"
    >
      <span className={`font-display text-xl lowercase ${selected ? 'text-ink' : 'text-ink-faint'}`}>
        {item.label}
      </span>
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs transition-all ${
          selected ? 'border-accent bg-accent text-white' : 'border-edge text-transparent'
        }`}
      >
        ✓
      </span>
    </motion.button>
  )
}

function ChipGroup({ fieldKey, options }: { fieldKey: string; options: Array<{ key: string; label: string }> }) {
  const [value, setValue] = useDemoField<string>(fieldKey, { defaultValue: '' })
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((option) => {
        const active = value === option.key
        return (
          <button
            key={option.key}
            type="button"
            onClick={() => setValue(active ? '' : option.key)}
            className={`border px-4 py-2 text-sm transition-all ${
              active
                ? 'border-accent bg-accent text-white'
                : 'border-edge bg-card text-ink-soft hover:border-ink'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

/** Section 03: scope of work, budget range and timeline. */
export default function Slide04Scope(_: SlideProps) {
  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-3xl px-6 py-14 md:px-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-baseline gap-6 border-b border-edge pb-5">
          <span className="font-display text-5xl italic text-accent">03</span>
          <h2 className="font-display text-3xl lowercase text-ink md:text-4xl">scope &amp; limits</h2>
        </motion.div>

        <div className="mt-10">
          <p className="text-xs uppercase tracking-[0.3em] text-ink-faint">what we'll make</p>
          <div className="mt-3">
            {deliverables.map((item, index) => (
              <DeliverableRow key={item.key} item={item} index={index} />
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-10 sm:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <p className="text-xs uppercase tracking-[0.3em] text-ink-faint">budget range</p>
            <div className="mt-4">
              <ChipGroup fieldKey="budgetRange" options={budgets} />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <p className="text-xs uppercase tracking-[0.3em] text-ink-faint">when you need it</p>
            <div className="mt-4">
              <ChipGroup fieldKey="deadlineText" options={deadlines} />
            </div>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 border-l-2 border-accent pl-4 text-sm leading-relaxed text-ink-soft"
        >
          The range isn't a quote — it just helps us propose a scope that makes sense
          within it, instead of "everything, maxed out."
        </motion.p>
      </div>
    </div>
  )
}
