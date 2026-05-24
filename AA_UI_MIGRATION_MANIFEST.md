# @aa/ui to @ds/core Migration Manifest

Per-export mapping from the retired `@aa/ui` package to `@ds/core` equivalents.

## Status

`@aa/ui` is fully retired. All exports are available in `@ds/core`.

## Export Mapping

### Phase 1: Foundational Primitives

| @aa/ui export | @ds/core export | Import path |
|---|---|---|
| `Button` | `Button` | `@ds/core/react` |
| `ButtonProps`, `ButtonVariant`, `ButtonSize` | Same | `@ds/core/react` |
| `Spinner` | `Spinner` | `@ds/core/react` |
| `SpinnerProps`, `SpinnerSize` | Same | `@ds/core/react` |
| `Chip` | `Chip` (deprecated) / `Tag` | `@ds/core/react` |
| `Badge` | `Badge` (deprecated) / `Tag variant="badge"` | `@ds/core/react` |
| `ChipProps`, `BadgeProps` | Same | `@ds/core/react` |
| `Tabs` | `Tabs` | `@ds/core/react` |
| `TabsProps`, `TabItem` | Same | `@ds/core/react` |
| `Sparkline` | `Sparkline` or `Graph layout="sparkline"` | `@ds/core/react/charts/Sparkline` or `@ds/core/react` |
| `SparklineProps`, `SparklineTone`, `SparklineSize` | Same | `@ds/core/react` |

### Phase 2: Utility Surfaces

| @aa/ui export | @ds/core export | Import path | Notes |
|---|---|---|---|
| `AwaitingState` | `AwaitingState` (deprecated) / `State variant="loading"` | `@ds/core/react` | Use `<State>` for new code |
| `StaleDataPill` | `StaleDataPill` (deprecated) / `State variant="stale" density="chip"` | `@ds/core/react` | Use `<State>` for new code |
| `StateBanner` | `StateBanner` (deprecated) / `State density="banner"` | `@ds/core/react` | Use `<State>` for new code |
| `OfflineBanner` | `OfflineBanner` (deprecated) / `State variant="offline" density="banner"` | `@ds/core/react` | Use `<State>` for new code |
| `Diff`, `diffLines` | `Diff`, `diffLines` | `@ds/core/react` | |

### Phase 3: Component Extensions

| @aa/ui export | @ds/core export | Import path | Notes |
|---|---|---|---|
| `Card` | `Card` | `@ds/core/react` | Extended with `actions`, `footer`, `padded` props |

### Phase 4: Composed Primitives

| @aa/ui export | @ds/core export | Import path | Notes |
|---|---|---|---|
| `useSplitPane` | `useSplitPane` | `@ds/core/react` | |
| `DrilldownLayout` | `DrilldownLayout` | `@ds/core/react` | |
| `FullScreenDetail` | `FullScreenDetail` | `@ds/core/react` | |

### Phase 5: Shell Primitives (demoted to internal)

| @aa/ui export | @ds/core export | Import path | Notes |
|---|---|---|---|
| `AppShell` | `AppShell` (deprecated) | `@ds/core/react` | Use `PlatformAppShell` |
| `TopBar` | `TopBar` (deprecated) | `@ds/core/react` | Use `PlatformAppShell` |
| `NavRail` | `NavRail` (deprecated) | `@ds/core/react` | Use `PlatformAppShell` |
| `CompanyGroupSwitcher` | `CompanyGroupSwitcher` (deprecated) | `@ds/core/react` | Use `PlatformAppShell` |
| `AppSwitcher` (internal) | `AppSwitcher` | `@ds/core/react` | Now a standalone export |
| `UserMenu` (internal) | `UserMenu` | `@ds/core/react` | Now a standalone export |

### Phase 6: Navigation

| @aa/ui export | @ds/core export | Import path |
|---|---|---|
| `useNavigateWithOrigin` | `useNavigateWithOrigin` | `@ds/core/react` |
| `encodeOrigin`, `decodeOrigin`, `buildUrlWithOrigin` | Same | `@ds/core/react` |
| `OriginContext` | Same | `@ds/core/react` |

### Other Utilities

| @aa/ui export | @ds/core export | Import path | Notes |
|---|---|---|---|
| `Panel` component | CSS class `cc-panel` | `@ds/core/primitives/primitives.css` | Pure CSS; no React component needed |
| `ActivityRibbon` | `ActivityTimeline` | `@ds/core/react` | Renamed in DS-SIMPLIFY 09 |
| `AuditLogList` | `AuditLogList` (deprecated) / `ActivityTimeline` | `@ds/core/react` | Use `ActivityTimeline` for new code |

## Recommended Replacements (Deprecated Chains)

Several @aa/ui exports have been through two generations of deprecation. The canonical replacement for new code:

| Original (@aa/ui) | Intermediate (@ds/core deprecated) | Canonical (@ds/core) |
|---|---|---|
| `Chip` / `Badge` | `Chip`, `Badge` | `Tag` |
| `AwaitingState` | `AwaitingState` | `State variant="loading"` |
| `StaleDataPill` | `StaleDataPill` | `State variant="stale" density="chip"` |
| `StateBanner` | `StateBanner` | `State density="banner"` |
| `OfflineBanner` | `OfflineBanner` | `State variant="offline" density="banner"` |
| `EmptyState` | `EmptyState` | `State variant="empty"` |
| `AppShell` + `TopBar` + `NavRail` | Individual deprecated re-exports | `PlatformAppShell` |
| `AuditLogList` | `AuditLogList` | `ActivityTimeline` |
| `ListView` | Types-only re-export | `ListPage` or `DataTable` |
| `ListPage` | `ListPage` | `ModuleTemplate variant="list"` |
| `Modal` / `Drawer` | `Modal`, `Drawer` | `Overlay` |
| `MetricChartCard` / `DashboardChartCard` | Individual chart components | `Graph` |

## Find and Replace Patterns

```bash
# Quick sed patterns for import migration:
# @aa/ui -> @ds/core/react
s|from ['"]@aa/ui['"]|from '@ds/core/react'|g
s|from ['"]@aa/ui/|from '@ds/core/react/|g
```

## Removal Timeline

All deprecated intermediate exports (Chip, Badge, AwaitingState, StaleDataPill, StateBanner, OfflineBanner, AppShell, TopBar, NavRail, CompanyGroupSwitcher, AuditLogList, Modal, Drawer, ListPage, ConfigurationsPage, MonitoringPage, ReviewQueue) will be removed in v1.0 (DS-SIMPLIFY 14).
