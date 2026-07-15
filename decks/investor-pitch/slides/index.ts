// Investor pitch deck: the glassy pastel theme ships inside the deck.
import './deckTheme.css'
import type { ComponentType } from 'react'
import type { Personalization } from '../kit/host'
import Slide01Hero from './Slide01Hero'
import Slide02Problem from './Slide02Problem'
import Slide03Market from './Slide03Market'
import Slide04Traction from './Slide04Traction'
import Slide05Round from './Slide05Round'
import Slide06Team from './Slide06Team'

// The deck theme is applied when the bundle loads — no need to touch index.html.
document.documentElement.dataset.theme = 'aurora-glass'

export interface SlideProps {
  personalization: Personalization
}

export const slides: Array<ComponentType<SlideProps>> = [
  Slide01Hero,
  Slide02Problem,
  Slide03Market,
  Slide04Traction,
  Slide05Round,
  Slide06Team,
]
