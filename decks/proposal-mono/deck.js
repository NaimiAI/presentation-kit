const FALLBACK_CONDITIONS = [
  'Payment: 50% to start, 50% on acceptance · Net 15',
  'Weekly status call and a written progress report',
  'Two revision rounds included on every stage',
]

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const formatUsd = (value) => usdFormatter.format(Math.max(0, Math.round(value)))

const formatDate = (raw, fallback = '') => {
  if (!String(raw ?? '').trim()) return fallback
  const date = new Date(String(raw).trim())
  if (Number.isNaN(date.getTime())) return fallback
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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

const parseConditions = (raw) => String(raw ?? '')
  .split('\n')
  .map((line) => line.replace(/^[•-]\s*/, '').trim())
  .filter(Boolean)

const makeStage = (stage, stageIndex) => {
  const article = document.createElement('article')
  article.className = 'estimate-stage'
  article.dataset.animate = 'up'
  article.dataset.delay = String(0.1 + stageIndex * 0.1)

  const head = document.createElement('div')
  head.className = 'stage-head'
  const title = document.createElement('h3')
  const cost = document.createElement('strong')
  title.textContent = stage.title
  cost.textContent = formatUsd(stage.cost)
  head.append(title, cost)

  const rows = document.createElement('div')
  rows.className = 'stage-rows'
  for (const row of stage.rows) {
    const line = document.createElement('div')
    line.className = 'stage-row'
    const work = document.createElement('span')
    const description = document.createElement('span')
    work.className = 'stage-work'
    work.textContent = `— ${row.work}`
    description.textContent = row.description
    line.append(work, description)
    rows.append(line)
  }

  article.append(head, rows)
  return article
}

const makeCondition = (line, index) => {
  const row = document.createElement('div')
  row.className = 'condition'
  row.dataset.animate = 'left'
  row.dataset.delay = String(0.1 + index * 0.08)
  const slash = document.createElement('span')
  const text = document.createElement('span')
  slash.textContent = '/'
  text.textContent = line
  row.append(slash, text)
  return row
}

naimi.ready((kit) => {
  const el = (id) => document.getElementById(id)

  kit.onChange(() => {
    const stages = parseStages(kit.personalization('stagesJson', ''))
    el('stages-list').replaceChildren(...stages.map(makeStage))
    el('estimate-content').hidden = stages.length === 0
    el('estimate-empty').hidden = stages.length > 0
    el('stages-total').textContent = formatUsd(
      stages.reduce((sum, stage) => sum + stage.cost, 0),
    )

    const proposalDate = formatDate(
      kit.personalization('proposalDate', ''),
      formatDate(new Date().toISOString()),
    )
    const validUntil = formatDate(kit.personalization('validUntil', ''))
    el('proposal-date').textContent = proposalDate
    el('cover-valid-until').textContent = validUntil || 'by agreement'

    const estimateValid = el('estimate-valid-until')
    estimateValid.hidden = !validUntil
    estimateValid.querySelector('span').textContent = validUntil

    const termsValid = el('terms-valid-until')
    termsValid.hidden = !validUntil
    termsValid.querySelector('p').textContent = validUntil
      ? `This proposal is valid through ${validUntil}`.replace(/ /g, '\u00a0')
      : ''

    const customConditions = parseConditions(kit.personalization('workConditions', ''))
    const conditions = customConditions.length > 0 ? customConditions : FALLBACK_CONDITIONS
    el('conditions-list').replaceChildren(...conditions.map(makeCondition))
  })
})
