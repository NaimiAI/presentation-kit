// Buyer-facing home tour: parsed neighbourhood sales with a price check, three
// purchase paths sharing one adaptive calculator, and buyer self-fill answers.
const MORTGAGE_RATE = 0.065
const MORTGAGE_YEARS = 30
const CASH_DISCOUNT = 0.02
const DEFAULT_PRICE = 725000
const PRICE_STEP = 5000
const MIN_SHARE = 0.1
const MAX_SHARE = 0.7
const DEFAULT_SHARE = 0.2

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const formatUsd = (value) => usd.format(Math.max(0, Math.round(value)))

const formatShare = (value) => `${(value * 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}%`

const parsePrice = (raw, fallback = 0) => {
  const digits = String(raw ?? '').replace(/[^\d]/g, '')
  return digits ? Number.parseInt(digits, 10) : fallback
}

const roundToStep = (value) => Math.round(value / PRICE_STEP) * PRICE_STEP

const formatDate = (iso, fallback = '') => {
  const raw = String(iso ?? '').trim()
  const date = raw ? new Date(raw) : new Date()
  if (Number.isNaN(date.getTime())) return fallback
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const parseHighlights = (raw) => String(raw ?? '')
  .split('\n')
  .map((line) => line.replace(/^[•\-–—◆*]\s*/, '').trim())
  .filter(Boolean)

const parseComps = (raw) => String(raw ?? '')
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => {
    const parts = line.split(/\s*\|\s*|\t+/).map((part) => part.trim())
    return {
      address: parts[0] || '—',
      soldPrice: parsePrice(parts[1] ?? '', 0),
      daysOnMarket: parsePrice(parts[2] ?? '', 0),
    }
  })

const median = (values) => {
  const clean = values.filter((value) => value > 0).sort((a, b) => a - b)
  if (clean.length === 0) return 0
  const middle = Math.floor(clean.length / 2)
  return clean.length % 2 === 0
    ? Math.round((clean[middle - 1] + clean[middle]) / 2)
    : clean[middle]
}

// Amortised payment: the formula every mortgage calculator on the market uses.
const monthlyPayment = (loan, rate, years) => {
  if (loan <= 0) return 0
  const monthlyRate = rate / 12
  const months = years * 12
  return (loan * monthlyRate) / (1 - (1 + monthlyRate) ** -months)
}

const setCalculatorNote = (container, price, suffix) => {
  const value = document.createElement('strong')
  value.textContent = price
  container.replaceChildren(document.createTextNode('Asking price: '), value, document.createTextNode(suffix))
}

const renderLines = (container, lines) => {
  container.replaceChildren(...lines.map(([label, value]) => {
    const row = document.createElement('p')
    const name = document.createElement('span')
    name.textContent = label
    const amount = document.createElement('strong')
    amount.textContent = value
    row.append(name, amount)
    return row
  }))
}

