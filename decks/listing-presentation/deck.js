// Listing interaction: parser-driven comps, pricing strategy/net sheet and seller self-fill.
const COMMISSION_RATE = 0.055
const CLOSING_COST_RATE = 0.015

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const formatUsd = (value) => usd.format(Math.max(0, Math.round(value)))

const parsePrice = (raw, fallback = 0) => {
  const digits = String(raw ?? '').replace(/[^\d]/g, '')
  return digits ? Number.parseInt(digits, 10) : fallback
}

const formatDate = (iso, fallback = '') => {
  const raw = String(iso ?? '').trim()
  const date = raw ? new Date(raw) : new Date()
  if (Number.isNaN(date.getTime())) return fallback
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const parseHighlights = (raw) => String(raw ?? '')
  .split('\n')
  .map((line) => line.replace(/^[•\-–—◆*]\s*/, '').trim())
  .filter(Boolean)

const parseComps = (raw) => String(raw ?? '')
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

const median = (values) => {
  const clean = values.filter((value) => value > 0).sort((a, b) => a - b)
  if (clean.length === 0) return 0
  const middle = Math.floor(clean.length / 2)
  return clean.length % 2 === 0
    ? Math.round((clean[middle - 1] + clean[middle]) / 2)
    : clean[middle]
}

naimi.ready((kit) => {
  const element = (id) => document.getElementById(id)
  const strategies = Array.from(document.querySelectorAll('.strategy'))
  const timelineButtons = Array.from(document.querySelectorAll('.timeline-options button'))
  const questionsInput = element('seller-questions')

  timelineButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.dataset.key
      kit.setField('moveTimeline', kit.field('moveTimeline', '') === key ? '' : key)
    })
  })

  questionsInput.addEventListener('input', () => kit.setField('sellerQuestions', questionsInput.value))

  kit.onChange(() => {
    const sellerNames = kit.personalization('companyName', '').trim() || 'the owners'
    element('next-heading').textContent = sellerNames === 'the owners'
      ? "Here's how we start"
      : `${sellerNames}, here's how we start`

    const presentDate = kit.personalization('presentDate', '')
    element('present-date').textContent = formatDate(presentDate, formatDate(''))

    const highlights = parseHighlights(kit.personalization('homeHighlights', ''))
    const highlightsList = element('home-highlights')
    highlightsList.replaceChildren(...highlights.map((highlight) => {
      const item = document.createElement('li')
      const diamond = document.createElement('span')
      diamond.className = 'highlight-diamond'
      const text = document.createElement('span')
      text.textContent = highlight
      item.append(diamond, text)
      return item
    }))
    highlightsList.hidden = highlights.length === 0

    const comps = parseComps(kit.personalization('compsLines', ''))
    element('comps-rows').replaceChildren(...comps.map((comp) => {
      const row = document.createElement('div')
      row.className = 'comp-row'
      const address = document.createElement('span')
      address.textContent = comp.address
      const sold = document.createElement('strong')
      sold.textContent = formatUsd(comp.soldPrice)
      const days = document.createElement('span')
      days.textContent = String(comp.daysOnMarket)
      row.append(address, sold, days)
      return row
    }))
    element('median-cards').hidden = comps.length === 0
    element('median-price').textContent = formatUsd(median(comps.map((comp) => comp.soldPrice)))
    element('median-days').textContent = String(median(comps.map((comp) => comp.daysOnMarket)))

    const strategy = String(kit.field('pricingStrategy', 'market'))
    strategies.forEach((button) => {
      const selected = button.dataset.nkValue === strategy
      button.setAttribute('aria-pressed', String(selected))
      button.querySelector('.strategy-state').textContent = selected ? '✓ Selected' : 'Choose'
    })

    const recommendedRaw = kit.personalization('recommendedPrice', '')
    const recommendedPrice = parsePrice(recommendedRaw, 725000)
    const recommendedPriceText = recommendedRaw || formatUsd(725000)
    const minimum = Math.round((recommendedPrice * 0.85) / 5000) * 5000
    const maximum = Math.round((recommendedPrice * 1.15) / 5000) * 5000
    const storedPrice = Number(kit.field('listPrice', recommendedPrice))
    const listPrice = Number.isFinite(storedPrice) && storedPrice > 0 ? storedPrice : recommendedPrice

    const range = element('list-price-range')
    const number = element('list-price-number')
    for (const input of [range, number]) {
      input.min = String(minimum)
      input.max = String(maximum)
      input.value = String(listPrice)
    }

    const commission = listPrice * COMMISSION_RATE
    const closing = listPrice * CLOSING_COST_RATE
    const netProceeds = listPrice - commission - closing
    element('list-price-display').textContent = formatUsd(listPrice)
    element('recommended-price').textContent = recommendedPriceText
    element('net-proceeds').textContent = formatUsd(netProceeds)
    element('net-list-price').textContent = formatUsd(listPrice)
    element('commission').textContent = `−${formatUsd(commission)}`
    element('closing-costs').textContent = `−${formatUsd(closing)}`

    const moveTimeline = String(kit.field('moveTimeline', ''))
    timelineButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.key === moveTimeline))
    })
    questionsInput.value = String(kit.field('sellerQuestions', ''))

    const bookingUrl = kit.personalization('bookingUrl', '').trim()
    const bookingLink = element('booking-link')
    bookingLink.hidden = !bookingUrl
    element('call-fallback').hidden = Boolean(bookingUrl)
    if (bookingUrl) bookingLink.href = bookingUrl
    else bookingLink.removeAttribute('href')
  })
})
