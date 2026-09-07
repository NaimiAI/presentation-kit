// agency-pitch: package × media budget → estimated monthly views; launch-week dates.
// Everything that reads personalization or fields lives in kit.onChange — it runs once the
// host's data has arrived and again on every change (naimi.ready fires before the data).
const PACKAGES = {
  spark: { name: 'Spark', viewsPerDollar: 90 },
  surge: { name: 'Surge', viewsPerDollar: 140 },
  supernova: { name: 'Supernova', viewsPerDollar: 220 },
}
const number = new Intl.NumberFormat('en-US')

const parseDate = (raw) => {
  if (!String(raw ?? '').trim()) return null
  const date = new Date(String(raw).trim())
  return Number.isNaN(date.getTime()) ? null : date
}
const addDays = (date, days) => new Date(date.getTime() + days * 86400000)
const shortDate = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
const longDate = (date) => date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

naimi.ready((kit) => {
  const el = (id) => document.getElementById(id)

  kit.onChange(() => {
    const launch = parseDate(kit.personalization('launchDate', ''))
    el('launch-date').textContent = launch ? longDate(launch) : 'to be agreed'
    for (let week = 1; week <= 4; week += 1) {
      // Week 4 is the launch week: count back from the agreed date.
      el(`week-${week}-date`).textContent = launch ? shortDate(addDays(launch, (week - 4) * 7)) : `Week ${week}`
    }

    const pkg = PACKAGES[kit.field('package', 'surge')] ?? PACKAGES.surge
    const budget = Number(kit.field('monthlyBudget', 6000)) || 0
    el('reach-package').textContent = pkg.name
    el('reach-value').textContent = number.format(Math.round(budget * pkg.viewsPerDollar))
  })
})
