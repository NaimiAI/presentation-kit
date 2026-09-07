// Remodel estimate: labor and material lines arrive as text from personalization fields,
// one line per item — "Description | unit | qty | rate"; a "# Section" line opens a section.
// Line amounts, section subtotals, the summary and the payment schedule are computed here.
const FALLBACK_CONDITIONS = [
  'Preliminary estimate: quantities are confirmed at the site visit, unit rates are fixed in the contract',
  'Rough and mechanical materials are purchased by us against an approved list; receipts attached to invoices',
  'Changes in scope are documented in a change order before the work starts',
  '2-year workmanship warranty from the final walkthrough',
]

const formatUsd = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Math.max(0, Math.round(value)))

const formatQty = (value) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value)

const formatDate = (raw, fallback = '') => {
  if (!String(raw ?? '').trim()) return fallback
  const date = new Date(String(raw).trim())
  if (Number.isNaN(date.getTime())) return fallback
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date)
}

// "1,200", "1.5", "$850" → number; garbage → 0.
const parseNumber = (value) => {
  const cleaned = String(value ?? '').replace(/[\s,$]/g, '').replace(/[^\d.]/g, '')
  const number = Number.parseFloat(cleaned)
  return Number.isFinite(number) ? number : 0
}

const parseEstimate = (raw) => {
  const sections = []
  let current = null
  for (const line of String(raw ?? '').split('\n').map((item) => item.trim()).filter(Boolean)) {
    if (line.startsWith('#')) {
      current = { title: line.replace(/^#+\s*/, ''), rows: [], subtotal: 0 }
      sections.push(current)
      continue
    }
    const parts = line.split(/\s*\|\s*|\t+/).map((part) => part.trim())
    if (!current) {
      current = { title: '', rows: [], subtotal: 0 }
      sections.push(current)
    }
    const qty = parseNumber(parts[2])
    const price = parseNumber(parts[3])
    const row = { name: parts[0] || line, unit: parts[1] || '—', qty, price, sum: qty * price }
    current.rows.push(row)
    current.subtotal += row.sum
  }
  return sections.filter((section) => section.rows.length > 0)
}

const cell = (tag, className, text) => {
  const el = document.createElement(tag)
  if (className) el.className = className
  el.textContent = text
  return el
}

const buildTable = (sections) => {
  const table = document.createElement('table')
  table.className = 'est-table'
  const thead = document.createElement('thead')
  const head = document.createElement('tr')
  head.append(cell('th', '', '#'), cell('th', '', 'Description'), cell('th', '', 'Unit'), cell('th', 'num', 'Qty'), cell('th', 'num', 'Rate'), cell('th', 'num', 'Amount'))
  thead.append(head)
  const tbody = document.createElement('tbody')
  let index = 0
  for (const section of sections) {
    if (section.title) {
      const group = document.createElement('tr')
      group.className = 'group'
      const td = cell('td', '', section.title)
      td.colSpan = 6
      group.append(td)
      tbody.append(group)
    }
    for (const row of section.rows) {
      index += 1
      const tr = document.createElement('tr')
      tr.append(
        cell('td', 'idx', String(index)),
        cell('td', '', row.name),
        cell('td', 'unit', row.unit),
        cell('td', 'num qty', formatQty(row.qty)),
        cell('td', 'num price', formatUsd(row.price)),
        cell('td', 'num sum', formatUsd(row.sum)),
      )
      tbody.append(tr)
    }
    if (section.title && sections.length > 1) {
      const sub = document.createElement('tr')
      sub.className = 'subtotal'
      const label = cell('td', '', `Subtotal: ${section.title.toLowerCase()}`)
      label.colSpan = 5
      sub.append(label, cell('td', 'num sum', formatUsd(section.subtotal)))
      tbody.append(sub)
    }
  }
  table.append(thead, tbody)
  return table
}

const sumOf = (sections) => sections.reduce((sum, section) => sum + section.subtotal, 0)

naimi.ready((kit) => {
  const el = (id) => document.getElementById(id)
  const textarea = document.querySelector('[data-nk-textarea]')
  textarea.addEventListener('input', () => kit.setField(textarea.dataset.nkTextarea, textarea.value))

  kit.onChange(() => {
    const works = parseEstimate(kit.personalization('worksEstimate', ''))
    const materials = parseEstimate(kit.personalization('materialsEstimate', ''))
    const worksTotal = sumOf(works)
    const materialsTotal = sumOf(materials)
    const discountPct = Math.min(100, parseNumber(kit.personalization('discountPercent', '')))
    const discount = Math.round((worksTotal + materialsTotal) * discountPct / 100)
    const total = worksTotal + materialsTotal - discount

    el('works-table').replaceChildren(...(works.length ? [buildTable(works)] : []))
    el('works-empty').hidden = works.length > 0
    el('works-total').textContent = formatUsd(worksTotal)
    el('materials-table').replaceChildren(...(materials.length ? [buildTable(materials)] : []))
    el('materials-empty').hidden = materials.length > 0
    el('materials-total').textContent = formatUsd(materialsTotal)

    for (const [prefix, worksId, materialsId] of [['cover', 'cover-works', 'cover-materials'], ['grand', 'grand-works', 'grand-materials']]) {
      el(worksId).textContent = formatUsd(worksTotal)
      el(materialsId).textContent = formatUsd(materialsTotal)
      el(`${prefix}-discount-row`).hidden = discount <= 0
      el(`${prefix}-discount`).textContent = `− ${formatUsd(discount)}`
      el(`${prefix}-total`).textContent = formatUsd(total)
    }
    el('grand-discount-pct').textContent = discount > 0 ? `${formatQty(discountPct)}%` : ''
    el('pay-1').textContent = formatUsd(total * 0.3)
    el('pay-2').textContent = formatUsd(total * 0.4)
    el('pay-3').textContent = formatUsd(total * 0.3)

    el('estimate-date').textContent = formatDate(kit.personalization('estimateDate', ''), formatDate(new Date().toISOString()))
    el('cover-valid').textContent = formatDate(kit.personalization('validUntil', ''), 'the end of the month')

    // The property photo is per-client; without it the plan sketch stays on the cover.
    const photo = String(kit.personalization('objectPhoto', '') ?? '').trim()
    el('object-photo').hidden = !photo
    if (photo && el('object-photo').getAttribute('src') !== photo) el('object-photo').src = photo
    el('floor-plan').hidden = Boolean(photo)
    el('cover-caption').textContent = photo ? 'The property' : 'Floor plan — confirmed at the site visit'

    const conditions = String(kit.personalization('workConditions', '') ?? '')
      .split('\n').map((line) => line.replace(/^[•\-–—]\s*/, '').trim()).filter(Boolean)
    el('conditions-list').replaceChildren(
      ...(conditions.length ? conditions : FALLBACK_CONDITIONS).map((line) => cell('li', '', line)),
    )

    const decision = String(kit.field('estimateDecision', '') ?? '')
    el('approve-state').textContent = decision === 'accepted'
      ? 'Estimate approved — your project manager will reach out to sign the contract.'
      : decision === 'questions'
        ? 'Questions received — we reply within one business day.'
        : 'No decision yet.'
    const comment = String(kit.field('clientComment', '') ?? '')
    if (document.activeElement !== textarea && textarea.value !== comment) textarea.value = comment
  })
})
