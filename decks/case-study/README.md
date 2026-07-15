# Case study — customer story

**Genre.** The B2B sales artifact you send *after* the pitch: a customer success
story ("How Ironwood Fulfillment cut support tickets 38% in 90 days") delivered to a
prospect as proof. Editorial "tech magazine" look — near-white surface, one electric-blue
accent, oversized metrics — in the `editorial-blue` theme.

## What it demonstrates

- **Static story vs. prospect personalization.** The featured customer (Ironwood
  Logistics) and the vendor (Relay) are fixed template content in `slides/content.ts`.
  Everything about the *recipient* — company name, contact, their pains, a personal
  note, the manager's signature, and the booking link — comes from personalization,
  so one story reaches many prospects with a tailored frame.
- **A "where you are today" sidebar** (slide 2) turns the recipient's own pain points,
  one per line, into a checklist next to the customer's original pains — the
  personalization hook of the deck. Empty? It shows a soft prompt instead.
- **Self-fill + a promoted calculator field.** The savings slider (`monthlyTickets`)
  is `collectFromClient` and `promoteToClientFacts`: an anonymous prospect can dial in
  their own volume, their answer is captured against the presentation, and it lands on
  the client's CRM card for the next conversation.
- **Optional CTA link.** The "Book a walkthrough" button only renders when the manager
  fills the `bookingUrl` personalization field — no dead buttons.

## Make it your own

Swap the constants at the top of `slides/content.ts` — `CUSTOMER`, `CHALLENGES`,
`RESULTS`, `QUOTE`, `TICKETS_PER_WEEK` — to tell your own customer's story, and replace
`assets/customer-ops.webp` and `assets/quote-headshot.webp` with your customer's photo
and headshot.

## Build

```bash
node scripts/build-deck.mjs case-study
```
