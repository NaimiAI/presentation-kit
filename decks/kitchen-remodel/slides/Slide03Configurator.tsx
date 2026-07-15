import { motion } from 'framer-motion'
import { RangeField } from '../kit/components'
import { useDemoField } from '../kit/hooks'
import kitchenDetail from '../assets/kitchen-detail-2.webp'
import { CABINETS, COUNTERTOPS, calcPrice, formatUsd, monthlyFinancing } from './content'
import type { SlideProps } from './index'

/** Kitchen configurator: linear feet + materials + hardware → live price. */
export default function Slide03Configurator(_: SlideProps) {
  const [feet, setFeet] = useDemoField<number>('cabinetFeet', { defaultValue: 18 })
  const [cabinet, setCabinet] = useDemoField<string>('cabinetLine', { defaultValue: 'semiCustom' })
  const [countertop, setCountertop] = useDemoField<string>('countertop', { defaultValue: 'quartz' })
  const [premium, setPremium] = useDemoField<boolean>('premiumHardware', { defaultValue: true })

  const price = calcPrice(feet, cabinet, countertop, premium)
  const perMonth = monthlyFinancing(price)

  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-5xl px-6 py-12 md:px-8">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs uppercase tracking-[0.35em] text-accent-ink">
          Configurator
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-4 font-display text-3xl leading-snug text-ink md:text-5xl"
        >
          Build your kitchen — the price adds itself up
        </motion.h2>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-3xl border border-edge bg-card p-6 shadow-sm"
            >
              <RangeField
                label="Cabinetry along the walls"
                value={feet}
                min={10}
                max={30}
                step={1}
                onChange={setFeet}
                displayValue={`${feet.toLocaleString('en-US')} linear ft`}
                suffix="ft"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <p className="mb-3 text-sm font-medium text-ink-soft">Cabinet line</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {CABINETS.map((item) => {
                  const active = cabinet === item.key
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setCabinet(item.key)}
                      className={`rounded-3xl border p-4 text-left transition-all ${
                        active ? 'border-accent bg-accent-soft shadow-sm' : 'border-edge bg-card hover:border-accent-edge'
                      }`}
                    >
                      <p className="font-display text-base text-ink">{item.label}</p>
                      <p className="mt-1 text-xs leading-relaxed text-ink-faint">{item.note}</p>
                      <p className={`mt-2 text-sm font-semibold ${active ? 'text-accent-ink' : 'text-ink-soft'}`}>
                        {formatUsd(item.pricePerFoot)}/ft
                      </p>
                    </button>
                  )
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <p className="mb-3 text-sm font-medium text-ink-soft">Countertop</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {COUNTERTOPS.map((item) => {
                  const active = countertop === item.key
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setCountertop(item.key)}
                      className={`rounded-3xl border p-4 text-left transition-all ${
                        active ? 'border-accent bg-accent-soft shadow-sm' : 'border-edge bg-card hover:border-accent-edge'
                      }`}
                    >
                      <p className="font-display text-base text-ink">{item.label}</p>
                      <p className="mt-1 text-xs leading-relaxed text-ink-faint">{item.note}</p>
                      <p className={`mt-2 text-sm font-semibold ${active ? 'text-accent-ink' : 'text-ink-soft'}`}>
                        {formatUsd(item.pricePerFoot)}/ft
                      </p>
                    </button>
                  )
                })}
              </div>
            </motion.div>

            <motion.button
              type="button"
              onClick={() => setPremium(!premium)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className={`flex w-full items-center justify-between rounded-3xl border px-5 py-4 text-left transition-all ${
                premium ? 'border-positive-edge bg-positive-soft' : 'border-edge bg-card'
              }`}
            >
              <div>
                <p className="text-sm font-medium text-ink">Premium Blum hardware</p>
                <p className="mt-0.5 text-xs text-ink-faint">soft-close hinges, full-extension slides, Aventos lift-ups (+10%)</p>
              </div>
              <span
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${premium ? 'bg-positive' : 'bg-edge'}`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${premium ? 'left-[22px]' : 'left-0.5'}`}
                />
              </span>
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col rounded-3xl border border-accent-edge bg-card p-7 shadow-sm lg:sticky lg:top-6"
          >
            <div className="mb-5 overflow-hidden rounded-2xl border border-edge">
              <img
                src={kitchenDetail}
                alt="Quartz countertop on a sage-green island"
                className="aspect-[16/10] w-full object-cover"
              />
            </div>
            <p className="text-xs uppercase tracking-[0.25em] text-ink-faint">Your kitchen</p>
            <p className="mt-4 font-display text-4xl text-accent-ink md:text-5xl">{formatUsd(price)}</p>
            <p className="mt-2 text-xs text-ink-faint">turnkey estimate — we'll firm it up after the in-home consult</p>
            <p className="mt-3 text-sm font-medium text-positive-ink">
              Financing available — from {formatUsd(perMonth)}/mo
            </p>
            <p className="text-[11px] text-ink-faint">with 84-month financing, on approved credit</p>

            <div className="mt-6 space-y-2.5 border-t border-edge pt-5 text-sm text-ink-soft">
              <p>· {feet.toLocaleString('en-US')} linear ft, moisture-resistant boxes</p>
              <p>· cabinets: {CABINETS.find((item) => item.key === cabinet)?.label.toLowerCase()}</p>
              <p>· countertop: {COUNTERTOPS.find((item) => item.key === countertop)?.label.toLowerCase()}</p>
              <p>· hardware: {premium ? 'Blum (premium)' : 'standard soft-close'}</p>
            </div>

            <p className="mt-auto pt-6 text-xs leading-relaxed text-ink-faint">
              Your configuration saves right in this proposal — your designer sees your picks and
              builds the 3D design in exactly these materials.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
