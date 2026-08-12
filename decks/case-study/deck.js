// Case-study interaction: the prospect's self-filled monthly ticket volume feeds
// the same 38% avoidance / $14 handling-cost model used by the v1 deck.
const AVOIDED_SHARE = 0.38
const HANDLING_COST = 14

const numberFormat = new Intl.NumberFormat('en-US')
const usdFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const clampNumber = (value, min, max, fallback) => {
  const number = Number(value)
  if (!Number.isFinite(number)) return fallback
  return Math.min(max, Math.max(min, number))
}

const toLines = (raw) => raw
  .split('\n')
  .map((line) => line.replace(/^[•\-*]\s*/, '').trim())
  .filter(Boolean)

const checkIcon = () => {
  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  icon.setAttribute('class', 'ico')
  icon.setAttribute('viewBox', '0 0 24 24')
  icon.setAttribute('aria-hidden', 'true')
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', 'M20 6 9 17l-5-5')
  icon.append(path)
  return icon
}

naimi.ready((kit) => {
  const element = (id) => document.getElementById(id)

  kit.onChange(() => {
    const companyName = kit.personalization('companyName', '').trim()
    element('prepared-for').hidden = !companyName
    element('proof-story').hidden = Boolean(companyName)

    const pains = toLines(kit.personalization('prospectPains', ''))
    const painsList = element('prospect-pains')
    painsList.replaceChildren(...pains.map((pain) => {
      const item = document.createElement('li')
      const text = document.createElement('span')
      text.textContent = pain
      item.append(checkIcon(), text)
      return item
    }))
    painsList.hidden = pains.length === 0
    element('prospect-pains-empty').hidden = pains.length > 0

    const bookingUrl = kit.personalization('bookingUrl', '').trim()
    const bookingLink = element('booking-link')
    if (bookingUrl) bookingLink.href = bookingUrl
    else bookingLink.removeAttribute('href')

    const monthlyTickets = Math.round(clampNumber(kit.field('monthlyTickets', 2000), 200, 20000, 2000))
    const avoidedPerMonth = Math.round(monthlyTickets * AVOIDED_SHARE)
    const yearlySavings = avoidedPerMonth * 12 * HANDLING_COST

    element('monthly-tickets-value').textContent = numberFormat.format(monthlyTickets)
    element('avoided-per-month').textContent = numberFormat.format(avoidedPerMonth)
    element('yearly-savings').textContent = usdFormat.format(Math.max(0, Math.round(yearlySavings)))
  })
})
