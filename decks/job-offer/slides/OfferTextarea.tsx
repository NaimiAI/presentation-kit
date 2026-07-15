import { useDemoField } from '../kit/hooks'

interface OfferTextareaProps {
  fieldKey: string
  placeholder: string
  rows?: number
}

/** Free-text candidate reply: a textarea bound to a demo field (self-fill). */
export default function OfferTextarea({ fieldKey, placeholder, rows = 4 }: OfferTextareaProps) {
  const [value, setValue] = useDemoField<string>(fieldKey, { defaultValue: '' })

  return (
    <textarea
      value={value}
      onChange={(event) => setValue(event.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full resize-none rounded-3xl border border-edge bg-card px-5 py-4 text-sm leading-relaxed text-ink shadow-sm outline-none transition-colors placeholder:text-ink-faint focus:border-accent"
    />
  )
}
