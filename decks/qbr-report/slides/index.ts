// Quarterly business review: the graphite-emerald theme lives inside the deck.
import './deckTheme.css'
import type { ComponentType } from 'react'
import type { Personalization } from '../kit/host'
import Slide01Cover from './Slide01Cover'
import Slide02Summary from './Slide02Summary'
import Slide03Numbers from './Slide03Numbers'
import Slide04Shipped from './Slide04Shipped'
import Slide05Next from './Slide05Next'
import Slide06Signoff from './Slide06Signoff'

// The deck theme activates when the bundle loads — no need to touch index.html.
document.documentElement.dataset.theme = 'graphite-emerald'

export interface SlideProps {
  personalization: Personalization
}

export const slides: Array<ComponentType<SlideProps>> = [
  Slide01Cover,
  Slide02Summary,
  Slide03Numbers,
  Slide04Shipped,
  Slide05Next,
  Slide06Signoff,
]
