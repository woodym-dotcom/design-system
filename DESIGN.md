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

  # Brand: CompanyCo — indigo accent
  companyco-accent: "#4f46e5"
  companyco-accent-hover: "#4338ca"
  companyco-accent-soft: "#eef2ff"
  companyco-accent-border: "#c7d2fe"
  companyco-accent-text: "#4f46e5"
  companyco-accent-dark: "#818cf8"
  companyco-accent-dark-hover: "#a5b4fc"
  companyco-accent-dark-text: "#a5b4fc"

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

  # Brand: automationArmoury — cyan accent
  automation-accent: "#06b6d4"
  automation-accent-hover: "#0891b2"
  automation-accent-soft: "#ecfeff"
  automation-accent-border: "#a5f3fc"
  automation-accent-text: "#0e7490"
  automation-accent-dark: "#22d3ee"
  automation-accent-dark-hover: "#67e8f9"
  runtime-running: "#06b6d4"
  runtime-queued: "#f59e0b"
  runtime-success: "#16a34a"
  runtime-failed: "#dc2626"
  runtime-paused: "#6b7280"

  # Brand: recruitment-woody — terracotta accent
  recruitment-accent: "#c75b3a"
  recruitment-accent-hover: "#a74a2f"
  recruitment-accent-soft: "#fdf2ef"
  recruitment-accent-border: "#f5c7b8"
  recruitment-accent-text: "#883c26"
  recruitment-accent-dark: "#e8a48f"
  recruitment-accent-dark-hover: "#f5c7b8"

typography:
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

### Brand accents

Each product has one accent hue that drives all interactive UI: buttons, focus rings, active tabs, selected rows, chips, and the topbar identity badge. The accent has five derived slots:

- **accent** — the action color itself (button backgrounds, active indicators)
- **accent-hover** — one step darker for hover/pressed states
- **accent-soft** — a very light tint used for selected row fills and chip backgrounds
- **accent-border** — a mid-tone used for chip and selected-row borders
- **accent-text** — saturated mid-tone used for text on soft backgrounds (accessible on white)

Dark mode shifts the accent one step lighter along the hue ramp to maintain contrast on dark surfaces.

CompanyCo's indigo (`#4f46e5`) is chosen for institutional authority — the hue reads as trusted technology without the corporate sterility of pure blue. The terracotta and cyan brands signal their respective domains (human/warmth vs. machine/data) without compromising the shared structural language.

### Editorial surface — CompanyCo only

The auth and marketing layer of CompanyCo uses a fixed dark-ink-on-dark treatment that does not flip with the theme. It uses:

- **Ink** (`#0c0c0c`, `#1a1a1a`) — near-black background
- **Paper** (`#fafaf8`, `#f5f0eb`) — warm off-white for contrast text
- **Amber scale** — used for decorative accents and highlights in the editorial headline stack

This surface is always rendered dark regardless of OS preference. It gives the product a premium, intentional "door" before the functional UI begins.

### Status and viz colors

Status colors (error/success/warning/info) follow a three-slot pattern: the pure color for text/icons, a light tinted fill, and a mid-tone border. This avoids all-red or all-green surfaces that create visual alarm; instead the fill + border combination signals state at low energy.

Viz tokens cover two independent dimensions used in the compliance domain:
- **Service health** (healthy / warning / critical / unknown) — green/amber/red/slate
- **Severity** (low / medium / high / critical) — green through orange through red
- **Compliance tier** (core / domain / bespoke) — blue / purple / gray — used to visually classify obligation source

## Typography

### Font stacks

The product UI uses **Inter** universally across all three brands. It was chosen for its consistent metrics, excellent legibility at 13–14px, and neutral personality that doesn't compete with data.

CompanyCo's editorial/auth surface uses a layered stack:
- **Playfair Display** (serif) — headlines. Chosen for its editorial authority and the contrast it creates against the functional Inter-only product interior.
- **DM Sans** (geometric sans) — taglines and eyebrows within the editorial surface. Bridges the serif headline and the body copy with a friendly, modern feel.
- **JetBrains Mono** — code, JSON previews, payload displays, and any content where character-level precision matters.

### Scale

The type scale is deliberately compact. The base size is **14px** — a product density choice, not a readability compromise. The system runs smaller than consumer apps because the users are internal staff and operators working in data-heavy contexts, not casual readers.

