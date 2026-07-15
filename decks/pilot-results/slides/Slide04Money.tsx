import { motion } from 'framer-motion'
import { Coins } from 'lucide-react'
import { Kicker, RangeField, SlideShell, StatCard } from '../kit/components'
import { useDemoField } from '../kit/hooks'
import { clampNumber, formatNumber, formatUsd } from './metrics'
import type { SlideProps } from './index'

/** Dollar impact: hours saved on faster order processing × the labor rate. */
export default function Slide04Money(_props: SlideProps) {
  const [processBefore] = useDemoField<number>('responseMinBefore', { defaultValue: 14 })
  const [processAfter] = useDemoField<number>('responseMinAfter', { defaultValue: 3 })
  const [ordersTotal, setOrdersTotal] = useDemoField<number>('dialogsTotal', { defaultValue: 9200 })
  const [laborRate, setLaborRate] = useDemoField<number>('avgCheck', { defaultValue: 32 })

  const safeProcessBefore = clampNumber(processBefore, 1, 600, 14)
  const safeProcessAfter = clampNumber(processAfter, 1, 600, 3)
  const safeOrders = Math.round(clampNumber(ordersTotal, 0, 1000000, 9200))
  const safeRate = Math.round(clampNumber(laborRate, 0, 500, 32))

  const minutesSavedPerOrder = Math.max(0, safeProcessBefore - safeProcessAfter)
  const hoursSaved = (safeOrders * minutesSavedPerOrder) / 60
  const pilotSavings = hoursSaved * safeRate
  const monthlySavings = pilotSavings / 1.5 // the pilot ran 6 weeks
  const yearlySavings = monthlySavings * 12

  const costPerOrderBefore = safeRate * (safeProcessBefore / 60)
  const costPerOrderAfter = safeRate * (safeProcessAfter / 60)

  return (
    <SlideShell width="wide">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Kicker tone="positive">Dollar impact</Kicker>
        <h2 className="font-display text-3xl font-bold text-ink md:text-4xl">
          What faster processing saves you
        </h2>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6 rounded-2xl border border-edge bg-card p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 text-ink-soft">
            <Coins className="h-4 w-4" />
            <span className="text-sm font-semibold uppercase tracking-wide">Assumptions</span>
          </div>
          <RangeField
            label="Orders processed during the pilot"
            value={safeOrders}
            min={100}
            max={50000}
            step={100}
            displayValue={formatNumber(safeOrders)}
            onChange={(value) => setOrdersTotal(Math.round(value))}
          />
          <RangeField
            label="Fully-loaded labor rate, $/hr"
            value={safeRate}
            min={15}
            max={120}
            step={1}
            displayValue={formatUsd(safeRate)}
            onChange={(value) => setLaborRate(Math.round(value))}
          />
          <p className="text-xs leading-relaxed text-ink-faint">
            Processing time comes from the metrics slide: {Math.round(safeProcessBefore)} min → {Math.round(safeProcessAfter)} min per order.
            Cost per order: {formatUsd(costPerOrderBefore)} → {formatUsd(costPerOrderAfter)}.
          </p>
        </motion.div>

        <div className="grid content-start gap-4">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <StatCard
              label="Hours saved during the pilot"
              value={`+${formatNumber(Math.round(hoursSaved))} hrs`}
              sub={`${formatUsd(pilotSavings)} in labor saved`}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <StatCard
              label="Per month"
              value={`+${formatUsd(monthlySavings)}`}
              sub="at the current order volume"
              accent
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <StatCard
              label="Annualized"
              value={`+${formatUsd(yearlySavings)}`}
              sub="before any growth in order volume"
              accent
            />
          </motion.div>
        </div>
      </div>
    </SlideShell>
  )
}
