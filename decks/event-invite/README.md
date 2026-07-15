# event-invite — event invitation

Personal invitation to a private event in a poster style: bold outlined
typography over a moody rooftop hero photo, a program, and RSVP with links.
Near-black `noir-lime` theme with acid-lime accents, shipped inside the deck.

What it demonstrates:

- event marketing as an unexpected genre for a presentation service;
- RSVP through demoData: the attendance answer and guest count are saved on the
  presentation, so the host sees them without forms or email;
- external links: a confirm-your-seat link, an "add to Google Calendar" link
  generated from the event date, and a past-event YouTube recording;
- poster typography: outlined text (`-webkit-text-stroke`), a huge background
  line, and a tilted date sticker, all layered over a low-opacity hero photo.

Program, speakers and the recording link are constants in `slides/content.ts`
and `Slide02Agenda.tsx`; replace them with your own. The hero photo lives in
`assets/event-hero.webp`.

Build: `node scripts/build-deck.mjs event-invite` from the kit root.
