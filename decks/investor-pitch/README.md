# investor-pitch — startup fundraising deck (art pack: sky-oil)

A seed pitch dressed in the `sky-oil` pack from `art/` — oil-on-paper cloud studies,
Playfair Display, navy ink on cream. `assets/art/` is a verbatim copy of
`art/sky-oil/pack` (minus the plates this deck does not use), linked before `deck.css`;
`deck.css` only lays out the deck's own blocks and takes every colour from the pack's
tokens. Rhythm `bookends`: loud cover on the hero sky (bleed plate under the pack's
bottom scrim, the name alone in the quiet air) · two quiet slides on the pack's paper ·
one mid slide opened by the stratus band (traction) · quiet round · loud close on the
navy `.art-field` with the moon study pasted in an `.art-sticker` mat. Classic seed
structure throughout — problem/solution, market (TAM/SAM/SOM), traction with an SVG
chart, round parameters and team.

What it demonstrates:

- per-investor personalization: a "why you" note, partner name, round-closing
  date — the same deck feels hand-written for each fund;
- an interactive ticket slider (`ticketK`, in USD) that shows the investor their
  share of the round and of the company, saved to the presentation and promoted
  to the client card — recoloured with the pack's tokens, not left in an old theme;
- a hand-drawn SVG line chart (no chart libraries) driven by a data array, drawn
  with the pack's ink over a warm `--nk-accent` wash;
- a team slide with founder headshots bundled in `assets/`, joined to the pack
  through `.art-duotone` in a white `.art-sticker` mat.

Startup facts (name, one-liner, MRR series) live in the slide markup in
`index.html`, and the round size in the `ROUND_TARGET` / `POST_MONEY` constants
at the top of `deck.js` — replace them once when adapting the template.

To restyle it, replace `assets/art/` with another calm pack (`cyanotype`, `engraving`,
`charcoal`) and change `data-theme` — the class names are the same in every pack (see
`art/README.md`); only the loud slides need a second look, because every pack composes
its hero differently.

Compose and validate from the repository root:

To build on this deck, copy `decks/investor-pitch/` into your working folder and add
`template/naimi-kit/` next to it — see `TEMPLATE-SKILL.md` (or just tell your agent
which deck you want to start from).