naimi.ready((kit) => {
  const element = (id) => document.getElementById(id)
  const options = Array.from(document.querySelectorAll('.strategy'))
  const timelineButtons = Array.from(document.querySelectorAll('.timeline-options button'))
  const questionsInput = element('buyer-questions')

  timelineButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.dataset.key
      kit.setField('moveTimeline', kit.field('moveTimeline', '') === key ? '' : key)
    })
  })

  questionsInput.addEventListener('input', () => kit.setField('buyerQuestions', questionsInput.value))

  kit.onChange(() => {
    const buyerName = kit.personalization('companyName', '').trim()
    element('next-heading').textContent = buyerName
      ? `${buyerName}, here's how this goes`
      : "Here's how this goes"

    element('present-date').textContent = formatDate(kit.personalization('presentDate', ''), formatDate(''))

    const highlights = parseHighlights(kit.personalization('homeHighlights', ''))
    const highlightsList = element('home-highlights')
    highlightsList.replaceChildren(...highlights.map((highlight) => {
      const item = document.createElement('li')
      const diamond = document.createElement('span')
      diamond.className = 'highlight-diamond'
      const text = document.createElement('span')
      text.textContent = highlight
      item.append(diamond, text)
      return item
    }))
    highlightsList.hidden = highlights.length === 0

    const price = parsePrice(kit.personalization('askingPrice', ''), DEFAULT_PRICE)

    const comps = parseComps(kit.personalization('compsLines', ''))
    element('comps-rows').replaceChildren(...comps.map((comp) => {
      const row = document.createElement('div')
      row.className = 'comp-row'
      const address = document.createElement('span')
      address.textContent = comp.address
      const sold = document.createElement('strong')
      sold.textContent = formatUsd(comp.soldPrice)
      const days = document.createElement('span')
      days.textContent = String(comp.daysOnMarket)
      row.append(address, sold, days)
      return row
    }))
    element('median-cards').hidden = comps.length === 0
    const medianPrice = median(comps.map((comp) => comp.soldPrice))
    element('median-price').textContent = formatUsd(medianPrice)
    element('median-days').textContent = String(median(comps.map((comp) => comp.daysOnMarket)))

    const priceNote = element('price-vs-median')
    priceNote.hidden = medianPrice === 0
    if (medianPrice > 0) {
      const gap = (price - medianPrice) / medianPrice
      const gapText = Math.abs(gap * 100).toLocaleString('en-US', { maximumFractionDigits: 1 })
      priceNote.textContent = Math.abs(gap) < 0.005
        ? `Asking ${formatUsd(price)} — right at the neighbourhood median.`
        : `Asking ${formatUsd(price)} — ${gapText}% ${gap < 0 ? 'below' : 'above'} the neighbourhood median.`
    }

    const option = String(kit.field('purchaseOption', 'mortgage'))
    options.forEach((button) => {
      const selected = button.dataset.nkValue === option
      button.setAttribute('aria-pressed', String(selected))
      button.querySelector('.strategy-state').textContent = selected ? '✓ Selected' : 'Choose'
    })

    const minimum = roundToStep(price * MIN_SHARE)
    const maximum = roundToStep(price * MAX_SHARE)
    const stored = Number(kit.field('downPayment', 0))
    const seeded = Number.isFinite(stored) && stored > 0 ? stored : roundToStep(price * DEFAULT_SHARE)
    const ownMoney = Math.min(maximum, Math.max(minimum, seeded))

    const range = element('down-payment-range')
    const number = element('down-payment-number')
    for (const input of [range, number]) {
      input.min = String(minimum)
      input.max = String(maximum)
      input.value = String(ownMoney)
    }

    const isCash = option === 'cash'
    const isBridge = option === 'bridge'
    element('down-payment-block').hidden = isCash
    element('cash-note').hidden = !isCash
    element('down-payment-label').textContent = isBridge ? 'Equity in your current home' : 'Down payment'
    number.setAttribute('aria-label', element('down-payment-label').textContent)
    element('down-payment-display').textContent = formatUsd(ownMoney)

    const share = price > 0 ? ownMoney / price : 0
    if (isCash) {
      const discounted = price * (1 - CASH_DISCOUNT)
      setCalculatorNote(element('calculator-note'), formatUsd(price), ` · cash credit ${formatShare(CASH_DISCOUNT)}`)
      element('result-label').textContent = 'Price with the cash credit'
      element('result-value').textContent = formatUsd(discounted)
      renderLines(element('result-lines'), [
        ['Asking price', formatUsd(price)],
        [`Cash credit (${formatShare(CASH_DISCOUNT)})`, `−${formatUsd(price - discounted)}`],
        ['Time to close', '10–14 days'],
      ])
      element('result-note').textContent = 'The credit goes into the purchase agreement. No appraisal and no lender timeline — escrow sets the pace.'
    } else if (isBridge) {
      const remainder = Math.max(0, price - ownMoney)
      setCalculatorNote(element('calculator-note'), formatUsd(price), ` · your equity covers ${formatShare(share)}`)
      element('result-label').textContent = 'Cash due at closing'
      element('result-value').textContent = formatUsd(remainder)
      renderLines(element('result-lines'), [
        ['Asking price', formatUsd(price)],
        ['Equity we front', `−${formatUsd(ownMoney)}`],
        ['Valuation and offer', 'in 3 days'],
      ])
      element('result-note').textContent = 'We value your current home for free in three days. If the number does not work for you, nothing is signed.'
    } else {
      const loan = Math.max(0, price - ownMoney)
      setCalculatorNote(element('calculator-note'), formatUsd(price), ` · ${formatShare(share)} down`)
      element('result-label').textContent = 'Monthly payment'
      element('result-value').textContent = formatUsd(monthlyPayment(loan, MORTGAGE_RATE, MORTGAGE_YEARS))
      renderLines(element('result-lines'), [
        ['Asking price', formatUsd(price)],
        ['Down payment', `−${formatUsd(ownMoney)}`],
        ['Loan amount', formatUsd(loan)],
        ['Rate and term', `${(MORTGAGE_RATE * 100).toLocaleString('en-US', { maximumFractionDigits: 1 })}% · ${MORTGAGE_YEARS} years`],
      ])
      element('result-note').textContent = 'Principal and interest only — taxes, insurance and HOA dues are not included. Your lender sets the final rate.'
    }

    const moveTimeline = String(kit.field('moveTimeline', ''))
    timelineButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.key === moveTimeline))
    })
    questionsInput.value = String(kit.field('buyerQuestions', ''))

    const bookingUrl = kit.personalization('bookingUrl', '').trim()
    const bookingLink = element('booking-link')
    bookingLink.hidden = !bookingUrl
    element('call-fallback').hidden = Boolean(bookingUrl)
    if (bookingUrl) bookingLink.href = bookingUrl
    else bookingLink.removeAttribute('href')
  })
})
