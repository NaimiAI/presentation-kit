// Service menu configurator: the mint theme ships inside the deck.
import './deckTheme.css'
import type { ComponentType } from 'react'
import type { Personalization } from '../kit/host'
import Slide01Title from './Slide01Title'
import Slide02Configurator from './Slide02Configurator'
import Slide03Summary from './Slide03Summary'

// The deck theme activates when the bundle loads — no need to touch index.html.
document.documentElement.dataset.theme = 'mint-fresh'

export interface SlideProps {
  personalization: Personalization
}

export const slides: Array<ComponentType<SlideProps>> = [
  Slide01Title,
  Slide02Configurator,
  Slide03Summary,
]
