# case-study — customer story (art pack: constructivist)

**Genre.** The B2B sales artifact you send *after* the pitch: a customer success
story ("How Ironwood Fulfillment cut support tickets 38% in 90 days") delivered to a
prospect as proof.

**Art pack.** The deck wears `constructivist` from `art/` — 1920s photomontage in red,
black and cream: Unbounded display caps, halftone fragments, the red diagonal bar, aged
paper as the quiet surface. `assets/art/` is a verbatim copy of `art/constructivist/pack`
(minus the plates the deck does not use), linked before `deck.css`; `deck.css` only lays
out the deck's own blocks and recolors them through the pack's tokens. Rhythm `editorial`:
loud cover (the industrial hero plate full bleed under a scrim) · mid challenge (one
halftone spot, the recipient's pains on a black block) · quiet solution (paper; the frieze
band divides the timeline from the capabilities) · mid results (the red bar behind
monumental `.art-num` figures, the customer's headshot as a `.art-duotone` wedge) · loud
close (the pack's red field with cream cards). A 3PL logistics story is exactly what this
pack was made for, so the plates carry the subject instead of decorating it.

## What it demonstrates

- **Static story vs. prospect personalization.** The featured customer (Ironwood
  Fulfillment) and the vendor (Relay) are fixed template content in `index.html`.
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

Swap the customer story in `index.html` — the cover, challenges, results and the
quote — and the savings constants at the top of `deck.js`, then replace
`assets/quote-headshot.webp` with your customer's headshot (keep it in `.art-duotone`
so it stays inside the pack). To restyle the deck, replace `assets/art/` with another
pack's `pack/` folder and change `data-theme` — the class names are the same in every
pack (see `art/README.md`); only the loud slides need re-checking, because every pack
composes its hero plate differently.

## Build

To build on this deck, copy `decks/case-study/` into your working folder and add
`template/naimi-kit/` next to it — see `TEMPLATE-SKILL.md` (or just tell your agent
which deck you want to start from).
