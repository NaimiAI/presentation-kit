import { motion } from 'framer-motion'
import ceremony from '../assets/port-ceremony.webp'
import portrait from '../assets/port-portrait.webp'
import detailRings from '../assets/port-detail-rings.webp'
import { STUDIO } from './content'
import type { SlideProps } from './index'

const meta = ['120+ weddings', 'Hudson Valley & beyond', 'Featured in national wedding publications']

/** The work: an asymmetric three-image composition and a short philosophy. */
export default function Slide02Work(_props: SlideProps) {
  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-6xl px-6 py-14 md:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[11px] uppercase tracking-[0.4em] text-accent-ink"
        >
          The work
        </motion.p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.35fr_1fr]">
          {/* Asymmetric image composition */}
          <div className="grid grid-cols-2 gap-4">
            <motion.figure
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="photo-mat col-span-2 overflow-hidden rounded-sm"
            >
              <div className="overflow-hidden rounded-sm">
                <img src={ceremony} alt="A wedding ceremony moment" className="aspect-[16/9] w-full object-cover" />
              </div>
            </motion.figure>

            <motion.figure
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="photo-mat overflow-hidden rounded-sm"
            >
              <div className="overflow-hidden rounded-sm">
                <img src={portrait} alt="A portrait of the couple" className="aspect-[3/4] w-full object-cover" />
              </div>
            </motion.figure>

            <motion.figure
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="photo-mat self-end overflow-hidden rounded-sm"
            >
              <div className="overflow-hidden rounded-sm">
                <img src={detailRings} alt="Wedding rings, close up" className="aspect-square w-full object-cover" />
              </div>
            </motion.figure>
          </div>

          {/* Philosophy */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex flex-col justify-center"
          >
            <h2 className="font-display text-3xl leading-tight text-ink md:text-4xl">
              I document the day as it <span className="italic text-accent-ink">actually happens</span>.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-ink-soft">
              No stiff posing, no shot list running the room. {STUDIO.photographer} works quietly in the
              moment — the look between you during the vows, your dad wiping his eyes, the dance floor at
              midnight. You get a wedding you'll actually recognize, not a set of poses.
            </p>

            <div className="mt-8 space-y-2 border-t border-edge pt-5">
              {meta.map((line) => (
                <p key={line} className="text-sm text-ink-soft">
                  <span className="mr-2 text-accent-ink">·</span>
                  {line}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
