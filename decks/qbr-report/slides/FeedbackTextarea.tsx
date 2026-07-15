import { useDemoField } from '../kit/hooks'

interface FeedbackTextareaProps {
  fieldKey: string
  placeholder: string
  rows?: number
}

/** Free-text client feedback: a textarea bound to a demo field (self-fill). */
export default function FeedbackTextarea({ fieldKey, placeholder, rows = 4 }: FeedbackTextareaProps) {
  const [value, setValue] = useDemoField<string>(fieldKey, { defaultValue: '' })

  return (
    <textarea
      value={value}
      onChange={(event) => setValue(event.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full resize-none rounded-2xl border border-edge bg-card px-4 py-3 text-sm leading-relaxed text-ink shadow-sm outline-none transition-colors placeholder:text-ink-faint focus:border-accent"
    />
  )
}
