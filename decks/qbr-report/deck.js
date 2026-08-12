const SVG_NS = 'http://www.w3.org/2000/svg'
const CHART = { width: 720, height: 220, padX: 8, padTop: 16, padBottom: 8 }

const ICONS = {
  checkCircle: [
    ['circle', { cx: '12', cy: '12', r: '10' }],
    ['path', { d: 'm9 12 2 2 4-4' }],
  ],
  attention: [
    ['path', { d: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3' }],
    ['path', { d: 'M12 9v4' }],
    ['path', { d: 'M12 17h.01' }],
  ],
  arrow: [
    ['path', { d: 'M5 12h14' }],
    ['path', { d: 'm12 5 7 7-7 7' }],
  ],
  up: [
    ['path', { d: 'M16 7h6v6' }],
    ['path', { d: 'm22 7-8.5 8.5-5-5L2 17' }],
  ],
  down: [
    ['path', { d: 'M16 17h6v-6' }],
    ['path', { d: 'm22 17-8.5-8.5-5 5L2 7' }],
  ],
  flat: [['path', { d: 'M5 12h14' }]],
}

const el = (id) => document.getElementById(id)

function icon(name) {
  const svg = document.createElementNS(SVG_NS, 'svg')
  svg.setAttribute('class', 'ico')
  svg.setAttribute('viewBox', '0 0 24 24')
  for (const [tag, attrs] of ICONS[name]) {
    const node = document.createElementNS(SVG_NS, tag)
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value)
    svg.append(node)
  }
  return svg
}

function parseLines(raw) {
  return String(raw ?? '')
    .split('\n')
    .map((line) => line.replace(/^[•\-*]\s*/, '').trim())
    .filter(Boolean)
}

function parseKpis(raw) {
  return String(raw ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(/\s*\|\s*|\t+/).map((part) => part.trim())
      const metric = parts[0] ?? ''
      const value = parts[1] ?? ''
      if (!metric || !value) return null
      const change = parts[2] ?? ''
      const direction = change.startsWith('+') ? 'up' : /^[-−]/.test(change) ? 'down' : 'flat'
      return { metric, value, change, direction }
    })
    .filter(Boolean)
    .slice(0, 6)
}

function parseSeries(raw) {
  return String(raw ?? '')
    .split(/[,\s]+/)
    .map((token) => token.trim())
    .filter(Boolean)
    .map((token) => Number.parseFloat(token.replace(/[^\d.-]/g, '')))
    .filter((number) => Number.isFinite(number))
}

