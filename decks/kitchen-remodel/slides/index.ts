// Kitchen remodel: the warm interior theme lives right inside the deck.
import './deckTheme.css'
import type { ComponentType } from 'react'
import type { Personalization } from '../kit/host'
import Slide01Welcome from './Slide01Welcome'
import Slide02Process from './Slide02Process'
import Slide03Configurator from './Slide03Configurator'
import Slide04Budget from './Slide04Budget'
import Slide05Next from './Slide05Next'

// The deck theme is applied when the bundle loads — no need to touch index.html.
document.documentElement.dataset.theme = 'warm-interior'

export interface SlideProps {
  personalization: Personalization
}

export const slides: Array<ComponentType<SlideProps>> = [
  Slide01Welcome,
  Slide02Process,
  Slide03Configurator,
  Slide04Budget,
  Slide05Next,
]
