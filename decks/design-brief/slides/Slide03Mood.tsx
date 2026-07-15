import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useDemoField } from '../kit/hooks'
import moodMinimal from '../assets/mood-minimal.webp'
import moodExpressive from '../assets/mood-expressive.webp'
import moodClassic from '../assets/mood-classic.webp'
import moodTech from '../assets/mood-tech.webp'
import moodRetro from '../assets/mood-retro.webp'
import moodLuxe from '../assets/mood-luxe.webp'
import type { SlideProps } from './index'

const moods = [
  { key: 'styleMinimal', image: moodMinimal, label: 'minimal', note: 'space, precision, nothing extra' },
  { key: 'styleExpressive', image: moodExpressive, label: 'expressive', note: 'bold color, a big gesture' },
  { key: 'styleClassic', image: moodClassic, label: 'classic', note: 'serifs, restraint, heritage' },
  { key: 'styleTech', image: moodTech, label: 'tech', note: 'grids, mono type, interface feel' },
  { key: 'styleRetro', image: moodRetro, label: 'retro', note: 'vintage print, warm nostalgia' },
  { key: 'styleLuxe', image: moodLuxe, label: 'luxe', note: 'rich materials, quiet, gloss' },
]

function MoodCard({ mood, index }: { mood: (typeof moods)[number]; index: number }) {
  const [selected, setSelected] = useDemoField<boolean>(mood.key, { defaultValue: false })
  return (
    <motion.button
      type="button"
      onClick={() => setSelected(!selected)}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.07 }}
      className={`group flex flex-col items-stretch border text-left transition-all duration-200 ${
        selected ? 'border-accent bg-accent-soft ring-1 ring-accent' : 'border-edge bg-card hover:border-ink'
      }`}
    >
      <div className="relative aspect-square w-full overflow-hidden">
        <img
          src={mood.image}
          alt=""
          className={`h-full w-full object-cover transition-all duration-300 ${
            selected ? '' : 'grayscale-[35%] group-hover:grayscale-0'
          }`}
        />
        {selected && (
          <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-white shadow-md">
            <Check className="h-4 w-4" />
          </span>
        )}
      </div>
      <div className="flex flex-col items-start p-5">
        <span className="font-display text-xl lowercase text-ink">{mood.label}</span>
        <span className="mt-1 text-xs leading-relaxed text-ink-faint">{mood.note}</span>
        <span className={`mt-4 text-[11px] uppercase tracking-[0.25em] ${selected ? 'text-accent-ink' : 'text-ink-faint'}`}>
          {selected ? '— selected' : '+ select'}
        </span>
      </div>
    </motion.button>
  )
}

/** Section 02: the mood — a moodboard of six directions (multi-select). */
export default function Slide03Mood(_: SlideProps) {
  return (
    <div className="min-h-full w-full bg-surface pb-24">
      <div className="mx-auto max-w-4xl px-6 py-14 md:px-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-baseline gap-6 border-b border-edge pb-5">
          <span className="font-display text-5xl italic text-accent">02</span>
          <div className="flex flex-1 flex-wrap items-baseline justify-between gap-3">
            <h2 className="font-display text-3xl lowercase text-ink md:text-4xl">the mood</h2>
            <p className="text-xs uppercase tracking-[0.25em] text-ink-faint">pick a few</p>
          </div>
        </motion.div>

        <p className="mt-8 max-w-xl text-sm leading-relaxed text-ink-soft">
          Where should the design lean? Choose two or three directions — the brand's
          character usually lives where they overlap.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {moods.map((mood, index) => (
            <MoodCard key={mood.key} mood={mood} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
