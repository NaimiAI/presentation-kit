# listing-presentation

**Genre.** A buyer-facing presentation of one home the agent is selling — what a realtor sends
after the first call to get the buyer to the door. Photo-led, warm and premium ("estate linen"
theme: warm linen surface, deep hunter green accent, brass gradient, serif headlines).

**What it demonstrates**

- **Photo-led B2C layout** — full-bleed hero carrying the address, a four-frame gallery-matted
  photo tour, engraved spec line.
- **Parser-driven comps with a price check** — the manager pastes nearby sales as
  `Address | Sold price | Days on market` (one per line); the deck renders a hairline table,
  computes the medians and compares them to the asking price on its own ("2.5% below the
  neighbourhood median").
- **Three purchase paths, one adaptive calculator** — financed (down payment → monthly
  payment), all cash (credit for the speed) and buy-before-you-sell (equity applied → cash due
  at closing) rewrite both the slider label and the result card. The choice (`purchaseOption`)
  and the buyer's own money (`downPayment`) are `promoteToClientFacts`, so they follow the
  buyer to their CRM card.
- **Buyer self-fill** — a move-timeline chip picker (`moveTimeline`) and a free-text question
  box (`buyerQuestions`) are `collectFromClient`; a tour CTA appears when `bookingUrl` is set.

**Personalization** — buyer name(s), property address, spec line, presentation date, home
highlights, nearby sales, asking price, and an optional tour booking link.

The house numbers on "Why this home" (size, lot, year, commute) and the photo-tour captions live
in the markup: the deck author edits them per property, not the manager in the client card.

**Compose and validate**

To build on this deck, copy `decks/listing-presentation/` into your working folder and add
`template/naimi-kit/` next to it — see `TEMPLATE-SKILL.md` (or just tell your agent
which deck you want to start from).
