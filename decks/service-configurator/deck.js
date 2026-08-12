// The independent service checkboxes go through the public API: the declarative
// layer has no toggle-off. The first-month total, discount and estimate live here too.
const SERVICES = [
  { key: 'svcAudit', price: 1900, cadence: 'once', weeks: 2, defaultOn: true },
  { key: 'svcBrand', price: 1200, cadence: 'mo', weeks: 2, defaultOn: false },
  { key: 'svcSite', price: 3200, cadence: 'once', weeks: 3, defaultOn: true },
  { key: 'svcSeo', price: 1500, cadence: 'once', weeks: 2, defaultOn: false },
  { key: 'svcContent', price: 2400, cadence: 'mo', weeks: 4, defaultOn: false },
  { key: 'svcAds', price: 1800, cadence: 'mo', weeks: 2, defaultOn: true },
]

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})
const formatUsd = (value) => usdFormatter.format(Math.max(0, Math.round(value)))
const discountPct = (count) => count >= 5 ? 10 : count >= 3 ? 5 : 0

naimi.ready((kit) => {
  const buttons = Array.from(document.querySelectorAll('[data-service-key]'))
  const rows = Array.from(document.querySelectorAll('[data-summary-key]'))
  const el = (id) => document.getElementById(id)

  for (const button of buttons) {
    button.addEventListener('click', () => {
      const service = SERVICES.find((item) => item.key === button.dataset.serviceKey)
      kit.setField(service.key, kit.field(service.key, service.defaultOn) !== true)
    })
  }

  kit.onChange(() => {
    const chosen = SERVICES.filter((service) => kit.field(service.key, service.defaultOn) === true)
    const subtotal = chosen.reduce((sum, service) => sum + service.price, 0)
    const discount = discountPct(chosen.length)
    const discountUsd = Math.round((subtotal * discount) / 100)
    const total = subtotal - discountUsd
    const maxWeeks = chosen.reduce((max, service) => Math.max(max, service.weeks), 0)

    for (const button of buttons) {
      const service = SERVICES.find((item) => item.key === button.dataset.serviceKey)
      button.setAttribute('aria-pressed', String(kit.field(service.key, service.defaultOn) === true))
    }

    let firstVisible = true
    for (const row of rows) {
      const service = SERVICES.find((item) => item.key === row.dataset.summaryKey)
      const selected = kit.field(service.key, service.defaultOn) === true
      row.hidden = !selected
      row.classList.toggle('is-first', selected && firstVisible)
      if (selected) firstVisible = false
    }

    el('selected-count').textContent = String(chosen.length)
    el('discount-chip').textContent = `${discount}% off`
    el('discount-chip').hidden = discount <= 0
    el('config-total').textContent = formatUsd(total)
    el('summary-subtotal').textContent = formatUsd(subtotal)
    el('summary-discount-label').textContent = `Bundle discount (${discount}%)`
    el('summary-discount-value').textContent = `−${formatUsd(discountUsd)}`
    el('summary-discount').hidden = discount <= 0
    el('summary-total').textContent = formatUsd(total)
    el('stat-total').textContent = formatUsd(total)
    el('stat-weeks').textContent = `~${maxWeeks} wk`

    const nextDiscountAt = chosen.length < 3 ? 3 : chosen.length < 5 ? 5 : null
    el('discount-tip').hidden = nextDiscountAt === null
    if (nextDiscountAt !== null) {
      const rest = nextDiscountAt - chosen.length
      const services = rest === 1 ? 'one more service' : `${rest} more services`
      el('discount-tip-text').textContent =
        `Add ${services} and the discount jumps to ${discountPct(nextDiscountAt)}%.`
    }

    el('summary-grid').hidden = chosen.length === 0
    el('empty-state').hidden = chosen.length > 0
  })
})
