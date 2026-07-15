# listing-presentation

**Genre.** A real-estate agent's listing presentation — the pitch a realtor gives a
homeowner to win the listing. Photo-led, warm and premium ("estate linen" theme: warm
linen surface, deep hunter green accent, brass gradient, serif headlines).

**What it demonstrates**

- **Photo-led B2C layout** — full-bleed hero, gallery-matted photos, engraved address line.
- **Parser-driven comps** — the manager pastes nearby sales as
  `Address | Sold price | Days on market` (one per line); the deck renders a hairline
  table and computes median sold price and median days on market.
- **Calculator + strategy picker promoted to the client card** — a three-way pricing
  strategy picker (`pricingStrategy`) and a net-proceeds calculator (`listPrice`, seeded
  from the recommended price, ±15% range) both `promoteToClientFacts`, so the choice and
  price follow the seller to their CRM card.
- **Seller self-fill** — a move-timeline chip picker (`moveTimeline`) and a free-text
  question box (`sellerQuestions`) are `collectFromClient`, so the seller's own answers
  come back to the agent; a booking CTA appears when `bookingUrl` is set.

**Personalization** — seller name(s), property address, presentation date, home
highlights, comps, recommended list price, and an optional booking link.

**Build**

```bash
node scripts/build-deck.mjs listing-presentation
```
