// Franchise payback calculator: average ticket and daily customers recalculate
// revenue, owner's cash flow and months to return the midpoint investment.
const INVESTMENT = 352_500
const RENT_FIXED = 6_500
const VARIABLE_SHARE = 0.3 + 0.26 + 0.06 + 0.02 + 0.06

const formatUsd = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Math.round(value))

naimi.ready((kit) => {
  const el = (id) => document.getElementById(id)

  kit.onChange(() => {
    const avgTicket = Number(kit.field('avgTicket', 9.5))
    const dailyGuests = Number(kit.field('dailyGuests', 260))
    const revenue = avgTicket * dailyGuests * 30
    const profit = Math.round(revenue * (1 - VARIABLE_SHARE) - RENT_FIXED)
    const paybackMonths = profit > 0 ? Math.ceil(INVESTMENT / profit) : null

    el('avg-ticket-display').textContent = `$${avgTicket.toFixed(2)}`
    el('daily-guests-display').textContent = `${new Intl.NumberFormat('en-US').format(dailyGuests)} cust`
    el('result-revenue').textContent = formatUsd(revenue)
    el('result-profit').textContent = profit > 0 ? formatUsd(profit) : '—'
    el('result-profit').classList.toggle('is-negative', profit <= 0)
    el('result-payback').textContent = paybackMonths === null ? '—' : `≈ ${paybackMonths} mo`
    el('result-loss-hint').hidden = paybackMonths !== null

    const cityName = String(kit.personalization('cityName', '')).trim()
    el('city-headline').textContent = cityName ? `in ${cityName}` : 'in your city'

    const personalNote = String(kit.personalization('personalNote', '')).trim()
    el('personal-note-card').hidden = !personalNote
    el('generic-note-card').hidden = Boolean(personalNote)

    const managerName = String(kit.personalization('managerName', 'Franchise director')).trim()
    el('manager-initial').textContent = managerName.charAt(0).toUpperCase() || 'D'
  })
})
