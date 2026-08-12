const DEFAULT_CONDITIONS = [
  'Payment: 50% to start per stage, 50% on acceptance · Net 15',
  'Two revision rounds included on every stage',
  'Design source files handed over on final payment',
  'Warranty support: 30 days after launch',
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

const makeStage = (stage, index) => {
  const article = document.createElement('article')
  article.className = 'estimate-stage'
  article.dataset.animate = 'up'
  article.dataset.delay = String(0.1 + index * 0.12)

  const head = document.createElement('div')
  head.className = 'estimate-stage-head'
  const title = document.createElement('h3')
  const cost = document.createElement('strong')
  title.textContent = stage.title
  cost.textContent = formatUsd(stage.cost)
  head.append(title, cost)

  const rows = document.createElement('div')
  rows.className = 'estimate-rows'
  for (const row of stage.rows) {
    const line = document.createElement('div')
    const work = document.createElement('span')
    const description = document.createElement('span')
    work.textContent = row.work
    description.textContent = row.description
    line.append(work, description)
    rows.append(line)
  }
  article.append(head, rows)
  return article
}

const makeCondition = (condition) => {
  const row = document.createElement('div')
  row.className = 'condition'
  const dash = document.createElement('span')
  const text = document.createElement('span')
  dash.textContent = '—'
  text.textContent = condition
  row.append(dash, text)
  return row
}

naimi.ready((kit) => {
  const el = (id) => document.getElementById(id)

  kit.onChange(() => {
    const contactName = kit.personalization('contactName', '').trim()
    el('cover-contact').hidden = !contactName
    el('signature-contact').hidden = !contactName

    const proposalDate = formatDate(
      kit.personalization('proposalDate', ''),
      formatDate(new Date().toISOString()),
    )
    const validUntil = formatDate(kit.personalization('validUntil', ''))
    el('proposal-date').textContent = proposalDate
    el('cover-valid').hidden = !validUntil
    el('cover-valid').querySelector('span').textContent = validUntil
    el('estimate-valid').hidden = !validUntil
    el('estimate-valid').querySelector('span').textContent = validUntil

    const stages = parseStages(kit.personalization('stagesJson', ''))
    el('stages-list').replaceChildren(...stages.map(makeStage))
    el('estimate-content').hidden = stages.length === 0
    el('estimate-empty').hidden = stages.length > 0
    el('stages-total').textContent = formatUsd(
      stages.reduce((sum, stage) => sum + stage.cost, 0),
    )
    el('pricing-disclaimer').textContent = kit.personalization(
      'pricingDisclaimer', 'Prices exclude sales tax',
    )

    const customConditions = parseConditions(kit.personalization('workConditions', ''))
    const conditions = customConditions.length > 0 ? customConditions : DEFAULT_CONDITIONS
    el('conditions-list').replaceChildren(...conditions.map(makeCondition))
  })
})
