# Starter deck — format reference (no build)

A presentation is HTML + CSS + vanilla JS on top of the ready-made runtime
`naimi-kit/`. **There is no build step** — no npm, no `node_modules`, no
compiler: the working folder IS the bundle, and "packaging" means zipping it.

```
index.html      the slides (<section> inside <main id="deck" hidden>) — the main file
deck.css        the theme (--nk-* tokens) and the slide styles
deck.js         derived maths for interactive elements (optional)
manifest.json   the presentation contract: id, name, personalization fields, interactive keys
mock/state.json local preview data (what the service supplies during a real show)
naimi-kit/      the runtime: kit.js + kit.css + a font. Don't edit or read it —
                it is a platform artifact and travels into the bundle byte for byte
assets/         (if needed) deck images — as files, referenced by relative paths
```

## Where to start

1. `manifest.json` — set `id` (kebab-case, latin) and `name`, declare the
   personalization fields and the interactive keys.
2. `index.html` — write the slides: copy a section as a sample and change it.
3. `deck.css` — pick a theme (`data-theme` on `<html>`) and add section styles.
4. `deck.js` — only if the interactive parts compute something.

## Format rules

- **A slide is a direct `<section>` child of `#deck`**, show order = DOM order.
  Nothing between the sections except the marker comment.
- Before each section — the marker `<!-- Slide N — Title -->`, and on the
  section a stable `data-nk-slide="name"` (kebab-case, unique in the deck). It
  is a **name, not a number**: it stays put when slides are inserted or
  reordered. Edits, show events and per-slide analytics address it.
- Editing one slide never means reading the whole file: find the marker or the
  `data-nk-slide` → read that range → edit in place.
- **Section = page.** A section is the unit of the show, of a PDF page and of a
  future PPTX slide. Don't emulate "pages" inside one section and don't rely on
  visual joins between sections.
- **The final look of a slide is the DOM/CSS default.** Without animation a
  slide must already stand finished: the runtime applies the final styles
  *before* animating, so never hide content with your own CSS.
- Own `@keyframes` and any continuous motion — only behind a guard: CSS inside
  `@media (prefers-reduced-motion: no-preference)`, timers and
  `requestAnimationFrame` in `deck.js` (ticking counters and the like) only when
  `naimi.static === false`, video/gif with a poster and no autoplay in static
  mode. Otherwise the export prints a random frame. Hover transitions need no
  guard.
- Text always lives in DOM text nodes, never baked into an image: PDF export and
  the future PPTX export read it.
- No CDNs and no absolute URLs, no `data:` images: fonts and images are files
  inside the bundle (the viewer's CSP is strict).

## Declarative runtime attributes

| Attribute | What it does |
|---|---|
| `data-nk-text="key"` | Fills in a personalization value (+ `data-nk-fallback="…"` while it is empty) |
| `data-nk-hide-empty="key"` | Hides the block when the personalization value is empty |
| `data-nk-field="key"` on an `input range/number` | Two-way binding to an interactive field |
| `data-nk-field="key" data-nk-value="v"` on a button | Value pick; the runtime maintains `aria-pressed` across the group (style `[aria-pressed='true']`), type via `data-nk-type="boolean\|number"` |
| `data-nk-action="name"` on a clickable element | A semantic client action (accept the offer, RSVP, sign): the click is reported to the host as an event — the platform builds "the client accepted" notifications on it. Combines with `data-nk-field` on the same element; names are kebab-case by meaning (`accept`, `rsvp-yes`, `sign`) |
| `data-animate="up\|up-lg\|left\|right\|scale\|grow"` | Entrance animation when the slide is shown (+ `data-delay="0.2"`, and `data-grow="72%"` for `grow`) |
| `data-stagger="0.08"` on a container | Auto-cascade of children with `data-animate` (+ `data-stagger-base`) |

Declare `data-nk-text` keys in `manifest.json` → `personalization.fields`, and
`data-nk-field` keys in `demoData.fields`.

## API for `deck.js`

```js
naimi.ready((kit) => {
  kit.field('seats', 25)          // value: this show's edits → demoData → client facts → fallback
  kit.setField('seats', 40)       // write it and send to the host (500 ms debounce)
  kit.onChange(() => { /* … */ }) // called immediately and on every change
  kit.personalization('companyName', 'your company')
  kit.go(2)                       // jump to a slide (zero-based index)
})
naimi.static                      // true in static mode (export / reduced-motion)
```

Inactive sections live in a hidden store **inside the document** —
`getElementById` works from any slide.

## The base reset

`naimi-kit/kit.css` carries a subset of the Tailwind preflight: a universal
`margin: 0; padding: 0`, a base `line-height: 1.5` on `html`, `list-style: none`
on lists and `font: inherit` on form controls. What that means in practice: UA
defaults (`td/th { padding: 1px }`, `input[type=range] { margin: 2px }`, the
margins of `figure`/`blockquote`, the system Arial inside `input`) never reach
your deck, and an element without its own `line-height` gets 1.5 rather than the
browser's `normal` (~1.21).

Hence one rule: **write `line-height` next to every `font-size`**. A 14px label
with no line-height gets 21px here; if you meant Tailwind's `text-sm` it should
be 20px.

The nav-chrome labels (buttons, counter, swipe hint) come from `<html lang>` —
keep the attribute honest (`en` / `ru`), or the viewer sees them in the wrong
language.

## Themes

A theme is a set of `--nk-*` tokens picked with the `data-theme` attribute on
`<html>`. `deck.css` ships three ready presets (`naimi-light`, `naimi-dark`,
`editorial`) and an example of your own (`mint-studio`): in your own preset list
only the tokens that differ — the rest fall back to the runtime defaults. Never
hardcode colours inside slide rules, only tokens: then the deck restyles from a
single line.

## Preview

Serve the folder with any static server (from `file://` the mock won't load):

```bash
python3 -m http.server 4173 -d my-presentation
# or: npx -y http-server my-presentation -p 4173
```

The preview reads `mock/state.json` — edit it to try realistic personalization
and client facts. Append **`?nk-static=1`** to the URL for screenshots: every
slide renders instantly in its final state, with no animation to wait out.
ArrowRight advances the slides.
