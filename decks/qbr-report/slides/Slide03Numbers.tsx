import { motion } from 'framer-motion'
import { Minus, TrendingDown, TrendingUp } from 'lucide-react'
import { Kicker, SlideShell } from '../kit/components'
import { getReport, type Kpi } from './content'
import type { SlideProps } from './index'

const CHART = { width: 720, height: 220, padX: 8, padTop: 16, padBottom: 8 }

/** Colored delta chip: emerald up, amber down, neutral flat. */
function DeltaChip({ kpi }: { kpi: Kpi }) {
  if (!kpi.change) return null
  if (kpi.direction === 'up') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-positive-soft px-2.5 py-1 text-xs font-semibold text-positive-ink">
        <TrendingUp className="h-3.5 w-3.5" />
        {kpi.change}
      </span>
    )
  }
  if (kpi.direction === 'down') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-critical-soft px-2.5 py-1 text-xs font-semibold text-critical">
        <TrendingDown className="h-3.5 w-3.5" />
        {kpi.change}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-ink-faint">
      <Minus className="h-3.5 w-3.5" />
      {kpi.change}
    </span>
  )
}

/** Build the SVG path + area for the trend series. */
function buildTrend(series: number[]) {
  const innerW = CHART.width - CHART.padX * 2
  const innerH = CHART.height - CHART.padTop - CHART.padBottom
  const max = Math.max(...series)
  const min = Math.min(...series)
  const span = max - min || 1
  const step = series.length > 1 ? innerW / (series.length - 1) : 0

  const points = series.map((value, index) => {
    const x = CHART.padX + step * index
    const y = CHART.padTop + innerH - ((value - min) / span) * innerH
    return { x, y }
  })

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const baseY = CHART.height - CHART.padBottom
  const area = `${line} L ${points[points.length - 1].x.toFixed(1)} ${baseY} L ${points[0].x.toFixed(1)} ${baseY} Z`

  return { points, line, area }
}

/** The numbers: a KPI grid plus an SVG trend chart, all from text fields. */
export default function Slide03Numbers({ personalization }: SlideProps) {
  const report = getReport(personalization)
  const hasChart = report.trendSeries.length >= 2
  const trend = hasChart ? buildTrend(report.trendSeries) : null

  return (
    <SlideShell width="wide">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Kicker>The numbers</Kicker>
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
          {report.periodLabel} in metrics
        </h2>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {report.kpis.map((kpi, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 + index * 0.05 }}
            className="rounded-2xl border border-edge bg-card p-5 shadow-sm"
          >
            <p className="text-xs uppercase tracking-wide text-ink-faint">{kpi.metric}</p>
            <div className="mt-3 flex items-end justify-between gap-2">
              <p className="font-display text-3xl font-bold tabular-nums text-ink">{kpi.value}</p>
              <DeltaChip kpi={kpi} />
            </div>
          </motion.div>
        ))}
      </div>

      {hasChart && trend && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 rounded-2xl border border-edge bg-card p-6 shadow-sm"
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink-soft">{report.trendLabel}</p>
          <svg
            viewBox={`0 0 ${CHART.width} ${CHART.height}`}
            className="w-full"
            preserveAspectRatio="none"
            role="img"
            aria-label={report.trendLabel}
          >
            <defs>
              <linearGradient id="qbrTrendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--nk-accent)" stopOpacity="0.18" />
                <stop offset="100%" stopColor="var(--nk-accent)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d={trend.area}
              fill="url(#qbrTrendFill)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            />
            <motion.path
              d={trend.line}
              fill="none"
              stroke="var(--nk-accent)"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.35, duration: 0.7 }}
            />
            {trend.points.map((point, index) =>
              index === trend.points.length - 1 ? (
                <circle key={index} cx={point.x} cy={point.y} r={4} fill="var(--nk-accent)" />
              ) : null,
            )}
          </svg>
        </motion.div>
      )}
    </SlideShell>
  )
}
