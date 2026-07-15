// Job offer: the warm "sunrise" theme lives right inside the deck.
import './deckTheme.css'
import type { ComponentType } from 'react'
import type { Personalization } from '../kit/host'
import Slide01Cover from './Slide01Cover'
import Slide02Role from './Slide02Role'
import Slide03Comp from './Slide03Comp'
import Slide04Benefits from './Slide04Benefits'
import Slide05Plan from './Slide05Plan'
import Slide06Answer from './Slide06Answer'

// The deck theme is activated when the bundle loads — no need to touch index.html.
document.documentElement.dataset.theme = 'sunrise-warm'

export interface SlideProps {
  personalization: Personalization
}

export const slides: Array<ComponentType<SlideProps>> = [
  Slide01Cover,
  Slide02Role,
  Slide03Comp,
  Slide04Benefits,
  Slide05Plan,
  Slide06Answer,
]
