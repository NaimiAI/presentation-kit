# b2b-services — B2B services presentation, dark premium

A services presentation for a B2B consultancy in a premium "navy & gold" theme:
deep navy surface, ivory serif display type, gold hairlines. The `navy-gold`
theme ships inside the deck. Genre: a US revenue-operations firm ("Meridian
Advisory") pitching a RevOps engagement.

What it demonstrates:

- client context as personalization: the `painPoints` textarea becomes an
  elegant numbered "what we heard" list — the deck opens with the client, not
  the vendor;
- a practice grid where the client (or manager) marks the priority practice —
  a single-choice string `useDemoField` saved to the presentation and promoted
  to the client card (`priorityService`);
- US-flavored mini-cases with dollar outcomes and a priced engagement model
  (Diagnostic → Roadmap sprint → Transformation retainer);
- a bundled team photo (`assets/team-office.webp`) on the engagement-model
  slide, sat in the palette under a navy gradient overlay.

Firm details and the practice portfolio are the `FIRM` / `SERVICES` constants
in `slides/content.ts` — edit them once when adapting the template.

Build: `node scripts/build-deck.mjs b2b-services` from the kit root.
