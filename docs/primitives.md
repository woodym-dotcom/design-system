# Shell Primitives — @ds/core (Phase 2.1)

Four canonical UI primitives shipped in Phase 2.1. Each replaces an ad-hoc pattern that was causing layout divergence across AA, CC, and CL.

---

## ListView

**File:** `react/ListView.tsx`  
**Export:** `@ds/core/react`  
**CSS class root:** `cc-list-view`, `cc-table`

Table-based entity list. Use instead of card-based entity layouts.

```tsx
import { ListView } from '@ds/core/react';

const columns = [
  { key: 'name', label: 'Name', sortable: true, render: (r) => r.name },
  { key: 'status', label: 'Status', render: (r) => r.status },
];

<ListView
  columns={columns}
  rows={rows}
  heading="Vendors"
  subtitle="All suppliers"
  scopeFilters={[
    { id: 'all', label: 'All', count: rows.length },
    { id: 'active', label: 'Active', count: activeCount },
  ]}
  activeScopeId={activeScopeId}
  onScopeChange={setActiveScopeId}
  sortKey={sortKey}
  sortDirection={sortDir}
  onSort={(key, dir) => { setSortKey(key); setSortDir(dir); }}
  pagination={{ page, pageSize: 20, totalItems: total }}
  onPageChange={setPage}
  selectedId={selectedId}
  onRowClick={setSelectedId}
  createAction={<TopRightCreateWizard ... />}
/>
```

**Props:**
- `columns` — `ListViewColumn[]`: `{ key, label, sortable?, minWidth?, render }`.
- `rows` — data rows, each must have an `id: string` field.
- `heading`, `subtitle?` — header text.
- `scopeFilters?` / `activeScopeId?` / `onScopeChange?` — scope tabs (All / Active / Archived etc.).
- `sortKey?` / `sortDirection?` / `onSort?` — controlled sort state.
- `pagination?` / `onPageChange?` — `{ page, pageSize, totalItems }` for page-mode pagination.
- `paginationMode?` — `'pages'` (default) | `'infinite-scroll'`.
- `hasMore?` / `onLoadMore?` — infinite-scroll controls.
- `loading?` — shows 5 skeleton rows.
- `emptyState?` — rendered when rows is empty and not loading.
- `createAction?` — create button slot (top-right of header).
- `onRowClick?` / `selectedId?` — row selection.

**Anti-pattern replaced:** `cc-card cc-card--sm` in entity lists. Flagged by ESLint rule `@ds/core/no-card-entity-layout`.

---

## ExpandableDetailPane

**File:** `react/ExpandableDetailPane.tsx`  
**Export:** `@ds/core/react`  
**CSS class root:** `cc-expandable-pane`

Right-side detail pane with full-screen toggle and composable tab structure. Extends `DetailPane` with tabs and expand-to-full-screen.

```tsx
import { ExpandableDetailPane } from '@ds/core/react';

<ExpandableDetailPane
  open={selectedId !== null}
  onClose={() => setSelectedId(null)}
  title={vendor.name}
  subtitle={`Risk: ${vendor.riskLevel}`}
  tabs={[
    { id: 'overview', label: 'Overview', render: () => <OverviewTab vendor={vendor} /> },
    { id: 'controls', label: 'Controls', render: () => <ControlsTab vendor={vendor} /> },
    { id: 'history', label: 'History', render: () => <HistoryTab vendor={vendor} /> },
  ]}
  defaultTabId="overview"
  headerActions={<button className="cc-btn cc-btn--secondary cc-btn--sm">Edit</button>}
/>
```

**Props:**
- `open` / `onClose` — visibility.
- `title` / `subtitle?` — header text.
- `tabs` — `ExpandableDetailPaneTab[]`: `{ id, label, render }`. Tab bar hidden when only one tab.
- `defaultTabId?` — initial active tab (defaults to first tab).
- `headerActions?` — slot for action buttons in the header row.
- `allowFullScreen?` — show/hide the full-screen toggle (default `true`).

**Keyboard behaviour:**
- `Escape` — exit full-screen (if active), then close pane.
- `Tab` / `Shift+Tab` — focus-trapped within pane.
- `ArrowLeft` / `ArrowRight` / `Home` / `End` — tab navigation.

**Anti-pattern replaced:** `isEditing`, `editMode`, `showEditForm` state + conditional inline form renders. Flagged by ESLint rule `@ds/core/no-inline-edit-pattern`.

---

## TopRightCreateWizard

**File:** `react/TopRightCreateWizard.tsx`  
**Export:** `@ds/core/react`  
**CSS class root:** `cc-create-wizard-modal`, `cc-create-wizard-trigger`

Top-right Create button that opens a stepped wizard in a modal. Composes `CreationWizard` internally.

Two variants:
- `manual` (default) — standard multi-step form.
- `ai` — Phase 6.1 placeholder. The AA Orchestrator integration lands in Phase 6.1; no provider SDK is called from this primitive (workspace rule §18).

