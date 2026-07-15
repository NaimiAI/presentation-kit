// B2B customer success story: the editorial "tech magazine" theme lives inside
// the deck and activates when the bundle loads — no need to touch index.html.
import './deckTheme.css'
import type { ComponentType } from 'react'
import type { Personalization } from '../kit/host'
import Slide01Cover from './Slide01Cover'
import Slide02Challenge from './Slide02Challenge'
import Slide03Solution from './Slide03Solution'
import Slide04Results from './Slide04Results'
import Slide05YourNumbers from './Slide05YourNumbers'

document.documentElement.dataset.theme = 'editorial-blue'

export interface SlideProps {
  personalization: Personalization
}

export const slides: Array<ComponentType<SlideProps>> = [
  Slide01Cover,
  Slide02Challenge,
  Slide03Solution,
  Slide04Results,
  Slide05YourNumbers,
]
