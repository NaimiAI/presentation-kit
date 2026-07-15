// Proposal — Swiss mono: the Swiss theme ships inside the deck.
import './deckTheme.css'
import type { ComponentType } from 'react'
import type { Personalization } from '../kit/host'
import Slide01Cover from './Slide01Cover'
import Slide02Scope from './Slide02Scope'
import Slide03Estimate from './Slide03Estimate'
import Slide04Process from './Slide04Process'
import Slide05Terms from './Slide05Terms'

// The deck theme activates when the bundle loads — no need to touch index.html.
document.documentElement.dataset.theme = 'swiss-mono'

export interface SlideProps {
  personalization: Personalization
}

export const slides: Array<ComponentType<SlideProps>> = [
  Slide01Cover,
  Slide02Scope,
  Slide03Estimate,
  Slide04Process,
  Slide05Terms,
]
