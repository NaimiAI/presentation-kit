// Wedding photography packages: the fine-art gallery theme lives in the deck.
import './deckTheme.css'
import type { ComponentType } from 'react'
import type { Personalization } from '../kit/host'
import Slide01Cover from './Slide01Cover'
import Slide02Work from './Slide02Work'
import Slide03Packages from './Slide03Packages'
import Slide04Addons from './Slide04Addons'
import Slide05Booking from './Slide05Booking'

// The deck theme activates when the bundle loads — no need to touch index.html.
document.documentElement.dataset.theme = 'gallery-ivory'

export interface SlideProps {
  personalization: Personalization
}

export const slides: Array<ComponentType<SlideProps>> = [
  Slide01Cover,
  Slide02Work,
  Slide03Packages,
  Slide04Addons,
  Slide05Booking,
]
