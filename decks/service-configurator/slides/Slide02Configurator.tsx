import { motion } from 'framer-motion'
import { Check, Plus } from 'lucide-react'
import { Kicker, SlideShell } from '../kit/components'
import { formatServicePrice, formatUsd, useServiceSelection } from './services'
import type { SlideProps } from './index'

/** Checkbox cards: the selection lives in demoData and is visible to the manager. */
export default function Slide02Configurator(_props: SlideProps) {
  const { selections, chosen, discount, total } = useServiceSelection()

  return (
    <SlideShell width="wide">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Kicker>Configurator</Kicker>
        <h2 className="font-display text-3xl font-bold text-ink md:text-4xl">Pick the services you need</h2>
        <p className="mt-2 text-ink-soft">Tap a card — the total below recalculates instantly.</p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {selections.map(({ def, selected, toggle }, index) => (
          <motion.button
            key={def.key}
            type="button"
            onClick={toggle}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + index * 0.06 }}
            className={`relative rounded-2xl border p-5 text-left transition-all duration-200 ${
              selected
                ? 'border-accent-edge bg-accent-soft shadow-md'
                : 'border-edge bg-card hover:border-accent-edge/60 hover:shadow-sm'
            }`}
          >
            <span
              className={`absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${
                selected ? 'border-accent bg-accent text-card' : 'border-edge bg-surface text-ink-faint'
              }`}
            >
              {selected ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            </span>

            <def.icon className={`mb-3 h-6 w-6 ${selected ? 'text-accent-ink' : 'text-ink-faint'}`} />
            <h3 className="pr-8 text-base font-semibold text-ink">{def.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{def.description}</p>
            <div className="mt-3 flex items-end justify-between gap-2">
              <div>
                <span className="text-lg font-bold tabular-nums text-ink">{formatServicePrice(def)}</span>
                {def.note && <p className="text-[11px] leading-tight text-ink-faint">{def.note}</p>}
              </div>
              <span className="whitespace-nowrap text-xs text-ink-faint">~{def.weeks} wk</span>
            </div>
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-accent-edge bg-card px-6 py-4 shadow-sm"
      >
        <p className="text-sm text-ink-soft">
          Services selected: <span className="font-semibold text-ink">{chosen.length}</span>
          {discount > 0 && (
            <span className="ml-2 rounded-full bg-positive-soft border border-positive-edge px-2.5 py-0.5 text-xs font-semibold text-positive-ink">
              {discount}% off
            </span>
          )}
        </p>
        <p className="text-right">
          <span className="text-2xl font-bold tabular-nums text-ink">{formatUsd(total)}</span>
          <span className="ml-1 text-xs text-ink-faint">first month</span>
        </p>
      </motion.div>
    </SlideShell>
  )
}
