# Design System foundation — primitives reference

This document indexes the foundation primitives shipped as part of the
[Platform][DS] Design System foundation roll-up (Phase 2). Every primitive
listed here lives in `@ds/core/react`, is covered by a vitest test file,
respects `prefers-reduced-motion` via the shared motion-respect rail, and
uses tokens-only colours.

For per-primitive props, see the corresponding source file and test —
this document is the **map**, the source files are the **legend**.

## Token rails

All in `tokens/core.css`.

### Motion (`--motion-*`)

| Token              | Resolves to                  | Use for                          |
|--------------------|------------------------------|----------------------------------|
| `--motion-instant` | 0ms                          | Skip-motion baseline             |
| `--motion-fast`    | 100ms                        | Subtle hover/focus changes       |
| `--motion-base`    | 120ms                        | Default — colours, opacity       |
| `--motion-med`     | 150ms                        | Layout / size                    |
| `--motion-slow`    | 200ms                        | Drawer / panel slide-in          |
| `--motion-emphatic`| 280ms                        | Hero / first-run reveal          |

Each is multiplied by `--motion-respect`. The reduced-motion media query
and `html[data-motion="reduced"]` both flip `--motion-respect` to `0`,
so any motion token used in a `transition` or `animation` rule auto-
collapses to instant.

Use the shorthand bundles when wiring transitions:

```css
.cc-thing {
  transition: var(--transition-colors), var(--transition-transform);
}
```

### Contrast (`--text-strong`, `--border-strong`)

Set `html[data-contrast="high"]` (or rely on `prefers-contrast: more`) to
swap borders to a heavier value and widen the focus ring. Default
contrast is preserved when neither hint is present.

### Print

`@import "@ds/core/tokens/print.css"` hides app chrome, expands
collapsed details, and forces ink-friendly colours for any surface
that needs to print cleanly (Evidence, Decision Records, audit views).

## React primitives

### Accessibility utilities (`react/a11y/`)

- **`useReducedMotion()`** — boolean hook; respects both the media query
  and the `data-motion` opt-in. Returns `false` on the server.
- **`useFocusTrap({ active })`** — returns a ref to attach to a modal
  container. Captures Tab/Shift+Tab, focuses the first focusable on
  activation, restores focus on deactivation.
- **`<AnnounceProvider>` + `useAnnounce()`** — mount the provider near
  the root; descendants call `announce("Saved", "polite")` to push to
  the polite or assertive ARIA live region.
- **`<LiveRegion message="…" politeness="…" />`** — standalone live
  region for one-off announcements (auto-clears after `clearAfterMs`).

### Surfaces

- **`<Modal>`** — generic centred dialog. Focus trap, ESC, backdrop
  click, body scroll lock, sizes `sm | md | lg | xl | auto`.
- **`<Drawer>`** — slide-in panel; `side` is `right | left | top | bottom`
  and `size` is `sm | md | lg | full`. Distinct from `<DetailPane>`
  (which is the record-detail surface with a fixed section list).
- **`<ToastProvider>` + `useToast()`** — toast stack with tone, action
  (e.g. Undo), auto-dismiss, max cap, and ARIA-live announcement.
- **`<Tooltip label="…">…</Tooltip>`** — focus-/hover-triggered tooltip
  with delay, ESC dismiss, wired `aria-describedby`.

### Atoms

- **`<Kbd keys="K" />`** — keyboard-shortcut token; aliases `mod`, `cmd`,
  `enter`, etc. and renders `⌘` on macOS, `Ctrl` elsewhere.
- **`<Avatar name="Jane Doe" />`** — initials fallback with deterministic
  brand-palette accent; image swap on `onerror`; sizes `xs..xl`.
- **`<Skeleton shape="text" lines={3} />`** — animated loading
  placeholder; shimmer auto-stops under reduced motion.
- **`<EmptyState variant="offline" />`** — long-tail state placeholder.
  Variants: `empty | offline | rate-limited | permissioned-out | stale |
  partial | error | loading`. ARIA role chosen per variant.

### Lists & queues

- **`useMultiSelect({ items, getKey })`** — selection state with toggle,
  shift-range, select-all, prune-on-items-change.
- **`<BulkBar count actions={…} onClear />`** — sticky action bar for
  selected rows; danger tone for destructive actions.

### URL state + cross-module navigation

- **`useSavedViews({ scope })`** — per-scope saved view CRUD with
  `shareableUrl(state)` for read-only deep-link sharing.
- **`<SavedViewsMenu views onSelect onSaveCurrent onTogglePin onRemove />`** —
  dropdown picker on top of `useSavedViews()`. Click-outside and ESC
  close; active view marked `aria-checked`; pinned views sort first.
