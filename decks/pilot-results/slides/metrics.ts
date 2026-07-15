// Shared report math: one source of truth for every slide.

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export function formatUsd(value: number): string {
  return usdFormatter.format(Math.max(0, Math.round(value)))
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

/** Relative change as a signed percentage. */
export function deltaPct(before: number, after: number): number {
  if (before <= 0) return 0
  return Math.round(((after - before) / before) * 100)
}

export function clampNumber(value: unknown, min: number, max: number, fallback: number): number {
  const num = Number(value)
  if (!Number.isFinite(num)) return fallback
  return Math.min(max, Math.max(min, num))
}

/**
 * Weekly trajectory of a metric for the chart: a smooth climb from "before"
 * to "after" (ease-out), so the trend reads like a real pilot ramp-up.
 */
export function weeklyTrajectory(before: number, after: number, weeks = 6): number[] {
  return Array.from({ length: weeks }, (_, index) => {
    const t = index / (weeks - 1)
    const eased = 1 - Math.pow(1 - t, 2)
    return before + (after - before) * eased
  })
}
