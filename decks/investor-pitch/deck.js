const ROUND_TARGET = 2_500_000
const POST_MONEY = 12_500_000

const formatUsd = (value) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
}).format(Math.max(0, Math.round(value)))

const formatDate = (iso) => {
  if (!iso.trim()) return ''
  const date = new Date(iso.trim())
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

naimi.ready((kit) => {
  const ticketDisplay = document.getElementById('ticket-display')
  const roundShare = document.getElementById('round-share')
  const equityShare = document.getElementById('equity-share')
  const closingWrap = document.getElementById('closing-wrap')
  const closingDate = document.getElementById('closing-date')
  const nextStepTitle = document.getElementById('next-step-title')

  kit.onChange(() => {
    const ticket = Number(kit.field('ticketK', 250_000))
    ticketDisplay.textContent = formatUsd(ticket)
    roundShare.textContent = `${Math.min(100, (ticket / ROUND_TARGET) * 100).toFixed(0)}%`
    equityShare.textContent = `≈${((ticket / POST_MONEY) * 100).toFixed(1)}%`

    const formattedClosing = formatDate(kit.personalization('roundClosing', ''))
    closingDate.textContent = formattedClosing
    closingWrap.hidden = !formattedClosing

    const contactName = kit.personalization('contactName', '')
    nextStepTitle.textContent = contactName
      ? `${contactName}, next step — 30 minutes with the founders`
      : 'Next step — 30 minutes with the founders'
  })
})
