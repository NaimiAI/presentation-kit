# franchise-offer — US coffee franchise offer for a partner (art pack: riso)

A franchise pitch for a prospective partner (Daybreak Coffee — 42 locations across the
Pacific Northwest) dressed in the `riso` pack from `art/` — Pressroom: risograph stencil
prints, three spot inks (federal blue, sunflower, green) on cream stock. The pack fits the
offer's job: a franchise is a handshake between two people, and the hero plate is exactly
that — hands passing an envelope. Rhythm `bookends`: loud cover (the hero plate bleeding
across the slide behind a paper scrim) · quiet unit economics on the pack's paper · quiet
calculator with one spot (the pointing hand) · mid network support (the isotype band —
envelope → paper plane → eye → hand → speech → seal → handshake) · loud close on the pack's
ink field. Never two loud slides in a row. The "client" is the franchise partner; the deck
is personalized to their city. Economics use US franchise terms — franchise fee, total
initial investment, royalty + brand fund, and average unit volume (AUV).

What it demonstrates:

- **an art pack as a folder**: `assets/art/` is a copy of `art/riso/pack` (plates the deck
  does not use are deleted), linked before `deck.css`; `deck.css` only lays out the deck's
  own blocks and colors them through the pack's tokens (`--art-ink`, `--art-accent`,
  `--art-field`) and devices (`.art-display`, `.art-mark`, `.art-chip`, `.art-num`,
  `.art-spot`, `.art-band`, `.art-paper`, `.art-field`);
- a **payback calculator** on two declaratively bound sliders (`avgTicket`,
  `dailyGuests`), both promoted to the client's CRM card: revenue → monthly
  profit → months to return the investment, computed live in `deck.js`; the controls are
  recolored by the pack (green thumb with a misregistered yellow shadow);
- the median location's unit economics drawn as animated expense bars — the
  same model the calculator uses, so the numbers always agree;
- per-partner personalization: the partner's city in the cover headline (under the
  sunflower `.art-mark`), a personal note and the franchise director on the terms slide.

The network legend (name, locations, AUV) and the economics model (expense
shares, rent, investment range) are represented in `index.html` and `deck.js` —
replace them together when adapting. To restyle the deck, replace `assets/art/` with
another pack's `pack/` folder and change `data-theme` — the class names are the same in
every pack (see `art/README.md`); only the cover needs re-checking, because plates are
composed differently.

Check from the repository root:

To build on this deck, copy `decks/franchise-offer/` into your working folder and add
`template/naimi-kit/` next to it — see `TEMPLATE-SKILL.md` (or just tell your agent
which deck you want to start from).
