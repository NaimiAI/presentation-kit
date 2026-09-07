# sponsor-package — event sponsorship offer (art pack: poster-swiss)

A sponsorship pitch for an event organizer, dressed in the `poster-swiss` pack from `art/`:
white paper, one electric blue, condensed Oswald set huge, brush plates and marks. Rhythm
`pulse` over five slides: loud type-only cover (the event name set as large as the frame
allows on white paper, a full-height blue `.art-field` column carrying the sponsor's own
name, the brush arrow pointing from the paper into it — no photography, so the deck reads
as its own poster next to the other deck on this pack) · mid audience (four display
numerals under heavy rules, the pack's brush band as the divider) · quiet packages · quiet
benefits matrix · loud booking (the brush arrow pointing into a blue action bar that bleeds
off the right edge). Sells three sponsorship tiers to one prospective sponsor.

What it demonstrates:

- **an art pack as a folder**: `assets/art/` is a copy of `art/poster-swiss/pack` trimmed to
  the plates the deck uses, linked before `deck.css`; `deck.css` only lays out the deck's own
  blocks and colours them through the pack's tokens (`--art-ink`, `--art-accent`,
  `--art-field`) and devices (`.art-display`, `.art-mark`, `.art-chip`, `.art-num`,
  `.art-rule`);
- tier selection as a saved interactive choice (`selectedTier` string field, promoted to the
  client card) — the selected card becomes the blue field itself, the benefits matrix on the
  next slide highlights the chosen column, and the closing slide adapts its headline;
- per-sponsor personalization: an exclusive-terms line and a booking deadline that create
  honest urgency;
- a comparison table inside a deck (scrollable on narrow screens);
- poster typography: the display size follows both axes (`clamp` over `min(vw, vh)`), so a
  long sponsor name from the personalization still clears the navbar.

Event facts and the benefits matrix live in `index.html`, the tiers and their prices in the
`TIERS` constant at the top of `deck.js` — replace them with the real event when adapting.
To restyle the deck, replace `assets/art/` with another pack's `pack/` folder and change
`data-theme` — the class names are the same in every pack (see `art/README.md`).

Slides: `poster` → `audience` → `tiers` → `benefits` → `booking` (see the `<!-- Slide N -->`
markers in `index.html`).

To build on this deck, copy `decks/sponsor-package/` into your working folder and add
`template/naimi-kit/` next to it — see `TEMPLATE-SKILL.md` (or just tell your agent
which deck you want to start from).