- **`useBackStack()`** — sessionStorage-backed back stack; pairs with
  `<Breadcrumbs>` so cross-module navigation returns the user to where
  they were.
- **`<Breadcrumbs items={…} />`** — ordered crumbs with auto current-page
  marker and middle-collapse for long trails.

### Locale / timezone / currency

- **`<FmtProvider locale timezone currency>`** — context that drives
  every `<Fmt.*>` primitive. Tenant-scoped at the app root.
- **`<Fmt.Date | Money | Number | Relative />`** — render helpers backed
  by `Intl`; per-call overrides supported.
- **`<Lens label="EU view" locale="fr-FR">…</Lens>`** — read-only toggle
  that swaps locale/timezone/currency for a subtree without persisting.

### Composite surfaces

- **`<CommandPalette open items onSelect />`** — Cmd+K palette; fuzzy
  match, grouped results, arrow-key navigation, shortcut hints.
  Composes `<Modal>` + `<Kbd>`. **Host app binds the global hotkey.**
- **`<TasksTray>`** — TasksTray contract: right-side drawer of actionable
  items with done / clear-completed.
- **`<NotificationsTray>`** — Notifications digest contract: unread-first
  ordering, mark-all-read, optional per-item mark-read.
- **`<ShareReadOnlyLink url variant="button|inline" />`** — copy-to-
  clipboard share affordance. Pairs with `useSavedViews().shareableUrl`.
- **`<FirstRunGuide title steps onComplete />`** — empty-tenant
  onboarding pattern. Accordion-style checklist; auto-expands the first
  not-done step; fires `onComplete` once when every step is done.
  Composes on `EmptyState` semantics — drop into an empty-tenant body.
- **`<HomepageCards viewerRoles cards loading emptyState />`** — role-
  aware homepage grid. Filters cards by `roles ∩ viewerRoles`, orders
  by `priority`, falls back to `<EmptyState variant="permissioned-out">`
  when the viewer can see nothing, renders per-card `<Skeleton>`s when
  `loading`.

## Composition examples

### Cmd+K command palette

```tsx
import { CommandPalette, useToast } from '@ds/core/react';

function App() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // Host binds the hotkey:
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <CommandPalette
      open={open}
      onClose={() => setOpen(false)}
      items={[
        { id: 'new', label: 'New vendor', group: 'Actions', shortcut: ['mod', 'N'], onSelect: () => nav('/vendors/new') },
        { id: 'home', label: 'Home', group: 'Navigate', onSelect: () => nav('/') },
      ]}
    />
  );
}
```

### Bulk selection + bar

```tsx
const sel = useMultiSelect({ items: vendors, getKey: (v) => v.id });

return (
  <>
    <List
      items={vendors}
      isSelected={sel.isSelected}
      onRowClick={(v, e) => sel.toggle(v, { shift: e.shiftKey })}
    />
    <BulkBar
      count={sel.count}
      onClear={sel.clear}
      actions={[
        { id: 'arch', label: 'Archive', onClick: () => archive(sel.selectedItems) },
        { id: 'del',  label: 'Delete',  onClick: () => del(sel.selectedItems), tone: 'danger' },
      ]}
    />
  </>
);
```

### Shareable view

```tsx
const views = useSavedViews<string>({
  scope: 'vendors.list',
  serialise: (s) => s,
  deserialise: (s) => s,
});
const url = views.shareableUrl(window.location.search);

<ShareReadOnlyLink url={url} variant="inline" helpText="Read-only — anyone with the link can open this view." />
```

## Composition rules

- **Toast for transient signals; Modal for blocking decisions; Drawer for
  side content; DetailPane for record detail.** Don't reach for a Modal
  when a Toast (or a status banner) would do.
- **Never instantiate a `<Toast>` directly** — call `useToast().toast({})`.
  Render position is owned by the provider.
- **Wrap once near the app root with `<AnnounceProvider>`** so primitives
  can call `useAnnounce()` from anywhere without prop-drilling. Multiple
  providers fragment the live regions and are discouraged.
- **Long-tail states are an `EmptyState` variant**, not a sibling family.
  When you need offline / stale / partial / error, set `variant`. Every
  variant picks the right ARIA role.
- **Never set a CSS `transition` or `animation` duration to a raw `--duration-*`
  token in new code** — use `--motion-*` (or one of the
  `--transition-*` shorthands) so reduced-motion respects propagate
  automatically.

## Dependents

The module-level `[WOW]` tickets that compose on these primitives are
enumerated in the foundation Notion ticket. Modules can ship in parallel
but should stub the dependency only when blocked; the primitives above
are the public contract.
