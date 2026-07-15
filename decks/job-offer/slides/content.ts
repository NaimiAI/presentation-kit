// Hiring company — edit this to make the template your own.
// Everything candidate-specific (role, pay, dates) arrives via personalization.

export const COMPANY = {
  name: 'Cadence',
  tagline: 'the workflow platform for modern ops teams',
  size: '140 people',
}

export function formatDate(iso: string, fallback = ''): string {
  if (!iso.trim()) return fallback
  const date = new Date(iso.trim())
  if (Number.isNaN(date.getTime())) return fallback
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}
