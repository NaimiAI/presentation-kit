# event-invite — event invitation (art pack: poster-swiss)

A personal invitation to a private event, dressed in the `poster-swiss` pack from `art/`:
white paper, one electric blue, condensed Oswald set huge, a high-contrast black-and-white
plate and brush marks. Rhythm `poster` on three slides: loud cover (the pack's hero plate
full bleed, the event name overlapping it in display type over a paper-coloured scrim) ·
quiet programme (paper, type only, one brush underline) · loud RSVP (a blue `.art-field`
strip carries the headline, the controls sit on white below it).

What it demonstrates:

- **an art pack as a folder**: `assets/art/` is a copy of `art/poster-swiss/pack` trimmed to
  the plates the deck uses, linked before `deck.css`; `deck.css` only lays out the deck's own
  blocks and colours them through the pack's tokens (`--art-ink`, `--art-accent`,
  `--art-field`) and devices (`.art-display`, `.art-mark`, `.art-chip`, `.art-scrim`);
- event marketing as an unexpected genre for a presentation service;
- RSVP through demoData: the attendance answer and guest count are saved on the
  presentation, so the host sees them without forms or email. The two reply buttons also
  expose `data-nk-action` (`rsvp-yes` / `rsvp-no`) and recolour with the pack —
  blue for "we'll be there", black for "still deciding";
- external links: a confirm-your-seat link (`confirm-seat`) as the blue call to action, an
  "add to Google Calendar" link generated from the event date (`calendar-add`), and a
  past-event YouTube recording (`watch-recording`);
- poster typography: the display size follows both axes (`clamp` over `min(vw, vh)`), so a
  long event name from the personalization still clears the navbar; the brush circle from
  the pack rings the seat count.

Program, speakers and the recording link are constants in `index.html`; the
event title fallback and link derivation live in `deck.js`. Replace them with
your own. To restyle the deck, replace `assets/art/` with another pack's `pack/` folder and
change `data-theme` — the class names are the same in every pack (see `art/README.md`).

Slides: `poster` → `agenda` → `rsvp` (see the `<!-- Slide N -->` markers in
`index.html`).

To build on this deck, copy `decks/event-invite/` into your working folder and add
`template/naimi-kit/` next to it — see `TEMPLATE-SKILL.md` (or just tell your agent
which deck you want to start from).
