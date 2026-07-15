// Pilot results report: uses the native naimi-light theme from the template.
import type { ComponentType } from 'react'
import type { Personalization } from '../kit/host'
import Slide01Title from './Slide01Title'
import Slide02Metrics from './Slide02Metrics'
import Slide03Dynamics from './Slide03Dynamics'
import Slide04Money from './Slide04Money'
import Slide05Next from './Slide05Next'

export interface SlideProps {
  personalization: Personalization
}

export const slides: Array<ComponentType<SlideProps>> = [
  Slide01Title,
  Slide02Metrics,
  Slide03Dynamics,
  Slide04Money,
  Slide05Next,
]
