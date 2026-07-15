import type { Personalization } from '../kit/host'
import { personalizationValue } from '../kit/host'

/** The listing agent — static template identity. Swap for your own brokerage. */
export const AGENT = {
  name: 'Claire Bennett',
  brokerage: 'Bennett Residential',
  blurb: 'Independent brokerage · Portland, OR',
  phone: '(503) 555-0142',
  email: 'claire@bennettresidential.com',
}

/** Career track record shown on the "Why Claire" slide (static). */
export const CAREER_STATS = [
  { value: '94', label: 'Homes sold' },
  { value: '11', label: 'Avg. days on market' },
  { value: '101%', label: 'Avg. sale-to-list' },
  { value: '$62M', label: 'Career volume' },
]

export const TESTIMONIAL = {
  quote: 'Claire had us under contract in nine days, $23k over ask.',
  author: 'Mark & Jenna T.',
  neighborhood: 'Laurelhurst',
}

/** Net-proceeds assumptions. Footnoted on the pricing slide. */
export const COMMISSION_RATE = 0.055
export const CLOSING_COST_RATE = 0.015

export interface PricingStrategy {
  key: string
  name: string
  tagline: string
  tradeoff: string
}

/** The three pricing strategies (radio picker on the pricing slide). */
export const PRICING_STRATEGIES: PricingStrategy[] = [
  {
    key: 'premium',
    name: 'Premium',
    tagline: 'Test the ceiling',
    tradeoff: 'Aim above market to find the top buyer — expect more days on market.',
  },
  {
    key: 'market',
    name: 'At market',
    tagline: 'Balanced',
    tradeoff: 'Price to the comps for steady showings and a clean, on-pace sale.',
  },
  {
    key: 'sharp',
    name: 'Sharp',
    tagline: 'Drive multiple offers',
    tradeoff: 'List a touch under to spark competition and push the final price up.',
  },
]

export interface Comp {
  address: string
  soldPrice: number
  daysOnMarket: number
}

const USD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

/** "$725,000" — whole-dollar USD, US market. */
export function formatUsd(value: number): string {
  return USD.format(Math.max(0, Math.round(value)))
}

/** "Mar 14, 2026" from an ISO date; falls back to today when empty/invalid. */
export function formatDate(iso: string, fallback = ''): string {
  const raw = iso.trim()
  const date = raw ? new Date(raw) : new Date()
  if (Number.isNaN(date.getTime())) return fallback
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/** Pull the first dollar figure out of free text like "$725,000" → 725000. */
export function parsePrice(raw: string, fallback = 0): number {
  const digits = String(raw ?? '').replace(/[^\d]/g, '')
  return digits ? Number.parseInt(digits, 10) : fallback
}

/** One highlight per line → trimmed, non-empty list. */
export function parseHighlights(raw: string): string[] {
  return String(raw ?? '')
    .split('\n')
    .map((line) => line.replace(/^[•\-–—◆*]\s*/, '').trim())
    .filter(Boolean)
}

/**
 * Comps table from a textarea, one row per line:
 *   Address | Sold price | Days on market
 * Extra/short columns degrade gracefully.
 */
export function parseComps(raw: string): Comp[] {
  return String(raw ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(/\s*\|\s*|\t+/).map((part) => part.trim())
      return {
        address: parts[0] || '—',
        soldPrice: parsePrice(parts[1] ?? '', 0),
        daysOnMarket: parsePrice(parts[2] ?? '', 0),
      }
    })
}

/** Median of a numeric list; 0 for an empty list (callers guard on length). */
export function median(values: number[]): number {
  const clean = values.filter((v) => v > 0).sort((a, b) => a - b)
  if (clean.length === 0) return 0
  const mid = Math.floor(clean.length / 2)
  return clean.length % 2 === 0 ? Math.round((clean[mid - 1] + clean[mid]) / 2) : clean[mid]
}

/** Everything the deck reads from personalization, with sensible fallbacks. */
export function getListing(personalization: Personalization) {
  const value = (key: string, fallback = '') => personalizationValue(personalization, key, fallback)

  return {
    sellerNames: personalization.companyName.trim() || 'the owners',
    propertyAddress: value('propertyAddress', 'your home'),
    presentDate: formatDate(value('presentDate'), formatDate('')),
    highlights: parseHighlights(value('homeHighlights')),
    comps: parseComps(value('compsLines')),
    recommendedPrice: parsePrice(value('recommendedPrice'), 725000),
    recommendedPriceText: value('recommendedPrice', formatUsd(725000)),
    bookingUrl: value('bookingUrl'),
  }
}
