// b2b-services interaction: painPoints become a numbered list, and the
// priority practice is a single choice that can be cleared with a second click.
const FALLBACK_PAIN = 'Fill in the "What we heard" field when you create the presentation — the client\'s challenges, in their own words, land right here.'

naimi.ready((kit) => {
  const painList = document.getElementById('pain-list')
  const serviceButtons = Array.from(document.querySelectorAll('[data-service-key]'))

  const renderPains = () => {
    const pains = kit.personalization('painPoints', '')
      .split('\n')
      .map((line) => line.replace(/^[•-]\s*/, '').trim())
      .filter(Boolean)
    const items = pains.length ? pains : [FALLBACK_PAIN]

    painList.replaceChildren(...items.map((pain, index) => {
      const row = document.createElement('div')
      row.className = 'pain'
      const number = document.createElement('span')
      number.className = 'pain-number'
      number.textContent = String(index + 1).padStart(2, '0')
      const text = document.createElement('p')
      text.textContent = pain
      row.append(number, text)
      return row
    }))
  }

  serviceButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.dataset.serviceKey
      kit.setField('priorityService', kit.field('priorityService', '') === key ? '' : key)
    })
  })

  kit.onChange(() => {
    renderPains()
    const priority = kit.field('priorityService', '')
    serviceButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.serviceKey === priority))
    })
  })
})
