// Managed services quote: service blocks come from the stages editor (stagesJson — name,
// monthly price, "what's included | detail" lines); the client picks the support tier right
// in the document, Premium is a multiplier over Standard.
const PREMIUM_FACTOR = 1.35
const LEVEL_NAMES = { basic: 'Standard', extended: 'Premium' }

const FALLBACK_CONDITIONS = [
  'The monthly fee is invoiced on the 1st and due within 10 days',
  'Work outside the service scope is billed at $145/hour after approval',
  'Hardware and licenses are purchased by the client from our specification',
  '12-month agreement, cancel with 30 days’ notice and no early-termination fee',
]

const formatUsd = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Math.max(0, Math.round(value)))

const formatDate = (raw, fallback = '') => {
  if (!String(raw ?? '').trim()) return fallback
  const date = new Date(String(raw).trim())
  if (Number.isNaN(date.getTime())) return fallback
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

const parseCost = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) return Math.max(0, Math.round(value))
  const digits = String(value ?? '').replace(/[^\d]/g, '')
  return digits ? Math.max(0, Number.parseInt(digits, 10)) : 0
}

const parseRows = (raw) => String(raw ?? '')
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => {
    const parts = line.split(/\s*\|\s*|\t+/).map((part) => part.trim()).filter(Boolean)
    return { item: parts[0] ?? line, note: parts.slice(1).join(' | ') || '' }
  })

const parseServices = (raw) => {
  if (!String(raw ?? '').trim()) return []
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map((item) => {
      const title = typeof item?.title === 'string' ? item.title.trim() : ''
      const rows = parseRows(item?.rows)
      if (!title && rows.length === 0) return null
      return { title: title || 'Service block', costRub: parseCost(item?.costRub), rows }
    }).filter(Boolean)
  } catch {
    return []
  }
}

const makeService = (service) => {
  const card = document.createElement('article')
  card.className = 'service'
  const title = document.createElement('h3')
  title.textContent = service.title
  const price = document.createElement('p')
  price.className = 'service-price'
  price.textContent = formatUsd(service.costRub)
  const unit = document.createElement('small')
  unit.textContent = 'per month'
  price.append(unit)
  const rows = document.createElement('div')
  rows.className = 'service-rows'
  for (const row of service.rows) {
    const line = document.createElement('div')
    line.className = 'service-row'
    const item = document.createElement('span')
    const note = document.createElement('span')
    item.textContent = row.item
    note.textContent = row.note
    line.append(item, note)
    rows.append(line)
  }
  card.append(title, price, rows)
  return card
}

naimi.ready((kit) => {
  const el = (id) => document.getElementById(id)

  kit.onChange(() => {
    const services = parseServices(kit.personalization('stagesJson', ''))
    const basic = services.reduce((sum, service) => sum + service.costRub, 0)
    const extended = Math.round(basic * PREMIUM_FACTOR)
    const level = kit.field('serviceLevel', 'basic') === 'extended' ? 'extended' : 'basic'
    const monthly = level === 'extended' ? extended : basic
    const setup = parseCost(kit.personalization('setupFee', ''))

    el('services-list').replaceChildren(...services.map(makeService))
    el('services-empty').hidden = services.length > 0
    el('services-total').textContent = formatUsd(basic)

    el('summary-monthly').textContent = formatUsd(monthly)
    el('summary-level').textContent = LEVEL_NAMES[level]
    el('summary-annual').textContent = formatUsd(monthly * 12)
    el('summary-setup').textContent = setup ? formatUsd(setup) : 'included'
    el('param-level').textContent = LEVEL_NAMES[level]
    el('level-basic-price').textContent = `${formatUsd(basic)} / mo`
    el('level-extended-price').textContent = `${formatUsd(extended)} / mo`
    const sla = document.querySelector('.sla-table')
    sla.classList.toggle('is-basic', level === 'basic')
    sla.classList.toggle('is-extended', level === 'extended')
    // The default tier is pressed even before any value reaches the deck (the engine marks
    // aria-pressed only for known values) — the document must not open with no tier chosen.
    for (const button of document.querySelectorAll('[data-nk-field="serviceLevel"]')) {
      button.setAttribute('aria-pressed', String(button.dataset.nkValue === level))
    }

    el('quote-date').textContent = formatDate(kit.personalization('quoteDate', ''), formatDate(new Date().toISOString()))
    el('quote-valid').textContent = formatDate(kit.personalization('validUntil', ''), 'the end of the month')

    const conditions = String(kit.personalization('workConditions', '') ?? '')
      .split('\n').map((line) => line.replace(/^[•\-–—]\s*/, '').trim()).filter(Boolean)
    el('conditions-list').replaceChildren(...(conditions.length ? conditions : FALLBACK_CONDITIONS).map((line) => {
      const li = document.createElement('li')
      li.textContent = line
      return li
    }))

    const decision = String(kit.field('quoteDecision', '') ?? '')
    el('approve-state').textContent = decision === 'accepted'
      ? `Quote confirmed: ${LEVEL_NAMES[level]} tier, ${formatUsd(monthly)} per month. We are preparing the agreement.`
      : decision === 'meeting'
        ? 'Call requested — your account manager will propose a time within one business day.'
        : `Selected tier: ${LEVEL_NAMES[level]}. No decision yet.`
  })
})
