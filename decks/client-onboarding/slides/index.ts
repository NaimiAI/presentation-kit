// New-client welcome pack: the warm theme lives inside the deck.
import './deckTheme.css'
import type { ComponentType } from 'react'
import type { Personalization } from '../kit/host'
import Slide01Welcome from './Slide01Welcome'
import Slide02Team from './Slide02Team'
import Slide03Plan from './Slide03Plan'
import Slide04Materials from './Slide04Materials'

// The deck theme activates when the bundle loads — no need to touch index.html.
document.documentElement.dataset.theme = 'sunrise'

export interface SlideProps {
  personalization: Personalization
}

export const slides: Array<ComponentType<SlideProps>> = [
  Slide01Welcome,
  Slide02Team,
  Slide03Plan,
  Slide04Materials,
]
