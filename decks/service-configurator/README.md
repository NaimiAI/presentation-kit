# service-configurator — service menu configurator

An interactive price list instead of "three fixed plans": a digital-marketing
services menu where the client (or the manager during a call) turns services on
as cards, the bundle discount grows with the number selected, and the first-month
estimate recalculates live. Light `mint-fresh` theme, shipped inside the deck.

What it demonstrates:

- multi-select through boolean demo fields, one per service;
- saved selection state: the manager opens the presentation later and sees which
  bundle was assembled;
- discount gamification ("add one more service and the discount grows");
- mixed pricing cadences (monthly retainers + one-time setup) rolled into a
  first-month total, calculated once and shared across slides through `deck.js`.

The service menu and prices are the `SERVICES` array in `deck.js`; when changing
the service set, mirror the keys in `manifest.json -> demoData.fields`.

Compose and validate from the repository root:

To build on this deck, copy `decks/service-configurator/` into your working folder and add
`template/naimi-kit/` next to it — see `TEMPLATE-SKILL.md` (or just tell your agent
which deck you want to start from).
