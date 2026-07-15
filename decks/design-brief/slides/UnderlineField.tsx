import { useDemoField } from '../kit/hooks'

interface UnderlineFieldProps {
  fieldKey: string
  placeholder: string
  rows?: number
}

/** A brief answer "on ruled paper": a textarea with a hairline underline. */
export default function UnderlineField({ fieldKey, placeholder, rows = 4 }: UnderlineFieldProps) {
  const [value, setValue] = useDemoField<string>(fieldKey, { defaultValue: '' })

  return (
    <textarea
      value={value}
      onChange={(event) => setValue(event.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full resize-none border-b border-edge bg-transparent px-0 py-2 font-display text-lg italic leading-loose text-ink outline-none transition-colors placeholder:not-italic placeholder:font-sans placeholder:text-sm placeholder:text-ink-faint focus:border-accent"
    />
  )
}
