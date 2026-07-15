import { motion } from 'framer-motion'
import { useDemoField } from '../kit/hooks'
import { BENEFITS, TIERS } from './content'
import type { SlideProps } from './index'

/** Benefits matrix by package; the selected tier is highlighted. */
export default function Slide04Benefits(_: SlideProps) {
  const [selectedTier] = useDemoField<string>('selectedTier', { defaultValue: '' })

  const columns: Array<{ key: 'general' | 'partner' | 'sponsor'; label: string }> = [
    { key: 'general', label: 'Headline' },
    { key: 'partner', label: 'Partner' },
    { key: 'sponsor', label: 'Community' },
  ]

  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-5xl px-6 py-14 md:px-8">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-semibold uppercase tracking-[0.4em] text-accent-ink">
          What's included
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 font-display text-3xl font-extrabold leading-tight text-ink md:text-5xl"
        >
          Every package, side by side
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10 overflow-x-auto"
        >
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="w-[38%] border-b border-edge pb-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-ink-faint">
                  Benefit
                </th>
                {columns.map((column) => {
                  const active = selectedTier === column.key
                  return (
                    <th
                      key={column.key}
                      className={`border-b pb-3 text-center text-xs font-semibold uppercase tracking-[0.2em] ${
                        active ? 'border-accent text-accent-ink' : 'border-edge text-ink-faint'
                      }`}
                    >
                      {column.label}
                      {active && <span className="ml-1.5">✓</span>}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {BENEFITS.map((benefit, rowIndex) => (
                <motion.tr
                  key={benefit.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 + rowIndex * 0.06 }}
                >
                  <td className="border-b border-edge py-3.5 pr-4 leading-relaxed text-ink-soft">{benefit.label}</td>
                  {columns.map((column) => {
                    const value = benefit[column.key]
                    const active = selectedTier === column.key
                    return (
                      <td
                        key={column.key}
                        className={`border-b py-3.5 text-center font-medium ${
                          active ? 'border-accent-edge bg-accent-soft text-ink' : 'border-edge text-ink'
                        }`}
                      >
                        {value ? (
                          value === '✓' ? <span className="text-positive-ink">✓</span> : value
                        ) : (
                          <span className="text-ink-faint/50">—</span>
                        )}
                      </td>
                    )
                  })}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-xs text-ink-faint"
        >
          {TIERS[0].label} is exclusive: one company for the whole summit, category locked to competitors.
        </motion.p>
      </div>
    </div>
  )
}
