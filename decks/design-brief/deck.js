// Brief interactions: textarea, boolean multi-select, and toggle-off chips
// use the public API because the declarative layer does not support toggle-off.
naimi.ready((kit) => {
  const buttons = Array.from(document.querySelectorAll('[data-field]'))
  const textareas = Array.from(document.querySelectorAll('[data-nk-textarea]'))

  for (const button of buttons) {
    button.addEventListener('click', () => {
      const field = button.dataset.field
      if (button.dataset.kind === 'boolean') {
        kit.setField(field, kit.field(field, false) !== true)
        return
      }
      const value = button.dataset.value
      kit.setField(field, String(kit.field(field, '') ?? '') === value ? '' : value)
    })
  }

  for (const textarea of textareas) {
    textarea.addEventListener('input', () => kit.setField(textarea.dataset.nkTextarea, textarea.value))
  }

  kit.onChange(() => {
    const contactName = String(kit.personalization('contactName', '') ?? '').trim()
    document.getElementById('cover-note').textContent =
      `${contactName ? `${contactName}, there are` : 'There are'} no right answers here — write `
      + 'it the way you feel it. Everything saves itself; come back and add more anytime.'

    for (const button of buttons) {
      const current = kit.field(button.dataset.field, button.dataset.kind === 'boolean' ? false : '')
      const pressed = button.dataset.kind === 'boolean'
        ? current === true
        : String(current ?? '') === button.dataset.value
      button.setAttribute('aria-pressed', String(pressed))
      const state = button.querySelector('.select-state')
      if (state) state.textContent = pressed ? '— selected' : '+ select'
    }

    for (const textarea of textareas) {
      const value = String(kit.field(textarea.dataset.nkTextarea, '') ?? '')
      if (document.activeElement !== textarea && textarea.value !== value) textarea.value = value
    }
  })
})
