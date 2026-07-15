# client-onboarding — new-client welcome pack

A document sent after signing: welcome message, project team with contacts, the
first 30 days plan, and useful resources. Warm orange `sunrise` theme, shipped
inside the deck.

What it demonstrates:

- post-sale material: the service is useful beyond commercial offers;
- light personalization (company, manager, contact, kickoff date), so a
  presentation can be created in a minute;
- dynamic content from a date field: every plan milestone is calculated from
  `startDate`, so the client sees exact dates instead of "week 1 / week 2";
- external links (shared drive, Slack Connect channel, status page) open from
  the presentation in a new tab;
- team-slide avatars: the three named members ship with photos
  (`assets/team-*.webp`); group entries (like the care team) fall back to CSS
  avatars from initials.

Team, links and SLA are constants in `slides/content.ts` and
`Slide02Team.tsx`; replace them with your own.

Build: `node scripts/build-deck.mjs client-onboarding` from the kit root.
