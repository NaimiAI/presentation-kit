// Pilot report interaction: the shared live metrics recalculate the before/after
// cards, the SVG trajectory, and the dollar impact. Fields are bound declaratively.
const CHART = { width: 720, height: 260, padX: 40, padY: 24 }

const clampNumber = (value, min, max, fallback) => {
  const number = Number(value)
  if (!Number.isFinite(number)) return fallback
  return Math.min(max, Math.max(min, number))
}

const deltaPct = (before, after) => before <= 0 ? 0 : Math.round(((after - before) / before) * 100)
const formatNumber = (value) => new Intl.NumberFormat('en-US').format(value)
const formatUsd = (value) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
}).format(Math.max(0, Math.round(value)))
const signedPct = (value) => `${value > 0 ? '+' : value < 0 ? '−' : ''}${Math.abs(value)}%`
const weeklyTrajectory = (before, after, weeks = 6) => Array.from({ length: weeks }, (_, index) => {
  const progress = index / (weeks - 1)
  const eased = 1 - Math.pow(1 - progress, 2)
  return before + (after - before) * eased
})

naimi.ready((kit) => {
  const el = (id) => document.getElementById(id)
  const svg = (name, attrs = {}) => {
    const node = document.createElementNS('http://www.w3.org/2000/svg', name)
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, String(value)))
    return node
  }

  const grid = document.querySelector('#resolution-chart .chart-grid')
  const bars = document.querySelector('#resolution-chart .chart-bars')

  const renderChart = (before, after) => {
    const weeks = weeklyTrajectory(before, after)
    const maxValue = Math.max(...weeks) * 1.15
    const innerWidth = CHART.width - CHART.padX * 2
    const innerHeight = CHART.height - CHART.padY * 2
    const slot = innerWidth / weeks.length
    const barWidth = slot * 0.55
    grid.replaceChildren()
    bars.replaceChildren()

    ;[0.25, 0.5, 0.75, 1].forEach((tick) => {
      const y = CHART.height - CHART.padY - innerHeight * tick
      const group = svg('g')
      group.append(svg('line', { x1: CHART.padX, x2: CHART.width - CHART.padX, y1: y, y2: y, stroke: 'var(--art-ink)', 'stroke-opacity': 0.22, 'stroke-dasharray': '4 6' }))
      const text = svg('text', { x: CHART.padX - 8, y: y + 4, 'text-anchor': 'end', 'font-size': 11, fill: 'var(--art-ink)', 'fill-opacity': 0.6 })
      text.textContent = String(Math.round(maxValue * tick))
      group.append(text)
      grid.append(group)
    })

    weeks.forEach((value, index) => {
      const x = CHART.padX + slot * index + (slot - barWidth) / 2
      const height = (value / maxValue) * innerHeight
      const y = CHART.height - CHART.padY - height
      const last = index === weeks.length - 1
      const group = svg('g')
      group.append(svg('rect', { x, y, width: barWidth, height, fill: last ? 'var(--art-accent-2)' : 'var(--art-ink)', opacity: last ? 1 : 0.35 + index * 0.08 }))
      const week = svg('text', { x: x + barWidth / 2, y: CHART.height - CHART.padY + 16, 'text-anchor': 'middle', 'font-size': 11, fill: 'var(--art-ink)', 'fill-opacity': 0.6 })
      week.textContent = `W${index + 1}`
      group.append(week)
      if (last) {
        const label = svg('text', { x: x + barWidth / 2, y: y - 8, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 700, fill: 'var(--art-ink)' })
        label.textContent = `${Math.round(value)}%`
        group.append(label)
      }
      bars.append(group)
    })
  }

  const setBadgeTone = (node, improved) => {
    node.classList.toggle('badge-positive', improved)
    node.classList.toggle('badge-neutral', !improved)
  }

  kit.onChange(() => {
    const responseBefore = clampNumber(kit.field('responseMinBefore', 14), 1, 600, 14)
    const responseAfter = clampNumber(kit.field('responseMinAfter', 3), 1, 600, 3)
    const convBefore = clampNumber(kit.field('convBefore', 18), 0, 100, 18)
    const convAfter = clampNumber(kit.field('convAfter', 61), 0, 100, 61)
    const dialogs = Math.round(clampNumber(kit.field('dialogsTotal', 9200), 0, 1000000, 9200))
    const laborRate = Math.round(clampNumber(kit.field('avgCheck', 32), 0, 500, 32))
    const responseDelta = deltaPct(responseBefore, responseAfter)
    const convDelta = deltaPct(convBefore, convAfter)

    const minutesSavedPerOrder = Math.max(0, responseBefore - responseAfter)
    const hoursSaved = dialogs * minutesSavedPerOrder / 60
    const pilotSavings = hoursSaved * laborRate
    const monthlySavings = pilotSavings / 1.5
    const yearlySavings = monthlySavings * 12
    const costPerOrderBefore = laborRate * responseBefore / 60
    const costPerOrderAfter = laborRate * responseAfter / 60

    el('hero-response-delta').textContent = `−${Math.abs(responseDelta)}%`
    el('hero-response-values').textContent = `${responseBefore} min → ${responseAfter} min`
    el('hero-conv-delta').textContent = `+${convDelta}%`
    el('hero-conv-values').textContent = `${convBefore}% → ${convAfter}%`
    el('hero-dialogs').textContent = formatNumber(dialogs)

    el('response-before-display').textContent = String(Math.round(responseBefore))
    el('response-after-display').textContent = String(Math.round(responseAfter))
    el('conv-before-display').textContent = `${Math.round(convBefore)}%`
    el('conv-after-display').textContent = `${Math.round(convAfter)}%`
    el('response-badge').textContent = signedPct(responseDelta)
    el('conv-badge').textContent = signedPct(convDelta)
    setBadgeTone(el('response-badge'), responseDelta < 0)
    setBadgeTone(el('conv-badge'), convDelta > 0)
    el('response-before-card').textContent = `${Math.round(responseBefore)} min`
    el('response-after-card').textContent = `${Math.round(responseAfter)} min`
    el('conv-before-card').textContent = `${Math.round(convBefore)}%`
    el('conv-after-card').textContent = `${Math.round(convAfter)}%`

    el('dialogs-display').textContent = formatNumber(dialogs)
    el('rate-display').textContent = formatUsd(laborRate)
    el('money-response-before').textContent = String(Math.round(responseBefore))
    el('money-response-after').textContent = String(Math.round(responseAfter))
    el('cost-before').textContent = formatUsd(costPerOrderBefore)
    el('cost-after').textContent = formatUsd(costPerOrderAfter)
    el('hours-saved').textContent = `+${formatNumber(Math.round(hoursSaved))} hrs`
    el('pilot-savings').textContent = `${formatUsd(pilotSavings)} in labor saved`
    el('monthly-savings').textContent = `+${formatUsd(monthlySavings)}`
    el('yearly-savings').textContent = `+${formatUsd(yearlySavings)}`
    renderChart(convBefore, convAfter)
  })
})
