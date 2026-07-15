// Event invitation: the poster theme lives inside the deck.
import './deckTheme.css'
import type { ComponentType } from 'react'
import type { Personalization } from '../kit/host'
import Slide01Poster from './Slide01Poster'
import Slide02Agenda from './Slide02Agenda'
import Slide03Rsvp from './Slide03Rsvp'

// The deck theme activates when the bundle loads — no need to touch index.html.
document.documentElement.dataset.theme = 'noir-lime'

export interface SlideProps {
  personalization: Personalization
}

export const slides: Array<ComponentType<SlideProps>> = [
  Slide01Poster,
  Slide02Agenda,
  Slide03Rsvp,
]
