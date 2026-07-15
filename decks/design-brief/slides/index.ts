// Design studio brief: the gallery serif theme lives inside the deck.
import './deckTheme.css'
import type { ComponentType } from 'react'
import type { Personalization } from '../kit/host'
import Slide01Cover from './Slide01Cover'
import Slide02Brand from './Slide02Brand'
import Slide03Mood from './Slide03Mood'
import Slide04Scope from './Slide04Scope'
import Slide05Fin from './Slide05Fin'

// The deck theme activates when the bundle loads — no need to touch index.html.
document.documentElement.dataset.theme = 'gallery-serif'

export interface SlideProps {
  personalization: Personalization
}

export const slides: Array<ComponentType<SlideProps>> = [
  Slide01Cover,
  Slide02Brand,
  Slide03Mood,
  Slide04Scope,
  Slide05Fin,
]
