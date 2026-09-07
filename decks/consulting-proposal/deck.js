// consulting-proposal: dates from personalization, the priced estimate from the stages
// editor (`stagesJson`), and the retainer picker summary.
const RETAINERS = {
  advisory: { name: 'Advisory', monthly: 2500 },
  embedded: { name: 'Embedded', monthly: 6000 },
  full: { name: 'Full', monthly: 12000 },
}
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const formatUsd = (value) => usd.format(Math.max(0, Math.round(value)))

const parseDate = (raw) => {
  if (!String(raw ?? '').trim()) return null
  const date = new Date(String(raw).trim())
  return Number.isNaN(date.getTime()) ? null : date
}
const addDays = (date, days) => new Date(date.getTime() + days * 86400000)
const longDate = (date) => date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
const shortDate = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

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
    return { work: parts[0] ?? line, description: parts.slice(1).join(' | ') || '—' }
  })
const parseStages = (raw) => {
  if (!String(raw ?? '').trim()) return []
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map((item) => {
      const title = typeof item?.title === 'string' ? item.title.trim() : ''
      const rows = parseRows(item?.rows)
      if (!title && rows.length === 0) return null
      return { title: title || 'Stage', cost: parseCost(item?.costRub), rows }
    }).filter(Boolean)
  } catch {
    return []
  }
}

const makeStage = (stage, index) => {
  const article = document.createElement('article')
  article.className = 'estimate-stage'
  article.dataset.animate = 'up'
  article.dataset.delay = String(0.2 + index * 0.1)
  const head = document.createElement('div')
  head.className = 'stage-head'
  const title = document.createElement('h3')
  title.textContent = stage.title
  const cost = document.createElement('strong')
  cost.textContent = formatUsd(stage.cost)
  head.append(title, cost)
  const rows = document.createElement('div')
  rows.className = 'stage-rows'
  for (const row of stage.rows) {
    const line = document.createElement('div')
    line.className = 'stage-row'
    const work = document.createElement('span')
    work.className = 'stage-work'
    work.textContent = row.work
    const description = document.createElement('span')
    description.className = 'stage-desc'
    description.textContent = row.description
    line.append(work, description)
    rows.append(line)
  }
  article.append(head, rows)
  return article
}

naimi.ready((kit) => {
  const el = (id) => document.getElementById(id)

  // The client's question box: textareas are bound by hand (input → setField, state → value).
  const questions = document.querySelector('[data-nk-textarea="clientQuestions"]')
  questions.addEventListener('input', () => kit.setField('clientQuestions', questions.value))

  // Everything that reads personalization or fields lives in kit.onChange — it runs once
  // the host's data has arrived and again on every change (naimi.ready fires before that).
  kit.onChange(() => {
    const proposalDate = parseDate(kit.personalization('proposalDate', ''))
    el('proposal-date').textContent = proposalDate ? longDate(proposalDate) : String(new Date().getFullYear())
    const validUntil = parseDate(kit.personalization('validUntil', ''))
    const validText = validUntil ? longDate(validUntil) : 'the end of the month'
    el('valid-until-cover').textContent = validText
    el('valid-until').textContent = validText

    // Twelve weeks: discover 1–3, design 4–9, deliver 10–12 — counted from the start date.
    const start = parseDate(kit.personalization('startDate', ''))
    el('start-date').textContent = start ? longDate(start) : 'kick-off'
    el('kickoff-date').textContent = start ? longDate(start) : 'the agreed date'
    if (start) {
      const span = (fromWeek, toWeek) => `${shortDate(addDays(start, (fromWeek - 1) * 7))} — ${shortDate(addDays(start, toWeek * 7 - 1))}`
      el('tl-1').textContent = span(1, 3)
      el('tl-2').textContent = span(4, 9)
      el('tl-3').textContent = span(10, 12)
    }

    const stages = parseStages(kit.personalization('stagesJson', ''))
    el('stages-list').replaceChildren(...stages.map(makeStage))
    el('estimate-content').hidden = stages.length === 0
    el('estimate-empty').hidden = stages.length > 0
    el('stages-total').textContent = formatUsd(stages.reduce((sum, stage) => sum + stage.cost, 0))

    const tier = RETAINERS[kit.field('retainer', 'embedded')] ?? RETAINERS.embedded
    el('retainer-summary').textContent = `${tier.name} — ${formatUsd(tier.monthly)} a month`

    const saved = String(kit.field('clientQuestions', '') ?? '')
    if (document.activeElement !== questions && questions.value !== saved) questions.value = saved
  })
})
