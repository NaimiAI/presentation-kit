// Deck interactivity: the derived maths. The controls themselves are bound
// declaratively in index.html (data-nk-field) and their values live in the
// runtime's demo fields — only what is computed from them belongs here.
//
// kit.field(key, fallback) resolves a value in this order: edits made during
// this show → the presentation's demoData → the client's accumulated facts →
// the fallback. kit.onChange(fn) calls fn immediately and on every change.

const formatMoney = (value) =>
  `$${new Intl.NumberFormat('en-US').format(Math.max(0, Math.round(value)))}`
const formatNumber = (value) => new Intl.NumberFormat('en-US').format(Math.round(value))
const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value) || 0))

naimi.ready((kit) => {
  const el = (id) => document.getElementById(id)

  kit.onChange(() => {
    // The keys are the ones in manifest.json → demoData.fields and data-nk-field.
    const visitors = clamp(kit.field('monthlyVisitors', 10000), 0, 200000)
    const conversion = clamp(kit.field('conversionRate', 2), 0, 20)
    const aov = clamp(kit.field('avgOrderValue', 120), 0, 2000)
    const uplift = clamp(kit.field('upliftPct', 25), 0, 100)

    const revenueNow = visitors * (conversion / 100) * aov
    const revenueNext = visitors * ((conversion * (1 + uplift / 100)) / 100) * aov
    const gainMonth = revenueNext - revenueNow

    el('visitors-value').textContent = formatNumber(visitors)
    el('conversion-value').textContent = `${conversion.toFixed(1)}%`
    el('aov-value').textContent = formatMoney(aov)
    el('uplift-value').textContent = `+${Math.round(uplift)}%`

    el('revenue-now').textContent = formatMoney(revenueNow)
    el('revenue-next').textContent = formatMoney(revenueNext)
    el('gain-month').textContent = `+${formatMoney(gainMonth)} per month`
    el('gain-year').textContent = `${formatMoney(gainMonth * 12)} per year`
  })
})
