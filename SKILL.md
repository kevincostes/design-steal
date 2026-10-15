---
name: design-steal
description: Reverse-engineer the design system of any website or web app (Linear, Stripe, Vercel, Notion, Arc, Raycast…) into a reusable skill file in the style of apple-design — tokens, typography, spacing, color, radii, shadows, motion/animation timings and the principles behind them. Use whenever the user wants to "steal", copy, extract, clone, analyze or document the design, look & feel, design system, design language, UI style or animations of a specific site or product, or wants a "brand-design" skill like apple-design, even if they don't say "design system". Uses Chrome to measure the live site; falls back to official docs, screenshots, tutorials and image search for parts behind a login.
---

# Design Steal

Turn a live product into a **design-system skill file** — a `SKILL.md` that another Claude can load later to build interfaces that look and *feel* like that product. The reference for quality and shape is `apple-design`: opinionated principles, concrete values, copy-pasteable CSS/JS, and a Quick Reference table.

The goal is not a screenshot dump or a token list. It's **the rules that produce the look**: why spacing is what it is, how motion behaves, which values repeat. Tokens are evidence; principles are the output.

## Inputs to settle first

From the user's message (ask only if missing and not guessable):

| Input | Default |
| --- | --- |
| Target (URL or product name) | required |
| Pages to cover | landing + 2–3 key product surfaces (app, docs, pricing) |
| Focus | everything; narrow if the user names one (e.g. "solo animaciones") |
| Output name | `<brand>-design` (e.g. `linear-design`) |

## Workflow

### 1. Recon the surfaces

List which surfaces exist and which are public vs. gated (login, paywall, waitlist). Gated surfaces usually hold the most interesting product UI — plan sources for them now (step 4) instead of discovering it at the end.

### 2. Measure the live site in Chrome

Read the `chrome-browser` skill before the first browser step. Open the site in a new tab, at desktop width first (1440px), then mobile (390px).

**Tokens — run the extractor.** Read `scripts/extract_tokens.js` and run its contents with the JavaScript tool on each key page. It returns the most frequent colors, typography combos, spacing, radii, shadows, transitions, CSS custom properties, `:hover/:active/:focus` rules, `@keyframes`, breakpoints and detected libraries (Tailwind, Framer Motion, GSAP, Lenis…). Frequency matters: a value used 200 times is a token, a value used once is noise.

If the site exposes CSS custom properties (`--color-…`, `--space-…`), those *are* the design tokens — prefer their names over raw values.

**Motion — observe it, don't guess it.** Motion is what generic design-system docs miss, and what makes the file worth having.
- Hover/press every interactive element type (button, link, card, nav item, input). Note what changes and the transition timing from the extractor's `stateRules` + `transitions`.
- Open menus, dropdowns, modals, toasts, tooltips, accordions, tabs. While something animates, run `document.getAnimations().map(a => ({name: a.animationName || a.constructor.name, timing: a.effect?.getTiming(), target: a.effect?.target?.className}))` to capture real durations/easings/delays.
- Scroll the page slowly: note scroll-triggered reveals (stagger, distance, duration), sticky headers, parallax, smooth-scroll (Lenis).
- Record a GIF of the signature interactions when they're hard to describe in words — it also serves as evidence.
- Identify the motion *character*: spring vs. ease curve, snappy vs. soft, overshoot or not, enter/exit symmetry, origin-aware popovers.

**Layout & spacing.** Measure container max-width, grid columns, gutters, section vertical rhythm, and the spacing scale (is it 4px- or 8px-based?). `getBoundingClientRect()` on a few repeated components settles ambiguities.

**Never** enter passwords, create accounts or bypass paywalls to reach gated UI. If the user is already signed in in their Chrome, browsing their own logged-in session is fine — ask before opening it.

### 3. Note what is distinctive

Before writing, answer in one line each:
- What would make someone recognise this product from a cropped screenshot?
- What does the motion *feel* like, in one adjective pair? (e.g. "quick and weightless", "soft and springy")
- Which 3–5 rules, if broken, would make a clone look off?

These become the "Core Idea" and the backbone of the file.

### 4. Fill the gated / unreachable parts from other sources

For anything behind a login (or that you couldn't trigger), gather evidence elsewhere. Read `references/sources.md` for the full list and search patterns. Priority order:

1. Official design system / brand / docs site of the product (often public even when the app isn't)
2. Official help center, changelog, product videos and launch posts (full of real UI screenshots)
3. Open-source code from the company (GitHub: UI kits, icon sets, config files with tokens)
4. Third-party UI galleries and teardowns (Mobbin, Page Flows, Refero, Dribbble/Behance shots by the company's designers)
5. Tutorials, YouTube walkthroughs, reviews (for flows and motion)
6. Image search for specific screens ("<product> settings page", "<product> command menu")

From screenshots you can recover layout, hierarchy, color (sample pixel values), type style, density and radius — not exact timings. Say so.

### 5. Tag confidence on every value

Each concrete value in the output carries one tag, so the future reader knows how much to trust it:

| Tag | Meaning |
| --- | --- |
| `measured` | read from computed styles / CSS / `getAnimations()` on the live site |
| `documented` | from the company's own design system or docs |
| `inferred` | estimated from screenshots, videos or third-party sources |

Put the tag in the Quick Reference table and inline where it matters. Never present an inferred value as measured — a wrong timing silently copied into a new product is worse than an honest estimate.

### 6. Write the skill file

Read `references/output-template.md` and follow its structure. It mirrors `apple-design`:

- frontmatter (`name: <brand>-design`, a pushy `description` listing what it covers)
- **Initial Response** block
- **Core Idea** — the through-line in 2–3 sentences + the distinctive traits from step 3
- numbered sections (foundations → color → typography → spacing/layout → radii/elevation → components → motion → states/feedback → responsive → accessibility/dark mode), each with *rules + why + concrete values + a code snippet*
- **Gated surfaces** section stating what was inferred and from where
- **Quick Reference** table with confidence tags
- **Sources** list

Write principles in the imperative ("Use…", "Keep…"), explain *why* in a sentence, and give real values. Skip sections the product genuinely has nothing distinctive about rather than padding them. Target 250–450 lines.

Describe the design language; don't copy brand assets. Logos, proprietary icons, illustrations and marketing copy stay out of the file — name them as "use your own" instead. Font families are fine to name; note if they're proprietary/paid and give the closest free alternative.

### 7. Deliver

Save to `<brand>-design/SKILL.md` in the working directory. Package it so the user can install it with one click:

```bash
python -m scripts.package_skill <brand>-design   # run from the skill-creator directory if available
```

Send the `.skill` file (or the bare `SKILL.md` if packaging isn't available) with the file-sending tool. Close with 2–3 lines: what's in it, what is `inferred`, and what could be measured better with a logged-in session.

## Quality bar

A good output lets someone build a new screen that a fan of the product would mistake for the real thing — *including how it moves*. Check before delivering:

- Every color, size, radius, shadow and duration in the Quick Reference has a confidence tag.
- Motion section has real durations + easing curves (or springs), not adjectives.
- Code snippets use CSS custom properties so the tokens are reusable.
- At least one "don't" per major section (what breaks the look).
- Gated parts are explicitly flagged, with sources.
