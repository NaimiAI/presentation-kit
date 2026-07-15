import type { Personalization } from '../kit/host'
import { personalizationValue } from '../kit/host'

/** Default event details and past recording — replace with your own. */
export const EVENT_DEFAULTS = {
  title: 'Signal — an evening for revenue leaders',
  time: '6:00 PM PT · dinner + talks',
  place: 'The Observatory, San Francisco',
  pastRecordingUrl: 'https://www.youtube.com/watch?v=REPLACE_WITH_YOURS',
}

export const AGENDA = [
  { time: '6:00', topic: 'Doors, welcome drinks and introductions', speaker: '' },
  { time: '6:40', topic: 'What actually moved pipeline this year — no vendor spin', speaker: 'Chris Novak' },
  { time: '7:30', topic: 'Dinner and open-table conversation', speaker: '' },
  { time: '8:15', topic: 'Fireside: scaling revenue without scaling headcount', speaker: 'Nina Alvarez' },
  { time: '9:00', topic: 'Nightcap and networking', speaker: 'the whole team' },
]

export function getEvent(personalization: Personalization) {
  return {
    companyName: personalization.companyName.trim(),
    contactName: personalizationValue(personalization, 'contactName'),
    title: personalizationValue(personalization, 'eventTitle', EVENT_DEFAULTS.title),
    time: personalizationValue(personalization, 'eventTime', EVENT_DEFAULTS.time),
    joinUrl: personalizationValue(personalization, 'joinUrl'),
    dateIso: personalizationValue(personalization, 'eventDate'),
  }
}

export function formatEventDate(iso: string): string {
  const date = new Date(iso.trim())
  if (!iso.trim() || Number.isNaN(date.getTime())) return 'date to be announced'
  return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(date)
}

/** "Add to Google Calendar" link (all-day event). */
export function calendarUrl(title: string, iso: string): string | null {
  const date = new Date(iso.trim())
  if (!iso.trim() || Number.isNaN(date.getTime())) return null
  const pad = (value: number) => String(value).padStart(2, '0')
  const ymd = (d: Date) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`
  const next = new Date(date.getTime() + 24 * 60 * 60 * 1000)
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${ymd(date)}/${ymd(next)}`
}
