---
name: naimi-start
description: Entry point and router for Naimi Web Pres. Read this first in any Naimi session. Explains, in plain language, what the user can build — interactive web presentations, proposals and offers that replace static PDF/PPTX, personalized per client and shared as a tracked link — then routes the request to the right Naimi skill. Use when a Naimi session begins, when the user asks "what can I do here", or when it is unclear which Naimi skill a request needs.
---

# Naimi Web Pres — start here

Naimi Web Pres turns a static PDF/PPTX into an **interactive web presentation**: a
manager personalizes it for one client, sends a single tracked link, and the service
records who opened it and saves what was filled in during the call. It covers
presentations, proposals, commercial offers, reports, invitations — anything you would
otherwise email as a flat document.

**Speak to the user in their own language — whatever language they write in — in plain
non-technical terms.** They are a salesperson or founder, not a developer. Building is
light: a presentation here is a small folder of web files with nothing to install or
compile — but the user never needs to know even that. Talk about slides, content,
clients and presentations; you do all the building. When the user first lands here (or
asks what they can do), give a short version of the pitch below, then ask what they
want to make and route them.

## The kit's four skills

All in the kit root next to this one. Don't read them all up front — open one when the
task needs it (routing table below):

- **`START-HERE.md`** — this file: product, core concepts, routing.
- **`TEMPLATE-SKILL.md`** (naimi-template) — build or edit a template locally: slides,
  design, personalization fields, local preview.
- **`PUBLISH-SKILL.md`** (naimi-publish) — validate, zip and upload a finished
  template to the service.
- **`PRESENTATIONS-SKILL.md`** (naimi-client-presentations) — work the service API:
  per-client presentations, stats, clients, notifications, account.

If you support installable skills (e.g. Claude Code), you may **offer** to install the
four kit skills so later sessions pick the right one automatically — one sentence on
what that gives, ask first, don't install unasked.

## Two objects — keep them distinct

- **Template** — a reusable presentation **blueprint** built **once** with the agent
  (slides, design, and which fields get personalized). "The proposal layout", not "the
  proposal for Acme".
- **Presentation** — a **personalized presentation** for **one** client, made from a
  template in seconds: personalized fields filled with that client's data, plus a
  public URL that opens without login. "Create a presentation for client Acme" is this —
  no rebuild needed.

> In the REST API the names map directly: **template** = `template`
> (`/api/templates`), per-client **presentation** = `presentation`
> (`/api/presentations`, field `shareUrl`). To the user always say **template** and
> **presentation**, never the API names.

## What the user can do here (the pitch)

- **Replace dead PDF/PPTX with a live web page**: calculators, sliders, tariff pickers,
  buttons, special offers, embedded links — real interaction, not a flat export.
- **Three ways to start a template**: from a ready-made example (the kit ships many
  genres), from scratch, or **from the user's own materials** — their current PDF/PPTX,
  a website, screenshots, even a photo of a napkin sketch — you read it and rebuild it
  as slides. Full freedom to edit anything afterwards. Real images (logo, product
  photos) raise quality a lot — actively ask for them.
- **Personalization.** The user chooses which parts are unique per client — from the
  company name to a full priced estimate. The fill-in form for those fields is
  generated automatically.
- **A presentation in seconds** — by hand in the service UI, or by telling the agent:
  *"create a presentation for Acme with a 15% discount until the end of the month"* —
  even from messy input (call transcript, chat export, meeting notes).
- **Tracking and signal.** Opens, view time, notifications at the right moment; deal
  status lives on the presentation.
- **Client CRM.** Everything personalized — plus values set during the call and the
  client's own self-fill answers — lands on the client's card and pre-fills the next
  presentation. Everything is also a REST API, so other tools can drive it.

## The working loop — teach it as you go

1. **Build a template once**, publish it to the service.
2. **Per client — a presentation in seconds**: fill the personalized fields, send one link.
3. **The client opens it without login**; interactive elements work; self-fill fields
   capture the client's own answers.
4. **The signal comes back** — opens, view time, notifications — so the user calls at
   the right moment and tracks the deal status.
5. **Everything learned lands on the client's CRM card** and pre-fills the next
   material. Back to step 2.

Don't lecture this list — teach it by doing: when a step finishes, say in one sentence
where the user now is and offer the natural next step (template published → create the
first presentation; presentation created → open the link together, set up open
notifications). Much of the loop also works by hand in the service UI — mention the
page when that is the easier path. And make it easy to brief you: the user isn't a
designer or programmer — words, however rough, plus any files they can drop in are
enough.

## Connected or local-only? — handle both

This kit is public (GitHub), so the user may or may not have a Naimi account yet.
Detect it, don't interrogate: the credentials are `NAIMI_URL` + `NAIMI_TOKEN`, and
they reach you three ways —

1. **pasted in the user's message** — the service's onboarding snippet (copied from
   `<URL>/app/authoring`) ends with the two values; existing users usually start here;
2. set in the **environment**;
3. stored in a **`.env` file at the kit root** (see `.env.example`).

**Whenever credentials arrive in a message (1), save them into `.env` at the kit
root right away** (it's gitignored — never commit it): the message is just the
transport, `.env` is where they live, so later sessions start connected.

- **Connected** (credentials present) — everything in this file applies in full.
- **Local-only** (no credentials) — the user likely just cloned the kit. Building,
  editing and previewing work **fully offline**: never gate that on an account and
  never open with a signup pitch. Step 1 of the loop is already theirs; steps 2–5
  are what an account adds.

In local-only mode offer a **free** account only where it unlocks real value, framed
by what it gives — never as a requirement to keep working: the deck looks good and
the user wants to **send it**; they ask for a **share link**, **open tracking or
notifications**, or a presentation **for a specific client**; they ask to publish.
One or two sentences is enough, e.g.: *"To send this as a live link — and get
per-client versions, open tracking and notifications — you'd need a free Naimi
account: sign up at https://app.naimi.ai/app/signup, create an API token under
Authoring, paste it here and I'll take it from there."* If they decline, keep
building locally and don't raise it again until they hit the same wall.

When the user comes back with a token: save `NAIMI_URL` (the cloud service is
`https://app.naimi.ai`; a self-hosted install uses its own URL) and `NAIMI_TOKEN`
into `.env`, verify with `GET /api/auth/me`, and continue where you left off —
usually publishing (**naimi-publish**) and then the first client presentation.

## Route the request

| The user wants to… | Go to skill |
|---|---|
| Build or change a **template** — slides, design, personalization fields | **naimi-template** (`TEMPLATE-SKILL.md`) |
| **Publish** a finished template, or push an edit | **naimi-publish** (`PUBLISH-SKILL.md`) |
| Make/edit a **presentation** for a client; stats, deal status, **what the client answered**; manage clients | **naimi-client-presentations** (`PRESENTATIONS-SKILL.md`) |
| **Service & account** — notifications, team, plan/billing, badge, custom domain, how presentations open (slides vs feed) | **naimi-client-presentations** (`PRESENTATIONS-SKILL.md`) |
| Just **see examples** first | The kit's `README.md` links a **live example for every ready-made deck** — hand those out, no account needed. Connected users can also fetch `GET /api/template-gallery` (Bearer auth) or browse `<URL>/app/authoring`. Ready-made decks can also be previewed locally (template skill). |

When the user is building a template, settle three things before writing slides:
**which fields are personalized per client** (and in what form — text, date, priced
estimate…), **whether they have images**, and **how it opens for the client** (slides
or a scrolling feed). Then hand off to the template skill.

Read the skill the table routes to **in full** before acting, and use it as your own
working instructions — don't lecture the user from it.
