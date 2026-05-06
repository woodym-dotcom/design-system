> **Source of truth:** https://www.notion.so/Canonical-Entity-Surface-Patterns-358b63f3c7658120ae1afeeccbd7fd4d
> This file mirrors the Notion page. The Notion page wins on any divergence.

# Canonical Entity Surface Patterns

Every CC + AA entity surface follows these four axes.

## 1. Create primitive

**Canonical:** `EntityModal` + `CreationWizard`, hoisted above `ListPage` (never embedded in page body).

**Why:** Hoisting keeps the list surface clean and ensures wizard lifecycle is owned at the page level, not nested inside table markup.

**Anti-patterns:**
- `TopRightCreateWizard` inline in a route file
- `<Panel title="Create …">` embedded directly in page body
- `CreationWizard` inside a `<td>` or card body

## 2. Create placement

**Canonical:** `ListPage.createMenu` — a `<Button variant="primary">` inside `<div className="cc-list-view__toolbar">` triggers `setShowCreate(true)`. The aside (`cc-detail--pinned`) renders conditionally.

**Why:** Consistent toolbar placement means users always find Create in the same spot across modules. Keyboard shortcuts and guided tours can reliably target it.

**Anti-patterns:**
- Buttons in tab content, card bodies, or panel bodies that open a create form without routing through the toolbar
- Floating action buttons on entity detail views

## 3. Breadcrumb

**Canonical (multi-tab modules):** `ModuleShell` with `title`, `description`, and `tabs` props in the layout route file (e.g. `orchestration.tsx`, `decision.tsx`). Breadcrumbs assembled automatically by `__root.tsx` from the `CRUMB_LABELS` map + the URL path.

**Canonical (standalone gateway pages — Regulatory, Integration, Outreach):** `PageHeader` component + `__root.tsx` path-based breadcrumbs. `ModuleShell` is not used because there are no sub-tabs.

**Anti-patterns:**
- Manual breadcrumb construction in leaf route files
- Breadcrumb text outside `CRUMB_LABELS` in `__root.tsx`
- Hard-coded breadcrumb arrays in component props

## 4. Edit pattern

**Canonical:** Detail pane only. Row click opens an `<aside>` detail pane (or `ArtefactDetailPane`) showing the entity. All mutations happen inside the pane.

**Why:** Inline editing scatters mutation logic across rows, making optimistic updates, validation, and rollback difficult. The detail pane provides a single owned surface.

**Anti-patterns:**
- Inline edit affordances in list rows (inputs, `Field` components in `<td>`, save buttons per row)
- `isEditing` / `editMode` / `showEditForm` state in list components

## Enforcement

### ESLint rules (plugin: `@ds/core` — `eslint-plugin/index.js`)

| Rule | Detects |
|---|---|
| `no-inline-edit-pattern` | `isEditing`/`editMode`/`showEditForm`/`editOpen`/`inlineEdit` useState |
| `no-adhoc-create-button` | Bare `<button>` with Create/+/Add/New text outside DS wrapper |
| `no-card-entity-layout` | `cc-card`/`cc-card--sm` classNames in entity list feature code |

### Fitness tests

- **CC:** `frontend/src/routes/-entity-surface-consistency.test.tsx`
- **AA:** `apps/frontend/src/routes/-entity-surface-consistency.test.tsx`

Checks: no `TopRightCreateWizard` import in route files; all multi-tab modules use `ModuleShell` + `tabs`; create triggers have canonical `data-testid`; no `InlineEdit`/`data-inline-edit` patterns.

## Change log

- 2026-05-06 — Initial publication. Canonical content lives in Notion; this file is a mirror.
