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

Startup facts (name, one-liner, round size, MRR series) are constants in
`slides/content.ts` — replace them once when adapting the template.

Build: `node scripts/build-deck.mjs investor-pitch` from the kit root.
