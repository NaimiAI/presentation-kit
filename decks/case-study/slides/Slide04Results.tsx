import { motion } from 'framer-motion'
import { Kicker, SlideShell } from '../kit/components'
import { QUOTE, RESULTS, TICKETS_PER_WEEK } from './content'
import quoteHeadshot from '../assets/quote-headshot.webp'
import type { SlideProps } from './index'

const CHART = { width: 520, height: 180, padX: 8, padTop: 16, padBottom: 8 }

/** Build an SVG polyline path (and a closed area path) from the weekly series. */
function buildChart() {
  const values = TICKETS_PER_WEEK
  const max = Math.max(...values)
  const min = Math.min(...values)
  const span = max - min || 1
  const innerW = CHART.width - CHART.padX * 2
  const innerH = CHART.height - CHART.padTop - CHART.padBottom

  const points = values.map((value, index) => {
    const x = CHART.padX + (innerW * index) / (values.length - 1)
    const y = CHART.padTop + innerH * (1 - (value - min) / span)
    return { x, y }
  })

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const baseY = CHART.height - CHART.padBottom
  const area = `${line} L${points[points.length - 1].x.toFixed(1)},${baseY} L${points[0].x.toFixed(1)},${baseY} Z`
  return { points, line, area }
}

/** The results: the money stats, a downward ticket-trend chart, and the quote. */
export default function Slide04Results(_props: SlideProps) {
  const { points, line, area } = buildChart()
  const last = points[points.length - 1]

  return (
    <SlideShell width="wide">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Kicker tone="positive">The results</Kicker>
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
          90 days later, the queue looked different
        </h2>
      </motion.div>

      {/* Oversized metric grid. */}
      <div className="mt-9 grid grid-cols-2 gap-x-8 gap-y-7 lg:grid-cols-4">
        {RESULTS.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 + index * 0.06 }}
          >
            <p className="cs-metric text-5xl text-positive-ink md:text-6xl">{stat.value}</p>
            <p className="mt-3 text-sm font-semibold text-ink">{stat.label}</p>
            <p className="text-xs text-ink-faint">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Ticket-trend chart. */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-edge bg-card p-6"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
            Support tickets per week · weeks 1–12
          </p>
          <svg
            viewBox={`0 0 ${CHART.width} ${CHART.height}`}
            className="mt-4 w-full"
            role="img"
            aria-label="Support tickets per week trending down over twelve weeks"
          >
            <defs>
              <linearGradient id="csArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--nk-accent)" stopOpacity="0.22" />
                <stop offset="100%" stopColor="var(--nk-accent)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d={area}
              fill="url(#csArea)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            />
            <motion.path
              d={line}
              fill="none"
              stroke="var(--nk-accent)"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.35, duration: 0.9, ease: 'easeInOut' }}
            />
            <motion.circle
              cx={last.x}
              cy={last.y}
              r={4.5}
              fill="var(--nk-accent)"
              stroke="var(--nk-card)"
              strokeWidth={2}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, type: 'spring', damping: 14 }}
            />
          </svg>
          <p className="mt-2 text-xs text-ink-faint">
            From ~480 to under 300 tickets a week — a steady decline, not a one-week spike.
          </p>
        </motion.div>

        {/* Pull quote. */}
        <motion.figure
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36 }}
          className="flex flex-col justify-center rounded-2xl border border-accent-edge bg-accent-soft p-6"
        >
          <blockquote className="font-display text-xl font-semibold leading-snug text-ink">
            “{QUOTE.text}”
          </blockquote>
          <figcaption className="mt-5 flex items-center gap-3">
            <img
              src={quoteHeadshot}
              alt={QUOTE.name}
              className="h-14 w-14 rounded-full border border-edge object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-ink">{QUOTE.name}</p>
              <p className="text-xs text-ink-faint">{QUOTE.role}</p>
            </div>
          </figcaption>
        </motion.figure>
      </div>
    </SlideShell>
  )
}
