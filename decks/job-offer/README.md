# job-offer — a warm job offer for a candidate, HR (art pack: riso)

A candidate-facing offer dressed in the **`riso` art pack** (Pressroom): risograph
stencil prints — three spot inks (federal blue, sunflower, green) on cream stock,
flat shapes, halftone tone, a misregistered second ink behind cards and numerals.
`assets/art/` is a verbatim copy of `art/riso/pack`, linked before `deck.css`;
`deck.css` only lays out the deck's own blocks and recolors them through the pack's
tokens. Rhythm `editorial`: loud cover (the take-off plate — a paper plane leaving the
stack — printed across the left half of the sheet, the headline set on the bare cream of
the right half; the plate's own stock is the slide's cream, so no scrim is needed and
nothing prints under the type) · quiet role · mid compensation (one spot: the offer
envelope) · quiet benefits · mid 90-day plan (the pack's isotype strip) · loud close
on the pack's ink field — never two loud slides in a row.

The client here is the candidate, not a company — `companyName` is labeled
"Candidate name". Genre: a US tech offer from "Cadence" to a Senior Product Designer.

What it demonstrates:

- **candidate self-fill** (`collectFromClient: true`) as the closing mechanic:
  the candidate answers the offer right on the page — accept / questions /
  need-time chips (`candidateAnswer`, promoted to the client's CRM card) plus a
  free-text question box (`candidateQuestion`, bound through `deck.js`); both
  controls are recolored with the pack's tokens (a pressed chip is the ink pill
  with the sunflower misregistration);
- rich per-candidate personalization: role, a US total-comp breakdown (base
  salary, equity, an optional signing bonus whose card hides when empty), start
  date, an offer expiration date and a personal welcome note quoted on the cover
  as a printed slip;
- an HR tone end-to-end: a first-90-days onboarding plan and a US benefits grid
  (medical/401(k)/PTO/parental leave/stipends) instead of sales KPIs, "comp
  reviews twice a year" instead of discounts.

`deck.css` is byte-identical to the RU copy (`decks/job-offer/`): the two decks
differ in markup only — the RU one carries six benefit cards instead of eight and
uses the `.cols-3` modifier for them.

To restyle the deck, replace `assets/art/` with another pack's `pack/` folder and
change `data-theme` — the class names are the same in every pack (`art/README.md`).

The employer brand (name, tagline, size) is embedded in `index.html` — replace
it when adapting.

To build on this deck, copy `decks/job-offer/` into your working folder and add
`template/naimi-kit/` next to it — see `TEMPLATE-SKILL.md` (or just tell your agent
which deck you want to start from).
