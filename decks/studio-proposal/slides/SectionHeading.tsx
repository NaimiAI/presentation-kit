interface SectionHeadingProps {
  index: string
  title: string
  lead?: string
}

/** Document section heading: large serif numeral + rule. */
export default function SectionHeading({ index, title, lead }: SectionHeadingProps) {
  return (
    <div className="mb-10">
      <div className="flex items-baseline gap-4 border-b border-ink/20 pb-4">
        <span className="font-display text-4xl md:text-5xl text-accent-ink/60 tabular-nums">{index}</span>
        <h2 className="font-display text-3xl md:text-4xl text-ink">{title}</h2>
      </div>
      {lead && <p className="mt-4 text-lg text-ink-soft max-w-3xl leading-relaxed">{lead}</p>}
    </div>
  )
}
