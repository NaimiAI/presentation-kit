// Event invitation: RSVP and guest count are stored in the demo fields
// rsvpGoing / attendeeCount. The controls are bound declaratively in HTML;
// this file only derives poster text/date, RSVP visibility and external links.
const EVENT_DEFAULTS = {
  title: 'Signal — an evening for revenue leaders',
}

/** Event date in English: “Thursday, July 16”. */
function formatEventDate(iso) {
  const date = new Date(iso.trim())
  if (!iso.trim() || Number.isNaN(date.getTime())) return 'date to be announced'
  return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(date)
}

/** “Add to Google Calendar” link for an all-day event. */
function calendarUrl(title, iso) {
  const date = new Date(iso.trim())
  if (!iso.trim() || Number.isNaN(date.getTime())) return null
  const pad = (value) => String(value).padStart(2, '0')
  const ymd = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`
  const next = new Date(date.getTime() + 24 * 60 * 60 * 1000)
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${ymd(date)}/${ymd(next)}`
}

naimi.ready((kit) => {
  const el = (id) => document.getElementById(id)

  kit.onChange(() => {
    const title = String(kit.personalization('eventTitle', EVENT_DEFAULTS.title) ?? '')
    const dateIso = String(kit.personalization('eventDate', '') ?? '')
    const joinUrl = String(kit.personalization('joinUrl', '') ?? '')

    const words = title.split(/\s+/).filter(Boolean)
    const splitAt = Math.ceil(words.length / 2)
    const secondLine = words.slice(splitAt).join(' ')
    el('poster-title-1').textContent = words.slice(0, splitAt).join(' ')
    el('poster-title-2-text').textContent = secondLine
    el('poster-title-2').hidden = !secondLine
    el('poster-date').textContent = formatEventDate(dateIso)

    const going = kit.field('rsvpGoing', false) === true
    const attendees = Math.min(20, Math.max(1, Math.round(Number(kit.field('attendeeCount', 2)) || 1)))
    el('attendees-row').hidden = !going
    el('attendees-value').textContent = String(attendees)

    if (joinUrl) el('join-link').href = joinUrl
    const addToCalendar = calendarUrl(title, dateIso)
    el('calendar-link').href = addToCalendar ?? '#'
    el('calendar-link').hidden = !addToCalendar
  })
})
