# CompanyCo Design System

> GRC platform with performance management and cost optimisation. This design system captures the visual language, component library, and brand rules used across the CompanyCo web product.

## Index

- `README.md` — this file
- `colors_and_type.css` — CSS custom properties for color + type (source of truth)
- `SKILL.md` — Claude Code / Agent SKill entry point
- `assets/` — logos, icons (sprite sheet), hero imagery
- `preview/` — design-system preview cards (color, type, components, etc.)
- `ui_kits/product/` — React recreations of the product admin UI (shell, nav, auth, tables, forms)

## Product overview

CompanyCo is a single product surface with two visually distinct modes:

1. **Product (Admin Workspace)** — Dense, functional, light-mode admin UI. Used 99% of the time. Indigo accent, system sans (Inter), small type, rigorous spacing. Lives behind login; everything the user actually does.
2. **Editorial / Brand (Auth, marketing)** — Luxury-editorial feel: near-black panel with warm amber brand mark, paired with a paper-white form side. Playfair Display for headlines, DM Sans for micro-type. Reserved for auth and any marketing-adjacent surfaces.

The tonal split is deliberate: the brand says "serious, considered, premium" (the GRC buyer is a board director, auditor, regulator); the product says "get out of the way, show me the data."

### Core modules (navigation)

The product is organised into hub modules, ordered by the backend and rendered as icons on the left nav rail:

`Intro` → `Companies` → `Measurement (Performance)` → `Portfolio` → `Services` → `Risks` → `Regulatory Obligations` → `Incidents (Investigations)` → plus `Admin` for superusers.

The home view is the **Actions** surface — items across the system that need the user's attention (duplicate reviews, user activations, etc.). The workspace is always scoped to an active **Company Group** chosen from the nav-rail avatar.

## Sources

- Codebase (read-only, mounted): `companyco/`
  - Frontend: `companyco/frontend/src/` — React + TypeScript + Vite
  - Backend: `companyco/backend/` — Spring Boot + Postgres
- GitHub repo referenced in the brief: `woodym-dotcom/companyco`

Specific style sources ingested:

- `companyco/frontend/src/index.css` — root tokens (colors, radii, shadows, type scale)
- `companyco/frontend/src/components/ui.css` — button / chip / field / panel primitives
- `companyco/frontend/src/components/ui.tsx` — React primitives API
- `companyco/frontend/src/components/AppShell.{tsx,css}` — top bar, breadcrumbs, identity menu
- `companyco/frontend/src/components/NavRail.{tsx,css}` — left icon rail, group picker
- `companyco/frontend/src/components/AuthScreen.{tsx,css}` — brand/editorial surface
- `companyco/frontend/src/components/CompaniesView.{tsx,css}` — tab + table patterns
- `companyco/frontend/src/components/ActionsView.{tsx,css}` — empty states, table patterns
- `companyco/frontend/src/components/DetailPanel.css` — slide-in side panel
- `companyco/frontend/src/components/HubView.{tsx,css}` — "coming soon" pattern
- `companyco/frontend/src/components/viz/viz-tokens.css` — status/severity/tier palettes
- `companyco/ETHOS.md` — product principles (Boil the Lake, Domain Language Wins, etc.)

---

## Content fundamentals

**Voice.** Direct, domain-literal, unadorned. No marketing fluff inside the product. The copy is written by engineers who respect the user's time; every label earns its place.

**Domain language wins.** When storage and domain conflict, domain wins. The DB column is `effective_to`; the UI says **"Resigned"**. Typed appointments — `DIRECTOR`, `SHAREHOLDER`, `BENEFICIAL_OWNER` — appear verbatim in the controller, the DTO, and the screen. Never collapse a domain distinction for copy-convenience.

**Sentence case, always.** Buttons, headings, tabs, menu items — all sentence case. Never Title Case. Never ALL CAPS except for eyebrows (tracked uppercase micro-labels).
- ✅ "Sign in", "Switch group", "Company group", "Pending actions"
- ❌ "Sign In", "SWITCH GROUP", "Company Group"

**Second person, present tense.** The product addresses the user as "you". Actions, not descriptions.
- ✅ "Sign in to your workspace"
- ✅ "Items across the system that need your attention."
- ✅ "Cmd + K to search"
- ❌ "User can sign in"

**Terse, declarative section copy.** Two-sentence max on section headers. One empty-state sentence.
- `Actions` — "Items across the system that need your attention."
- `Coming soon` — "{Module} module is under development."
- Empty: **All clear** / "No pending actions right now."

**Status is specific.** Never "Error" alone; say what happened and what to do. Timestamps are relative in lists (`just now`, `3m ago`, `2h ago`, `4d ago`) and absolute in detail panels.

**Chips are nouns.** `Admin`, `Active`, `3 pending`. Short labels, not sentences.

**Emoji: never.** Icons in the product are line-SVGs (1.5 stroke, 20×20 viewBox). No emoji, no unicode symbols, no decorative glyphs. The only exception is the `*` required-field marker (colored red).

