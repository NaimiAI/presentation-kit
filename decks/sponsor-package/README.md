# sponsor-package — event sponsorship offer

A sponsorship pitch for an event organizer in a "velvet night" poster theme:
deep aubergine surface, amber glow, fuchsia gradient. Sells three sponsorship
tiers to one prospective sponsor.

What it demonstrates:

- tier selection as a saved interactive choice (`selectedTier` string field,
  promoted to the client card) — the benefits matrix on the next slide
  highlights the chosen column, and the closing slide adapts its headline;
- per-sponsor personalization: an exclusive-terms line and a booking deadline
  that create honest urgency;
- a comparison table inside a deck (scrollable on narrow screens);
- event photography bundled in `assets/` — the stage shot behind the poster
  type, the networking shot on the audience slide, both graded into the palette.

Event facts, tiers and the benefits matrix are constants in
`slides/content.ts` — replace them with the real event when adapting.

Build: `node scripts/build-deck.mjs sponsor-package` from the kit root.
