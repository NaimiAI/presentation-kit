import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { BulletItem, Kicker, SlideShell, StatCard } from '../kit/components'
import { useDemoField } from '../kit/hooks'
import { personalizationValue } from '../kit/host'
import type { SlideProps } from './index'

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function Slide04Summary({ personalization }: SlideProps) {
  const companyName = personalization.companyName.trim() || 'your company'
  const contactName = personalizationValue(personalization, 'contactName')

  // Same keys as the calculator slide — values flow through demo.demoData.
  const [monthlyVisitors] = useDemoField<number>('monthlyVisitors', { defaultValue: 10000 })
  const [conversionRate] = useDemoField<number>('conversionRate', { defaultValue: 2 })
  const [avgOrderValue] = useDemoField<number>('avgOrderValue', { defaultValue: 85 })
  const [upliftPct] = useDemoField<number>('upliftPct', { defaultValue: 25 })

  const visitors = Math.max(0, Number(monthlyVisitors) || 0)
  const conversion = Math.max(0, Math.min(100, Number(conversionRate) || 0))
  const aov = Math.max(0, Number(avgOrderValue) || 0)
  const uplift = Math.max(0, Math.min(200, Number(upliftPct) || 0))

  const currentRevenue = visitors * (conversion / 100) * aov
  const newRevenue = visitors * ((conversion * (1 + uplift / 100)) / 100) * aov
  const monthlyGain = newRevenue - currentRevenue
  const yearlyGain = monthlyGain * 12

  return (
    <SlideShell>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Kicker tone="positive">What the numbers say</Kicker>
        <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight text-ink">
          For {companyName} that's{' '}
          <span className="text-positive-ink">{formatMoney(yearlyGain)}</span>{' '}
          in extra revenue per year
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-10 grid gap-4 md:grid-cols-3"
      >
        <StatCard label="Extra revenue per month" value={`+${formatMoney(monthlyGain)}`} accent />
        <StatCard label="Current revenue / mo" value={formatMoney(currentRevenue)} />
        <StatCard label="Forecast / mo" value={formatMoney(newRevenue)} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-10 rounded-2xl border border-edge bg-card p-6"
      >
        <p className="text-xs uppercase tracking-wide text-ink-faint mb-4">Inputs</p>
        <div className="grid gap-3 md:grid-cols-2">
          <BulletItem value={new Intl.NumberFormat('en-US').format(visitors)}>Monthly visitors</BulletItem>
          <BulletItem value={`${conversion.toFixed(1)}%`}>Current conversion rate</BulletItem>
          <BulletItem value={formatMoney(aov)}>Average order value</BulletItem>
          <BulletItem value={`+${uplift}%`}>Conversion uplift</BulletItem>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-positive-soft border border-positive-edge px-4 py-2 text-positive-ink text-sm"
      >
        <ArrowRight className="w-4 h-4" />
        {contactName ? `${contactName}, these` : 'These'} numbers are saved — we'll send a personalized proposal with the same figures
      </motion.div>
    </SlideShell>
  )
}
