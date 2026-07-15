# pilot-results — pilot results report

A report on a pilot project — here, a 6-week workflow-automation pilot at a
mid-size e-commerce brand: before/after metrics, a weekly trend as an SVG chart,
the dollar impact, and a full rollout plan. Uses the native `naimi-light` theme
as an example of a deck without a custom theme.

What it demonstrates:

- a business document that is not a sales pitch: it closes the pilot and opens
  the full-contract deal;
- metrics as live fields (`useDemoField`): the manager adjusts numbers during
  the call, while the chart and money calculation recalculate live;
- `promoteToClientFacts`: final values move to the client profile, so the next
  offer for this client starts with real numbers;
- a pure SVG chart using theme token colors, with no charting library.

Build: `node scripts/build-deck.mjs pilot-results` from the kit root.
