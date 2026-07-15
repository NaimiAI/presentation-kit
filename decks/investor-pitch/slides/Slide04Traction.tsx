import { motion } from 'framer-motion'
import { Kicker, SlideShell, StatCard } from '../kit/components'
import { MRR_SERIES, formatUsdCompact } from './content'
import type { SlideProps } from './index'

const CHART_W = 640
const CHART_H = 200
const PAD = 8

function chartPoints(): string {
  const max = Math.max(...MRR_SERIES.map((point) => point.value))
  const stepX = (CHART_W - PAD * 2) / (MRR_SERIES.length - 1)
  return MRR_SERIES
    .map((point, index) => {
      const x = PAD + index * stepX
      const y = CHART_H - PAD - ((point.value / max) * (CHART_H - PAD * 2))
      return `${x},${y}`
    })
    .join(' ')
}

/** Traction: SVG chart of MRR over 12 months + headline metrics. */
export default function Slide04Traction(_: SlideProps) {
  const points = chartPoints()
  const areaPoints = `${PAD},${CHART_H - PAD} ${points} ${CHART_W - PAD},${CHART_H - PAD}`
  const first = MRR_SERIES[0]
  const last = MRR_SERIES[MRR_SERIES.length - 1]

  return (
    <SlideShell width="default">
      <Kicker tone="positive">Traction</Kicker>
      <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink md:text-5xl">
        MRR up 5.8× in twelve months
      </h2>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-10 rounded-3xl border border-white/60 bg-white/55 p-6 shadow-lg shadow-accent-soft backdrop-blur-md"
      >
        <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="w-full" role="img" aria-label="MRR growth by month">
          <defs>
            <linearGradient id="mrrFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--nk-accent)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--nk-accent)" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <polygon points={areaPoints} fill="url(#mrrFill)" />
          <polyline
            points={points}
            fill="none"
            stroke="var(--nk-accent)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {points.split(' ').map((pair, index) => {
            const [x, y] = pair.split(',').map(Number)
            const isLast = index === MRR_SERIES.length - 1
            return (
              <circle
                key={pair}
                cx={x}
                cy={y}
                r={isLast ? 5 : 3}
                fill={isLast ? 'var(--nk-positive)' : 'var(--nk-card)'}
                stroke="var(--nk-accent)"
                strokeWidth="2"
              />
            )
          })}
        </svg>
        <div className="mt-2 flex justify-between text-[11px] uppercase tracking-wider text-ink-faint">
          <span>{first.month} · {formatUsdCompact(first.value)}</span>
          <span className="font-semibold text-positive-ink">{last.month} · {formatUsdCompact(last.value)}</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mt-6 grid gap-4 sm:grid-cols-4"
      >
        <StatCard label="Net revenue retention" value="124%" />
        <StatCard label="Logo churn" value="1.8%" sub="per month" />
        <StatCard label="CAC payback" value="7 mo" />
        <StatCard label="Trial → contract" value="71%" accent />
      </motion.div>
    </SlideShell>
  )
}
