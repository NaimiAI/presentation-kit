// EN job offer. The engine inserts direct personalization; this file keeps only
// derived text/layout and the two self-fill controls that need the public JS API.

/** "Jul 31, 2026" — the exact v1 formula from slides/content.ts. */
function formatDate(iso, fallback = '') {
  if (!iso.trim()) return fallback
  const date = new Date(iso.trim())
  if (Number.isNaN(date.getTime())) return fallback
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

naimi.ready((kit) => {
  const el = (id) => document.getElementById(id)
  const chips = Array.from(document.querySelectorAll('.chip'))
  const question = el('answer-question')

  // v1 clears an answer when its active chip is clicked again, so this field is
  // managed manually instead of mixing engine binding with a second handler.
  for (const chip of chips) {
    chip.addEventListener('click', () => {
      const current = String(kit.field('candidateAnswer', '') ?? '')
      kit.setField('candidateAnswer', current === chip.dataset.answer ? '' : chip.dataset.answer)
    })
  }

  // The declarative engine binds range/number inputs, not free-text textarea.
  question.addEventListener('input', () => kit.setField('candidateQuestion', question.value))

  kit.onChange(() => {
    const candidateName = String(kit.personalization('companyName', '') ?? '').trim()
    el('cover-lead').textContent = candidateName ? `${candidateName}, we'd love` : "We'd love"

    const managerName = String(kit.personalization('managerName', 'Hiring manager') ?? '')
    el('manager-initial').textContent = managerName.trim().charAt(0).toUpperCase() || 'M'

    el('comp-start-date').textContent = formatDate(
      String(kit.personalization('startDate', '') ?? ''),
      "we'll pick together",
    )

    const compCount = 1
      + (kit.personalization('equityText') ? 1 : 0)
      + (kit.personalization('signingBonus') ? 1 : 0)
    el('comp-grid').classList.toggle('cols-1', compCount === 1)
    el('comp-grid').classList.toggle('cols-2', compCount === 2)

    const validUntilText = formatDate(String(kit.personalization('validUntil', '') ?? ''))
    el('answer-title').textContent = validUntilText
      ? `This offer is valid through ${validUntilText}`
      : "We're excited to hear from you"

    const answer = String(kit.field('candidateAnswer', '') ?? '')
    for (const chip of chips) chip.setAttribute('aria-pressed', String(chip.dataset.answer === answer))

    const questionText = String(kit.field('candidateQuestion', '') ?? '')
    if (document.activeElement !== question && question.value !== questionText) {
      question.value = questionText
    }
  })
})
