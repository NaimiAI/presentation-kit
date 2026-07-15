interface RangeFieldProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  /** Formatted value shown next to the label (e.g. "12 000 ₽"). */
  displayValue?: string
  /** Unit hint inside the number input. */
  suffix?: string
  highlight?: boolean
}

/**
 * Slider + number input bound to one value — the building block for
 * interactive calculators. Pair it with useDemoField so edits persist.
 */
export default function RangeField({
  label, value, min, max, step, onChange, displayValue, suffix = '', highlight = false,
}: RangeFieldProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-sm font-medium text-ink-soft">{label}</label>
        <span className={`text-lg font-semibold tabular-nums ${highlight ? 'text-positive-ink' : 'text-ink'}`}>
          {displayValue ?? String(value)}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="flex-1 h-2 cursor-pointer appearance-none rounded-full bg-edge"
          style={{ accentColor: highlight ? 'var(--nk-positive)' : 'var(--nk-accent)' }}
        />
        <div className="relative">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(event) => onChange(Number(event.target.value))}
            className="w-28 rounded-lg border border-edge bg-card px-2.5 py-1.5 text-right text-sm tabular-nums text-ink focus:border-accent focus:outline-none"
          />
          {suffix && (
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-ink-faint">
              {suffix}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
