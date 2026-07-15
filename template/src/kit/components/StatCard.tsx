interface StatCardProps {
  label: string
  value: string
  sub?: string
  accent?: boolean
}

/** Big-number card for metrics and money (like the proposal summary cards). */
export default function StatCard({ label, value, sub, accent = false }: StatCardProps) {
  return (
    <div className={`rounded-2xl border p-5 ${accent ? 'border-positive-edge bg-positive-soft' : 'border-edge bg-card'}`}>
      <p className="text-xs uppercase tracking-wide text-ink-faint">{label}</p>
      <p className={`mt-2 text-2xl md:text-3xl font-bold tabular-nums ${accent ? 'text-positive-ink' : 'text-ink'}`}>
        {value}
      </p>
      {sub && <p className={`mt-1 text-sm ${accent ? 'text-positive-ink/80' : 'text-ink-faint'}`}>{sub}</p>}
    </div>
  )
}
