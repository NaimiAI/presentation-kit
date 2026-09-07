# service-configurator — service menu configurator (art pack: clay-3d)

An interactive price list instead of "three fixed plans": a digital-marketing
services menu where the client (or the manager during a call) turns services on
as cards, the bundle discount grows with the number selected, and the first-month
estimate recalculates live.

The deck wears the `clay-3d` pack from `art/`: matte pastel clay objects, off-white
paper, Manrope headlines and one coral accent for the thing that matters — the price.
Rhythm `bookends` on three slides: loud cover where the pack's shelf of clay objects —
the menu of services to pick from — runs across the foot of the frame under the
personalized headline, cropped short of the rocket that ends the row · quiet configurator on the pack's paper, where the interactive is
the slide and the clay chart is its only spot · loud estimate on the coral `.art-field`,
the itemized sheet lying on it as a white card. Never two loud slides in a row.

What it demonstrates:

- **an art pack over a pricing genre**: `assets/art/` is a copy of `art/clay-3d/pack`
  (unused plates deleted), linked before `deck.css`; `deck.css` only lays out the deck's
  own blocks and colors them through the pack's tokens (`--art-accent`, `--art-paper`,
  `--art-field`, `--nk-*`), using its devices `.art-display`, `.art-mark`, `.art-chip`,
  `.art-cover`, `.art-paper`, `.art-field`, `.art-spot`. A picked service card takes the
  coral outline and a coral check, the running total is the coral numeral;
- multi-select through boolean demo fields, one per service;
- saved selection state: the manager opens the presentation later and sees which
  bundle was assembled;
- discount gamification ("add one more service and the discount grows");
- mixed pricing cadences (monthly retainers + one-time setup) rolled into a
  first-month total, calculated once and shared across slides through `deck.js`.

To restyle it, replace `assets/art/` with another pack's `pack/` folder and change
`data-theme` — the class names are the same in every pack (see `art/README.md`).

The service menu and prices are the `SERVICES` array in `deck.js`; when changing
the service set, mirror the keys in `manifest.json -> demoData.fields`.

Compose and validate from the repository root:

To build on this deck, copy `decks/service-configurator/` into your working folder and add
`template/naimi-kit/` next to it — see `TEMPLATE-SKILL.md` (or just tell your agent
which deck you want to start from).