function formatDate(iso, fallback = '') {
  if (!String(iso ?? '').trim()) return fallback
  const date = new Date(String(iso).trim())
  if (Number.isNaN(date.getTime())) return fallback
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

function buildTrend(series) {
  const innerWidth = CHART.width - CHART.padX * 2
  const innerHeight = CHART.height - CHART.padTop - CHART.padBottom
  const max = Math.max(...series)
  const min = Math.min(...series)
  const span = max - min || 1
  const step = series.length > 1 ? innerWidth / (series.length - 1) : 0
  const points = series.map((value, index) => ({
    x: CHART.padX + step * index,
    y: CHART.padTop + innerHeight - ((value - min) / span) * innerHeight,
  }))
  const line = points.map((point, index) =>
    `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' ')
  const baseY = CHART.height - CHART.padBottom
  const area = `${line} L ${points.at(-1).x.toFixed(1)} ${baseY} L ${points[0].x.toFixed(1)} ${baseY} Z`
  return { points, line, area }
}

function renderList(container, items, iconName) {
  const fragment = document.createDocumentFragment()
  for (const item of items) {
    const li = document.createElement('li')
    const text = document.createElement('span')
    text.textContent = item
    li.append(icon(iconName), text)
    fragment.append(li)
  }
  container.replaceChildren(fragment)
}

function renderKpis(kpis) {
  const fragment = document.createDocumentFragment()
  kpis.forEach((kpi, index) => {
    const article = document.createElement('article')
    article.className = 'kpi-card'
    article.dataset.animate = 'up'
    article.dataset.delay = String(0.06 + index * 0.05)

    const metric = document.createElement('p')
    metric.textContent = kpi.metric
    const row = document.createElement('div')
    const value = document.createElement('strong')
    value.textContent = kpi.value
    row.append(value)

    if (kpi.change) {
      const delta = document.createElement('span')
      delta.className = `delta is-${kpi.direction}`
      delta.append(icon(kpi.direction), document.createTextNode(kpi.change))
      row.append(delta)
    }

    article.append(metric, row)
    fragment.append(article)
  })
  el('kpi-grid').replaceChildren(fragment)
}

function renderPriorities(items) {
  const fragment = document.createDocumentFragment()
  items.forEach((item, index) => {
    const article = document.createElement('article')
    article.className = 'priority'
    article.dataset.animate = 'up'
    article.dataset.delay = String(0.08 + index * 0.06)
    const number = document.createElement('strong')
    number.textContent = String(index + 1).padStart(2, '0')
    const text = document.createElement('span')
    text.textContent = item
    article.append(number, text)
    fragment.append(article)
  })
  el('priorities-list').replaceChildren(fragment)
}

naimi.ready((kit) => {
  const value = (key, fallback = '') => kit.personalization(key, fallback)
  const ratings = Array.from(document.querySelectorAll('#rating-buttons button'))
  const feedback = el('feedback-textarea')

  ratings.forEach((button) => {
    button.addEventListener('click', () => {
      const score = Number(button.dataset.score)
      const next = Number(kit.field('qbrRating', 0)) === score ? 0 : score
      kit.setField('qbrRating', next)
    })
  })
  feedback.addEventListener('input', () => kit.setField('qbrFeedback', feedback.value))

  kit.onChange(() => {
    const companyName = value('companyName', 'your account').trim() || 'your account'
    const periodLabel = value('periodLabel', 'This quarter')
    const presentDate = formatDate(value('presentDate'))
    const healthStatus = value('healthStatus', 'On track')
    const healthPositive = /on track|healthy|great|strong/i.test(healthStatus.trim())
    const wins = parseLines(value('winsLines'))
    const watchouts = parseLines(value('watchoutsLines'))
    const kpis = parseKpis(value('kpiLines'))
    const trendSeries = parseSeries(value('trendSeries'))
    const delivered = parseLines(value('deliveredLines'))
    const inFlight = parseLines(value('inFlightLines'))
    const priorities = parseLines(value('planLines'))
    const nextReviewDate = formatDate(value('nextReviewDate'))
    const managerName = value('managerName', 'your account lead')
    const managerContact = value('managerContact')
    const bookingUrl = value('bookingUrl')

    el('cover-period').textContent = periodLabel
    el('cover-company').textContent = companyName
    el('cover-manager').textContent = `Prepared by ${managerName}`
    el('cover-date').textContent = presentDate
    el('date-chip').hidden = !presentDate
    el('health-status').textContent = healthStatus
    el('health-card').classList.toggle('is-positive', healthPositive)
    el('health-card').classList.toggle('is-attention', !healthPositive)

    el('summary-company').textContent = companyName
    renderList(el('wins-list'), wins, 'checkCircle')
    renderList(el('watchouts-list'), watchouts, 'attention')
    el('watchouts-card').hidden = watchouts.length === 0
    el('summary-grid').classList.toggle('is-single', watchouts.length === 0)
    const summaryNote = value('summaryNote')
    el('summary-note').textContent = summaryNote
    el('summary-card').hidden = !summaryNote

    el('metrics-period').textContent = periodLabel
    renderKpis(kpis)
    const trendLabel = value('trendLabel', 'Trend')
    el('trend-label').textContent = trendLabel
    el('trend-svg').setAttribute('aria-label', trendLabel)
    el('trend-card').hidden = trendSeries.length < 2
    if (trendSeries.length >= 2) {
      const trend = buildTrend(trendSeries)
      el('trend-area').setAttribute('d', trend.area)
      el('trend-line').setAttribute('d', trend.line)
      el('trend-end').setAttribute('cx', trend.points.at(-1).x)
      el('trend-end').setAttribute('cy', trend.points.at(-1).y)
    }

    renderList(el('delivered-list'), delivered, 'checkCircle')
    renderList(el('inflight-list'), inFlight, 'arrow')
    el('inflight-card').hidden = inFlight.length === 0
    el('delivery-grid').classList.toggle('is-single', inFlight.length === 0)

    el('next-period').textContent = value('nextPeriodLabel', 'next quarter')
    renderPriorities(priorities)
    const recommendationNote = value('recommendationNote')
    el('recommendation-note').textContent = recommendationNote
    el('recommendation-note').hidden = !recommendationNote
    const upsellLine = value('upsellLine')
    el('upsell-line').textContent = upsellLine
    el('upsell-card').hidden = !upsellLine

    const rating = Number(kit.field('qbrRating', 0))
    ratings.forEach((button) => button.setAttribute('aria-pressed', String(Number(button.dataset.score) === rating)))
    const feedbackValue = String(kit.field('qbrFeedback', ''))
    if (feedback.value !== feedbackValue) feedback.value = feedbackValue
    el('next-review-date').textContent = nextReviewDate
    el('next-review-card').hidden = !nextReviewDate
    el('signoff-manager').textContent = managerName
    el('signoff-contact').textContent = managerContact
    el('signoff-contact').hidden = !managerContact
    el('booking-link').href = bookingUrl || '#'
    el('booking-link').hidden = !bookingUrl
  })
})
