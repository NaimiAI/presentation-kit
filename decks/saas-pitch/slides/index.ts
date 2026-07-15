// SaaS product pitch: the dark neon theme ships inside the deck.
import './deckTheme.css'
import type { ComponentType } from 'react'
import type { Personalization } from '../kit/host'
import Slide01Hero from './Slide01Hero'
import Slide02ProblemSolution from './Slide02ProblemSolution'
import Slide03Product from './Slide03Product'
import Slide04Pricing from './Slide04Pricing'
import Slide05CTA from './Slide05CTA'

// The deck theme is applied when the bundle loads — no need to touch index.html.
document.documentElement.dataset.theme = 'orbit-night'

export interface SlideProps {
  personalization: Personalization
}

export const slides: Array<ComponentType<SlideProps>> = [
  Slide01Hero,
  Slide02ProblemSolution,
  Slide03Product,
  Slide04Pricing,
  Slide05CTA,
]
