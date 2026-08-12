# kitchen-remodel — design-build studio proposal

A homeowner-facing proposal from a US kitchen design-build studio (Alder & Oak
Kitchens, Portland OR) in a "warm interior" theme: cream surfaces, terracotta
accent, sage green, serif display type. The client here is a person, not a
company — `companyName` is labeled "Client name(s)".

What it demonstrates:

- a full product **configurator**: a linear-feet slider + cabinet-line/countertop
  pickers + a hardware toggle, priced live from the price list at the top of
  `deck.js`, with a financing line under the total; every choice
  persists on the presentation and promotes to the client card;
- **client self-fill** (`collectFromClient: true`) on two questions — budget-range
  chips and timeline chips: the anonymous client answers right in the page and the
  manager sees the answers in the service;
- bundled photos (`assets/`): three kitchen shots used as the hero and as
  material context on the configurator and closing slides, plus the designer's
  headshot on the closing slide (`designer-olivia.webp` — swap in your own).

Studio name and showroom address live in `index.html`, the configurator price
list in `deck.js` — adjust them when adapting.

To build on this deck, copy `decks/kitchen-remodel/` into your working folder and add
`template/naimi-kit/` next to it — see `TEMPLATE-SKILL.md` (or just tell your agent
which deck you want to start from).
