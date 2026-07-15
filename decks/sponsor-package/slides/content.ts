// Event and package data — edit for your own event.

export const EVENT = {
  name: 'Forward Summit 2026',
  kind: 'the conference for product & growth leaders',
  date: 'September 24–25, 2026',
  place: 'Austin, TX · Riverfront Hall',
  organizer: 'The Forward Summit team',
}

export interface Tier {
  // key stays 'general' | 'partner' | 'sponsor' internally so the selected-tier
  // state and the benefits matrix line up; label is the display name.
  key: string
  label: string
  priceUsd: number
  seats: string
  vibe: string
}

export const TIERS: Tier[] = [
  { key: 'general', label: 'Headline', priceUsd: 30000, seats: '1 company', vibe: 'Main-stage keynote, category exclusivity, top billing everywhere' },
  { key: 'partner', label: 'Partner', priceUsd: 15000, seats: 'up to 4 companies', vibe: 'Booth, breakout session, prominent presence' },
  { key: 'sponsor', label: 'Community', priceUsd: 7500, seats: 'up to 8 companies', vibe: 'Your brand across materials and on-site' },
]

/** Benefits matrix: value per tier ('' — not included). */
export const BENEFITS: Array<{ label: string; general: string; partner: string; sponsor: string }> = [
  { label: 'Logo on all materials and the livestream', general: '✓', partner: '✓', sponsor: '✓' },
  { label: 'Booth in the networking hall', general: '120 sq ft', partner: '60 sq ft', sponsor: '' },
  { label: 'Speaking slot', general: 'Main stage · 20 min', partner: 'Breakout track', sponsor: '' },
  { label: 'Program integration', general: 'Host a track', partner: 'Panel seat', sponsor: '' },
  { label: 'Posts to the summit channels (37,000 followers)', general: '5', partner: '3', sponsor: '1' },
  { label: 'Opted-in attendee contact list', general: '✓', partner: '', sponsor: '' },
  { label: 'Team passes', general: '10', partner: '5', sponsor: '2' },
]

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
