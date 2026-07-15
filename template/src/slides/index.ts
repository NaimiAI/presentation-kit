// Deck composition: the order here is the slide order in the presentation.
// Each slide is a React component receiving { personalization }.
import type { ComponentType } from 'react'
import type { Personalization } from '../kit/host'
import Slide01Title from './Slide01Title'
import Slide02Problem from './Slide02Problem'
import Slide03Calculator from './Slide03Calculator'
import Slide04Summary from './Slide04Summary'

export interface SlideProps {
  personalization: Personalization
}

export const slides: Array<ComponentType<SlideProps>> = [
  Slide01Title,
  Slide02Problem,
  Slide03Calculator,
  Slide04Summary,
]
