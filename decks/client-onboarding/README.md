# client-onboarding — new-client welcome pack (art pack: papercut)

A document sent after signing: welcome message, project team with contacts, the
first 30 days plan, and useful resources.

The deck wears the `papercut` pack from `art/` — layered cut-paper craft in sand,
terracotta and teal, Nunito headlines, cards that are sheets lifted off the surface by
their own shadow. `assets/art/` is a verbatim copy of `art/papercut/pack` (with the
plates the deck does not use removed), linked before `deck.css`; `deck.css` only lays
out the deck's own blocks and colors them through the pack's tokens. Rhythm `bookends`:
loud cover on the `hero` plate (the road to the house, headline in the plain sky, with
`.art-scrim` under the personalized company name) · quiet team slide on the pack's paper
· mid plan slide opened by the mountain `band` · loud close on the terracotta
`.art-field` with the trophy cut-out.

What it demonstrates:

- **an art pack over a post-sale genre**: the service is useful beyond commercial offers,
  and the pack makes the document feel handmade rather than generated;
- light personalization (company, manager, contact, kickoff date), so a
  presentation can be created in a minute;
- dynamic content from a date field: every plan milestone is calculated from
  `startDate`, so the client sees exact dates instead of "week 1 / week 2";
- external links (shared drive, Slack Connect channel, status page) open from
  the presentation in a new tab;
- team-slide avatars: the three named members ship with photos
  (`assets/team-*.webp`) pasted into the craft through `.art-sticker` + `.art-duotone`;
  group entries (like the care team) fall back to a paper tile with initials.

Team, links and SLA are constants in `index.html`; replace them with your own.

To restyle it, replace `assets/art/` with another warm pack's `pack/` folder and change
`data-theme` — the class names are the same in every pack (see `art/README.md`).

To build on this deck, copy `decks/client-onboarding/` into your working folder and add
`template/naimi-kit/` next to it — see `TEMPLATE-SKILL.md` (or just tell your agent
which deck you want to start from).
