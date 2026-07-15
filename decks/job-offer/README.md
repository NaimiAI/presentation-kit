# job-offer — a warm job offer for a candidate (HR)

A candidate-facing offer in a warm "sunrise" theme: peach surface, pink accent,
orange→pink→amber gradient, friendly rounded-3xl cards with a dosed emoji or
two. The client here is the candidate, not a company — `companyName` is labeled
"Candidate name". Genre: a US tech offer from "Cadence" to a Senior Product
Designer.

What it demonstrates:

- **candidate self-fill** (`collectFromClient: true`) as the closing mechanic:
  the candidate answers the offer right on the page — accept / questions /
  need-time chips (`candidateAnswer`, promoted to the client's CRM card) plus a
  free-text question box (`candidateQuestion`, bound via the local
  `OfferTextarea`);
- rich per-candidate personalization: role, a US total-comp breakdown (base
  salary, equity, an optional signing bonus whose card hides when empty), start
  date, an offer expiration date and a personal welcome note quoted on the cover;
- an HR tone end-to-end: a first-90-days onboarding plan and a US benefits grid
  (medical/401(k)/PTO/parental leave/stipends) instead of sales KPIs, "comp
  reviews twice a year" instead of discounts;
- a bundled team-culture photo (`assets/team-culture.webp`) as a rounded hero
  panel on the cover.

The employer brand (name, tagline, size) is the `COMPANY` constant in
`slides/content.ts` — replace it when adapting.

Build: `node scripts/build-deck.mjs job-offer` from the kit root.
