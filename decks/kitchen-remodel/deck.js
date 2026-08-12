// Kitchen configurator and self-fill questions. Fields mirror the v1 React deck:
// cabinetFeet + materials + hardware calculate the estimate; budget and timing
// chips allow a second click to clear the current answer.
const CABINETS = {
  stock: { label: 'Stock', pricePerFoot: 1100 },
  semiCustom: { label: 'Semi-custom', pricePerFoot: 1850 },
  custom: { label: 'Custom', pricePerFoot: 2900 },
}
const COUNTERTOPS = {
  butcher: { label: 'Butcher block', pricePerFoot: 180 },
  granite: { label: 'Granite', pricePerFoot: 340 },
  quartz: { label: 'Quartz', pricePerFoot: 420 },
}
const BASE_COST = 6000
const PREMIUM_HARDWARE_FACTOR = 1.1

const formatUsd = (value) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
}).format(Math.max(0, Math.round(value)))

naimi.ready((kit) => {
  const el = (id) => document.getElementById(id)
  const hardware = document.querySelector('[data-hardware-toggle]')
  const budgetButtons = [...document.querySelectorAll('[data-budget-value]')]
  const timingButtons = [...document.querySelectorAll('[data-timing-value]')]

  hardware.addEventListener('click', () => {
    kit.setField('premiumHardware', kit.field('premiumHardware', true) !== true)
  })
  budgetButtons.forEach((button) => button.addEventListener('click', () => {
    const value = Number(button.dataset.budgetValue)
    kit.setField('clientBudget', Number(kit.field('clientBudget', 0)) === value ? 0 : value)
  }))
  timingButtons.forEach((button) => button.addEventListener('click', () => {
    const value = button.dataset.timingValue
    kit.setField('projectTiming', kit.field('projectTiming', '') === value ? '' : value)
  }))

  kit.onChange(() => {
    const feet = Math.min(30, Math.max(10, Math.round(Number(kit.field('cabinetFeet', 18)) || 10)))
    const cabinetKey = kit.field('cabinetLine', 'semiCustom')
    const countertopKey = kit.field('countertop', 'quartz')
    const cabinet = CABINETS[cabinetKey] ?? CABINETS.semiCustom
    const countertop = COUNTERTOPS[countertopKey] ?? COUNTERTOPS.quartz
    const premium = kit.field('premiumHardware', true) === true
    const base = feet * (cabinet.pricePerFoot + countertop.pricePerFoot) + BASE_COST
    const price = Math.round((premium ? base * PREMIUM_HARDWARE_FACTOR : base) / 1000) * 1000

    el('cabinet-feet-display').textContent = `${feet.toLocaleString('en-US')} linear ft`
    el('estimate-total').textContent = formatUsd(price)
    el('financing-monthly').textContent = formatUsd(Math.round(price / 85))
    el('summary-feet').textContent = feet.toLocaleString('en-US')
    el('summary-cabinet').textContent = cabinet.label.toLowerCase()
    el('summary-countertop').textContent = countertop.label.toLowerCase()
    el('summary-hardware').textContent = premium ? 'Blum (premium)' : 'standard soft-close'
    hardware.setAttribute('aria-pressed', String(premium))

    const budget = Number(kit.field('clientBudget', 0))
    budgetButtons.forEach((button) => button.setAttribute('aria-pressed', String(Number(button.dataset.budgetValue) === budget)))
    const timing = kit.field('projectTiming', '')
    timingButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.timingValue === timing)))

    const clientName = kit.personalization('companyName', '').trim()
    document.querySelector('[data-name-fallback]').hidden = Boolean(clientName)
    const managerName = kit.personalization('managerName', 'Your designer')
    document.querySelector('[data-manager-alt]').alt = managerName
  })
})
