# agency-pitch — creative agency campaign pitch (art pack: sticker-pop)

A creative agency pitches a social-first campaign to a brand. The deck is the kit's
first example of an **art pack** applied to a genre: the `sticker-pop` pack from
`art/` (acid-yellow field, condensed Oswald headlines, die-cut stickers, marker
marks) over a plain six-slide pitch. Rhythm `poster`: loud cover · quiet · loud idea ·
quiet packages · mid plan (band) · loud close — never two loud slides in a row.

What it demonstrates:

- **an art pack as a folder**: `assets/art/` is a verbatim copy of `art/sticker-pop/pack`,
  linked before `deck.css`; `deck.css` only lays out the deck's own blocks and uses the
  pack's devices (`.art-display`, `.art-mark`, `.art-chip`, `.art-cta`, `.art-spot`,
  `.art-field`, `.art-paper`, `.art-band`) and marks (`assets/art/marks/*.svg`);
- **loud and quiet slides in one deck**: the cover is the pack's hero plate with the
  cut-out figure on top, the idea and the close are `.art-field` slides with spots, the
  quiet slides sit on the pack's paper with one small spot at most;
- **a package picker with a live estimate**: `package` (string) and `monthlyBudget`
  (number, client self-fill, promoted to the client card) through `data-nk-field`;
  `deck.js` turns them into an estimated monthly reach;
- **client actions**: `package-select` on the packages, `book-call` on the closing CTA;
- **light personalization** that carries the pitch: campaign name, the client's goal
  in their words, the idea paragraph, the launch date (the plan counts back from it).

To restyle it, replace `assets/art/` with another pack's `pack/` folder and change
`data-theme` — the class names are the same in every pack (see `art/README.md`).

To build on this deck, copy `decks/agency-pitch/` into your working folder and add
`template/naimi-kit/` next to it — see `TEMPLATE-SKILL.md` (or just tell your agent
which deck you want to start from).
