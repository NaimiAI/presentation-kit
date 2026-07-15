// Daybreak Coffee franchise: the light "growth green" theme lives inside the deck.
import './deckTheme.css'
import type { ComponentType } from 'react'
import type { Personalization } from '../kit/host'
import Slide01Cover from './Slide01Cover'
import Slide02Unit from './Slide02Unit'
import Slide03Calculator from './Slide03Calculator'
import Slide04Support from './Slide04Support'
import Slide05Terms from './Slide05Terms'

// The deck theme is applied when the bundle loads — no need to touch index.html.
document.documentElement.dataset.theme = 'growth-green'

export interface SlideProps {
  personalization: Personalization
}

export const slides: Array<ComponentType<SlideProps>> = [
  Slide01Cover,
  Slide02Unit,
  Slide03Calculator,
  Slide04Support,
  Slide05Terms,
]