- **Eyebrow** — 11.2px, uppercase, wide letter-spacing (0.08em), weight 500. Used for section labels, column headers, and category markers.
- **Label / Caption** — 12px. Labels are weight 500; captions are weight 400.
- **Body** — 14px weight 400. The workhorse for all prose, field values, and list copy.
- **H3 / Panel title** — 16px weight 600. In-panel headers and card titles.
- **H2 / Section title** — 18px weight 600, letter-spacing −0.02em. Page section headings.
- **H1 / View title** — 24px weight 600, letter-spacing −0.02em. One per page; reserved for the primary view heading.
- **Mono** — JetBrains Mono 13px. Code and structured data.

Table headers use the eyebrow treatment (uppercase, wide tracking, text-4 color) to subordinate them visually to the data rows.

Brand editorial sizes are significantly larger — the hero headline is `clamp(44.8px, 4.5vw, 64px)` — because they appear on dedicated full-screen surfaces, not inside the data product UI.

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

### App shell

The shell is a full-viewport CSS grid: `44px topbar / 1fr` row, `52px navrail / 1fr` column. Everything else fits inside the main content cell. The topbar holds the brand wordmark on the left, a keyboard shortcut hint in the center-right, and action icons + identity avatar on the right. The navrail holds group badges (square with brand accent fill) and icon buttons for each destination, separated by hairline dividers.

### Buttons

Four variants — primary, secondary, ghost, and danger — sharing the same geometry (`min-height: 36px`, `border-radius: 6px`, `font-weight: 500`). The primary button carries the brand accent as its background; all other variants use surface or transparent backgrounds with border-1 borders. Ghost drops the border entirely. Danger replaces the accent with the error color.

A `sm` modifier reduces height to 28px for dense table row actions. An `icon` modifier makes the button square (36×36px), used for toolbar icon buttons.

All interactive states (hover, focus, disabled) use the same pattern: hover is a one-step tonal shift; focus adds a 2px accent-colored ring; disabled is 50% opacity.

### Chips

Chips represent non-interactive status labels and filter tags. They always use the pill radius and a height of 24px. The neutral chip is `surface-2` with `border-1`; semantic variants (accent, success, warning, info, danger) swap in the matching status fill/border/text triple. They must never be used for interactive affordances — that role belongs to buttons.

### Record rows

The primary list primitive. A record row is a full-width interactive element with `border-radius: md`, a 1px border, and a transition on background. The default state is `surface-0`; hover lifts to `surface-1`; selected applies the accent soft fill and accent border. The row layout uses flex with `justify-content: space-between`, supporting a left-aligned main copy block (bold name + secondary detail) and a right-aligned chip or action cluster.

### Forms

Fields follow a grid layout with a `4px` gap between label and control. Labels are `text-xs` weight 500 in `text-3` color. Error messages appear below the control in `error` color. The inline variant uses a fixed 120px label column alongside the control for horizontal key-value forms.

### Combobox

A floating dropdown with a 4px gap below the trigger, 240px max height, and a 2px inner padding. Options use `border-radius: sm` and transition to `accent-soft` on hover or selection. An empty state renders the message in `text-3` at body size.

### Tabs

A horizontal row with a shared bottom border. Each tab has transparent background, bottom-border active indicator in the brand accent, and transition on color only. The active tab color matches `accent-text` so it reads comfortably on both light and dark surfaces without needing a background fill.

### Tables

Tables use `border-collapse: collapse`. Headers are the eyebrow treatment (uppercase, 12px, wide tracking, `text-4` color). Body cells are 14px `text-2`, with `text-1` weight-500 for emphasized values. Row hover transitions to `surface-1`; selected rows use the `accent-soft` fill.

### Detail panel & modals

Both the slide-in detail panel and centered modals share the 420px width. The detail panel enters from the right with a `translateX(40px)` → `translateX(0)` transition over 150ms. Modals use the scrim + `shadow-2`. Both are `surface-0` backgrounds with `radius-lg` corners.

## Motion

All transitions use `ease` (the CSS keyword — a subtle ease-in-out) rather than a custom cubic-bezier. The intent is for motion to be imperceptible as motion — it should reduce jarring state snaps without drawing attention to itself.

- **100ms (fast):** table row hover, chip hover — anything that tracks the cursor closely
- **120ms (base):** button states, input borders, surface tints — the standard interactive transition
- **150ms (med):** detail panel slide and fade, combobox menu appear — afforded a little more time because the element traverses space
- **200ms (slow):** theme transitions (background and text color on the body element) — long enough that a full-page color mode switch feels deliberate rather than abrupt

The spinner uses an 800ms linear rotation — slow enough to read as a calm loading state, not an anxious one.
