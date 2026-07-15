import { motion } from 'framer-motion'
import { SlideShell } from '../kit/components'
import { CUSTOMER, VENDOR, getProspect } from './content'
import customerOps from '../assets/customer-ops.webp'
import type { SlideProps } from './index'

/** Cover: editorial headline, industry chips, and the customer's warehouse. */
export default function Slide01Cover({ personalization }: SlideProps) {
  const { companyName, contactName } = getProspect(personalization)

  const preparedFor =
    personalization.companyName.trim() &&
    (contactName ? `${companyName} · ${contactName}` : companyName)

  return (
    <SlideShell width="wide" className="flex items-center">
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent-ink"
          >
            Case study
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink md:text-5xl"
          >
            How {CUSTOMER.name} cut support tickets{' '}
            <span className="text-accent-ink">38%</span> in 90 days
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-ink-soft"
          >
            {CUSTOMER.chips.map((chip, index) => (
              <span key={chip} className="flex items-center gap-3">
                {index > 0 && <span className="text-ink-faint">·</span>}
                <span className="rounded-full border border-edge bg-card px-3 py-1 text-xs font-medium text-ink-soft">
                  {chip}
                </span>
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="mt-10 flex items-center justify-between border-t border-edge pt-5"
          >
            <p className="text-sm text-ink-faint">
              {preparedFor ? (
                <>
                  Prepared for <span className="font-medium text-ink-soft">{preparedFor}</span>
                </>
              ) : (
                <>A proof story from a customer like yours</>
              )}
            </p>
            <span className="font-display text-lg font-bold tracking-tight text-ink">
              {VENDOR.name}
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="overflow-hidden rounded-2xl border border-edge"
        >
          <img
            src={customerOps}
            alt="Ironwood Fulfillment fulfillment floor"
            className="aspect-[3/4] max-h-[62vh] w-full object-cover md:aspect-[4/5]"
          />
        </motion.div>
      </div>
    </SlideShell>
  )
}
