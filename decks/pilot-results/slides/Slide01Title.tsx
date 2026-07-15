import { motion } from 'framer-motion'
import { ClipboardCheck } from 'lucide-react'
import { Badge, GradientText, SlideShell, StatCard } from '../kit/components'
import { useDemoField } from '../kit/hooks'
import { personalizationValue } from '../kit/host'
import { deltaPct, formatNumber } from './metrics'
import type { SlideProps } from './index'

export default function Slide01Title({ personalization }: SlideProps) {
  const companyName = personalization.companyName.trim() || 'the client'
  const periodLabel = personalizationValue(personalization, 'periodLabel', 'the last 6 weeks')
  const managerName = personalizationValue(personalization, 'managerName')

  const [processBefore] = useDemoField<number>('responseMinBefore', { defaultValue: 14 })
  const [processAfter] = useDemoField<number>('responseMinAfter', { defaultValue: 3 })
  const [autoBefore] = useDemoField<number>('convBefore', { defaultValue: 18 })
  const [autoAfter] = useDemoField<number>('convAfter', { defaultValue: 61 })
  const [ordersTotal] = useDemoField<number>('dialogsTotal', { defaultValue: 9200 })

  return (
    <SlideShell orbs center width="wide">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Badge icon={ClipboardCheck} tone="positive">Pilot complete</Badge>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mx-auto mt-6 max-w-3xl font-display text-4xl font-bold leading-tight text-ink md:text-6xl"
      >
        Pilot results for <GradientText>{companyName}</GradientText>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-lg text-ink-soft"
      >
        {periodLabel}
        {managerName && <> · report by {managerName}</>}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mx-auto mt-12 grid max-w-3xl gap-4 text-left sm:grid-cols-3"
      >
        <StatCard
          label="Order-processing time"
          value={`−${Math.abs(deltaPct(processBefore, processAfter))}%`}
          sub={`${processBefore} min → ${processAfter} min`}
          accent
        />
        <StatCard
          label="Tickets auto-resolved"
          value={`+${deltaPct(autoBefore, autoAfter)}%`}
          sub={`${autoBefore}% → ${autoAfter}%`}
          accent
        />
        <StatCard label="Orders processed" value={formatNumber(ordersTotal)} sub="during the pilot" />
      </motion.div>
    </SlideShell>
  )
}
