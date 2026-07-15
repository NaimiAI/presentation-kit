import { motion } from 'framer-motion'
import { ArrowRight, SlidersHorizontal } from 'lucide-react'
import { Badge, Kicker, RangeField, SlideShell } from '../kit/components'
import { useDemoField } from '../kit/hooks'
import { clampNumber, deltaPct } from './metrics'
import type { SlideProps } from './index'

/**
 * Before/after metrics. The left panel is live: the manager fine-tunes the
 * numbers on the call, and they save to the demo and to the client profile.
 */
export default function Slide02Metrics(_props: SlideProps) {
  const [processBefore, setProcessBefore] = useDemoField<number>('responseMinBefore', { defaultValue: 14 })
  const [processAfter, setProcessAfter] = useDemoField<number>('responseMinAfter', { defaultValue: 3 })
  const [autoBefore, setAutoBefore] = useDemoField<number>('convBefore', { defaultValue: 18 })
  const [autoAfter, setAutoAfter] = useDemoField<number>('convAfter', { defaultValue: 61 })

  const safeProcessBefore = clampNumber(processBefore, 1, 600, 14)
  const safeProcessAfter = clampNumber(processAfter, 1, 600, 3)
  const safeAutoBefore = clampNumber(autoBefore, 0, 100, 18)
  const safeAutoAfter = clampNumber(autoAfter, 0, 100, 61)

  const comparisons = [
    {
      title: 'Order-processing time',
      before: `${Math.round(safeProcessBefore)} min`,
      after: `${Math.round(safeProcessAfter)} min`,
      delta: deltaPct(safeProcessBefore, safeProcessAfter),
      goodWhenNegative: true,
    },
    {
      title: 'Support tickets auto-resolved',
      before: `${Math.round(safeAutoBefore)}%`,
      after: `${Math.round(safeAutoAfter)}%`,
      delta: deltaPct(safeAutoBefore, safeAutoAfter),
      goodWhenNegative: false,
    },
  ]

  return (
    <SlideShell width="wide">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Kicker>Key metrics</Kicker>
        <h2 className="font-display text-3xl font-bold text-ink md:text-4xl">What changed during the pilot</h2>
        <p className="mt-2 text-ink-soft">
          Fine-tune the numbers right in the meeting — the report recalculates and the values save.
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6 rounded-2xl border border-edge bg-card p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 text-ink-soft">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="text-sm font-semibold uppercase tracking-wide">Actual values</span>
          </div>
          <RangeField
            label="Processing time before, min"
            value={Math.round(safeProcessBefore)}
            min={1}
            max={30}
            step={1}
            onChange={setProcessBefore}
          />
          <RangeField
            label="Processing time after, min"
            value={Math.round(safeProcessAfter)}
            min={1}
            max={30}
            step={1}
            onChange={setProcessAfter}
            highlight
          />
          <RangeField
            label="Auto-resolved before, %"
            value={Math.round(safeAutoBefore)}
            min={0}
            max={100}
            step={1}
            displayValue={`${Math.round(safeAutoBefore)}%`}
            onChange={(value) => setAutoBefore(Math.round(value))}
          />
          <RangeField
            label="Auto-resolved after, %"
            value={Math.round(safeAutoAfter)}
            min={0}
            max={100}
            step={1}
            displayValue={`${Math.round(safeAutoAfter)}%`}
            onChange={(value) => setAutoAfter(Math.round(value))}
            highlight
          />
        </motion.div>

        <div className="space-y-4">
          {comparisons.map((row, index) => {
            const improved = row.goodWhenNegative ? row.delta < 0 : row.delta > 0
            return (
              <motion.div
                key={row.title}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="rounded-2xl border border-edge bg-card p-6 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-ink">{row.title}</h3>
                  <Badge tone={improved ? 'positive' : 'neutral'} size="sm">
                    {row.delta > 0 ? '+' : ''}{row.delta}%
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 rounded-xl bg-critical-soft border border-critical-edge px-4 py-3 text-center">
                    <p className="text-xs uppercase tracking-wide text-ink-faint">Before</p>
                    <p className="mt-1 text-2xl font-bold tabular-nums text-ink-soft">{row.before}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-ink-faint" />
                  <div className="flex-1 rounded-xl bg-positive-soft border border-positive-edge px-4 py-3 text-center">
                    <p className="text-xs uppercase tracking-wide text-positive-ink">After</p>
                    <p className="mt-1 text-2xl font-bold tabular-nums text-positive-ink">{row.after}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="px-2 text-xs text-ink-faint"
          >
            The "after" values save to the client profile — the next proposal starts from these numbers.
          </motion.p>
        </div>
      </div>
    </SlideShell>
  )
}
