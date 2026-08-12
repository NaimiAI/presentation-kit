# event-invite — event invitation

Personal invitation to a private event in a poster style: bold outlined
typography over a moody rooftop hero photo, a program, and RSVP with links.
Near-black `noir-lime` theme with acid-lime accents, shipped inside the deck.

What it demonstrates:

- event marketing as an unexpected genre for a presentation service;
- RSVP through demoData: the attendance answer and guest count are saved on the
  presentation, so the host sees them without forms or email. The two reply
  chips also expose `data-nk-action` (`rsvp-yes` / `rsvp-no`);
- external links: a confirm-your-seat link (`confirm-seat`), an "add to Google
  Calendar" link generated from the event date (`calendar-add`), and a
  past-event YouTube recording (`watch-recording`);
- poster typography: outlined text (`-webkit-text-stroke`), a huge background
  line, and a tilted date sticker, all layered over a low-opacity hero photo.

Program, speakers and the recording link are constants in `index.html`; the
event title fallback and link derivation live in `deck.js`. Replace them with
your own.

Slides: `poster` → `agenda` → `rsvp` (see the `<!-- Slide N -->` markers in
`index.html`).

To build on this deck, copy `decks/event-invite/` into your working folder and add
`template/naimi-kit/` next to it — see `TEMPLATE-SKILL.md` (or just tell your agent
which deck you want to start from).
