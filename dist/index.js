export { useTheme, initTheme } from "./useTheme.js";
export { useUrlFilterState, useUrlFilterStateRouter, } from "./hooks/useUrlFilterState.js";
export { FormField } from "./FormField.js";
export { FilterBar } from "./FilterBar.js";
// NavRail + CreateMenu demoted to internal in DS-SIMPLIFY 05 — use
// PlatformAppShell. Files remain in `react/` for internal composition.
// EntityForm module (G3) — canonical public surface
// Individual field components (TextField, NumberField, etc.) are NOT exported here.
// Use <EntityForm schema={...}> for schema-driven forms or <FormField as="shell">
// for arbitrary child inputs. Custom field types use registerFieldType().
export { buildEntitySchema, setOrchestratorBridge, getOrchestratorBridge, useEntityForm, EntityForm, registerFieldType, getFieldTypeComponent, } from "./entity-form/index.js";
export { ThemeToggle } from "./ThemeToggle.js";
export { ModuleShell, } from "./ModuleShell.js";
export { ModuleShellProvider, useModuleShellRouter, } from "./ModuleShellProvider.js";
export { ListPage, } from "./ListPage.js";
export { ConfigurationsPage, } from "./ConfigurationsPage.js";
export { ReviewQueue, } from "./ReviewQueue.js";
export { MonitoringPage, KpiTile, } from "./MonitoringPage.js";
export { CreationWizard, } from "./CreationWizard.js";
export { ListPageHeader } from "./ListPageHeader.js";
// ── DS-SIMPLIFY 04: ModuleTemplate — unified page-template primitive ─────────
// Subsumes ListPage / ConfigurationsPage / MonitoringPage / ReviewQueue /
// ModuleShell / AuthLayout / HomepageCards into one variant-driven primitive.
// SIMPLIFY 14 deletes the subsumed primitives.
export { ModuleTemplate } from "./ModuleTemplate.js";
export { DetailPane } from "./DetailPane.js";
export { ExpandableDetailPane, } from "./ExpandableDetailPane.js";
export { TopRightCreateWizard, } from "./TopRightCreateWizard.js";
// CompanyGroupSwitcher demoted to internal in DS-SIMPLIFY 05 — use
// PlatformAppShell. File remains in `react/` for internal composition.
export { ArtefactDetailPane, ArtefactDefinition, ArtefactIOContractView, ArtefactMetricsView, ArtefactHistory, ArtefactCallers, ArtefactVersioning, } from "./ArtefactDetailPane.js";
export { FileUploadField, } from "./FileUploadField.js";
export { formatFileSize, fileMatchesAccept } from "./fileUploadUtils.js";
export { LifecycleStateBadge, } from "./LifecycleStateBadge.js";
// ── DS-SIMPLIFY 03: Tag primitive ─────────────────────────────────────────────
// Canonical tone-coded text-indicator. Subsumes Chip, Badge, StatusPill,
// LifecycleStateBadge, and MetadataChip inline badge patterns.
export { Tag, } from "./Tag.js";
export { DetailRow, DetailSection, DetailMetric, } from "./DetailPrimitives.js";
export { EntityCard, EntityCardList, } from "./EntityCard.js";
// Dashboard primitives (Phase 1A)
export { StatusPill, } from "./StatusPill.js";
export { MetadataChip, } from "./MetadataChip.js";
export { SectionHeader, } from "./SectionHeader.js";
export { EmptyState, } from "./EmptyState.js";
export { CompactListRow, } from "./CompactListRow.js";
// DashboardChartCard intentionally NOT re-exported here.
// Import directly from "@ds/core/react/charts/DashboardChartCard" — keeps
// recharts (optional peer) out of the bundle path for consumers that don't
// use charts.
// ── Phase 2 foundation primitives ────────────────────────────────────────────
// Accessibility utilities
export { useReducedMotion } from "./a11y/useReducedMotion.js";
export { useFocusTrap } from "./a11y/useFocusTrap.js";
export { LiveRegion, AnnounceProvider, useAnnounce, } from "./a11y/LiveRegion.js";
// Toast — provider + hook are the public surface; consumers should not
// render an individual toast manually. The `Toast` type is exported below.
export { ToastProvider, useToast, } from "./Toast.js";
// Overlay — unified primitive (SIMPLIFY 01). Modal/Drawer/DetailPane/
// ExpandableDetailPane/ArtefactDetailPane/DrilldownLayout/FullScreenDetail
// remain as @deprecated re-exports until SIMPLIFY 14.
export { Overlay, } from "./Overlay.js";
// Modal + Drawer
export { Modal, } from "./Modal.js";
export { Drawer, } from "./Drawer.js";
// Kbd, Tooltip, Avatar, Skeleton bundle
export { Kbd } from "./Kbd.js";
export { Tooltip } from "./Tooltip.js";
export { Avatar, } from "./Avatar.js";
export { Skeleton, } from "./Skeleton.js";
// Locale / timezone / currency Fmt + Lens
export { FmtProvider, useFmt, Fmt, DEFAULT_FMT, } from "./fmt/Fmt.js";
export { Lens } from "./fmt/Lens.js";
// Multi-select hook + BulkBar
export { useMultiSelect, } from "./hooks/useMultiSelect.js";
export { BulkBar, } from "./BulkBar.js";
// Saved views (deep-link sharing) + back stack
export { useSavedViews, } from "./hooks/useSavedViews.js";
export { useBackStack, } from "./hooks/useBackStack.js";
// Breadcrumbs
export { Breadcrumbs, } from "./Breadcrumbs.js";
// Command palette (Cmd+K)
export { CommandPalette, } from "./CommandPalette.js";
// Trays — TasksTray + NotificationsTray (notifications digest contract)
export { TasksTray, NotificationsTray, } from "./Trays.js";
// Print + shareable read-only link
export { ShareReadOnlyLink, } from "./ShareReadOnlyLink.js";
// Saved-views picker UI (on top of `useSavedViews`)
export { SavedViewsMenu, } from "./SavedViewsMenu.js";
// First-run / empty-tenant onboarding
export { FirstRunGuide, } from "./FirstRunGuide.js";
// Role-aware homepage cards
export { HomepageCards, } from "./HomepageCards.js";
// ── @aa/ui retirement — Phase 1 foundational primitives ──────────────────────
export { Button, } from "./Button.js";
export { Spinner, } from "./Spinner.js";
export { Chip, Badge, } from "./Chip.js";
export { Tabs, } from "./Tabs.js";
export { Sparkline, } from "./charts/Sparkline.js";
// ── DS-SIMPLIFY 02 — State primitive (unified state-messaging) ────────────────
export { State, } from "./State.js";
// ── @aa/ui retirement — Phase 2 utility surfaces ─────────────────────────────
// @deprecated — these individual state components are superseded by <State>.
//   Use <State variant="…" density="…"> instead. Will be removed in v1.0 (SIMPLIFY 14).
export { AwaitingState, } from "./AwaitingState.js";
export { StaleDataPill, } from "./StaleDataPill.js";
export { StateBanner, } from "./StateBanner.js";
export { OfflineBanner, } from "./OfflineBanner.js";
export { Diff, diffLines, } from "./Diff.js";
// ── @aa/ui retirement — Phase 3 extensions of existing components ─────────────
// Card now exported here (was previously only available via the ./react/Card
// subpath) so the extended `actions`, `footer`, `padded` props are discoverable
// from the barrel.
export { Card } from "./Card.js";
// ── DS-SIMPLIFY 09: ActivityTimeline (supersedes AuditLogList) ────────────────
export { ActivityTimeline, } from "./ActivityTimeline.js";
// AuditLogList — deprecated alias; kept for back-compat until v1.0 (SIMPLIFY 14).
export { AuditLogList, } from "./AuditLogList.js";
// ── @aa/ui retirement — Phase 4 composed primitives ──────────────────────────
export { useSplitPane, } from "./hooks/useSplitPane.js";
export { DrilldownLayout, } from "./DrilldownLayout.js";
export { FullScreenDetail, } from "./FullScreenDetail.js";
// ── DS-SIMPLIFY 05: PlatformAppShell — pre-composed shell ─────────────────────
// TopBar + AppShell are demoted to internal; consumers compose at the
// PlatformAppShell layer. Sub-primitive files remain in `react/` for
// internal composition only.
export { PlatformAppShell, } from "./PlatformAppShell.js";
// ── @aa/ui retirement — Phase 6 navigation hook ──────────────────────────────
export { useNavigateWithOrigin, encodeOrigin, decodeOrigin, buildUrlWithOrigin, } from "./hooks/useNavigateWithOrigin.js";
// ── DS-SIMPLIFY 08: Graph — unified data-viz primitive ───────────────────────
// Subsumes Sparkline, MetricChartCard, DashboardChartCard, KpiTile, HeatmapChart,
// RelationshipGraph, DistributionPlot into one layout-discriminated primitive.
// force/hierarchical layouts are stubbed — coming in v1.1 with @xyflow/react.
export { Graph } from "./Graph.js";
// ── DS-SIMPLIFY 10: AISuggestionsPane — canonical AI-review surface ──────────
export { AISuggestionsPane, } from "./AISuggestionsPane.js";
// ── DS-SIMPLIFY 07: EntityPicker — standalone search + inline-create combobox ─
export { EntityPicker } from "./EntityPicker.js";
// ── DS-SIMPLIFY 12: layout atoms cluster ─────────────────────────────────────
export { Stack, } from "./Stack.js";
export { Row, } from "./Row.js";
export { Text, } from "./Text.js";
export { Menu, MenuItem, MenuSeparator, MenuLabel, } from "./Menu.js";
export { Disclosure, Accordion, } from "./Disclosure.js";
//# sourceMappingURL=index.js.map