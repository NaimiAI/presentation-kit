// Startup facts — swap them for your own when adapting the template.
// Anything specific to a given investor comes in through personalization.

export const STARTUP = {
  name: 'Loop',
  oneliner: 'The returns-management platform for e-commerce brands: turn returns into exchanges, recover margin, and keep customers instead of losing them at checkout.',
  stage: 'Seed',
}

/** Round economics, in whole US dollars. Post-money = target + preMoney. */
export const ROUND = {
  target: 2_500_000, // raising $2.5M
  preMoney: 10_000_000, // $10M pre → $12.5M post-money
  useOfFunds: [
    { label: 'Product & engineering', share: 45 },
    { label: 'Sales & marketing', share: 35 },
    { label: 'Operations & infrastructure', share: 20 },
  ],
}

/** MRR by month, in whole US dollars — data for the traction chart. */
export const MRR_SERIES = [
  { month: 'Jul', value: 8_000 },
  { month: 'Aug', value: 10_000 },
  { month: 'Sep', value: 13_000 },
  { month: 'Oct', value: 16_000 },
  { month: 'Nov', value: 19_000 },
  { month: 'Dec', value: 23_000 },
  { month: 'Jan', value: 27_000 },
  { month: 'Feb', value: 31_000 },
  { month: 'Mar', value: 35_000 },
  { month: 'Apr', value: 39_000 },
  { month: 'May', value: 43_000 },
  { month: 'Jun', value: 46_000 },
]

/** Compact USD, e.g. $2.5M, $46K — for headline figures. */
export function formatUsdCompact(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(Math.max(0, value))
}

/** Full USD with no cents, e.g. $250,000 — for the ticket calculator. */
export function formatUsd(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(value)))
}

export function formatDate(iso: string, fallback = ''): string {
  if (!iso.trim()) return fallback
  const date = new Date(iso.trim())
  if (Number.isNaN(date.getTime())) return fallback
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
