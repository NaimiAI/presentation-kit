// B2B services presentation: the dark premium theme lives right inside the deck.
import './deckTheme.css'
import type { ComponentType } from 'react'
import type { Personalization } from '../kit/host'
import Slide01Cover from './Slide01Cover'
import Slide02Context from './Slide02Context'
import Slide03Services from './Slide03Services'
import Slide04Cases from './Slide04Cases'
import Slide05Process from './Slide05Process'
import Slide06Contact from './Slide06Contact'

// The deck theme is activated when the bundle loads — no need to touch index.html.
document.documentElement.dataset.theme = 'navy-gold'

export interface SlideProps {
  personalization: Personalization
}

export const slides: Array<ComponentType<SlideProps>> = [
  Slide01Cover,
  Slide02Context,
  Slide03Services,
  Slide04Cases,
  Slide05Process,
  Slide06Contact,
]
