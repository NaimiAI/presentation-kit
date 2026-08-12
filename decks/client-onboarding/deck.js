// Derived deck content: plan dates calculated from startDate.
const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })

function resolveStartDate(raw) {
  const parsed = new Date(raw)
  return String(raw).trim() && !Number.isNaN(parsed.getTime()) ? parsed : new Date()
}

function addDays(date, days) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

naimi.ready((kit) => {
  kit.onChange(() => {
    const startDate = resolveStartDate(kit.personalization('startDate', ''))
    const startDay = dateFormatter.format(startDate)
    document.getElementById('welcome-start-date').textContent = startDay
    document.querySelectorAll('[data-date-offset]').forEach((node) => {
      node.textContent = dateFormatter.format(addDays(startDate, Number(node.dataset.dateOffset)))
    })

    const managerName = kit.personalization('managerName', 'Your manager')
    document.getElementById('manager-photo').alt = managerName
    document.getElementById('manager-contact-wrap').hidden = !kit.personalization('managerContact', '')
  })
})
