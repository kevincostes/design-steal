# Sources for gated or unreachable UI

Use when part of the product sits behind a login, paywall, waitlist, desktop/mobile-only app, or an interaction you couldn't trigger. Work top-down: earlier sources are more trustworthy. Record every source you use in the output's **Sources** section and tag values from here as `documented` or `inferred`.

## 1. Official design material (→ `documented`)

| Look for | Search patterns |
| --- | --- |
| Public design system / component library | `<brand> design system`, `<brand>.design`, `design.<brand>.com`, `<brand> UI kit` |
| Brand guidelines / press kit | `<brand> brand guidelines`, `<brand> press kit`, `<brand> brand assets` |
| Design blog posts / engineering posts | `<brand> blog redesign`, `how we built <feature> <brand>`, `<brand> design team` |
| Figma Community files by the company | `figma.com/community <brand>` |
| Open-source repos | `github.com/<org>` → look for `tailwind.config`, `tokens.json`, `theme.ts`, `globals.css`, `*.css` with `--` variables, icon packages |
| Conference talks by their designers | `<brand> designer talk`, Config / Figma talks, YouTube |

Many companies publish exactly the tokens you need (e.g. Stripe, GitHub Primer, Atlassian, Shopify Polaris, IBM Carbon, Vercel Geist). If one exists, it outranks anything you measure from marketing pages — the product app often uses a denser system than the landing page.

## 2. Official product imagery (→ `inferred`, high confidence)

| Look for | Why |
| --- | --- |
| Help center / docs articles | step-by-step screenshots of real settings, menus, empty states |
| Changelog / release notes | each entry usually shows the newest UI, often as video/GIF |
| Launch posts, Product Hunt page | hero screenshots and demo videos of the core app |
| Official YouTube / X / LinkedIn videos | **motion**: pause and step frame-by-frame to estimate durations (count frames at 30/60fps) |
| App Store / Play Store listing | mobile app screenshots |

## 3. Third-party galleries & teardowns (→ `inferred`)

- **Mobbin**, **Page Flows**, **Refero**, **Screenlane**, **UI Sources**: full flows of logged-in apps (onboarding, settings, dashboards).
- **Dribbble / Behance**: shots posted by the company's own designers (search the designer names from their team page).
- **Godly**, **Land-book**, **Lapa Ninja**, **SaaS Landing Page**: marketing page archives.
- Wayback Machine (`web.archive.org`) for older versions or pages that now redirect to login.

## 4. Tutorials and reviews (→ `inferred`, lower confidence)

- YouTube walkthroughs: `<brand> tutorial`, `<brand> walkthrough 2026`, `<brand> review` — best source for real interactions inside the app.
- Blog tutorials / Medium posts with screenshots.
- Reddit / community forum posts with screenshots of specific screens.

## 5. Image search (→ `inferred`)

Search specific screens rather than the brand alone:
`<brand> dashboard`, `<brand> settings page`, `<brand> command menu`, `<brand> sidebar`, `<brand> dark mode`, `<brand> onboarding`, `<brand> empty state`, `<brand> modal`, `<brand> mobile app`.

## Extracting values from screenshots

- **Color:** open the image in Chrome and sample pixels with a canvas (`getImageData`) or eyeball against measured public tokens. Compression shifts colors slightly — round to the nearest value seen in the public site/tokens when close.
- **Type:** identify the family by comparing glyphs (`a`, `g`, `R`, `1`) to the public site's font; estimate sizes relative to a known element (e.g. a 32px avatar or the 14px body text measured publicly).
- **Spacing & radius:** measure in px relative to a known-size element, then snap to the scale found on the public site (4/8px grid).
- **Motion from video:** frames-until-settled ÷ fps ≈ duration; note whether it overshoots (spring) or eases out smoothly (curve).

Always state the method next to inferred values in the output, e.g. `~200ms (inferred, changelog video frame count)`.
