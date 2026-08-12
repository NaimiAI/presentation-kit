// Event sponsorship package. The selectedTier field drives the selected card,
// the highlighted benefits column, and the booking copy.
const TIERS = [
  { key: 'general', label: 'Headline', priceUsd: 30000 },
  { key: 'partner', label: 'Partner', priceUsd: 15000 },
  { key: 'sponsor', label: 'Community', priceUsd: 7500 },
]

function formatUsd(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(value)))
}

function formatDate(iso, fallback = '') {
  if (!iso.trim()) return fallback
  const date = new Date(iso.trim())
  if (Number.isNaN(date.getTime())) return fallback
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

naimi.ready((kit) => {
  const el = (id) => document.getElementById(id)
  const cards = Array.from(document.querySelectorAll('.tier'))
  const columns = Array.from(document.querySelectorAll('[data-col]'))

  // v1 toggles the active package off on a second click. This is authored via
  // the public kit API; data-nk-action on each card emits the semantic action.
  for (const card of cards) {
    card.addEventListener('click', () => {
      const current = String(kit.field('selectedTier', '') ?? '')
      kit.setField('selectedTier', current === card.dataset.tier ? '' : card.dataset.tier)
    })
  }

  kit.onChange(() => {
    const selected = String(kit.field('selectedTier', '') ?? '')
    const tier = TIERS.find((item) => item.key === selected)

    for (const card of cards) card.setAttribute('aria-pressed', String(card.dataset.tier === selected))
    for (const cell of columns) cell.classList.toggle('is-active', cell.dataset.col === selected)

    const companyName = String(kit.personalization('companyName', 'Your team') ?? '').trim() || 'Your team'
    el('booking-title').textContent = tier
      ? `${companyName}: holding your ${tier.label} spot`
      : `${companyName}: your spot is still open`

    const tierLine = el('booking-tier')
    tierLine.hidden = !tier
    tierLine.textContent = tier
      ? `Selected package: ${tier.label} · ${formatUsd(tier.priceUsd)} — saved to this presentation.`
      : ''

    el('booking-deadline').textContent = formatDate(kit.personalization('validUntil', ''), '') || "we'll set it on the call"
  })
})
