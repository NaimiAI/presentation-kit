// Price quote: line items arrive as text "Description | SKU | Unit | Qty | Unit price";
// subtotal, discount, estimated sales tax, total and the amount in words are computed here.
const formatUsd = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.max(0, value))

const formatDate = (raw, fallback = '') => {
  if (!String(raw ?? '').trim()) return fallback
  const date = new Date(String(raw).trim())
  if (Number.isNaN(date.getTime())) return fallback
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date)
}

const parseNumber = (value) => {
  const cleaned = String(value ?? '').replace(/[\s,$%]/g, '').replace(/[^\d.]/g, '')
  const number = Number.parseFloat(cleaned)
  return Number.isFinite(number) ? number : 0
}

const parseSpec = (raw) => String(raw ?? '')
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith('#'))
  .map((line) => {
    const parts = line.split(/\s*\|\s*|\t+/).map((part) => part.trim())
    const qty = parseNumber(parts[3])
    const price = parseNumber(parts[4])
    return { name: parts[0] || line, sku: parts[1] || '—', unit: parts[2] || 'pcs', qty, price, sum: qty * price }
  })

// Amount in words — dollars in words, cents as a fraction (check style).
const ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
const SCALES = ['', 'thousand', 'million', 'billion']
const tripletWords = (n) => {
  const words = []
  if (n >= 100) words.push(`${ONES[Math.floor(n / 100)]} hundred`)
  const rest = n % 100
  if (rest >= 20) words.push(rest % 10 ? `${TENS[Math.floor(rest / 10)]}-${ONES[rest % 10]}` : TENS[Math.floor(rest / 10)])
  else if (rest > 0) words.push(ONES[rest])
  return words
}
const amountInWords = (value) => {
  const dollars = Math.floor(Math.max(0, value))
  const cents = Math.round((Math.max(0, value) - dollars) * 100) % 100
  const fraction = `${String(cents).padStart(2, '0')}/100`
  if (dollars === 0) return `zero dollars and ${fraction}`
  const words = []
  let rest = dollars
  let scale = 0
  while (rest > 0 && scale < SCALES.length) {
    const triplet = rest % 1000
    if (triplet > 0) words.unshift(...tripletWords(triplet), SCALES[scale])
    rest = Math.floor(rest / 1000)
    scale += 1
  }
  const text = words.filter(Boolean).join(' ')
  return `${text.charAt(0).toUpperCase()}${text.slice(1)} dollars and ${fraction}`
}

const cell = (tag, className, text) => {
  const el = document.createElement(tag)
  if (className) el.className = className
  el.textContent = text
  return el
}

const buildTable = (rows) => {
  const table = document.createElement('table')
  table.className = 'spec-table'
  const thead = document.createElement('thead')
  const head = document.createElement('tr')
  head.append(cell('th', '', '#'), cell('th', '', 'Description'), cell('th', '', 'SKU'), cell('th', '', 'Unit'), cell('th', 'num', 'Qty'), cell('th', 'num', 'Unit price'), cell('th', 'num', 'Amount'))
  thead.append(head)
  const tbody = document.createElement('tbody')
  rows.forEach((row, index) => {
    const tr = document.createElement('tr')
    tr.append(
      cell('td', 'idx', String(index + 1)),
      cell('td', '', row.name),
      cell('td', 'sku', row.sku),
      cell('td', 'unit', row.unit),
      cell('td', 'num qty', new Intl.NumberFormat('en-US').format(row.qty)),
      cell('td', 'num price', formatUsd(row.price)),
      cell('td', 'num sum', formatUsd(row.sum)),
    )
    tbody.append(tr)
  })
  table.append(thead, tbody)
  return table
}

naimi.ready((kit) => {
  const el = (id) => document.getElementById(id)

  kit.onChange(() => {
    const rows = parseSpec(kit.personalization('specification', ''))
    const subtotal = rows.reduce((sum, row) => sum + row.sum, 0)
    const discountPct = Math.min(100, parseNumber(kit.personalization('discountPercent', '')))
    const discount = Math.round(subtotal * discountPct) / 100
    const taxRate = parseNumber(kit.personalization('taxRate', ''))
    const taxed = subtotal - discount
    const tax = Math.round(taxed * taxRate) / 100
    const total = taxed + tax

    el('spec-table').replaceChildren(...(rows.length ? [buildTable(rows)] : []))
    el('spec-empty').hidden = rows.length > 0
    el('total-net').textContent = formatUsd(subtotal)
    el('discount-row').hidden = discount <= 0
    el('discount-pct').textContent = discount > 0 ? `${new Intl.NumberFormat('en-US').format(discountPct)}%` : ''
    el('total-discount').textContent = `− ${formatUsd(discount)}`
    el('tax-row').hidden = tax <= 0
    el('tax-pct').textContent = tax > 0 ? `(${new Intl.NumberFormat('en-US', { maximumFractionDigits: 3 }).format(taxRate)}%)` : ''
    el('total-tax').textContent = formatUsd(tax)
    el('total-gross').textContent = formatUsd(total)
    el('letter-total').textContent = formatUsd(total)
    el('total-words').textContent = amountInWords(total)

    el('offer-date').textContent = formatDate(kit.personalization('offerDate', ''), formatDate(new Date().toISOString()))
    const valid = formatDate(kit.personalization('validUntil', ''), 'the end of the month')
    el('letter-valid').textContent = valid
    el('terms-valid').textContent = valid

    const decision = String(kit.field('offerDecision', '') ?? '')
    el('approve-state').textContent = decision === 'accepted'
      ? 'Quote accepted — we will send the order confirmation and the deposit invoice.'
      : decision === 'samples'
        ? 'Sample request received — they ship within 5 business days.'
        : 'No response yet — we see your choice the moment you click.'
  })
})
