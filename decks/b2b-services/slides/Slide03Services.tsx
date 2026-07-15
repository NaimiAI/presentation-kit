import { motion } from 'framer-motion'
import { useDemoField } from '../kit/hooks'
import { SERVICES } from './content'
import type { SlideProps } from './index'

/** Practices: a grid of services with a priority pick — the choice is saved. */
export default function Slide03Services(_: SlideProps) {
  const [priority, setPriority] = useDemoField<string>('priorityService', { defaultValue: '' })

  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-5xl px-6 py-14 md:px-8">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs uppercase tracking-[0.45em] text-accent-ink">
          Practices
        </motion.p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl leading-snug text-ink md:text-5xl"
          >
            How we can help
          </motion.h2>
          <p className="text-sm text-ink-faint">Mark where to start — your pick is saved</p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, index) => {
            const selected = priority === service.key
            return (
              <motion.button
                key={service.key}
                type="button"
                onClick={() => setPriority(selected ? '' : service.key)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.07 }}
                className={`group relative border p-6 text-left transition-all duration-200 ${
                  selected
                    ? 'border-accent bg-accent-soft shadow-[0_0_30px_rgba(212,169,76,0.15)]'
                    : 'border-edge bg-card hover:border-accent-edge'
                }`}
              >
                <span
                  className={`absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full border text-[10px] transition-colors ${
                    selected ? 'border-accent bg-accent text-[#0c1626]' : 'border-edge text-transparent'
                  }`}
                >
                  ✓
                </span>
                <h3 className="pr-6 font-display text-lg leading-snug text-ink">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{service.text}</p>
                <span
                  className={`mt-4 block h-px w-10 transition-all duration-300 ${selected ? 'w-16' : 'group-hover:w-14'}`}
                  style={{ background: 'var(--nk-gradient)' }}
                />
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
