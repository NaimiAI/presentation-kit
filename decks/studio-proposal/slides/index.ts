// Studio proposal document: the printed serif theme ships inside the deck.
import './deckTheme.css'
import type { ComponentType } from 'react'
import type { Personalization } from '../kit/host'
import Slide01Cover from './Slide01Cover'
import Slide02Brief from './Slide02Brief'
import Slide03Process from './Slide03Process'
import Slide04Estimate from './Slide04Estimate'
import Slide05Terms from './Slide05Terms'

// The deck theme activates when the bundle loads — no need to touch index.html.
document.documentElement.dataset.theme = 'proposal-paper'

export interface SlideProps {
  personalization: Personalization
}

export const slides: Array<ComponentType<SlideProps>> = [
  Slide01Cover,
  Slide02Brief,
  Slide03Process,
  Slide04Estimate,
  Slide05Terms,
]
