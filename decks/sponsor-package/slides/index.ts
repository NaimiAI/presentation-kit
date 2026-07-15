// Sponsorship package: the velvet-night poster theme ships inside the deck.
import './deckTheme.css'
import type { ComponentType } from 'react'
import type { Personalization } from '../kit/host'
import Slide01Poster from './Slide01Poster'
import Slide02Audience from './Slide02Audience'
import Slide03Tiers from './Slide03Tiers'
import Slide04Benefits from './Slide04Benefits'
import Slide05Booking from './Slide05Booking'

// The deck theme is applied when the bundle loads — no need to touch index.html.
document.documentElement.dataset.theme = 'velvet-night'

export interface SlideProps {
  personalization: Personalization
}

export const slides: Array<ComponentType<SlideProps>> = [
  Slide01Poster,
  Slide02Audience,
  Slide03Tiers,
  Slide04Benefits,
  Slide05Booking,
]
