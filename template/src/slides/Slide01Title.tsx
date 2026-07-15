import { motion } from 'framer-motion'
import { Calculator, Sparkles } from 'lucide-react'
import { Badge, GradientText, SlideShell } from '../kit/components'
import type { SlideProps } from './index'

export default function Slide01Title({ personalization }: SlideProps) {
  const companyName = personalization.companyName.trim() || '{{companyName}}'

  return (
    <SlideShell orbs center width="narrow">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <Badge icon={Calculator}>Interactive presentation</Badge>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="font-display text-5xl md:text-7xl font-bold text-ink mb-6 leading-tight"
      >
        A proposal<br />for <GradientText>{companyName}</GradientText>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-xl md:text-2xl text-ink-soft max-w-2xl mx-auto"
      >
        Let's calculate the impact with your own numbers, right in the meeting.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-12 inline-flex items-center gap-2 text-ink-faint"
      >
        <Sparkles className="w-4 h-4" />
        <span className="text-sm">Swipe right or press → to continue</span>
      </motion.div>
    </SlideShell>
  )
}
