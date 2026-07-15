// Static story content and shared helpers for the case study.
// The featured customer (Ironwood Fulfillment) and vendor (Relay) are fixed
// template content; everything personalized for the recipient prospect arrives
// through the personalization block. Swap the constants below to tell your own
// customer's story.

import type { Personalization } from '../kit/host'
import { personalizationValue } from '../kit/host'

/** The vendor sending this case study (same fictional product as saas-pitch). */
export const VENDOR = {
  name: 'Relay',
  tagline: 'the customer-communications platform',
}

/** The featured customer whose results anchor the story. */
export const CUSTOMER = {
  name: 'Ironwood Fulfillment',
  industry: '3PL fulfillment',
  chips: ['3PL fulfillment', '240 employees', 'Columbus, OH'],
  summary:
    'Ironwood runs order fulfillment out of four warehouses for growing e-commerce brands. As volume scaled, "where is my order" tickets buried the support team — and every manual carrier update pulled someone off the floor.',
}

/** The three pains the customer lived with before Relay. */
export const CHALLENGES = [
  '1,900 WISMO tickets per month',
  '4-hour first response time',
  '3 FTEs on manual carrier updates',
]

/** Rollout timeline shown as horizontal steps on the solution slide. */
export const TIMELINE = [
  { weeks: 'Week 1–2', title: 'Connect systems', body: 'Wire up the OMS, carriers, and support inbox — no rip-and-replace.' },
  { weeks: 'Week 3–6', title: 'Automate flows', body: 'Turn on order-status updates and proactive delay alerts.' },
  { weeks: 'Week 7–12', title: 'Scale & train', body: 'Roll out to every brand and coach the team on the new inbox.' },
]

/** The three capabilities that did the work. */
export const CAPABILITIES = [
  { icon: 'workflow', title: 'Automated status flows', body: 'Every order sends its own updates — shipped, out for delivery, delivered — without an agent lifting a finger.' },
  { icon: 'inbox', title: 'Unified support inbox', body: 'Email, chat, and SMS land in one queue with full order context attached.' },
  { icon: 'bell-ring', title: 'Proactive delay alerts', body: 'A carrier slips, the customer hears it from you first — before they open a ticket.' },
]

/** The headline outcomes after 90 days. */
export const RESULTS = [
  { value: '−38%', label: 'Support tickets', sub: 'in the first 90 days', positive: true },
  { value: '11 min', label: 'First response', sub: 'down from 4 hours', positive: true },
  { value: '4.8', label: 'CSAT', sub: 'up from 4.1', positive: true },
  { value: '$310k', label: 'Saved per year', sub: 'in support handling cost', positive: true },
]

/** The customer quote. */
export const QUOTE = {
  text: 'We stopped dreading Monday mornings. The queue just… shrank.',
  name: 'Nadia Reeves',
  role: 'VP Customer Experience, Ironwood Fulfillment',
}

/** Support tickets per week over the 12-week rollout — data for the SVG chart. */
export const TICKETS_PER_WEEK = [480, 472, 455, 430, 405, 372, 348, 336, 322, 310, 302, 298]

/** Assumed cost to handle one support ticket end to end (US market). */
export const HANDLING_COST = 14

/** Share of tickets the automation removes (the customer's headline result). */
export const AVOIDED_SHARE = 0.38

/** USD, whole dollars — the US-market money format for this deck. */
const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export function formatUsd(value: number): string {
  return usd.format(Math.max(0, Math.round(value)))
}

const num = new Intl.NumberFormat('en-US')

export function formatNumber(value: number): string {
  return num.format(Math.round(value))
}

/** Clamp a possibly-invalid interactive value into a safe range. */
export function clampNumber(value: unknown, min: number, max: number, fallback: number): number {
  const n = Number(value)
  if (!Number.isFinite(n)) return fallback
  return Math.min(max, Math.max(min, n))
}

/** Split a textarea into trimmed, non-empty lines (one pain per line). */
export function toLines(raw: string): string[] {
  return raw
    .split('\n')
    .map((line) => line.replace(/^[•\-*]\s*/, '').trim())
    .filter(Boolean)
}

/** The recipient-facing content, pulled from personalization with fallbacks. */
export function getProspect(personalization: Personalization) {
  const value = (key: string, fallback = '') => personalizationValue(personalization, key, fallback)
  const companyName = personalization.companyName.trim() || 'your team'
  return {
    companyName,
    contactName: value('contactName'),
    pains: toLines(value('prospectPains')),
    personalNote: value('personalNote'),
    bookingUrl: value('bookingUrl'),
    managerName: value('managerName'),
    managerContact: value('managerContact'),
  }
}