**Eyebrows.** Tracked uppercase micro-labels above section titles: `HOME`, `COMPANIES`. Rare — only on primary hub views.

**Error tone.** Red text below the field (`.field-error`), plain and specific. No exclamation points, no "Oops!".

**Ethos words that show up in copy.** "Boil the Lake", "Single source of truth", "Fail fast on startup". These are internal-facing (docs, PR descriptions) — the product UI itself stays terse.

---

## Visual foundations

### Palette

**Neutral (product).** A 9-step cool gray scale, `#f9fafb` → `#111827`. Semantic aliases: `--surface-0/1/2/3`, `--text-1/2/3/4`, `--border-1/2`. The product is near-monochrome; color is used sparingly and always carries meaning.

**Accent (product).** Indigo — `#4f46e5` primary, `#4338ca` hover, `#eef2ff` soft. Used for primary buttons, active nav state, link text, focus rings, selection highlights. One accent, never mixed.

**Amber (brand).** `#d4a574` primary, ranging `#e8b87a` → `#b8865c`. Reserved for the brand/editorial surface — never appears inside the product. Paired with `#0c0c0c` (near-black ink) and `#fafaf8` (paper).

**Status (viz tokens).** `--status-healthy #22c55e`, `--status-warning #f59e0b`, `--status-critical #ef4444`, `--status-unknown #94a3b8`. Semantic chips have their own 3-swatch set (bg / border / text): success green, warning amber-yellow, info blue, accent indigo. No purple, no pink, no teal.

### Typography

**Product.** `Inter`, 400/500/600. 14px body (`--text-base`), 13px secondary, 12px micro. Tight letter-spacing (`-0.02em`) on headings 18px+. Line-height 1.5 body, 1 for display. `font-synthesis: none` + antialiased.

**Brand.** `Playfair Display` for headlines (700, `clamp(2.8rem, 4.5vw, 4rem)`, -0.03em tracking). `DM Sans` for supporting brand text and form labels on the auth side.

**Numerals.** Always Inter in product (tabular-nums where in tables). Brand surfaces can use Playfair for big numerals in hero moments.

### Spacing

4-point grid. Common rhythm: `4 / 6 / 8 / 12 / 16 / 24 / 32 / 48`. Panels pad 16; modals pad 24; auth side padded 48. Gaps between stacked form fields = 12; between sections = 16.

### Corners

`--radius-sm 6px` — buttons, inputs, small interactive elements.
`--radius-md 8px` — cards, popovers, dropdowns, avatars (square), brand buttons.
`--radius-lg 10px` — panels, modals, the workspace content container.
`--radius-pill 999px` — chips, identity avatar (circle).

### Borders

Single-pixel `--border-1 #e5e7eb` is the default separator. `--border-2 #d1d5db` is heavier (dashed empty states). Borders do 80% of the layout work — the system uses very few shadows.

### Shadows

Minimal. Two shadow tokens:
- `--shadow-1` — 1px card lift, near-imperceptible
- `--shadow-2` — 4/12 popover + modal lift
Plus `-4/12` inverted for the mobile bottom sheet. The detail panel slides in with **no** shadow — just a border-left. Admin surfaces are shadow-light by design.

### Backgrounds

Product is flat white / near-white. **No** gradients, patterns, textures, illustrations inside the product. The auth/brand surface is the only place gradients appear: two soft radial amber gradients on near-black (`rgba(212, 165, 116, 0.08)` top-right, `0.05` bottom-left), plus a brand mark composed of three overlapping amber rectangles.

No hand-drawn illustrations. No photography inside the product (one `hero.png` exists but is unused in the current build). The brand mark is geometric and gradient-rendered.

### Animation

Short, functional, no bounce. Four durations: `100ms` (row hover), `120ms` (button/nav hover), `150ms` (panel slide-in), `200ms` (brand focus ring, auth input transitions). All `ease`. Never `spring`. Never `cubic-bezier(...)`.

Motion primitives:
- Panel slide-in: `translateX(40px) → 0` + fade, 150ms
- Bottom sheet (mobile): `translateY(100%) → 0`, 200ms
- Button hover: background color only
- Loading spinner: 0.8s linear rotate, 2px indigo border

Brand-side has one exception: the auth mark shapes float (`translateY(0 ↔ -6px)`, 8s infinite, staggered -2.5s / -5s).

### Hover / press states

- **Buttons** — background change only (`--surface-2` for secondary/ghost; `--accent-1-hover` for primary). No shrink, no shadow bloom, no border change.
- **Rows (table, record)** — background `→ --surface-1`, 100ms.
- **Nav icons** — bg `→ --surface-2`, text `→ --text-1`, 120ms. Active: amber-soft bg + accent border + accent text.
- **Identity trigger** — bg `→ --surface-1`.
- **Press** — no dedicated press state; `:active` is default browser.
- **Disabled** — `opacity: 0.5; cursor: not-allowed;` on buttons. Nav icons get `opacity: 0.55` plus a small uppercase category badge in the bottom-right.

