> **Canonical source.** This file (`design-system/DESIGN.md`) is the authoritative spec for `@ds/core`. The [Notion page](https://www.notion.so/358b63f3c7658169b736c2be8ebf7838) is a discoverability stub only; it updates referentially but does not drive changes. On any divergence, this repo file wins.
> Last updated: 2026-05-06

---
name: "@ds/core"
colors:
  # Neutrals — raw palette
  gray-50: "#f9fafb"
  gray-100: "#f3f4f6"
  gray-200: "#e5e7eb"
  gray-300: "#d1d5db"
  gray-400: "#9ca3af"
  gray-500: "#6b7280"
  gray-600: "#4b5563"
  gray-700: "#374151"
  gray-800: "#1f2937"
  gray-900: "#111827"
  gray-950: "#0b1220"

  # Semantic surfaces — light (default)
  surface-0: "#ffffff"
  surface-1: "#f9fafb"
  surface-2: "#f3f4f6"
  surface-3: "#e5e7eb"

  # Semantic surfaces — dark
  surface-0-dark: "#0b1220"
  surface-1-dark: "#111827"
  surface-2-dark: "#1f2937"
  surface-3-dark: "#374151"

  # Borders — light / dark
  border-1: "#e5e7eb"
  border-2: "#d1d5db"
  border-1-dark: "#1f2937"
  border-2-dark: "#374151"

  # Text hierarchy — light
  text-1: "#111827"
  text-2: "#374151"
  text-3: "#6b7280"
  text-4: "#9ca3af"

  # Text hierarchy — dark
  text-1-dark: "#f9fafb"
  text-2-dark: "#e5e7eb"
  text-3-dark: "#9ca3af"
  text-4-dark: "#6b7280"

  # Status semantic — light
  error: "#dc2626"
  error-light: "#fef2f2"
  error-border: "#fca5a5"
  error-text: "#991b1b"
  error-strong: "#b91c1c"
  success: "#16a34a"
  success-light: "#dcfce7"
  success-border: "#86efac"
  success-text: "#166534"
  warning: "#d97706"
  warning-light: "#fef9c3"
  warning-border: "#fde68a"
  warning-text: "#92400e"
  info: "#2563eb"
  info-light: "#dbeafe"
  info-border: "#93c5fd"
  info-text: "#1e40af"

  # Status semantic — dark overrides
  error-dark: "#f87171"
  success-dark: "#4ade80"
  warning-dark: "#fbbf24"
  info-dark: "#60a5fa"

  # Viz — service health
  status-healthy: "#22c55e"
  status-warning: "#f59e0b"
  status-critical: "#ef4444"
  status-unknown: "#94a3b8"

  # Viz — severity
  severity-low: "#22c55e"
  severity-medium: "#f59e0b"
  severity-high: "#f97316"
  severity-critical: "#ef4444"

  # Viz — compliance tier
  tier-core: "#3b82f6"
  tier-domain: "#8b5cf6"
  tier-bespoke: "#6b7280"

  # Viz — phase palette (workflow state chips)
  phase-screen-bg: "#eff6ff"
  phase-screen-border: "#bfdbfe"
  phase-screen-text: "#1d4ed8"
  phase-allocate-bg: "#fef3c7"
  phase-allocate-border: "#fde68a"
  phase-allocate-text: "#b45309"
  phase-score-bg: "#f5f3ff"
  phase-score-border: "#ddd6fe"
  phase-score-text: "#6d28d9"
  phase-approve-bg: "#fff1f2"
  phase-approve-border: "#fecdd3"
  phase-approve-text: "#be123c"
  phase-complete-bg: "#f0fdf4"
  phase-complete-border: "#bbf7d0"
  phase-complete-text: "#15803d"

  # Brand accents are computed from --brand-hue and --brand-chroma per
  # brand file via oklch(). The formula is uniform across brands; each
  # brand declares only its seed values. See "Brand palette formula"
  # below for the exact derivation.
  companyco-brand-hue: 210
  companyco-brand-chroma: 0.15

  # Brand: CompanyCo — amber editorial (always dark, theme-invariant)
  amber-50: "#fdf7ef"
  amber-100: "#f5e9d4"
  amber-200: "#e8b87a"
  amber-300: "#d4a574"
  amber-400: "#c9956a"
  amber-500: "#b8865c"
  amber-600: "#9a6f48"
  ink-0: "#0c0c0c"
  ink-1: "#1a1a1a"
  paper: "#fafaf8"
  paper-ink: "#f5f0eb"

  # Brand: automationArmoury — cyan accent (algorithmic)
  automation-brand-hue: 210
  automation-brand-chroma: 0.15
  runtime-running: "#06b6d4"
  runtime-queued: "#f59e0b"
  runtime-success: "#16a34a"
  runtime-failed: "#dc2626"
  runtime-paused: "#6b7280"

  # Brand: recruitment-woody — warm orange / ember (algorithmic)
  recruitment-brand-hue: 30
  recruitment-brand-chroma: 0.15

typography:
  micro:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: "400"
    lineHeight: 14px
  eyebrow:
    fontFamily: Inter
    fontSize: 11.2px
    fontWeight: "500"
    letterSpacing: 0.08em
    textTransform: uppercase
  label:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: "500"
    lineHeight: 16px
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: "400"
    lineHeight: 16px
  body:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 1.5
  body-secondary:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 1.5
  h3:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "600"
    lineHeight: 24px
  h2:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: "600"
    lineHeight: 28px
    letterSpacing: -0.02em
  h1:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: "600"
    lineHeight: 32px
    letterSpacing: -0.02em
  mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: "400"
    lineHeight: 20px
  brand-headline:
    fontFamily: Playfair Display
    fontSize: clamp(44.8px, 4.5vw, 64px)
    fontWeight: "700"
    lineHeight: 1
    letterSpacing: -0.03em
  brand-h2:
    fontFamily: Playfair Display
    fontSize: 28.8px
    fontWeight: "600"
    lineHeight: 1.25
    letterSpacing: -0.02em
  brand-tagline:
    fontFamily: DM Sans
    fontSize: 16.8px
    fontWeight: "400"
    lineHeight: 1.6
  brand-eyebrow:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: "400"
    letterSpacing: 0.15em
    textTransform: uppercase

spacing:
  space-1: 4px
  space-2: 6px
  space-3: 8px
  space-4: 12px
  space-5: 16px
  space-6: 24px
  space-7: 32px
  space-8: 48px

rounded:
  sm: 6px
  md: 8px
  lg: 10px
  pill: 9999px

shadows:
  shadow-1: "0 1px 3px rgba(0, 0, 0, 0.06)"
  shadow-2: "0 4px 12px rgba(0, 0, 0, 0.08)"
  shadow-3: "0 -4px 12px rgba(0, 0, 0, 0.08)"
  shadow-1-dark: "0 1px 3px rgba(0, 0, 0, 0.40)"
  shadow-2-dark: "0 4px 12px rgba(0, 0, 0, 0.50)"
  shadow-3-dark: "0 -4px 12px rgba(0, 0, 0, 0.50)"

motion:
  ease: ease
  duration-fast: 100ms
  duration-base: 120ms
  duration-med: 150ms
  duration-slow: 200ms

components:
  shell:
    gridRows: "44px 1fr"
    height: 100vh
    backgroundColor: "{colors.surface-0}"
  topbar:
    height: 44px
    padding: "0 16px"
    borderBottom: "1px solid {colors.border-1}"
    backgroundColor: "{colors.surface-0}"
    brandFontSize: 14px
    brandFontWeight: "600"
    brandLetterSpacing: -0.01em
  navrail:
    width: 52px
    padding: "8px 4px"
    borderRight: "1px solid {colors.border-1}"
    backgroundColor: "{colors.surface-0}"
    iconSize: 38px
    iconBorderRadius: "{rounded.md}"
    groupBadgeSize: 36px
    groupBadgeBorderRadius: "{rounded.md}"
  breadcrumbs:
    height: 40px
    padding: "0 16px"
    fontSize: 13px
    borderBottom: "1px solid {colors.border-1}"
  panel:
    backgroundColor: "{colors.surface-0}"
    border: "1px solid {colors.border-1}"
    borderRadius: "{rounded.lg}"
    padding: 16px
  card:
    backgroundColor: "{colors.surface-0}"
    border: "1px solid {colors.border-1}"
    borderRadius: "{rounded.lg}"
    padding: 16px
    boxShadow: "{shadows.shadow-1}"
    transition: "box-shadow {motion.duration-base} {motion.ease}"
  card-hover:
    boxShadow: "{shadows.shadow-2}"
  button-primary:
    backgroundColor: "{colors.companyco-accent}"
    textColor: "#ffffff"
    borderRadius: "{rounded.sm}"
    minHeight: 36px
    padding: "0 12px"
    fontSize: 14px
    fontWeight: "500"
    transition: "background-color 120ms ease"
  button-primary-hover:
    backgroundColor: "{colors.companyco-accent-hover}"
  button-secondary:
    backgroundColor: "{colors.surface-0}"
    textColor: "{colors.text-1}"
    border: "1px solid {colors.border-1}"
    borderRadius: "{rounded.sm}"
    minHeight: 36px
    padding: "0 12px"
    fontWeight: "500"
  button-secondary-hover:
    backgroundColor: "{colors.surface-2}"
  button-ghost:
    backgroundColor: transparent
    borderColor: transparent
    textColor: "{colors.text-2}"
    borderRadius: "{rounded.sm}"
    minHeight: 36px
    padding: "0 12px"
    fontWeight: "500"
  button-ghost-hover:
    backgroundColor: "{colors.surface-2}"
  button-danger:
    backgroundColor: "{colors.error}"
    textColor: "#ffffff"
    borderRadius: "{rounded.sm}"
    minHeight: 36px
    padding: "0 12px"
    fontWeight: "500"
  button-danger-hover:
    backgroundColor: "{colors.error-strong}"
  button-sm:
    minHeight: 28px
    padding: "0 8px"
    fontSize: 13px
  button-icon:
    minWidth: 36px
    minHeight: 36px
    padding: 0
    borderRadius: "{rounded.sm}"
  focus-ring:
    outline: none
    borderColor: "{colors.companyco-accent}"
    boxShadow: "0 0 0 2px rgba(79, 70, 229, 0.15)"
  input-field:
    backgroundColor: "{colors.surface-0}"
    border: "1px solid {colors.border-1}"
    borderRadius: "{rounded.sm}"
    minHeight: 36px
    padding: "6px 8px"
    fontSize: 14px
    color: "{colors.text-1}"
    placeholderColor: "{colors.text-4}"
    transition: "border-color 120ms ease, box-shadow 120ms ease"
  input-field-focus:
    borderColor: "{colors.companyco-accent}"
    boxShadow: "0 0 0 2px rgba(79, 70, 229, 0.15)"
  input-field-error:
    borderColor: "{colors.error}"
    backgroundColor: "{colors.error-light}"
  input-field-readonly:
    backgroundColor: "{colors.surface-2}"
    color: "{colors.text-3}"
  chip:
    backgroundColor: "{colors.surface-2}"
    border: "1px solid {colors.border-1}"
    borderRadius: "{rounded.pill}"
    minHeight: 24px
    padding: "0 8px"
    fontSize: 12px
    fontWeight: "500"
    color: "{colors.text-2}"
  chip-accent:
    backgroundColor: "{colors.companyco-accent-soft}"
    borderColor: "{colors.companyco-accent-border}"
    color: "{colors.companyco-accent-text}"
  chip-success:
    backgroundColor: "{colors.success-light}"
    borderColor: "{colors.success-border}"
    color: "{colors.success-text}"
  chip-warning:
    backgroundColor: "{colors.warning-light}"
    borderColor: "{colors.warning-border}"
    color: "{colors.warning-text}"
  chip-info:
    backgroundColor: "{colors.info-light}"
    borderColor: "{colors.info-border}"
    color: "{colors.info-text}"
  chip-danger:
    backgroundColor: "{colors.error-light}"
    borderColor: "{colors.error-border}"
    color: "{colors.error-text}"
  record-row:
    backgroundColor: "{colors.surface-0}"
    border: "1px solid {colors.border-1}"
    borderRadius: "{rounded.md}"
    padding: "8px 12px"
    transition: "background 120ms ease"
  record-row-hover:
    backgroundColor: "{colors.surface-1}"
  record-row-selected:
    backgroundColor: "{colors.companyco-accent-soft}"
    borderColor: "{colors.companyco-accent-border}"
  detail-panel:
    width: 420px
    backgroundColor: "{colors.surface-0}"
    borderLeft: "1px solid {colors.border-1}"
    padding: 16px
    transitionOpen: "transform 150ms ease, opacity 150ms ease"
  modal:
    backgroundColor: "{colors.surface-0}"
    borderRadius: "{rounded.lg}"
    padding: 24px
    minWidth: 420px
    boxShadow: "{shadows.shadow-2}"
  scrim:
    backgroundColor: "rgba(0, 0, 0, 0.30)"
    backdropFilter: "blur(4px)"
  combobox-menu:
    backgroundColor: "{colors.surface-0}"
    border: "1px solid {colors.border-1}"
    borderRadius: "{rounded.md}"
    boxShadow: "{shadows.shadow-2}"
    maxHeight: 240px
    padding: 4px
  combobox-option:
    borderRadius: "{rounded.sm}"
    padding: "8px"
    fontSize: 14px
  combobox-option-hover:
    backgroundColor: "{colors.companyco-accent-soft}"
  tab:
    padding: "8px 16px"
    fontSize: 14px
    fontWeight: "500"
    color: "{colors.text-3}"
    borderBottom: "2px solid transparent"
  tab-active:
    color: "{colors.companyco-accent-text}"
    borderBottomColor: "{colors.companyco-accent}"
  table-header:
    fontSize: 12px
    fontWeight: "600"
    textTransform: uppercase
    letterSpacing: 0.06em
    color: "{colors.text-4}"
    padding: "8px 12px"
    borderBottom: "1px solid {colors.border-1}"
  table-cell:
    padding: "12px"
    fontSize: 14px
    color: "{colors.text-2}"
    borderBottom: "1px solid {colors.border-1}"
  spinner:
    size: 20px
    borderColor: "{colors.border-1}"
    accentColor: "{colors.companyco-accent}"
    duration: 800ms
  identity-avatar:
    size: 28px
    borderRadius: "{rounded.pill}"
    backgroundColor: "{colors.companyco-accent}"
    color: "#ffffff"
    fontSize: 12px
    fontWeight: "600"
  kbd:
    backgroundColor: "{colors.surface-1}"
    border: "1px solid {colors.border-1}"
    borderRadius: 3px
    padding: "1px 4px"
    fontSize: 11px
---

## Brand & Product Identity

`@ds/core` is a shared design system serving three internal products built by the same team:

- **CompanyCo** — a GRC (governance, risk & compliance) admin platform. Primary brand: indigo accent with an amber/ink editorial surface for the auth and marketing layer.
- **automationArmoury** — an ops and automation platform. Brand accent: cyan. Mono-forward; engineering density is a feature.
- **recruitment-woody** — a recruitment management tool. Brand accent: terracotta. Minimal; Inter only.

Every product shares the same neutral palette, spacing scale, radii, shadows, motion tokens, and `cc-*` component primitives. Only the accent color set and font stack differ. The design language is deliberately **understated and functional** — no decorative gradients, no rounded-corner excess. Borders, tonal surfaces, and controlled whitespace carry the visual hierarchy. The UI should feel like the tools used by people who value precision over delight.

## Colors

### Neutral strategy

The gray scale is sourced from Tailwind's gray ramp. Light mode uses near-white surfaces (`#ffffff`, `#f9fafb`, `#f3f4f6`) with cool-gray text hierarchy. Dark mode flips to a cool near-black (`#0b1220`) base with the same gray ramp reversed for text. There are no warm grays — the palette is intentionally cool and neutral so that brand accents and status colors read clearly against it.

Surfaces have four tiers in each mode:

- **surface-0** — page / modal background (white / deepest dark)
- **surface-1** — raised row background, sidebar
- **surface-2** — hover state, secondary containers
- **surface-3** — dividers used as fills, highest contrast surface

### Brand accents (algorithmic)

Each brand declares exactly two seed values — `--brand-hue` (0–360°) and `--brand-chroma` (0–0.4) — and the full accent token set is computed from them with a single formula shared across all brands. Consumer code reads the same token names (`--accent-1`, `--accent-1-hover`, `--accent-soft`, `--accent-border`, `--accent-text`, `--accent-ring`); only the derivation changes.

#### Brand palette formula

**Light mode** (CSS in each brand file):
```
--accent-1:       oklch(55% C H)
--accent-1-hover: oklch(45% C H)
--accent-soft:    oklch(96% C*0.25 H)
--accent-border:  oklch(85% C*0.5  H)
--accent-text:    oklch(35% C H)
--accent-ring:    color-mix(in oklch, var(--accent-1) 18%, transparent)
```

**Dark mode** — solid tokens lift via lightness; `soft`/`border`/`ring` become translucent `color-mix()` derivations of `--accent-1` so they read correctly against true-dark surfaces:
```
--accent-1:       oklch(75% C*0.85 H)
--accent-1-hover: oklch(85% C*0.7  H)
--accent-text:    oklch(85% C*0.7  H)
--accent-soft:    color-mix(in oklch, var(--accent-1) 12%, transparent)
--accent-border:  color-mix(in oklch, var(--accent-1) 40%, transparent)
--accent-ring:    color-mix(in oklch, var(--accent-1) 25%, transparent)
```

#### Brand seeds

| Brand | Hue | Chroma | Character |
|---|---|---|---|
| CompanyCo | `210` | `0.15` | cyan — paired with automationArmoury; enterprise governance tools share a cool, technical family |
| automationArmoury | `210` | `0.15` | cyan — machine, data, engineering density |
| recruitment-woody | `30`  | `0.15` | warm orange / ember — people, recruitment warmth |
| cl-frontend, customer-backoffice | `265` | `0.18` | indigo — customer-lifecycle admin family. Imports `@ds/core/brands/customer-lifecycle.css`, distinct from the GRC/automation cyan pair |

To rebrand any product, change the two seed values in that brand's CSS file. The full accent set (light + dark) recomputes automatically; no downstream code changes.

#### Browser baseline

The formula uses `oklch()` and `color-mix()`. Both require Chrome 111+, Firefox 113+, Safari 16.4+ (all shipped 2023). No fallback is provided; older browsers are not supported.

### Editorial surface — CompanyCo only

The auth and marketing layer of CompanyCo uses a fixed dark-ink-on-dark treatment that does not flip with the theme. It uses:

- **Ink** (`#0c0c0c`, `#1a1a1a`) — near-black background
- **Paper** (`#fafaf8`, `#f5f0eb`) — warm off-white for contrast text
- **Amber scale** — used for decorative accents and highlights in the editorial headline stack

This surface is always rendered dark regardless of OS preference. It gives the product a premium, intentional "door" before the functional UI begins.

### Status and viz colors

Status colors (error/success/warning/info) follow a three-slot pattern: the pure color for text/icons, a light tinted fill, and a mid-tone border. This avoids all-red or all-green surfaces that create visual alarm; instead the fill + border combination signals state at low energy.

Viz tokens cover several independent dimensions:
- **Service health** (healthy / warning / critical / unknown) — green/amber/red/slate
- **Severity** (low / medium / high / critical) — green through orange through red
- **Compliance tier** (core / domain / bespoke) — blue / purple / gray — used to visually classify obligation source
- **Phase** (screen / allocate / score / approve / complete) — blue / amber / purple / rose / green — used for workflow-state chips in the recruitment and operations domains. Each phase has a `bg / border / text` triple matching the chip primitive pattern. The phase is a status-adjacent but distinct axis: unlike service-health or severity (which express degree of badness), phase expresses *which stage of a workflow* an item is in. Light mode uses saturated mid-tones for text against a light tinted fill; dark mode flips the fill to translucent and raises the text to a pastel tint.

### Opacity conventions

Tailwind-style `token/N` suffixes (`bg-muted/40`, `border-border/60`, `text-foreground/55`) are canonical for softening a token in context. Use the following bands consistently:

- **`/5`–`/20`** — subtle fills: resting tint on accent chips, wash over surface, nav-rail hover background, avatar background tints.
- **`/30`–`/50`** — borders and dividers: contextual separators, selected-state borders, medium overlays.
- **`/60`–`/80`** — stronger overlays: menu hovers, pressed states, secondary text weight reduction on light surfaces.

Avoid `/85`–`/95` (unnecessary precision) and avoid stacking multiple opacity suffixes on the same element. If a value recurs in more than three places, promote it to a named token rather than repeating the opacity suffix.

## Typography

### Font stacks

The product UI uses **Inter** universally across all three brands. It was chosen for its consistent metrics, excellent legibility at 13–14px, and neutral personality that doesn't compete with data.

CompanyCo's editorial/auth surface uses a layered stack:
- **Playfair Display** (serif) — headlines. Chosen for its editorial authority and the contrast it creates against the functional Inter-only product interior.
- **DM Sans** (geometric sans) — taglines and eyebrows within the editorial surface. Bridges the serif headline and the body copy with a friendly, modern feel.
- **JetBrains Mono** — code, JSON previews, payload displays, and any content where character-level precision matters.

### Scale

The type scale is deliberately compact. The base size is **14px** — a product density choice, not a readability compromise. The system runs smaller than consumer apps because the users are internal staff and operators working in data-heavy contexts, not casual readers.

- **Micro** — 10px weight 400, line-height 14px. Used sparingly for dense pill text, overdue stamps, phase tags on cards, and inline density markers where 11.2px eyebrow is still too large. Never for prose.

- **Eyebrow** — 11.2px, uppercase, wide letter-spacing (0.08em), weight 500. Used for section labels, column headers, and category markers.
- **Label / Caption** — 12px. Labels are weight 500; captions are weight 400.
- **Body** — 14px weight 400. The workhorse for all prose, field values, and list copy.
- **H3 / Panel title** — 16px weight 600. In-panel headers and card titles.
- **H2 / Section title** — 18px weight 600, letter-spacing −0.02em. Page section headings.
- **H1 / View title** — 24px weight 600, letter-spacing −0.02em. One per page; reserved for the primary view heading.
- **Mono** — JetBrains Mono 13px. Code and structured data.

Table headers use the eyebrow treatment (uppercase, wide tracking, text-4 color) to subordinate them visually to the data rows.

Brand editorial sizes are significantly larger — the hero headline is `clamp(44.8px, 4.5vw, 64px)` — because they appear on dedicated full-screen surfaces, not inside the data product UI.

## Density modes

Operators staring at the same pane for a full shift want a knob. The DS exposes one: `data-density` on the `<html>` root.

- **`compact`** — `--density: 0.85`, base font-size 13px. More rows on screen; tighter content padding, table cells, record-row min-heights, and stack gaps. For ops marathons.
- **`cozy`** (default — no attribute set) — `--density: 1`, base 14px. The spec'd values throughout this document.
- **`spacious`** — `--density: 1.15`, base 15px. Roomier; better for first-time use, demos, and accessibility.

Implementation is one multiplier (`--density`) and a few derived `--density-*` tokens (`--density-content-pad`, `--density-stack-gap`, `--density-row-pad-y/x`, `--density-table-pad`, `--density-row-min`, `--density-text-base`). `cc-content` / `cc-stack` (default gap) / `cc-record-row` / `cc-table tbody td` and the body font read through them; everything else stays at fixed `--space-*` values, so the chrome (topbar 44px, navrail 52px, breadcrumbs 40px) doesn't deform.

Persistence: the `useDensity` React hook in `@ds/core/react/useDensity` mirrors `useTheme` — three values, `localStorage` key `ds-density`, `cycle()` rotates between them. Call `initDensity()` once at app boot before React renders to avoid a flash of the wrong density.

## Layout & Spacing

The spacing scale is a 4-point grid with one exception: `space-2` is 6px rather than 8px, giving a finer gap option for tightly packed inline elements (button icon gaps, chip stacks, topbar action clusters).

The primary layout shell is a CSS grid with a **44px topbar** spanning the full width, below which a **52px icon-only nav rail** flanks the main content area. The nav rail is narrow by design — it fits exactly one icon per destination, with no text labels. Users who need orientation look at the breadcrumb stripe (40px) at the top of the content pane, not the rail.

Content is padded at `16px` on all sides. The canonical two-column layout splits at approximately 44% / 56% (`minmax(280px, 0.9fr)` / `minmax(0, 1.1fr)`), giving the detail or form panel slightly more room than the list or summary panel.

The **detail panel** slides in from the right at 420px fixed width, sitting 44px below the topbar to avoid occluding the nav. The same width is used for modals. This consistency means the eye knows the "focused view" width before it appears.

## Elevation & Depth

This design system uses **tonal layering** rather than aggressive shadows. The four surface tiers create depth through hue difference alone — no shadow is needed to separate a panel from its page background in most contexts.

Shadows appear only at floating layers:

- **shadow-1** — 1px lift: applied to cards in special cases, never to flat panels
- **shadow-2** — 12px diffuse: dropdowns, combobox menus, modals
- **shadow-3** — upward 12px diffuse: bottom-anchored drawers and toasts

Shadow opacity is intentionally low in light mode (6–8%) because the tonal surface layers already provide context. In dark mode opacity rises to 40–50% since the surfaces are close in tone and the shadow must do more work.

Modals use a scrim of `rgba(0, 0, 0, 0.30)` with a 4px backdrop blur. The blur is light — enough to visually anchor the modal without creating a heavy curtain effect.

## Shapes

The radius scale is tight — `sm: 6px`, `md: 8px`, `lg: 10px`. There are no very-round cards or hero-radius components inside the product UI. The reasoning: a GRC platform handles regulated data; sharp-but-not-harsh corners signal precision. The pill radius (`9999px`) is reserved for chips and identity avatars only.

- **Buttons and inputs** — `sm` (6px): keeps interactive controls crisp and grid-aligned
- **Record rows and combobox options** — `md` (8px): slightly softer for list items that need to feel selectable without dominating
- **Panels, modals, detail panels, and the app shell** — `lg` (10px): the largest surfaces use the largest radius; the increment from `md` is subtle but prevents the UI from looking rectangular
- **Chips and identity badges** — `pill`: the only place where full-round corners appear, used specifically to distinguish non-interactive labels from interactive controls at a glance

## Components

Every selector below is defined in `@ds/core/primitives/primitives.css`. Consumers should use these class names directly rather than hand-rolling equivalents. If an app needs a capability the primitive lacks, promote the capability into `@ds/core` first, then consume it.

### Shell variants

Two canonical top-level layouts. Pick one per product; do not mix.

- **Horizontal topbar shell** (`.cc-shell`) — `44px topbar / 1fr` grid row, `52px navrail / 1fr` grid column inside. The topbar is a thin persistent band at the top; the navrail is icon-only on the left. Used by CompanyCo. Good for dense admin platforms with a global keyboard-shortcut hint, brand wordmark, and identity avatar living in the topbar.
- **Sidebar-first shell** — no persistent top band on desktop; a 72px `.cc-sidebar` on the left holds the logo + icon-only nav + footer controls. On mobile, `.cc-topbar--mobile` appears (hamburger + wordmark) with `.cc-topbar--mobile__spacer` reserving the height in the main content. Used by recruitment-woody. Good for product interiors where a topbar would be dead space.

### Topbar

`.cc-topbar` is the horizontal-shell's top band. Children: `.cc-topbar__brand` (wordmark, left), `.cc-topbar__kbd` (keyboard hint, center-right, with nested `<kbd>` pills), `.cc-topbar__actions` (right icons + `.cc-identity`).

`.cc-topbar--mobile` is the mobile-only hamburger band used by the sidebar-first shell. Pads for `env(safe-area-inset-top)` on iOS; pair with `.cc-topbar--mobile__spacer` in the main content to reserve layout height. Hidden above the `md` breakpoint.

### Navigation rail

`.cc-navrail` — 52px icon-only left rail for the horizontal shell. Children: `.cc-navrail__group` (36px square with accent fill, weight-700 label, used as a section badge), `.cc-navrail__divider` (80% width hairline), `.cc-navrail__icon` (38px square button with hover + active state; active uses `accent-soft` fill + `accent-border` + `accent-text`).

### Sidebar

`.cc-sidebar` — 72px desktop left nav for the sidebar-first shell. Children: `.cc-sidebar__nav` (scrollable nav column), `.cc-sidebar__icon` (44px square icon button, hover + active states mirror `.cc-navrail__icon`), `.cc-sidebar__footer` (`margin-top: auto`, holds identity + controls). Hidden below `md`. The wider 72px (vs 52px navrail) accommodates small app logos and dual icon+text labels on mobile drawer variants.

### Drawer

`.cc-drawer` + `.cc-drawer-scrim` — mobile left slide-in drawer paired with `.cc-topbar--mobile`. Toggle via an `.is-open` class on both elements. Transitions over `duration-slow`. Pads for both top and bottom safe-area insets. Hidden above `md`.

### Breadcrumbs

`.cc-crumbs` — 40px hairline-bordered strip above the main content. Items are rendered inline with `.cc-crumbs__sep` dividers (typically `/` or `›` in `text-4` color). The last item uses `.cc-crumbs__last` (weight-500, `text-1`) to signal "you are here." One breadcrumb strip per page. Used with the horizontal shell; the sidebar-first shell does not use breadcrumbs on desktop.

### Content structure

`.cc-main` — grid with `40px` breadcrumb row + `1fr` content row. Wraps the breadcrumbs + content pane inside a shell.
`.cc-content` — scrollable padded pane inside `.cc-main`. Default padding is `space-5`.
`.cc-workspace` — 52px navrail + `1fr` content grid, used between the topbar and the main content in the horizontal shell.

### Page header and page shell

`.cc-page-header` — the one-and-only top-of-page heading block for a primary view. `.cc-page-header__title` is an h1-sized heading (24px / weight 600 / line-height 32px / letter-spacing -0.02em) that may contain inline icons; `.cc-page-header__actions` is a right-aligned flex cluster for primary CTAs. Default `margin-bottom: space-5`; add `.cc-page-header--flush` when the page handles its own spacing. Exactly one per page — subheadings below use `.cc-section-header`.

`.cc-page-shell` — standard page padding container. `space-5` on mobile, `space-6` from `md` up. Wrap the page's content inside `.cc-page-shell` so every route starts at consistent horizontal insets.

### Section header and panel header

`.cc-section-header` — used inside panels/cards to title a grouping of related content. `.cc-section-header__copy` holds the h2 (18px weight 600) and optional secondary description; `.cc-section-header__actions` is the right-aligned cluster. Section headers do not sit at page level — that's `.cc-page-header`.

`.cc-panel-header` — condensed header inside a `.cc-panel` or `.cc-card`. Uses h3 (16px weight 600) and a smaller description. `.cc-panel-header-row` lays out heading + actions horizontally.

### Buttons

Four variants — primary, secondary, ghost, danger — sharing `min-height: 36px`, `border-radius: sm` (6px), weight 500. The primary button carries the brand accent as its background; secondary and ghost use surface/transparent backgrounds with `border-1` borders (ghost drops the border entirely). Danger replaces the accent with the error color.

Modifiers: `--sm` (28px, for dense row actions), `--icon` (36×36 square, toolbar icon buttons). States: hover is a one-step tonal shift; focus adds a 2px `accent-ring`; disabled is 50% opacity.

### Chips

Non-interactive status labels and filter tags. Pill radius, 24px min-height, 12px font weight 500. Neutral chips use `surface-2` + `border-1`; semantic variants swap in the matching status fill/border/text triple:

- `--accent / --success / --warning / --info / --danger`
- `--phase-screen / --phase-allocate / --phase-score / --phase-approve / --phase-complete` (workflow state)

Never use chips for interactive affordances — that role belongs to buttons. Use `.cc-chip-stack` as a flex-wrap gap container for groups of chips.

### Record rows

`.cc-record-row` is the primary interactive list primitive. Full-width button-like element with `radius-md`, a 1px border, and a background transition. Default state is `surface-0`; hover lifts to `surface-1`; `.is-selected` applies `accent-soft` fill + `accent-border`. Inside, `.cc-record-main` is a left-aligned grid with bold name + `text-3` secondary detail; chips or action clusters go on the right via `justify-content: space-between`.

`.cc-record-card` is the **stacked variant** of `cc-record-row`. Same border, hover, and selection semantics — but `display: grid` with `space-2` gap instead of a single horizontal flex row. Use when each list item carries multi-line content (name row, then meta row, then chips row) that doesn't fit cleanly into a single line. Selection works via either `.is-selected` or `[aria-current="page"]` so it composes naturally with `<Link>` and `<button>` elements.

Wrap rows or cards in `.cc-record-list` to get consistent `space-2` gap between items.

### Forms

`.cc-field` is a grid container with a `space-1` gap between label and control. `.cc-field__label` is `text-xs` weight 500 in `text-3`; `.cc-field__required` is a small error-colored asterisk. Inputs (`input`, `select`, standalone `.cc-input`) share `min-height: 36px`, `radius-sm`, `border-1` border, `text-base` font, focus state with accent border + 2px ring. `.cc-field__hint` is a `text-3` helper below the control; `.cc-field__error` is `error`-colored and weight 500.

`.cc-field--inline` uses a fixed 120px label column alongside the control for horizontal key-value forms. `.cc-field--error` decorates the container to paint input borders and backgrounds in the error tone.

`.cc-form-section` is a `.cc-panel`-like container that groups related fields with a consistent space-4 gap inside.

### Combobox

`.cc-combobox` is a positioned wrapper. `.cc-combobox__menu` floats 4px below the trigger with `shadow-2`, `radius-md`, 240px max-height, internal `4px` padding. `.cc-combobox__option` is a 36px-ish row with `radius-sm` and an `accent-soft` hover/selected state. `.cc-combobox__empty` shows the no-matches message in `text-3` at body size.

### Tabs

`.cc-tabs` is a horizontal row with a shared bottom border; `.cc-tab` items have transparent backgrounds, a 2px bottom-border active indicator, and transition on color only. `.is-active` uses `accent-text` color + accent bottom-border, which reads comfortably in both themes without needing a background fill.

### Tables

`.cc-table` uses `border-collapse: collapse`. Headers are the eyebrow treatment (uppercase, 12px weight 600, letter-spacing 0.06em, `text-4`). Body cells are 14px `text-2`; emphasized values wrap in `<strong>` to get `text-1` + weight 500. Row hover transitions to `surface-1`; `.is-selected` rows use `accent-soft`.

### Detail panel

`.cc-detail` is the canonical right-aligned slide-in panel. 420px wide, `surface-0` background, `border-1` left border, sits 44px below the horizontal-shell topbar. Transitions from `translateX(40px)`+`opacity: 0` to in-position over `duration-med`. Toggle with an `.is-open` class.

For consumers that need a resizable detail panel (user-drag left edge) and mobile-fullscreen behavior, extend with `.cc-detail--resizable`. The consumer provides the React state and sets the width via inline style; the primitive supplies `.cc-detail__resize-handle` (12px column on the left edge, accent-tinted on hover / `.is-resizing`) and collapses the panel to 100% width below 640px. Structural children: `.cc-detail__header` (h2 + close), `.cc-detail__body` (scrollable), `.cc-detail__footer` (optional).

### Modals

`.cc-modal` is `surface-0`, `radius-lg`, `space-6` padding, `min-width: 420px`, `shadow-2`. Wrap in `.cc-scrim` for the backdrop (rgba(0,0,0,0.3) + 4px backdrop blur). Modals are centered via `place-items: center` on the scrim.

### Empty states

Two variants:

- **Inline** (`.cc-empty`) — a `surface-1`-filled dashed-border box with text. Used inline where a panel or table would otherwise be blank and the user can take action via surrounding controls. Minimal; no icon, no CTA.
- **Hero** (`.cc-empty--hero`) — center-stage empty with an icon chip (`.cc-empty__icon`, 56×56 bordered square with `shadow-1`), an 18px title (`.cc-empty__title`), a muted description (`.cc-empty__description`), and an action cluster (`.cc-empty__actions`). Used when the empty state is the primary message of the viewport.

Pick hero when the user just completed onboarding or a filter-to-empty. Pick inline when blank is the expected resting state for an optional section.

### Toast + Undo

`.cc-toast-stack` is the fixed bottom-right queue of transient `.cc-toast` cards. Each toast has:

- `.cc-toast__copy` — primary message (e.g. "Resolved alert AB12 (allow)")
- `.cc-toast__action` — accent-coloured inline button, typically "Undo"
- `.cc-toast__progress` — 2px hairline at the bottom that drains over the dismiss window

Tones via `--success`, `--error`, `--warning` modifiers shift the border colour and the progress hairline. Enter / leave animations slide up + fade.

Pair with the `useUndoStack` + `UndoToaster` pieces in `apps/frontend` for Linear-grade optimistic mutations: `useOptimisticMutation` wraps a TanStack Query mutation, applies the optimistic patch synchronously to listed query keys, and queues the durable commit behind a 5-second undo lever. Roll-back fires on Undo or commit failure.

### Bulk action bar

`.cc-bulk-bar` is a sticky bottom-centre pill that animates in when ≥1 row is selected. Slots:

- `.cc-bulk-bar__count` — bold count + noun ("3 alerts selected")
- `.cc-bulk-bar__actions` — flex cluster of action buttons (consumers compose `Button` instances)
- `.cc-bulk-bar__divider` — 1px hairline between slots
- Trailing close × clears the selection

Multi-selection styling: `.is-multi-selected` on `cc-record-row`, `cc-record-card`, or `cc-table` row applies the same `accent-soft` fill as single-selection, but tagged distinctly so operators see they have a working set in flight. The `cc-table__select` cell utility is the slim 28px leading column for checkboxes.

Use the `useBulkSelection<T>(rows, getId)` hook in `apps/frontend` for the state machine: shift-click range select, indeterminate parent checkbox, auto-drop of stale ids when the row set refreshes.

### Background tasks

`.cc-tasks-list` + `.cc-task` render a vertical list of in-flight and recently-finished background tasks (training runs, exports, regulatory submissions). Each task:

- `.cc-task__title` — primary label + optional muted hint
- `.cc-task__time` — mono relative time
- `.cc-task__status` — leading dot + state label
- `.cc-task__link` — accent-coloured "Open" link to the result, shown only after completion

State modifiers `--running` (pulsing accent dot), `--queued` (warning), `--success` (success), `--failed` (error). Auto-divider between rows.

Pair with the `tasksStore` module (`startTask` / `updateTask` / `finishTask` / `clearFinishedTasks` / `useTasks`) and the `TasksTray` component in `apps/frontend`. The tray sits next to `NotificationsTray` in the topbar via `cc-icon-button` + `cc-count-badge`; long-running ops kicked off from any route surface here so the user can navigate away without losing the in-flight work.

### Filter bar + saved views

`.cc-filter-bar` is the row that sits above a list, surfacing the active filter state as accent-soft chips with × removers. Slots:

- `__label` — small uppercase tracker ("Filters")
- `__chip` + `__chip-remove` — one chip per active filter
- `__spacer` — pushes trailing content (typically a "Save view" button) to the right edge

Use the `FilterBar` component in `@aa/ui` plus the `useSavedViews(surface)` hook in `apps/frontend`. The hook talks to `/v1/platform/views` (CRUD on the `saved_views` table); each saved view stores filter / sort / shared as JSONB. The pattern is per-surface: `risk.alerts`, `quality.reviews`, `regulatory.filings` each have their own namespace of personal + shared views.

### Global search

`/v1/platform/search?q=&types=&limit=` is a fan-out aggregator across domain `SearchProvider` beans. Each bean returns `SearchHit` rows (`type / id / title / subtitle / href / score`); the service merges, sorts by score, and caps. Adding a new searchable domain is one bean.

The `GlobalSearch` component (`⌘/` hotkey) reuses `cc-palette` + `cc-modal` + `cc-scrim`. Results group by `type` with type-specific icons; selecting a hit navigates to its `href`. Distinct from `cc-palette` / `CommandPalette` (`⌘K`): cmd-K is route + action navigation; cmd-/ is cross-domain content search.

### Auth screen

`.cc-auth` is the standardized login / sign-in layout shared across every frontend app. **Dark by default** — the auth surface reads as a deliberate "door" before the functional UI begins. The React `AuthScreen` component sets `data-theme="dark"` on the document root while mounted; all token cascades flip to their dark-mode values automatically.

**Engagement layer.** The bare layout is centered card-on-surface, but the surface itself carries:

- Two soft accent-coloured radial glows (top-left and bottom-right of the viewport, blurred 80px) that visually anchor the centered column without competing with the form.
- An optional 32px grid texture overlay (`.cc-auth__grid`) at very low opacity, masked with a radial gradient so it fades toward the edges. Reads as engineering-mono atmosphere, not as a chart.
- A short fade-in / 8px-translate-up enter animation on the inner column.

The intent is "operator console at 2 AM" rather than "marketing splash" — atmosphere from primitives, not from imagery.

**Shape:** full-viewport vertical + horizontal center. 420px max-width column. Optional eyebrow tracker, headline (with optional accent emphasis), subtitle, form card, optional footer links, optional status row.

**Structural slots:**
- `.cc-auth` — outer full-viewport flex container; `surface-0` background. Owns the radial-glow `::before` / `::after` layers.
- `.cc-auth__grid` — aria-hidden grid texture overlay (sibling of `.cc-auth__inner`).
- `.cc-auth__inner` — 420px-max column with the enter animation.
- `.cc-auth__brand` — centered wordmark block above the form.
- `.cc-auth__eyebrow` — optional small mono-uppercase pill in accent-soft for product family / context (e.g. "Ops · Automation"). Renders as a chip above the headline.
- `.cc-auth__headline` — the product wordmark, `text-3xl` / 600 / `text-1` color, tighter letter-spacing.
- `.cc-auth__headline-accent` — optional accent-coloured emphasis word inside the headline (e.g. "Automation **Armoury**" with the second word in `--accent-1`).
- `.cc-auth__subtitle` — one-liner under the wordmark in `text-3`.
- `.cc-auth__footer` — centered small-text link row below the form card.
- `.cc-auth__footer-link` — muted link that shifts to `accent-1` on hover.
- `.cc-auth__error` — inline validation / session error copy in `error`.
- `.cc-auth__status` — optional mono "ground-truth" row below the form ("All systems nominal", build identifier, etc.). Renders with a small green dot prefix (`::before`) — the AA brand's ops-platform tell.

**Form container:** wrap the form in `.cc-panel` (or the richer `.cc-card`) for the card surround. Form fields use the standard `.cc-field` / `.cc-input` / `.cc-btn--primary` primitives — they pick up dark-mode tokens automatically.

**No editorial token dependency.** Any brand (including `recruitment`) can render `.cc-auth` without needing `--ink-0` / `--paper` / `--amber-*` / `--font-brand`. The headline picks up whatever `--accent-1` is for that brand. The mono-tracker eyebrow uses the body `--font-mono` stack only.

**Opting out of dark.** Pass `forceTheme="light"` (or `null` to inherit the page theme) to the React `AuthScreen` component. The CSS itself is theme-agnostic — both glow colours and grid texture work in light surfaces too — but dark is the defacto identity for the "door".

### Loading state

`.cc-loading-screen` — full-height centered placeholder for initial route loads. `.cc-spinner` — 20px accent-colored circular spinner with 800ms linear rotation. Use the spinner inside buttons (`.cc-btn` with `.cc-spinner` replacing the label) or empty cells, and the loading-screen for full-page initial fetches.

### Identity avatar

`.cc-identity` — circle (pill radius) with accent fill, white initials. Three sizes: `--sm` (24px / 10px text), `--md` (28px / text-xs) default, `--lg` (36px / text-base). Consumers that want hash-based background colors (instead of accent) should keep that logic in their React layer — the primitive is a shape + size + typography host.

### Typography primitives

`.cc-eyebrow` — 11.2px uppercase weight-500 label with letter-spacing 0.08em in `text-4`. Use for section eyebrows and cluster labels above a row of controls; avoids the need for arbitrary `text-[11px]` / `tracking-[0.22em]` compositions.

`.cc-dense-copy` — `.cc-section-header`-style spacing for dense description blocks. `.cc-inline-message` / `.cc-status-copy` — muted inline prose (margin-0, `text-3`, body size) for narrative status text between components.

The `t-*` semantic typography classes (defined in `tokens/type-scale.css`) are siblings: `t-h1` / `t-h2` / `t-h3` / `t-body` / `t-secondary` / `t-caption` / `t-label` / `t-mono` / `t-micro` / `t-eyebrow` / `t-strong`. Use these when you need to apply the typography tier directly to a non-canonical element (e.g. a `<small>` rendered as a label, a `<span>` styled as an eyebrow).

### Text utilities

Inline text utilities for cases where adding a semantic typography class would over-specify:

- **`.cc-text-muted`** — `text-3` colour. Pair with a parent that already sets the size when you only need the colour shift; use `t-caption` (12px text-3) when you need both size and colour.
- **`.cc-text-error`** — error-coloured copy.
- **`.cc-text-eyebrow`** — uppercase 12px tracker with text-3 colour and zero margin.
- **`.cc-text-center`** / **`.cc-text-right`** — text alignment.
- **`.cc-num`** — `font-variant-numeric: tabular-nums`. Use for any column of numeric values (counts, percentages, durations) so digits align vertically.
- **`.cc-wrap`** — `white-space: pre-wrap`. For `<pre>` and error message blocks where the source text controls line breaks.
- **`.cc-capitalize`** — capitalises the first letter, for enum-style strings rendered inline.
- **`.cc-link`** — accent-coloured anchor with no underline by default, underline on hover. For in-flow text links (table cells, list items).

### Layout utilities

- **`.cc-flex-grow`** — `flex: 1`. Spacer in horizontal flex containers (typical use: pushing the trailing item to the end in a `cc-row` or a `NavRail`).
- **`.cc-divider`** — 1px top border in `border-1`. Use to separate logical groups inside a panel or menu.
- **`.cc-sr-only`** — visually-hidden but accessible. Standard screen-reader-only utility.

### Form sub-utilities

- **`.cc-fieldset`** — strips browser fieldset chrome (border, padding, margin) so radio / checkbox groups can be wrapped in `<fieldset>` for accessibility without the visible box. Pair with a `t-label` or `t-strong` legend.
- **`.cc-list--bare`** — strips `<ul>`/`<ol>` markers and resets margin/padding to zero. Pair with `cc-stack` for vertical spacing.
- **`.cc-list--compact`** — `<ul>` variant with `space-2` row padding and a hairline divider between rows. For notification trays and dense in-popover lists.
- **`.cc-scroll-box`** — bordered scrollable container (max-height `--scroll-max`, default 240px). For long checkbox lists, log tails, audit feeds.
- **`.cc-table-wrap`** — `overflow-x: auto` wrapper for tables that may overflow narrow viewports.

### Card variants

`cc-card` (defined in the card section earlier) carries three modifiers worth highlighting:

- **`.cc-card--sm`** — denser variant (`space-3` padding, `radius-md`, no shadow). For dense list cards.
- **`.cc-card--flat`** — borderless transparent variant. For sidebar lists where spacing alone separates items.
- **`.cc-card--linklike`** — strips anchor chrome (underline, blue colour) so a card wrapped in `<a>` keeps its surface treatment. Largely superseded by `.cc-record-card` for clickable list cards, but useful in standalone link-as-card cases.
- **`.cc-card--selectable`** — adds `accent-soft` fill + `accent-border` when the card has `[aria-current="page"]` or `.is-selected`. Consider `cc-record-card` first for dedicated list pickers.
- **`.cc-card--accent`** — accent-soft background with `accent-border`. For the "current node" highlight in a flow map.
- **`.cc-card--dashed`** — dashed border on `surface-2`. For "floating" or aspirational panels (golden-dataset summary, future-state placeholders).

### Panel-header layout

`.cc-panel__header` is the spec'd flex layout for the header strip inside `cc-panel` (title cluster on the left, actions on the right, `align-items: flex-start`, `space-3` gap). The `Panel` component in `@aa/ui` applies it automatically when `title`, `description`, or `actions` props are passed.

### Legend swatches

`.cc-legend-swatch` + `--metric` / `--deploy` / `--violation` — small (12×2px or 2×12px) coloured indicators for chart legends. Used by `MonitoringTimeline`'s legend row.

### Payload preview

`.cc-payload-preview` — 12px mono-friendly block for JSON previews, API payload samples, code snippets. `surface-1` fill + `border-1` border + `radius-md` + `space-4` padding. Use inside a panel, not as a standalone surface. The alias `.cc-codeblock` resolves to the same selector for places that prefer the generic name.

### Inline status surfaces

A small family of "narrative box" primitives for messages embedded inside a panel:

- **`.cc-banner`** — neutral status banner (`surface-2` fill, `text-3` copy, `space-2 space-3` padding, `radius-md`). Pair with `--error` / `--warning` / `--success` tone modifiers when the banner conveys validation state. Use for non-blocking inline feedback ("Alert resolved", separation-of-duties warnings, "Submitted for review").
- **`.cc-callout`** — pull-quote / read-aloud surface (`surface-2`, italic body in `text-2`, `radius-md`, `space-3` padding). Use for narrative summaries (the "read aloud" panel on alert detail, calibration prose).
- **`.cc-pill`** — rounded inline tag (`pill` radius, `space-2 space-3` padding, `surface-0`, `border-1`, `text-sm`). Decorative node label in flow maps and "Prod v3" version stamps. Distinct from `cc-chip`: chips carry status semantics and a fixed font-size; pills are decorative.
- **`.cc-dot`** — 8px coloured circle for inline indicators. Tone modifiers: `--success` / `--warning` / `--error` / `--info` / `--neutral`, or set `--dot-color` directly.

### Progress

`.cc-progress` — track + filled bar pair. Renders as either:
- An SVG: `<svg class="cc-progress"><rect class="cc-progress__bar" width={pct} ...></svg>` — width comes from the rect's data attribute (no inline style).
- Or a div pair: `<div class="cc-progress"><div class="cc-progress__bar"></div></div>` — width is read from `--progress` set on the wrapper.

Either way the consumer never inlines styling; only the data flows through.

### Timeline

`.cc-timeline` is a vertical `<ol>` with a left rail and dot markers per row. Children are oldest-first (consumer order). Each `<li>` gets a `12px` accent-coloured dot rendered via `::before`, and `space-3` vertical padding with `space-5` left padding to clear the rail.

### Chart primitives

Hand-rolled SVG charts compose stroke / fill / font-size from these classes; consumers compute geometry only:

- **`.cc-chart-axis`** — axis lines (`border-1` stroke, 1px width).
- **`.cc-chart-grid`** — grid lines (`border-1` stroke with `3 3` dash, 1px width).
- **`.cc-chart-axis-text`** — axis labels (`text-3` fill, `--text-micro` size).
- **`.cc-chart-line`** — plot line (`accent-1` stroke, 2px width).
- **`.cc-chart-point`** / `--violation` — data point fill (`accent-1` or `error`).
- **`.cc-chart-marker--deploy`** — vertical deploy marker (`accent-1` stroke, `3 3` dash).
- **`.cc-chart-marker--violation`** — vertical violation marker (`error` at 25% opacity).

### Sparklines

`.cc-spark` is a token-driven SVG inline micro-chart for embedding next to text — chips, table cells, record-rows, panel headers. Three sizes (`cc-spark--sm` 56×14 / default 80×20 / `cc-spark--lg` 120×28) and five tones on each of `__line`, `__area`, and `__dot` (default accent + `--success` / `--warning` / `--error` / `--muted`). The DS owns stroke weight (1.5px), area fill opacity (0.12), line cap/join (round), and default sizing.

Use the `Sparkline` React helper in `@aa/ui` to skip computing path strings: pass a numeric array, get an SVG. Geometry comes from the values; styling comes from the primitive. Consumers can override any of `tone`, `size`, `showArea`, `showLastDot`, `ariaLabel`.

### Diff

`.cc-diff` is a token-driven side-by-side or unified diff view for short payloads (model version JSON, rule defs, governance summaries, regulatory templates). The header row carries the comparison title and an add/remove count badge (`+12 −4`). The body is a grid of `cc-diff__line`s with three modifiers — `--add`, `--remove`, `--context` — each using `success-soft` / `error-soft` colour-mixes against the surface so additions and deletions read at a glance without overwhelming the eye. Two structural columns per line: `cc-diff__lineno` (right-aligned line numbers in `text-4`) and `cc-diff__sigil` (the `+` / `−` glyph in the matching tone).

Mode switches via `cc-diff--split` (two side-by-side `cc-diff__pane`s) vs the default unified single column. Use the `Diff` React component in `@aa/ui` to skip writing the rendering loop, and the `diffLines(before, after)` helper for a small LCS implementation suitable for short payloads.

### Activity ribbon

`.cc-activity` is a thin (28px) band rendered between breadcrumbs and content. It surfaces platform liveness in the operator's peripheral vision — chips type in when matching events land, hold briefly, then fade. Uses the runtime-* token family from the AA brand palette directly:

- `cc-activity__chip--running` — accent-soft (active processes / planner decisions)
- `cc-activity__chip--queued` — warning-soft (waiting / scheduled / queued)
- `cc-activity__chip--success` — success-soft (completed / resolved)
- `cc-activity__chip--failed` — error-soft (failed / errored)
- default — neutral chip for info-class events

A leading `cc-activity__label.is-live` carries the pulsing live-indicator dot (cc-activity-pulse keyframe, 2s ease-in-out). Chip enter/leave use slide-down + fade and slide-up + fade respectively (`duration-slow` / `duration-med`).

Use the `ActivityRibbon` React component in `@aa/ui` for the visual host. The data subscription is the consumer's responsibility — `useActivityFeed` in `apps/frontend` polls existing event endpoints and maps event types to tones; replace with a Redis Streams SSE subscription when the gateway exposes one.

### Command palette

`.cc-palette` composes with `cc-scrim` + `cc-modal`. Three structural slots:

- **`cc-palette__search`** — search row at top with a leading `__search-icon` glyph and a `cc-bare-input`.
- **`cc-palette__results`** — scrollable grouped result list. Groups (`cc-palette__group` + `__group-label`) bucket results — typically Recent, Go to (routes), Actions.
- **`cc-palette__footer`** — mono shortcut row showing `↑ ↓ navigate · ↵ select · esc close`. Renders inline `cc-palette__kbd` pills.

Items are buttons (`cc-palette__item`) with three slots: `__item-icon` (single-glyph leading), `__item-label` (primary copy), `__item-hint` (right-aligned secondary). The active item gets `accent-soft` fill via `.is-active`; mouse hover mirrors keyboard selection via the same class.

Use the `CommandPalette` component in `apps/frontend/src/components` plus its `paletteActions` registry: `registerPaletteActions([...])` exposes commands from any route (returns an unregister callback for cleanup). `paletteRoutes.ts` ships a default set of route-navigation commands so cmd-K is useful from day one. Recent selections persist to `localStorage` and surface as the top group when the palette opens with no query.

### Menus, popovers, and modals

A small floating-surface family:

- **`.cc-menu-anchor`** — a positioned wrapper for a button + menu pair (e.g. `AppSwitcher`, identity dropdown).
- **`.cc-menu-toggle`** — the toggle button (caret-clad, `radius-sm`, `surface-0`, `border-1`).
- **`.cc-menu`** — the popped surface (`absolute`, `surface-0`, `radius-sm`, `shadow-1`, 200px min-width). Lives anchored to its `cc-menu-anchor`. The variant `cc-menu--fixed-top-right` switches to `position: fixed` for header dropdowns.
- **`.cc-menu__item`** — option row (button or div). `aria-current="page"` applies the spec'd "current selection" treatment (weight-600, `surface-2` fill, `cursor: default`); other items get `accent-soft` on hover.
- **`.cc-popover`** — generic floating panel (`absolute`, `surface-0`, `border-1`, `radius-lg`, `shadow-2`). Position via `--top-right` / `--top-left` / `--bottom-right` modifiers; size via `--w-sm` (240px) / `--w-md` (340px / max-h 420px) / `--w-lg` (480px / max-h 560px).
- **`.cc-modal`** + **`.cc-scrim`** — see Modals section. The `--lg` modifier widens the modal to `min(820px, 92vw)` for richer content; `.cc-modal__body` adds `space-4` padding for the inner content area.
- **`.cc-icon-button`** — 36×36 square button with `radius-sm`, `surface-0`, `border-1`. For top-bar action triggers (notifications bell, search, command palette).
- **`.cc-count-badge`** — floating count badge anchored to a positioned parent (`top: -4; right: -4; min-width: 16; height: 16`). Tone modifiers: `--error`, `--info`, default warning.
- **`.cc-fixed--top-right`** / **`--top-left`** — fixed-position wrappers for header trays.
- **`.cc-bare-button`** / **`.cc-bare-input`** — chrome-stripped button and input for inline icon actions and palette search inputs.

### Coming-soon placeholder

`.cc-coming-soon` — editorial placeholder for routes whose backend isn't wired yet. Renders inside a `cc-panel`. Children: `cc-coming-soon__eyebrow` (warning-toned uppercase label), `cc-coming-soon__title` (32px brand-serif headline), `cc-coming-soon__body` (muted body copy). Pair with a primary CTA linking to the PRD.

### Stack layouts

`.cc-stack-panel` / `.cc-stack-form` — grid with `space-4` gap, used to stack multiple panels or forms vertically inside a page. `.cc-workspace-view` wraps the top-level grid of a page (stacks `space-5` gaps with `align-content: start`). `.cc-workspace-grid-2` is the canonical 44%/56% two-column layout (`minmax(280px, 0.9fr) minmax(0, 1.1fr)`), giving the detail or form panel slightly more room than the list or summary panel.

### Generic flex / grid utilities

The named layouts above carry product semantics (workspace, page, panel-stack). For everything else — symmetric column pairs, three-up cards, auto-fit responsive grids, and inline clusters — use the unsemantic utility family:

- **`.cc-row`** — flex row, `justify-content: space-between`, `align-items: center`, `gap: space-3`. The most common page-internal pattern (title on left, controls on right). Modifiers: `--cluster` (left-aligned, drops space-between), `--tight` (space-2 gap), `--wrap` (flex-wrap), `--center` (center-justified), `--start` / `--baseline` / `--top` (vertical alignment).
- **`.cc-stack`** — vertical grid with configurable gap via `--stack-gap` (default `space-4`). Modifiers: `--tight` (space-2), `--loose` (space-5), `--divided` (top border + top padding on every child after the first).
- **`.cc-grid-2`** — symmetric 2-column responsive grid, collapses to 1 column under 720px. For form-pair layouts and side-by-side panels (use `cc-workspace-grid-2` when the split is the canonical 44/56 list+detail).
- **`.cc-grid-3`** — symmetric 3-column responsive grid, collapses to 2 columns under 960px and 1 under 600px.
- **`.cc-grid-auto`** — auto-fit responsive grid; override `--grid-min` to tune the minimum column width. Pre-set sizes: `--sm` (180px min), `--md` (220px min).
- **`.cc-grid-rail-content`** — asymmetric two-pane layout: a `minmax(280px, 380px)` left rail + a `minmax(0, 1fr)` right pane. Use when one column is always narrower than the other (sidebar list + main panel) and the canonical 44/56 split doesn't fit.
- **`.cc-grid-full`** — `grid-column: 1 / -1` modifier, span all columns inside any `cc-grid-*` parent.

### Adjustable split-pane

`.cc-split` is the in-flow alternative to overlay drawers. A two-pane grid (`var(--split-left, 60%)` left + `6px` handle + `1fr` right) where the user drags the handle to resize. Pair with the `useSplitPane` hook in `@aa/ui` to get drag-and-persist behaviour out of the box.

- `.cc-split__pane` — pane shell with `overflow: auto` and `min-height/min-width: 0` so flex/grid sizing works correctly.
- `.cc-split__pane--left` / `--right` — adds an inner padding gutter on the appropriate edge.
- `.cc-split__handle` — the drag affordance (6px column with a 1→2px hairline that brightens to `accent-1` on hover, focus, or active drag).
- `.cc-split--collapsed` — modifier when the right pane is empty: hides the handle and the right column, lets the left expand to full width.

Below 720px the panes stack vertically and the handle is hidden — touch users get a single-column view.

### Swimlane and lane

`.cc-swimlane` is a wrap-friendly horizontal flow (`display: flex; align-items: stretch; gap: space-2; flex-wrap: wrap`) for system-map and connection-map visualizations.

- `.cc-lane` — equal-flex bordered column inside the swimlane (`flex: 1; min-width: 220px`). Compose with `cc-card cc-card--sm cc-stack cc-stack--tight` for the standard lane card.
- `.cc-arrow` — visual flow connector between lanes (`text-3` color, `text-xl` size, padded for spacing).

## Motion

All transitions use `ease` (the CSS keyword — a subtle ease-in-out) rather than a custom cubic-bezier. The intent is for motion to be imperceptible as motion — it should reduce jarring state snaps without drawing attention to itself.

- **100ms (fast):** table row hover, chip hover — anything that tracks the cursor closely
- **120ms (base):** button states, input borders, surface tints — the standard interactive transition
- **150ms (med):** detail panel slide and fade, combobox menu appear — afforded a little more time because the element traverses space
- **200ms (slow):** theme transitions (background and text color on the body element) — long enough that a full-page color mode switch feels deliberate rather than abrupt

The spinner uses an 800ms linear rotation — slow enough to read as a calm loading state, not an anxious one.

### Utility animations

Three enter animations are exposed as utility classes so consumers don't rehardcode the keyframes or timing:

- **`.cc-anim-slide-in-right`** — `translateX(100%) → 0` over `duration-slow`. Used for right-side detail panels and drawers at initial render.
- **`.cc-anim-fade-in`** — `opacity 0 → 1` over `duration-med`. Used for menu and popover content.
- **`.cc-anim-fade-in-up`** — `opacity 0 → 1` + `translateY(8px → 0)` over `duration-slow`. Used for toast and banner appearances where a hint of motion matters.

All three resolve timing from the motion tokens and use the `ease` curve. Consumers should prefer these over adding project-local keyframes.

## Cross-cutting platform surfaces

These are the platform-level routes and primitives that don't belong to any single domain — they tie the product together.

### Workflow inbox (`/my-day`)

Single cross-domain backlog. The `/v1/platform/inbox` endpoint fans out to `InboxProvider` beans, each contributing rows in the common `InboxItem` shape (`type / id / title / subtitle / href / group / priority / updatedAt`). Three groups bucket the result: `ACTION_NEEDED`, `WAITING`, `RECENT`. Adding a new domain to the inbox is one bean.

The frontend `/my-day` route renders each group as a `Panel` with `cc-record-row` Links. The `useInbox` hook polls every 30s. Surfaces in cmd-K as the first route entry.

### Audit timeline (`/v1/platform/timeline/{resourceId}`)

Every record's complete narrative. The endpoint queries `aa_platform.audit_log` keyed on `resource_id`, ordered ts DESC, capped at 200. The `RecordTimeline` component (`apps/frontend`) renders entries inside a `cc-timeline` with actor chip, relative time, and a compact diff summary (up to 3 changed keys per entry). Pin it to the right of any detail panel via `cc-grid-rail-content`.

### Real-time event stream

`GET /v1/orchestration/instances/{id}/events:stream` is a Server-Sent Events feed of `ExecutionEvent` rows for one process instance. Implemented with `SseEmitter` polling the Postgres ledger every 500ms; auto-cancels on client disconnect.

The `useEventStream` hook (`apps/frontend`) subscribes via the browser's `EventSource` and exposes a 1000-row rolling buffer. The `LogPane` component renders it as a tail-style monospace view with sticky-bottom auto-follow that pauses on user scroll-up. Use anywhere a `tail -f` feel is appropriate.

### Promotion review queue

`promotion_reviews` is the maker-checker ledger: any service writes a review row instead of acting directly on a promotion, and a separate reviewer claims and decides. Service enforces `maker ≠ checker`. Endpoints under `/v1/platform/reviews` cover request / list / get / comment / decide.

The `/reviews` queue surfaces pending rows; `/reviews/$id` shows the before→after diff (using `Diff`), a comments thread, and Approve / Request changes controls that prompt for a reason. Decisions write `decided_at` + `decision_reason` + the reviewer subject.

Wire any service-side promotion path through this queue by replacing the direct mutation with a `PromotionReviewService.request(...)` call. Existing callers of the queue stay generic.

### Anomaly detector

A `@Scheduled` job walks every `AnomalySource` bean every 5 minutes, computes `|z|` against the supplied baseline mean + stddev, and writes a row into `platform_anomalies` when `|z| > 3`. A 60-minute debounce per metric prevents repeat firings for sustained anomalies. Each source returns `AnomalySample`s with `currentValue / baselineMean / baselineStddev / metric / surface / unit`; the seed `AlertVolumeAnomalySource` compares last-hour alert opens against the trailing 23-hour rolling per-category baseline.

The `AnomalyBanner` component mounts at the top of every authenticated page and surfaces up to 2 open anomalies as `cc-banner--warning` rows; the `/anomalies` route shows the full ledger with Acknowledge buttons. The detector runs background and is silent until the platform actually drifts.