```tsx
import { TopRightCreateWizard } from '@ds/core/react';

// manual variant
<TopRightCreateWizard<VendorValues>
  triggerLabel="+ New vendor"
  modalTitle="New Vendor"
  wizard={{
    steps: [
      { id: 'basics', label: 'Basics', render: ({ values, setValues }) => <BasicsStep ... /> },
      { id: 'ownership', label: 'Ownership', render: ({ values, setValues }) => <OwnerStep ... /> },
    ],
    initialValues: { name: '', owner: '' },
    onSubmit: async (values) => myApi.createVendor(values),
  }}
  onComplete={() => refetch()}
/>

// ai variant
<TopRightCreateWizard<VendorValues>
  variant="ai"
  triggerLabel="+ AI-assisted"
  modalTitle="Generate with AI"
  wizard={{ steps: [], initialValues: {}, onSubmit: async () => {} }}
/>
```

**Props:**
- `variant?` — `'manual'` | `'ai'` (default `'manual'`).
- `triggerLabel?` — trigger button label (default `'Create'`).
- `modalTitle` — title shown in the modal header.
- `wizard` — all `CreationWizardProps` except `className`.
- `onComplete?` — called after wizard submits and modal closes.

**Keyboard behaviour:**
- `Escape` — close modal, focus returns to trigger.
- `Tab` / `Shift+Tab` — focus-trapped within modal.

**Anti-pattern replaced:** bare `<button>Create</button>` or `<button>+</button>` placements outside a DS wrapper. Flagged by ESLint rule `@ds/core/no-adhoc-create-button`.

---

## NavRail

**File:** `react/NavRail.tsx`  
**Export:** `@ds/core/react`  
**CSS class root:** `cc-text-navrail`

Text-label vertical navigation rail with single-select state. Phase 2.1 fixes the multi-select bug seen in AA: items that share a common path prefix (e.g. `/vendors` and `/vendors/risks`) no longer both activate when the pathname is `/vendors/risks/acme`. The **longest prefix match wins**.

```tsx
import { NavRail } from '@ds/core/react';

// Default — active state via pathname prefix match
<NavRail
  items={[
    { id: 'vendors', to: '/vendors', label: 'Vendors' },
    { id: 'risks', to: '/risks', label: 'Risks' },
    { id: 'controls', to: '/controls', label: 'Controls' },
  ]}
  currentPathname={window.location.pathname}
/>

// Router-integrated — swap <a> for your router's <Link>
<NavRail
  items={items}
  currentPathname={location.pathname}
  renderItem={({ item, isActive, className }) => (
    <Link to={item.to} className={className} aria-current={isActive ? 'page' : undefined}>
      {item.label}
    </Link>
  )}
/>
```

**Multi-select fix (Phase 2.1):**
When multiple items share a common prefix, the item whose `to` path is the longest match for `currentPathname` wins. Items that supply their own `isActive` boolean bypass this logic and are controlled independently.

**Props:**
- `items` — `NavRailItem[]`: `{ id, to, label, isActive? }`.
- `currentPathname?` — current URL pathname for default active detection.
- `renderItem?` — render-prop for router `<Link>` integration.
- `ariaLabel?` — accessible label for the `<nav>` element (default `'Modules'`).

---

## ESLint Guardrails

**Plugin:** `@ds/eslint-plugin` (see `eslint-plugin/`)

Three rules that enforce the shell primitive contracts across AA, CC, and CL:

| Rule | Severity | What it bans |
|------|----------|-------------|
| `@ds/core/no-card-entity-layout` | error | `cc-card` / `cc-card--sm` className in entity-list feature code |
| `@ds/core/no-inline-edit-pattern` | warn | `useState` with `isEditing` / `editMode` / `showEditForm` / `editOpen` / `inlineEdit` variable names |
| `@ds/core/no-adhoc-create-button` | warn | Bare `<button>+</button>` / `<button>Create</button>` outside `<CreateMenu>` or `<TopRightCreateWizard>` |

### Opt in (flat config)

```js
// eslint.config.js in AA, CC, or CL
import dsPlugin from '../design-system/eslint-plugin/index.js';

export default [
  {
    plugins: { '@ds/core': dsPlugin },
    rules: {
      '@ds/core/no-card-entity-layout': 'error',
      '@ds/core/no-inline-edit-pattern': 'warn',
      '@ds/core/no-adhoc-create-button': 'warn',
    },
  },
];
```

### Opt in (legacy .eslintrc)

```json
{
  "plugins": ["@ds/core"],
  "rules": {
    "@ds/core/no-card-entity-layout": "error",
    "@ds/core/no-inline-edit-pattern": "warn",
    "@ds/core/no-adhoc-create-button": "warn"
  }
}
```

---

## a11y

All four primitives pass axe-core at build time (see `tests/ListView.test.tsx`, `tests/ExpandableDetailPane.test.tsx`, `tests/TopRightCreateWizard.test.tsx`, `tests/NavRail.test.tsx`). axe tests are included in the vitest run (`npm test`).

## Visual Regression

Stories live in `stories/`. Run `npx storybook dev` once Storybook is added to the repo to capture visual baselines. The primitives use only `cc-*` token-driven CSS — no inline colours — so cross-theme visual regressions will not be silently masked.
