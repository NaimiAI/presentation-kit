import { motion } from 'framer-motion'
import { Calculator, TrendingUp } from 'lucide-react'
import { Badge, RangeField, SlideShell } from '../kit/components'
import { useDemoField } from '../kit/hooks'
import type { SlideProps } from './index'

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value)
}

export default function Slide03Calculator({ personalization }: SlideProps) {
  const companyName = personalization.companyName.trim() || 'the client'

  // Keys match manifest.json → demoData.fields. Edited values are saved into
  // demo.demoData and reused as defaults in future demos for the same client.
  const [monthlyVisitors, setMonthlyVisitors] = useDemoField<number>('monthlyVisitors', { defaultValue: 10000 })
  const [conversionRate, setConversionRate] = useDemoField<number>('conversionRate', { defaultValue: 2 })
  const [avgOrderValue, setAvgOrderValue] = useDemoField<number>('avgOrderValue', { defaultValue: 85 })
  const [upliftPct, setUpliftPct] = useDemoField<number>('upliftPct', { defaultValue: 25 })

  const safeVisitors = Math.max(0, Number(monthlyVisitors) || 0)
  const safeConversion = Math.max(0, Math.min(100, Number(conversionRate) || 0))
  const safeAov = Math.max(0, Number(avgOrderValue) || 0)
  const safeUplift = Math.max(0, Math.min(200, Number(upliftPct) || 0))

  const currentRevenue = safeVisitors * (safeConversion / 100) * safeAov
  const newRevenue = safeVisitors * ((safeConversion * (1 + safeUplift / 100)) / 100) * safeAov
  const monthlyGain = newRevenue - currentRevenue
  const yearlyGain = monthlyGain * 12

  return (
    <SlideShell width="wide">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="mb-3">
          <Badge icon={Calculator} size="sm">Impact calculator</Badge>
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">
          Let's plug in {companyName}'s numbers
        </h2>
        <p className="mt-2 text-ink-soft">
          The values you enter are saved — we'll drop them into the proposal automatically.
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-edge bg-card p-6 shadow-sm space-y-6"
        >
          <RangeField
            label="Monthly visitors"
            value={safeVisitors}
            min={0}
            max={200000}
            step={500}
            displayValue={formatNumber(safeVisitors)}
            onChange={setMonthlyVisitors}
          />
          <RangeField
            label="Order conversion rate, %"
            value={safeConversion}
            min={0}
            max={20}
            step={0.1}
            suffix="%"
            displayValue={`${safeConversion.toFixed(1)} %`}
            onChange={(value) => setConversionRate(Number(value.toFixed(1)))}
          />
          <RangeField
            label="Average order value, $"
            value={safeAov}
            min={0}
            max={1000}
            step={5}
            suffix="$"
            displayValue={formatMoney(safeAov)}
            onChange={setAvgOrderValue}
          />
          <RangeField
            label="Conversion uplift, %"
            value={safeUplift}
            min={0}
            max={100}
            step={1}
            suffix="%"
            displayValue={`+${safeUplift} %`}
            onChange={setUpliftPct}
            highlight
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-positive-edge bg-positive-soft p-6 shadow-sm flex flex-col gap-5"
        >
          <div className="flex items-center gap-2 text-positive-ink">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wide">Forecast</span>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-ink-faint">Current revenue / mo</p>
            <p className="mt-1 text-2xl font-semibold text-ink-soft">{formatMoney(currentRevenue)}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-ink-faint">Forecast / mo</p>
            <p className="mt-1 text-3xl font-bold text-ink">{formatMoney(newRevenue)}</p>
          </div>

          <div className="rounded-xl bg-positive-soft border border-positive-edge p-4">
            <p className="text-xs uppercase tracking-wide text-positive-ink">Revenue uplift</p>
            <p className="mt-1 text-3xl font-bold text-positive-ink">+{formatMoney(monthlyGain)} / mo</p>
            <p className="mt-1 text-sm text-positive-ink/80">{formatMoney(yearlyGain)} per year</p>
          </div>

          <p className="text-xs text-ink-faint">
            Illustrative estimate only. The final forecast comes after a pilot.
          </p>
        </motion.div>
      </div>
    </SlideShell>
  )
}
