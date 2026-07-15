import { motion } from 'framer-motion'
import { CalendarCheck2, CheckCircle2, MapPin, Percent } from 'lucide-react'
import { personalizationValue } from '../kit/host'
import kitchenDetail from '../assets/kitchen-detail-1.webp'
import designerPhoto from '../assets/designer-olivia.webp'
import { STUDIO } from './content'
import type { SlideProps } from './index'

const included = [
  'In-home consult and 3D design — free and no obligation',
  'Delivery, haul-away of the old kitchen, and professional install',
  'Hook-up of the sink, cooktop and oven',
  'A door and drawer tune-up a month after install',
]

/** Close: what's included, financing, and booking the in-home consult. */
export default function Slide05Next({ personalization }: SlideProps) {
  const clientName = personalization.companyName.trim()
  const managerName = personalizationValue(personalization, 'managerName', 'Your designer')
  const managerContact = personalizationValue(personalization, 'managerContact')

  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-4xl px-6 py-14 md:px-8">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs uppercase tracking-[0.35em] text-accent-ink">
          Next step
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 font-display text-3xl leading-snug text-ink md:text-5xl"
        >
          {clientName ? `${clientName}, book` : 'Book'} your free in-home consultation
        </motion.h2>

        <div className="mt-10 grid gap-6 md:grid-cols-[1.3fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl border border-edge bg-card p-7 shadow-sm"
          >
            <div className="mb-5 overflow-hidden rounded-2xl border border-edge">
              <img
                src={kitchenDetail}
                alt="Shaker cabinets with brass hardware"
                className="aspect-[16/9] w-full object-cover"
              />
            </div>
            <p className="text-sm font-medium uppercase tracking-wider text-ink-faint">Always included in the price</p>
            <div className="mt-4 space-y-3">
              {included.map((item) => (
                <div key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-positive" />
                  <p className="text-sm leading-relaxed text-ink-soft">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-accent-soft px-4 py-3.5">
              <Percent className="mt-0.5 h-4 w-4 shrink-0 text-accent-ink" />
              <p className="text-sm leading-relaxed text-accent-ink">
                0% financing for 12 months, or spread it over 84 — a deposit at signing, the balance after install.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
            className="flex flex-col rounded-3xl border border-accent-edge bg-card p-7 text-center shadow-sm"
          >
            <img
              src={designerPhoto}
              alt={managerName}
              className="mx-auto h-20 w-20 rounded-full border-2 border-accent-edge object-cover shadow-sm"
            />
            <p className="mt-4 font-display text-xl text-ink">{managerName}</p>
            <p className="text-sm text-ink-faint">designer at {STUDIO.name}</p>
            {managerContact && (
              <p className="mt-4 rounded-2xl bg-surface px-4 py-3 text-sm font-semibold text-accent-ink">
                {managerContact}
              </p>
            )}
            <div className="mt-auto pt-6">
              <div className="flex items-center justify-center gap-2 text-sm text-ink-soft">
                <CalendarCheck2 className="h-4 w-4 text-positive-ink" />
                <span>Next consult slots open this week</span>
              </div>
              <div className="mt-3 flex items-start justify-center gap-2 text-xs text-ink-faint">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{STUDIO.address}</span>
              </div>
              <p className="mt-1.5 text-xs text-ink-faint">{STUDIO.phone}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
