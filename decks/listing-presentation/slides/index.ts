// Real-estate listing presentation: the "estate-linen" theme lives in the deck.
import './deckTheme.css'
import type { ComponentType } from 'react'
import type { Personalization } from '../kit/host'
import Slide01Cover from './Slide01Cover'
import Slide02Market from './Slide02Market'
import Slide03Pricing from './Slide03Pricing'
import Slide04Marketing from './Slide04Marketing'
import Slide05Why from './Slide05Why'
import Slide06Next from './Slide06Next'

// The deck theme activates when the bundle loads — no need to touch index.html.
document.documentElement.dataset.theme = 'estate-linen'

export interface SlideProps {
  personalization: Personalization
}

export const slides: Array<ComponentType<SlideProps>> = [
  Slide01Cover,
  Slide02Market,
  Slide03Pricing,
  Slide04Marketing,
  Slide05Why,
  Slide06Next,
]
