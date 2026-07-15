import type { Personalization } from '../kit/host'
import { personalizationValue } from '../kit/host'

/** Sender agency — swap for your own details when adapting the template. */
export const AGENCY = {
  name: 'Beacon Digital',
  tagline: 'Growth marketing · retained partner',
}

/** Account health states. Anything not "on track" is treated as attention (amber). */
export type HealthTone = 'positive' | 'attention'

export function healthTone(status: string): HealthTone {
  return /on track|healthy|great|strong/i.test(status.trim()) ? 'positive' : 'attention'
}

/** Split a textarea into trimmed, non-empty lines (drops leading bullets). */
export function parseLines(raw: string): string[] {
  return raw
    .split('\n')
    .map((line) => line.replace(/^[•\-*]\s*/, '').trim())
    .filter(Boolean)
}

export interface Kpi {
  metric: string
  value: string
  /** Raw change string as entered, e.g. "+22%" or "-4%" ('' when omitted). */
  change: string
  /** 'up' for a leading +, 'down' for a leading −, 'flat' otherwise. */
  direction: 'up' | 'down' | 'flat'
}

/** Parse `Metric | value | change` lines into KPI cards (max 6, malformed skipped). */
export function parseKpis(raw: string): Kpi[] {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(/\s*\|\s*|\t+/).map((part) => part.trim())
      const metric = parts[0] ?? ''
      const value = parts[1] ?? ''
      if (!metric || !value) return null
      const change = parts[2] ?? ''
      const direction: Kpi['direction'] = change.startsWith('+')
        ? 'up'
        : /^[-−]/.test(change)
          ? 'down'
          : 'flat'
      return { metric, value, change, direction }
    })
    .filter((kpi): kpi is Kpi => kpi !== null)
    .slice(0, 6)
}

/** Parse a comma-separated list of numbers into a clean numeric series. */
export function parseSeries(raw: string): number[] {
  return raw
    .split(/[,\s]+/)
    .map((token) => token.trim())
    .filter(Boolean)
    .map((token) => Number.parseFloat(token.replace(/[^\d.-]/g, '')))
    .filter((num) => Number.isFinite(num))
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

/** Format an ISO date as "Mar 14, 2026"; returns the fallback when empty/invalid. */
export function formatDate(iso: string, fallback = ''): string {
  if (!iso.trim()) return fallback
  const date = new Date(iso.trim())
  if (Number.isNaN(date.getTime())) return fallback
  return dateFormatter.format(date)
}

/** All report content assembled from personalization, with safe fallbacks. */
export function getReport(personalization: Personalization) {
  const value = (key: string, fallback = '') => personalizationValue(personalization, key, fallback)

  return {
    companyName: personalization.companyName.trim() || 'your account',
    periodLabel: value('periodLabel', 'This quarter'),
    presentDate: formatDate(value('presentDate')),
    healthStatus: value('healthStatus', 'On track'),
    summaryNote: value('summaryNote'),
    wins: parseLines(value('winsLines')),
    watchouts: parseLines(value('watchoutsLines')),
    kpis: parseKpis(value('kpiLines')),
    trendSeries: parseSeries(value('trendSeries')),
    trendLabel: value('trendLabel', 'Trend'),
    delivered: parseLines(value('deliveredLines')),
    inFlight: parseLines(value('inFlightLines')),
    nextPeriodLabel: value('nextPeriodLabel', 'next quarter'),
    plan: parseLines(value('planLines')),
    recommendationNote: value('recommendationNote'),
    upsellLine: value('upsellLine'),
    nextReviewDate: formatDate(value('nextReviewDate')),
    managerName: value('managerName', 'your account lead'),
    managerContact: value('managerContact'),
    bookingUrl: value('bookingUrl'),
  }
}
