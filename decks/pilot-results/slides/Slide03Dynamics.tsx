import { motion } from 'framer-motion'
import { LineChart } from 'lucide-react'
import { BulletItem, Kicker, SlideShell } from '../kit/components'
import { useDemoField } from '../kit/hooks'
import { clampNumber, weeklyTrajectory } from './metrics'
import type { SlideProps } from './index'

const CHART = { width: 720, height: 260, padX: 40, padY: 24 }

/** Weekly auto-resolution trend — an SVG chart built from the live metrics. */
export default function Slide03Dynamics(_props: SlideProps) {
  const [autoBefore] = useDemoField<number>('convBefore', { defaultValue: 18 })
  const [autoAfter] = useDemoField<number>('convAfter', { defaultValue: 61 })

  const safeBefore = clampNumber(autoBefore, 0, 100, 18)
  const safeAfter = clampNumber(autoAfter, 0, 100, 61)
  const weeks = weeklyTrajectory(safeBefore, safeAfter)

  const maxValue = Math.max(...weeks) * 1.15
  const innerWidth = CHART.width - CHART.padX * 2
  const innerHeight = CHART.height - CHART.padY * 2
  const barWidth = (innerWidth / weeks.length) * 0.55

  return (
    <SlideShell width="wide">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Kicker>Trend</Kicker>
        <h2 className="font-display text-3xl font-bold text-ink md:text-4xl">
          Auto-resolution climbed every week
        </h2>
      </motion.div>

      <div className="grid items-center gap-8 lg:grid-cols-[1.5fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-edge bg-card p-6 shadow-sm"
        >
          <div className="mb-4 flex items-center gap-2 text-ink-soft">
            <LineChart className="h-4 w-4" />
            <span className="text-sm font-semibold uppercase tracking-wide">Tickets auto-resolved, % by week</span>
          </div>

          <svg viewBox={`0 0 ${CHART.width} ${CHART.height}`} className="w-full" role="img" aria-label="Weekly auto-resolution trend">
            {[0.25, 0.5, 0.75, 1].map((tick) => {
              const y = CHART.height - CHART.padY - innerHeight * tick
              return (
                <g key={tick}>
                  <line
                    x1={CHART.padX}
                    x2={CHART.width - CHART.padX}
                    y1={y}
                    y2={y}
                    stroke="var(--nk-edge)"
                    strokeDasharray="4 6"
                  />
                  <text x={CHART.padX - 8} y={y + 4} textAnchor="end" fontSize="11" fill="var(--nk-ink-faint)">
                    {Math.round(maxValue * tick)}
                  </text>
                </g>
              )
            })}

            {weeks.map((value, index) => {
              const slot = innerWidth / weeks.length
              const x = CHART.padX + slot * index + (slot - barWidth) / 2
              const barHeight = (value / maxValue) * innerHeight
              const y = CHART.height - CHART.padY - barHeight
              const isLast = index === weeks.length - 1
              return (
                <g key={index}>
                  <motion.rect
                    initial={{ height: 0, y: CHART.height - CHART.padY }}
                    animate={{ height: barHeight, y }}
                    transition={{ delay: 0.25 + index * 0.07, type: 'spring', damping: 20 }}
                    x={x}
                    width={barWidth}
                    rx={6}
                    fill={isLast ? 'var(--nk-positive)' : 'var(--nk-accent)'}
                    opacity={isLast ? 1 : 0.45 + index * 0.06}
                  />
                  <text
                    x={x + barWidth / 2}
                    y={CHART.height - CHART.padY + 16}
                    textAnchor="middle"
                    fontSize="11"
                    fill="var(--nk-ink-faint)"
                  >
                    W{index + 1}
                  </text>
                  {isLast && (
                    <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--nk-positive-ink)">
                      {Math.round(value)}%
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink-faint">What drove it</h3>
          <BulletItem>Weeks 1–2: connected the order and support systems, mapped the base workflows</BulletItem>
          <BulletItem>Weeks 3–4: tuned the automation on real tickets and edge cases</BulletItem>
          <BulletItem>Weeks 5–6: auto-routing and auto-replies took over the repetitive volume</BulletItem>
          <p className="pt-3 text-xs leading-relaxed text-ink-faint">
            The chart is built from the values on the previous slide — change them and the trend recalculates.
          </p>
        </motion.div>
      </div>
    </SlideShell>
  )
}