### Focus

2px indigo ring on inputs (`box-shadow: 0 0 0 2px var(--accent-ring)`) + border-color indigo, 120ms. Brand-side auth: 3px amber ring (`rgba(212, 165, 116, 0.15)`).

### Layout rules

- **Top bar** — 44px fixed, `CompanyCo` wordmark left, actions right.
- **Nav rail** — 52px fixed, icon-only, tooltip on hover; group initials avatar at top (indigo square), admin cog at bottom.
- **Content** — single scrolling column, 16px padding (12px mobile). Breadcrumbs row at 40px above.
- **Mobile (<768px)** — nav rail rotates to a bottom bar with safe-area inset; detail panel becomes a bottom sheet.

### Transparency + blur

Used twice: the global loading overlay (`rgba(255,255,255,0.85)` + `backdrop-filter: blur(2px)`) and the modal scrim (`rgba(0,0,0,0.3)` + `blur(4px)`). Nothing else uses blur inside the product.

### Cards

"Panels" (`.panel`) are the canonical card: 1px solid `--border-1`, `--radius-lg 10px`, white bg, 16px pad, no shadow. A card hovered inside a list gets a subtle bg change, never a shadow.

### Chips

Pill-shaped (`999px`), 24px min-height, 8px horizontal pad, 12px font-size, 500 weight. Always bordered. Four tones: `neutral`, `accent`, `success`, `warning`, `info` — each with a matched bg/border/text triple.

### Tables

Header row: 12px micro caps, `--text-4` color, 0.06em tracking. Body: 14px, 10/12 padding. Row dividers are 1px `--border-1`. Selected row = amber-soft `--accent-soft` bg. Row hover = `--surface-1` bg, 100ms.

### Forms

- Input height: 36px desktop, 44px mobile (+16px font to kill iOS zoom).
- Labels: 12px micro, `--text-3`, above the input by default. `field-inline` flips to a 120/1fr two-column grid.
- Errors: red text below, bg `--error-light` on the input.
- Readonly: `--surface-2` bg, `--text-3` text.
- Select: native chrome on desktop; custom chevron overlay in the detail panel.

### Imagery

Near-none inside the product. The hero image that exists (`assets/hero.png`) is an unused placeholder.

### Required-field marker

Red asterisk with a leading space: `{label} *`. The asterisk is `aria-hidden`; the `required` attribute carries semantics.

---

## Iconography

**System.** Custom inline SVGs in `NavRail.tsx`, drawn per-module. All use a shared envelope:

```
viewBox="0 0 20 20"
fill="none"
stroke="currentColor"
strokeWidth="1.5"
strokeLinecap="round"
strokeLinejoin="round"
```

Rendered at 18×18 inside a 38×38 button. Color inherits from the active/inactive nav state (`--text-3` default, `--accent-text` active).

**Other icons.** A small sprite sheet lives at `assets/icons.svg` containing brand/social symbols: `bluesky-icon`, `discord-icon`, `documentation-icon`, `github-icon`, `social-icon`, `x-icon`. Two colored: ink-black `#08060d` and a purple `#aa3bff` for documentation/social. These are the only non-monochrome icons in the system and are used outside the product shell (likely docs/marketing).

**No icon font.** No Heroicons/Lucide dependency in the product. All product icons are hand-drawn inline. If you need an icon that isn't already in the rail, draw it inline with the same stroke-1.5 / 20-viewbox envelope.

**Emoji: never used.**

**Unicode as icons: rare.** Only `•` as a separator inline and `/` in breadcrumbs. No arrow glyphs, no stars.

**Logos.** The CompanyCo brand mark (`assets/logo-mark.svg`, extracted from `AuthScreen.tsx`) is three stacked amber-gradient rectangles. `logo-wordmark.svg` pairs the mark with a Playfair "CompanyCo" wordmark.

**Substitution flag.** No typography files were shipped in the repo — the auth screen pulls Playfair Display and DM Sans from Google Fonts via `@import`. The product uses system-fallback Inter (same Google Fonts load in `colors_and_type.css`). If a licensed desktop version of any of these is the canonical build, please attach it and we'll swap the CDN link.

---

## Caveats

- **Brand mark** is derived from the auth-screen decorative SVG (3 stacked amber rectangles). There's no formal wordmark in the repo; the wordmark here is a reasonable reconstruction in the brand's typeface. Please confirm or replace.
- **Fonts** are all Google Fonts CDN — no local font files shipped. If you want local `.woff2` files, please attach.
- **Iconography coverage** is narrow — only the 8 nav-module icons plus the social sprite. Extend with the same SVG envelope as needed.
- **Dark mode** — `viz-tokens.css` has a dark-mode media-query block for status/severity/tier colors only. No full dark-mode palette for product surfaces exists.
- **One product.** Despite GRC-module breadth, everything is a single app; there is no marketing site, docs site, or mobile app in the attached codebase.
