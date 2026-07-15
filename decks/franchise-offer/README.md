# franchise-offer — US coffee franchise offer for a partner

A franchise pitch for a prospective partner (Daybreak Coffee — 42 locations
across the Pacific Northwest) in a light "growth green" theme: mint surface,
emerald accent, emerald→lime→teal gradient, rounded cards and lively animated
numbers. The "client" is the franchise partner; the deck is personalized to
their city. Economics use US franchise terms — franchise fee, total initial
investment, royalty + brand fund, and average unit volume (AUV).

What it demonstrates:

- a **payback calculator** on two `useDemoField` sliders (`avgTicket`,
  `dailyGuests`), both promoted to the client's CRM card: revenue → monthly
  profit → months to return the investment, computed live from the
  unit-economics model in `slides/content.ts`;
- the median location's unit economics drawn as animated expense bars — the
  same model the calculator uses, so the numbers always agree;
- per-partner personalization: the partner's city in the cover headline, a
  personal note and the franchise director on the terms slide.

The network legend (name, locations, AUV) and the economics model (expense
shares, rent, investment range) are constants in `slides/content.ts` — replace
them when adapting. The cover photo (`assets/cafe-interior.webp`) is a generic
café interior — swap in a real location shot when you have one.

Build: `node scripts/build-deck.mjs franchise-offer` from the kit root.
