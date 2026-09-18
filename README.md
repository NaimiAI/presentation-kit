# Naimi Presentation Kit

**Build interactive, personalized web presentations and proposals with your AI agent** —
Claude Code, Cursor, Codex, or any coding agent.

This kit replaces the static PDF/PPTX you'd normally email with a **live web
presentation**: calculators, sliders, package pickers, embedded video, special
offers — personalized per client and sent as **one link** that opens without any
login. Describe what you want in plain words; your agent builds it.

Not AI-assisted. **AI-run**: the agent doesn't just draft slides — it builds,
previews, publishes and personalizes presentations end-to-end from the same chat
you already work in.

- 🆓 **Everything in this repo works locally, no account needed** — build,
  preview and iterate on presentations forever.
- 🔗 A free [Naimi](https://app.naimi.ai/app/signup) account is only needed when
  you want to **send** a presentation: it turns your local deck into per-client
  personalized presentations with tracked links (who opened, when, for how long),
  open notifications and a lightweight client CRM.

## Quick start

```bash
git clone https://github.com/NaimiAI/presentation-kit.git
cd presentation-kit
```

Open your AI agent in this folder and just talk to it:

```
claude   # or cursor / codex — the agent picks up AGENTS.md automatically
```

> *"Build me a proposal for my design studio — three pricing stages and a
> signature block. Here's our logo."*

The agent reads the kit skills, scaffolds the presentation, writes the slides,
serves a local preview and shows you the result. You never touch HTML, config or
a build tool — but all of it is here if you want to (see
[Manual use](#manual-use-without-an-agent)).

**There is no build step and nothing to install** — a presentation is a folder of
plain web files: `index.html`, `deck.css`, `deck.js` on top of a precompiled
runtime. The working folder *is* the publishable bundle.

**Requirements:** an AI coding agent. (Any static file server for the local
preview — the one built into Python, Node or your editor will do.)

## Ready-made decks

18 decks in different genres, each with its own design system and
personalization mechanics. Click any preview to open a **live example** —
that's a real personalized presentation, exactly what your client would receive.

<table>
  <tr>
    <td align="center"><a href="https://app.naimi.ai/ridgeline-outfitters-7330bd"><img src="decks/proposal-mono/preview.webp" width="260" alt="Service proposal — Swiss mono"/><br/><b>Service proposal — Swiss mono</b></a><br/>staged pricing, terms, validity</td>
    <td align="center"><a href="https://app.naimi.ai/bluebird-coffee-roasters-b8b367"><img src="decks/studio-proposal/preview.webp" width="260" alt="Studio proposal — paper"/><br/><b>Studio proposal — paper</b></a><br/>stage estimate, signature block</td>
    <td align="center"><a href="https://app.naimi.ai/truenorth-logistics-42fd87"><img src="decks/b2b-services/preview.webp" width="260" alt="B2B services — dark premium"/><br/><b>B2B services — dark premium</b></a><br/>practices, priority picker</td>
  </tr>
  <tr>
    <td align="center"><a href="https://app.naimi.ai/emma-noah-sullivan-89a06b"><img src="decks/kitchen-remodel/preview.webp" width="260" alt="Kitchen remodel proposal"/><br/><b>Kitchen remodel proposal</b></a><br/>live configurator with financing</td>
    <td align="center"><a href="https://app.naimi.ai/the-hendersons-c711e0"><img src="decks/listing-presentation/preview.webp" width="260" alt="Home tour presentation"/><br/><b>Home tour for a buyer</b></a><br/>photo tour, three ways to buy</td>
    <td align="center"><a href="https://app.naimi.ai/sarah-james-ac5f35"><img src="decks/photography-package/preview.webp" width="260" alt="Wedding photography packages"/><br/><b>Wedding photography packages</b></a><br/>client picks package &amp; add-ons</td>
  </tr>
  <tr>
    <td align="center"><a href="https://app.naimi.ai/harbor-main-home-goods-ffaff3"><img src="decks/service-configurator/preview.webp" width="260" alt="Service menu configurator"/><br/><b>Service menu configurator</b></a><br/>checkboxes, bundle discount, total</td>
    <td align="center"><a href="https://app.naimi.ai/juniper-skincare-85096f"><img src="decks/design-brief/preview.webp" width="260" alt="Design studio brief"/><br/><b>Design studio brief</b></a><br/>client self-fill: moodboard, budget</td>
    <td align="center"><a href="https://app.naimi.ai/summit-gear-co-3ec859"><img src="decks/saas-pitch/preview.webp" width="260" alt="SaaS product pitch"/><br/><b>SaaS product pitch</b></a><br/>plan / seats / billing choice</td>
  </tr>
  <tr>
    <td align="center"><a href="https://app.naimi.ai/crestview-capital-4417b0"><img src="decks/investor-pitch/preview.webp" width="260" alt="Investor pitch deck"/><br/><b>Investor pitch deck</b></a><br/>ticket slider, traction chart</td>
    <td align="center"><a href="https://app.naimi.ai/tony-ramirez-df362c"><img src="decks/franchise-offer/preview.webp" width="260" alt="Franchise offer"/><br/><b>Franchise offer</b></a><br/>payback calculator</td>
    <td align="center"><a href="https://app.naimi.ai/summit-gear-co-40f2e6"><img src="decks/pilot-results/preview.webp" width="260" alt="Pilot results report"/><br/><b>Pilot results report</b></a><br/>before/after metrics, SVG chart</td>
  </tr>
  <tr>
    <td align="center"><a href="https://app.naimi.ai/harbor-main-home-goods-589807"><img src="decks/qbr-report/preview.webp" width="260" alt="Quarterly business review"/><br/><b>Quarterly business review</b></a><br/>KPI grid, client rating self-fill</td>
    <td align="center"><a href="https://app.naimi.ai/summit-gear-co-a40c05"><img src="decks/case-study/preview.webp" width="260" alt="Case study — customer story"/><br/><b>Case study — customer story</b></a><br/>prospect's own savings projection</td>
    <td align="center"><a href="https://app.naimi.ai/northwind-software-df9004"><img src="decks/event-invite/preview.webp" width="260" alt="Event invitation"/><br/><b>Event invitation</b></a><br/>RSVP, add-to-calendar</td>
  </tr>
  <tr>
    <td align="center"><a href="https://app.naimi.ai/atlas-payments-a45950"><img src="decks/sponsor-package/preview.webp" width="260" alt="Event sponsorship package"/><br/><b>Event sponsorship package</b></a><br/>tier picker, benefits matrix</td>
    <td align="center"><a href="https://app.naimi.ai/ridgeline-outfitters-e843c0"><img src="decks/client-onboarding/preview.webp" width="260" alt="New-client welcome pack"/><br/><b>New-client welcome pack</b></a><br/>30-day plan from kickoff date</td>
    <td align="center"><a href="https://app.naimi.ai/jamie-rivera-4750f5"><img src="decks/job-offer/preview.webp" width="260" alt="Job offer to a candidate"/><br/><b>Job offer to a candidate</b></a><br/>total comp, candidate replies inline</td>
  </tr>
</table>

Every deck is a **starting point**, not a locked design: your agent can restyle
it, rewrite it, or rebuild your existing PDF/PPTX/website into slides from
scratch.

### Documents — offers, quotes and estimates as portrait pages

Not everything a sales team sends is a slide deck. Three **document templates** build
the things you used to make in Word — Letter-size pages read by scrolling, still
personalized and interactive, and the PDF prints exactly like the document they replace:

| Deck | What it is |
|---|---|
| `decks/renovation-estimate/` | a remodel estimate: labor and materials tables from text fields, summary with discount, payment schedule, client approval right in the document |
| `decks/service-quote/` | a monthly managed-services quote: service blocks, two SLA tiers the client picks, onboarding plan |
| `decks/price-quote/` | a supplier's price quote as a cover letter on letterhead: itemized pricing with sales tax and the amount in words, product cards, terms |

Ask your agent for "a quote / an estimate / a commercial offer as a document" — it starts
from one of these (`TEMPLATE-SKILL.md` → "Document format").

## How it works

1. **Build a template once.** A template is a reusable presentation blueprint —
   slides, design, and which fields get filled in per client (company name,
   contact, prices, dates, a full priced estimate…). Start from a ready-made
   deck, from scratch, or from your own materials — the agent reads a PDF, a
   slide deck, screenshots, even a photo of a napkin sketch, and rebuilds it.
2. **Preview locally.** The folder is served as-is with mock data — iterate with
   your agent until it looks right. No account, no upload.
3. **Publish & personalize** *(free account)*. The agent zips the folder, uploads
   it to Naimi, then makes a **presentation per client in seconds**: *"create a
   presentation for Acme with a 15% discount until Friday"* → you get back one
   link. It even works from messy input — a call transcript, meeting notes, a
   chat export.
4. **The signal comes back.** The client opens the link without any login; you
   see opens, view time and what they answered in interactive fields — with
   notifications the moment it happens. Everything learned lands on the client's
   CRM card and pre-fills their next presentation.

## What's in the box

| Path | What it is |
|---|---|
| `START-HERE.md` | Agent entry point: the product in plain language + routing to the skills |
| `TEMPLATE-SKILL.md` | Agent skill: build/edit a presentation locally, preview, themes, images |
| `PUBLISH-SKILL.md` | Agent skill: check, zip and upload a template to the service |
| `PRESENTATIONS-SKILL.md` | Agent skill: create per-client presentations, stats, deal status, CRM — pure API |
| `template/` | The starter deck — three example slides plus the runtime; what a presentation is built from. `template/README.md` is the full format reference |
| `template/naimi-kit/` | The runtime: slide navigation, thumbnail panel, slides/scroll view, personalization, PDF-safe static mode. Precompiled — nothing to build, nothing to edit |
| `decks/<id>/` | Ready-made decks (slides + manifest + mock data + cover), including three document templates |

The skills are written for agents that support instruction files
(`AGENTS.md`/`CLAUDE.md` are picked up automatically by Claude Code, Cursor,
Codex and most others). If your agent supports installable skills, install the
four `*-SKILL.md` files and it will pick the right one per request.

## Manual use (without an agent)

A presentation is plain web files, so you can work with them directly:

```bash
cp -R template my-presentation          # or: cp -R decks/saas-pitch my-presentation
                                        #     cp -R template/naimi-kit my-presentation/naimi-kit
python3 -m http.server 4173 -d my-presentation     # open http://localhost:4173
```

Edit `index.html` (slides), `deck.css` (theme and styles), `deck.js` (any maths),
`manifest.json` (name and the per-client fields) and `mock/state.json` (preview
data). `template/README.md` documents the slide grammar, the declarative
attributes, the runtime API and the manifest contract.

To publish, zip the folder's contents (with `index.html` at the ZIP root) and
upload it — `PUBLISH-SKILL.md` has the exact `curl` calls.

## Do I need an account?

| | Without an account | With a free account |
|---|---|---|
| Build & edit presentations locally | ✅ | ✅ |
| Preview with mock data | ✅ | ✅ |
| Publish a template to the service | — | ✅ |
| Per-client personalized presentations via one link | — | ✅ |
| Open & view tracking, notifications | — | ✅ |
| Client self-fill answers + client CRM | — | ✅ |

Sign up at **[app.naimi.ai](https://app.naimi.ai/app/signup)** (free plan, no
card). Then create an API token at *Authoring → API tokens* and hand it to your
agent — that's the only setup it needs.

## Links

- **Service:** [app.naimi.ai](https://app.naimi.ai)
- **Website:** [naimi.ai](https://naimi.ai)

## License

The kit — starter, ready-made decks, runtime and agent skills — is released under
the [MIT License](LICENSE). Build on it freely, including for commercial client
work. (The Naimi service itself is a separate product and is not part of this
repository.)
