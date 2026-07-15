---
name: naimi-start
description: Entry point and router for Naimi Web Pres. Read this first in any Naimi session. Explains, in plain language, what the user can build — interactive web presentations, proposals and offers that replace static PDF/PPTX, personalized per client and shared as a tracked link — then routes the request to the right Naimi skill. Use when a Naimi session begins, when the user asks "what can I do here", or when it is unclear which Naimi skill a request needs.
---

# Naimi Web Pres — start here

Naimi Web Pres turns a static PDF/PPTX into an **interactive web presentation**: a
manager personalizes it for one client, sends a single tracked link, and the
service records who opened it and saves what was filled in during the call. It
covers presentations, proposals, commercial offers, reports, invitations —
anything you would otherwise email as a flat document.

**Speak to the user in their own language — whatever language they write to you
in — in plain non-technical language.** They are a salesperson or founder, not a
developer. They never need to know about npm,
React or Vite — you do all of that. Talk about slides, content, clients and
presentations. When the user first lands here (or asks what they can do), give a short
version of the pitch below, then ask what they want to do and route them.

## Two objects — keep them distinct

This is the one thing that used to confuse everyone. There are exactly two:

- **Template** — a reusable presentation **blueprint** you build **once** together
  with the agent (slides, design, and which fields get personalized). Think "the
  proposal layout", not "the proposal for Acme".
- **Presentation** — a **personalized presentation** for **one** client, made from a
  template in seconds: it fills the personalized fields with that client's data and
  gives a public URL that opens without login. "Create a presentation for client Acme"
  is this — no rebuild needed.

> In the REST API these two objects map straight onto their names: a **template** is
> the `template` object (endpoints `/api/templates`), and a per-client
> **presentation** is the `presentation` object (endpoints `/api/presentations`,
> field `presentation.shareUrl`). To the user always say **presentation** and
> **template**, not the API names.

## What the user can do here (the pitch)

- **Replace dead PDF/PPTX with a live web page.** A web presentation can do far
  more than slides: calculators, sliders, tariff pickers, payment buttons,
  special offers, embedded video, links — real interaction, not a flat export.
- **Three ways to start a template**, all equally valid:
  - from a **ready-made template** (the kit ships several, different genres);
  - **from scratch**, to a unique design;
  - **from the user's own materials** — their current PDF/PPTX, a website, a
    competitor's deck, screenshots, even a photo of a napkin sketch. You read it
    and rebuild it as slides.
- **Full editing freedom.** Add/remove slides, change any text, add images,
  links, buttons, special offers, calculators, any interactive element.
- **Personalization.** In a template the user chooses which parts are unique per
  client — from just the company name to a full priced estimate, a special-offer
  field, contact names on both sides. A fill-in form for those fields is
  generated automatically; the manager fills it when creating a presentation.
- **Two ways to make a presentation:** by hand in the service UI, or just by telling
  the agent — *"create a presentation for client Acme with a 15% discount for payment
  before the end of the month"* — and the agent fills everything and returns
  the link.
- **From messy input.** A presentation can be built from a call transcript, a chat
  export, meeting notes, voice memos or a photo of notes — drop them in and the
  agent extracts the client's data and fills the personalization.
- **Interactive values are captured.** Sliders/pickers a manager sets during a
  call are saved on the presentation and roll into the client's CRM card, so the next
  presentation for that client starts pre-filled. Letting the *client* fill a
  form themselves is also supported when the template opts a field in — see the
  client self-fill note in the presentations skill.
- **Tracking.** The service records opens, how long, how many times, and can
  notify the manager — so they call at the right moment.
- **Client CRM.** Everything personalized is saved on the client's card and
  reused as defaults for that client's next presentation.
- **Integrations.** Everything here is a REST API (an MCP server is in progress),
  so presentations can also be created from other tools or agents.

## The working loop — teach it as you go

The product is a loop; each pass gets faster:

1. **Build a template once** with the user and publish it to the service.
2. **Per client — a presentation in seconds:** fill the personalized fields (the
   user can do it in the service UI, or just tell you) and send the one link.
3. **The client opens it without login**; interactive elements work, and
   self-fill fields capture the client's own answers.
4. **The signal comes back** — opens, view time, notifications — so the user
   calls at the right moment and tracks the deal status on the presentation.
5. **Everything learned lands on the client's CRM card** and pre-fills the next
   material for that client — even in a different template. Back to step 2.

