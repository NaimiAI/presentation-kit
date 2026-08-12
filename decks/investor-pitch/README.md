# investor-pitch — startup fundraising deck

An investor pitch in a light "aurora glass" theme: pastel lavender surface,
frosted-glass cards, violet gradient. Classic seed-deck structure — problem/
solution, market (TAM/SAM/SOM), traction with an SVG chart, round parameters
and team.

What it demonstrates:

- per-investor personalization: a "why you" note, partner name, round-closing
  date — the same deck feels hand-written for each fund;
- an interactive ticket slider (`ticketK`, in USD) that shows the investor their
  share of the round and of the company, saved to the presentation and promoted
  to the client card;
- a hand-drawn SVG line chart (no chart libraries) driven by a data array;
- a team slide with founder headshots bundled in `assets/`.

Startup facts (name, one-liner, MRR series) live in the slide markup in
`index.html`, and the round size in the `ROUND_TARGET` / `POST_MONEY` constants
at the top of `deck.js` — replace them once when adapting the template.

Compose and validate from the repository root:

To build on this deck, copy `decks/investor-pitch/` into your working folder and add
`template/naimi-kit/` next to it — see `TEMPLATE-SKILL.md` (or just tell your agent
which deck you want to start from).
