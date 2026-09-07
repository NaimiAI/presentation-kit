# saas-pitch — SaaS product pitch with a pricing calculator (art pack: clay-3d)

Product pitch for the fictional "Relay" customer-communications platform, dressed in the
`clay-3d` pack from `art/`: matte pastel clay objects, off-white paper, Manrope
headlines and one coral accent for the thing that matters. Rhythm `bookends`: loud cover
on the hero plate (envelope, rocket and chart on the right, the personalized headline in
the plate's quiet left half under an `.art-scrim`) · quiet problem/solution on the pack's
paper · mid product slide with the clay chart as its only spot · quiet pricing, where the
interactive calculator is the slide · loud close on the coral `.art-field` with the
rocket. Never two loud slides in a row; at most one spot per quiet slide.

What it demonstrates:

- **an art pack over a product pitch**: `assets/art/` is a copy of `art/clay-3d/pack`
  (unused plates deleted), linked before `deck.css`; `deck.css` only lays out the deck's
  own blocks — cards, mockup, plans, calculator — and colors them through the pack's
  tokens (`--art-accent`, `--art-paper`, `--nk-*`), using its devices `.art-display`,
  `.art-mark`, `.art-chip`, `.art-cover`, `.art-paper`, `.art-field`, `.art-spot`;
- interactive choices during a call: plan (string), seats (number,
  `promoteToClientFacts`), annual/monthly billing (boolean), all through
  `data-nk-field`; the manager sees the saved choice on the presentation. Every control
  is recolored by the pack — the picked plan takes a coral outline, the billing pill and
  the slider pebble go coral, the running total is the coral numeral;
- a product slide without assets or screenshots: the interface is built from divs and
  animated (the clay pack never fakes a UI inside a plate);
- light personalization: company, contact, deal manager.

To restyle it, replace `assets/art/` with another pack's `pack/` folder and change
`data-theme` — the class names are the same in every pack (see `art/README.md`).

Product and pricing are constants in `deck.js` and the slide markup in
`index.html`; replace them with your own.

To build on this deck, copy `decks/saas-pitch/` into your working folder and add
`template/naimi-kit/` next to it — see `TEMPLATE-SKILL.md` (or just tell your agent
which deck you want to start from).
