// Pricing configurator. The plan, seat count, and billing cycle are bound
// declaratively in index.html; this file renders the derived totals.
const PLANS = {
  starter: { name: 'Starter', price: 29 },
  growth: { name: 'Growth', price: 59 },
  enterprise: { name: 'Enterprise', price: null },
}
const ANNUAL_DISCOUNT = 0.17

const formatUsd = (value) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
}).format(Math.max(0, Math.round(value)))

naimi.ready((kit) => {
  const el = (id) => document.getElementById(id)

  kit.onChange(() => {
    const plan = PLANS[kit.field('plan', 'growth')] ?? PLANS.growth
    const seats = Math.min(500, Math.max(1, Math.round(Number(kit.field('seats', 25)) || 1)))
    const annual = kit.field('billingAnnual', true) === true
    const custom = plan.price == null
    const baseMonthly = custom ? 0 : seats * plan.price
    const monthly = annual ? baseMonthly * (1 - ANNUAL_DISCOUNT) : baseMonthly
    const savings = annual ? baseMonthly * ANNUAL_DISCOUNT * 12 : 0

    el('seats-value').textContent = String(seats)
    el('total-plan').textContent = `${plan.name} · ${seats} seats`
    el('total-monthly').textContent = custom ? "Let's talk" : formatUsd(monthly)
    el('total-yearly').textContent = custom
      ? `Custom pricing for ${seats}+ seats`
      : `${formatUsd(monthly * 12)} / year`
    el('savings').textContent = `Save ${formatUsd(savings)} a year`
    el('savings').hidden = custom || savings <= 0
    el('savings-hint').hidden = custom || savings > 0
    el('custom-hint').hidden = !custom
  })
})
