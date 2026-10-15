# Output template — `<brand>-design/SKILL.md`

Follow this skeleton. It mirrors `apple-design`: principles first, values as evidence, code you can paste, a Quick Reference at the end. Drop sections where the product has nothing distinctive; never pad. Replace every `<…>`.

````markdown
---
name: <brand>-design
description: <Brand>'s design language translated into reusable rules for the web — <3–6 signature traits, e.g. "dense dark UI, 13px type scale, 4px grid, crisp 150ms ease-out motion, layered borders instead of shadows">. Use when building or reviewing UI that should look and feel like <Brand>: <list of covered areas: color, typography, spacing, components, motion, dark mode…>, or when the user mentions <Brand>-style, <Brand>-like or "like <Brand>".
---

# <Brand> Design

## Initial Response

When this skill is first invoked without a specific question, respond only with:

> I'm ready to help you build <Brand>-style interfaces. This knowledge was extracted from <brand-url> on <YYYY-MM-DD> (live measurement + <main other sources>).

Do not provide any other information until the user asks a question.

<One paragraph: what this product's UI is, who it's for, and what the file covers.>

The through-line: **<one bold sentence that captures the whole design language>.**

## The Core Idea

<2–4 sentences on the philosophy. What makes it recognisable. The motion character as an adjective pair.>

Signature traits (break these and it stops looking like <Brand>):
1. <trait>
2. <trait>
3. <trait>

## 1. Color

- <Rule + why.>
- <Rule + why.>
- **Don't:** <what breaks it>

```css
:root {
  --<brand>-bg: <value>;          /* measured */
  --<brand>-surface: <value>;
  --<brand>-border: <value>;
  --<brand>-text: <value>;
  --<brand>-text-muted: <value>;
  --<brand>-accent: <value>;
}
```

<Dark/light mode handling if relevant.>

## 2. Typography

- Family: <name> (<free alternative if proprietary>), fallback stack.
- <Scale rules, tracking per size, leading, weights used and where.>

| Role | Size | Line height | Weight | Tracking | Confidence |
| --- | --- | --- | --- | --- | --- |
| Display | | | | | |
| H1 | | | | | |
| Body | | | | | |
| Small / UI label | | | | | |

## 3. Spacing & layout

- Base unit: <4px/8px>. Scale: <list>.
- Container max-width, grid, gutters, section rhythm.
- Density: <compact / comfortable> and why.

## 4. Shape & elevation

- Radius scale and where each applies.
- Elevation strategy: <shadows / borders / layered surfaces / blur>.

```css
/* example card */
```

## 5. Components

One short block per component that has a distinctive treatment (button, input, card, nav/sidebar, menu/dropdown, modal, toast, tooltip, table/list, tabs). For each: anatomy, sizes, states, a snippet.

## 6. Motion

The most valuable section — be concrete.

- Character: <adjective pair>. <Springs or curves? Overshoot?>
- <Rules: enter/exit symmetry, origin, stagger, what never animates.>

| Interaction | Property | Duration | Easing / spring | Confidence |
| --- | --- | --- | --- | --- |
| Button hover | | | | |
| Button press | | | | |
| Menu open / close | | | | |
| Modal enter / exit | | | | |
| Toast | | | | |
| Scroll reveal | | | | |

```css
:root {
  --<brand>-ease-out: cubic-bezier(<…>);
  --<brand>-dur-fast: <…>ms;
  --<brand>-dur-base: <…>ms;
}
```

```js
// Framer Motion / Motion equivalent if springs are used
```

## 7. States & feedback

Hover, active/pressed, focus-visible, disabled, loading, empty, error, success — what each looks like.

## 8. Responsive

Breakpoints and what changes at each (nav collapse, density, type scale).

## 9. Accessibility & preferences

How the product handles (or should handle) `prefers-reduced-motion`, `prefers-color-scheme`, contrast, focus rings.

## 10. Gated surfaces

What could not be measured live, what was inferred, and from which sources. Values here are `inferred` unless documented.

## Quick Reference

| Need | Technique | Value | Confidence |
| --- | --- | --- | --- |
| | | | measured / documented / inferred |

## Sources

- <url> — <what it provided>
````

## Writing notes

- Explain the *why* in one sentence per rule; the reader will face cases the rules don't cover.
- Use CSS custom properties in snippets so the tokens travel together.
- Prefer the product's own variable names when the site exposes them.
- Keep brand assets (logo, proprietary icons, illustrations, copy) out — say "use your own".