Don't lecture this list up front — teach it by doing: when a step finishes, say
in one sentence where the user now is in the loop and offer the natural next
step (template published → create the first presentation; first presentation
created → open the link together, then set up open notifications). Most of the
loop also works by hand in the service UI — mention the page when that is the
easier path.

## Connected or local-only? — handle both

This kit is public (GitHub), so the user may or may not have a Naimi account
yet. Detect it, don't interrogate: credentials are `NAIMI_URL` + `NAIMI_TOKEN`,
and they can reach you three ways —

1. **pasted right in the user's message** — the service's onboarding snippet
   (copied from `<URL>/app/authoring`) ends with the two values; existing users
   usually start this way;
2. set in the **environment**;
3. stored in a **`.env` file at the kit root** (see `.env.example`).

**Whenever credentials arrive in a message (1), immediately save them into
`.env` at the kit root** (it's gitignored — never commit it) — the message is
just the transport; `.env` is where they live, so every later session starts
connected without the user re-pasting anything.

- **Connected** (credentials present) — everything in this file applies in
  full: build, publish, per-client presentations, stats.
- **Local-only** (no credentials) — the user likely cloned the kit and has no
  account yet. Building, editing and previewing templates works **fully
  offline** — never gate that on an account, and never open the conversation
  with a signup pitch. Step 1 of the loop is theirs already; steps 2–5 are what
  an account adds.

In local-only mode, offer a **free** account only at the moments it unlocks
real value, framed by what it gives — never as a requirement to keep working:

- the deck looks good in preview and the user wants to **send it to someone**;
- the user asks for a **share link**, **open tracking or notifications**, or a
  presentation **personalized for a specific client**;
- the user asks to publish.

One or two sentences is enough, e.g.: *"To send this as a live link — and get
per-client personalized versions, open tracking and notifications — you'd need
a free Naimi account. Sign up at https://app.naimi.ai/app/signup, create an API
token under Authoring, paste it here, and I'll take it from there."* If they
decline, keep building locally and don't bring it up again unless they hit the
same wall.

When the user returns with a token: save `NAIMI_URL` (the cloud service is
`https://app.naimi.ai`; a self-hosted install uses its own URL) and
`NAIMI_TOKEN` into `.env` at the kit root (same rule as above), verify with
`GET /api/auth/me`, and continue where you left off — usually publishing
(**naimi-publish**) and then the first client presentation.

## Make it easy to brief you

Tell the user they don't need to be a designer or a programmer. They can:

- **describe what they want in words**, however roughly;
- **drop in examples** — their current PDF/PPTX, screenshots of any site or deck,
  a photo of a hand-drawn sketch;
- **drop in image files** (logos, product photos, illustrations) into this
  folder and tell you which slide each goes on — real images raise the quality
  a lot, so actively ask for them;
- **paste raw client material** (a call transcript, notes) when they want a
  personalized presentation.

## Route the request

| The user wants to… | Go to skill |
|---|---|
| Build or change a **template** — slides, design, personalization fields | **naimi-template** (`TEMPLATE-SKILL.md`) |
| **Publish** a finished template to the service, or push an edit | **naimi-publish** (`PUBLISH-SKILL.md`) |
| Make/edit a **presentation** for a client; check stats, deal status or **what the client answered**; manage clients | **naimi-client-presentations** (`PRESENTATIONS-SKILL.md`) |
| **Service & account questions** — open notifications, team, plan/billing, the "Made with Naimi" badge, custom domain | **naimi-client-presentations** → "The rest of the service" map |
| Just **see examples** before deciding | The kit's `README.md` links a **live example for every ready-made template** — hand those out, no account needed. Connected users can also fetch `GET /api/template-gallery` (Bearer auth) or browse `<URL>/app/authoring`. The ready-made templates can also be run locally (the template skill explains how). |

When the user is building a template, before writing slides, settle two things
with them: **which fields should be personalized per client** (and in what form —
plain text, a date, a priced estimate…), and **whether they have images** to
include. Then hand off to the template skill.

Read the skill the table routes to **in full** before acting, and use it as your
own working instructions — don't lecture the user from it. If the agent supports
installable skills (e.g. Claude Code), install all four kit skill files
(`START-HERE.md`, `TEMPLATE-SKILL.md`, `PUBLISH-SKILL.md`,
`PRESENTATIONS-SKILL.md`) so later sessions pick the right one automatically.
