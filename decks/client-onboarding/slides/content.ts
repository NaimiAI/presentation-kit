import type { Personalization } from '../kit/host'
import { personalizationValue } from '../kit/host'

/** Your team's details and materials — replace with your own. */
export const COMPANY = {
  name: 'Northmark Consulting',
  sharedDrive: 'https://example.com/northmark/shared-drive',
  slackChannel: 'https://example.com/northmark/slack-connect',
  statusPage: 'https://status.example.com',
  slaText: 'We reply within 15 minutes during business hours; critical issues are covered around the clock.',
}

export function resolveStartDate(personalization: Personalization): Date {
  const raw = personalizationValue(personalization, 'startDate')
  const parsed = new Date(raw)
  if (raw.trim() && !Number.isNaN(parsed.getTime())) return parsed
  return new Date()
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export function formatDay(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)
}

/** Initials for CSS avatars: "Emily Carter" → "EC". */
export function initials(fullName: string): string {
  return fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('') || '•'
}
