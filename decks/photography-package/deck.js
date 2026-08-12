// Client self-fill for the wedding package: collection selection drives which
// add-ons are included, while optional add-ons and extra hours produce a live total.
const PACKAGES = {
  essentials: { label: 'Essentials', price: 3200, covers: [] },
  signature: { label: 'Signature', price: 4800, covers: ['addonSecondShooter', 'addonEngagement'] },
  heirloom: { label: 'Heirloom', price: 7500, covers: ['addonSecondShooter', 'addonEngagement', 'addonAlbum'] },
}

const ADDONS = {
  addonSecondShooter: { label: 'Second shooter', price: 600 },
  addonEngagement: { label: 'Engagement session', price: 450 },
  addonAlbum: { label: 'Fine-art album', price: 950 },
  addonRehearsal: { label: 'Rehearsal-dinner coverage', price: 800 },
}

const EXTRA_HOUR_RATE = 400

const formatUsd = (value) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
}).format(Math.max(0, Math.round(value)))

const formatWeddingDate = (iso) => {
  const trimmed = String(iso ?? '').trim()
  if (!trimmed) return ''
  const date = new Date(trimmed)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

naimi.ready((kit) => {
  const el = (id) => document.getElementById(id)
  const addonButtons = Array.from(document.querySelectorAll('[data-addon-key]'))
  const dateButtons = Array.from(document.querySelectorAll('[data-date-key]'))
  const hourButtons = Array.from(document.querySelectorAll('[data-hour-delta]'))
  const questions = el('couples-questions')

  addonButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const packageKey = String(kit.field('selectedPackage', 'signature'))
      const selectedPackage = PACKAGES[packageKey] ?? PACKAGES.essentials
      const key = button.dataset.addonKey
      if (selectedPackage.covers.includes(key)) return
      kit.setField(key, kit.field(key, false) !== true)
    })
  })

  hourButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const current = Math.max(0, Math.min(4, Math.round(Number(kit.field('extraHours', 0)) || 0)))
      const delta = Number(button.dataset.hourDelta)
      kit.setField('extraHours', Math.max(0, Math.min(4, current + delta)))
    })
  })

  dateButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.dataset.dateKey
      kit.setField('dateFlexible', kit.field('dateFlexible', '') === key ? '' : key)
    })
  })

  questions.addEventListener('input', () => kit.setField('couplesQuestions', questions.value))

  kit.onChange(() => {
    const packageKey = String(kit.field('selectedPackage', 'signature'))
    const selectedPackage = PACKAGES[packageKey] ?? PACKAGES.essentials
    const extraHours = Math.max(0, Math.min(4, Math.round(Number(kit.field('extraHours', 0)) || 0)))
    const billedAddons = []

    addonButtons.forEach((button) => {
      const key = button.dataset.addonKey
      const covered = selectedPackage.covers.includes(key)
      const checked = kit.field(key, false) === true
      button.classList.toggle('is-covered', covered)
      button.disabled = covered
      button.setAttribute('aria-pressed', String(!covered && checked))
      if (!covered && checked) billedAddons.push(key)
    })

    const addonsTotal = billedAddons.reduce((sum, key) => sum + ADDONS[key].price, 0)
    const extraHoursTotal = extraHours * EXTRA_HOUR_RATE
    const total = selectedPackage.price + addonsTotal + extraHoursTotal

    el('selected-package-label').textContent = selectedPackage.label
    el('selected-package-price').textContent = formatUsd(selectedPackage.price)
    el('addons-package-label').textContent = selectedPackage.label
    el('extra-hours-value').textContent = String(extraHours)
    el('total-price').textContent = formatUsd(total)

    hourButtons.forEach((button) => {
      const delta = Number(button.dataset.hourDelta)
      button.disabled = (delta < 0 && extraHours <= 0) || (delta > 0 && extraHours >= 4)
    })

    const totalLines = el('total-lines')
    totalLines.replaceChildren()
    const appendLine = (label, price) => {
      const row = document.createElement('div')
      row.className = 'total-line'
      const labelNode = document.createElement('span')
      const priceNode = document.createElement('span')
      labelNode.textContent = label
      priceNode.textContent = price
      row.append(labelNode, priceNode)
      totalLines.append(row)
    }
    appendLine(`${selectedPackage.label} collection`, formatUsd(selectedPackage.price))
    billedAddons.forEach((key) => appendLine(ADDONS[key].label, `+${formatUsd(ADDONS[key].price)}`))
    if (extraHours > 0) appendLine(`Extra hours (×${extraHours})`, `+${formatUsd(extraHoursTotal)}`)

    const dateFlexible = String(kit.field('dateFlexible', ''))
    dateButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.dateKey === dateFlexible)))
    const questionValue = String(kit.field('couplesQuestions', ''))
    if (questions.value !== questionValue) questions.value = questionValue

    const weddingDate = formatWeddingDate(kit.personalization('weddingDate', ''))
    const venueName = kit.personalization('venueName', '')
    el('cover-meta').textContent = [weddingDate, venueName].filter(Boolean).join(' · ')

    const bookingUrl = kit.personalization('bookingUrl', '').trim()
    const bookingLink = el('booking-link')
    const bookingContact = el('booking-contact')
    bookingLink.hidden = !bookingUrl
    bookingContact.hidden = Boolean(bookingUrl)
    if (bookingUrl) bookingLink.href = bookingUrl

    const couple = kit.personalization('companyName', '').trim()
    bookingContact.replaceChildren()
    bookingContact.append(document.createTextNode(couple ? `${couple}, when you're ready, reach out to Sarah Wren at ` : "When you're ready, reach out to Sarah Wren at "))
    const email = document.createElement('strong')
    email.textContent = 'hello@wrenandfield.co'
    const phone = document.createElement('strong')
    phone.textContent = '(415) 555-0142'
    bookingContact.append(email, document.createTextNode(" or "), phone, document.createTextNode(" and we'll get your date on the calendar."))
  })
})
