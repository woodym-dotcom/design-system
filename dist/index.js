export { useTheme, initTheme } from "./useTheme";
export { useUrlFilterState, useUrlFilterStateRouter, } from "./hooks/useUrlFilterState";
export { FormField } from "./FormField";
export { FilterBar } from "./FilterBar";
// NavRail + CreateMenu demoted to internal in DS-SIMPLIFY 05 — use
// PlatformAppShell. Files remain in `react/` for internal composition.
// EntityForm module (G3) — canonical public surface
// Individual field components (TextField, NumberField, etc.) are NOT exported here.
// Use <EntityForm schema={...}> for schema-driven forms or <FormField as="shell">
// for arbitrary child inputs. Custom field types use registerFieldType().
export { buildEntitySchema, setOrchestratorBridge, getOrchestratorBridge, useEntityForm, EntityForm, registerFieldType, getFieldTypeComponent, } from "./entity-form/index";
export { ThemeToggle } from "./ThemeToggle";
export { ModuleShell, } from "./ModuleShell";
export { ModuleShellProvider, useModuleShellRouter, } from "./ModuleShellProvider";
export { ListPage, } from "./ListPage";
export { ConfigurationsPage, } from "./ConfigurationsPage";
export { ReviewQueue, } from "./ReviewQueue";
export { MonitoringPage, KpiTile, } from "./MonitoringPage";
export { CreationWizard, } from "./CreationWizard";
export { ListPageHeader } from "./ListPageHeader";
// ── DS-SIMPLIFY 04: ModuleTemplate — unified page-template primitive ─────────
// Subsumes ListPage / ConfigurationsPage / MonitoringPage / ReviewQueue /
// ModuleShell / AuthLayout / HomepageCards into one variant-driven primitive.
// SIMPLIFY 14 deletes the subsumed primitives.
export { ModuleTemplate } from "./ModuleTemplate";
export { DetailPane } from "./DetailPane";
export { ExpandableDetailPane, } from "./ExpandableDetailPane";
export { TopRightCreateWizard, } from "./TopRightCreateWizard";
// CompanyGroupSwitcher demoted to internal in DS-SIMPLIFY 05 — use
// PlatformAppShell. File remains in `react/` for internal composition.
export { ArtefactDetailPane, ArtefactDefinition, ArtefactIOContractView, ArtefactMetricsView, ArtefactHistory, ArtefactCallers, ArtefactVersioning, } from "./ArtefactDetailPane";
export { FileUploadField, } from "./FileUploadField";
export { formatFileSize, fileMatchesAccept } from "./fileUploadUtils";
export { LifecycleStateBadge, } from "./LifecycleStateBadge";
// ── DS-SIMPLIFY 03: Tag primitive ─────────────────────────────────────────────
// Canonical tone-coded text-indicator. Subsumes Chip, Badge, StatusPill,
// LifecycleStateBadge, and MetadataChip inline badge patterns.
export { Tag, } from "./Tag";
export { DetailRow, DetailSection, DetailMetric, } from "./DetailPrimitives";
export { EntityCard, EntityCardList, } from "./EntityCard";
// Dashboard primitives (Phase 1A)
export { StatusPill, } from "./StatusPill";
export { MetadataChip, } from "./MetadataChip";
export { SectionHeader, } from "./SectionHeader";
export { EmptyState, } from "./EmptyState";
export { CompactListRow, } from "./CompactListRow";
// DashboardChartCard intentionally NOT re-exported here.
// Import directly from "@ds/core/react/charts/DashboardChartCard" — keeps
// recharts (optional peer) out of the bundle path for consumers that don't
// use charts.
// ── Phase 2 foundation primitives ────────────────────────────────────────────
// Accessibility utilities
export { useReducedMotion } from "./a11y/useReducedMotion";
export { useFocusTrap } from "./a11y/useFocusTrap";
export { LiveRegion, AnnounceProvider, useAnnounce, } from "./a11y/LiveRegion";
// Toast — provider + hook are the public surface; consumers should not
// render an individual toast manually. The `Toast` type is exported below.
export { ToastProvider, useToast, } from "./Toast";
// Overlay — unified primitive (SIMPLIFY 01). Modal/Drawer/DetailPane/
// ExpandableDetailPane/ArtefactDetailPane/DrilldownLayout/FullScreenDetail
// remain as @deprecated re-exports until SIMPLIFY 14.
export { Overlay, } from "./Overlay";
// Modal + Drawer
export { Modal, } from "./Modal";
export { Drawer, } from "./Drawer";
// Kbd, Tooltip, Avatar, Skeleton bundle
export { Kbd } from "./Kbd";
export { Tooltip } from "./Tooltip";
export { Avatar, } from "./Avatar";
export { Skeleton, } from "./Skeleton";
// Locale / timezone / currency Fmt + Lens
export { FmtProvider, useFmt, Fmt, DEFAULT_FMT, } from "./fmt/Fmt";
export { Lens } from "./fmt/Lens";
// Multi-select hook + BulkBar
export { useMultiSelect, } from "./hooks/useMultiSelect";
export { BulkBar, } from "./BulkBar";
export { BulkSelectableTable, } from "./BulkSelectableTable";
export { Printable, PrintHeader, PrintFooter, ShareableSnapshotButton, } from "./Printable";
export { useNotifications, } from "./useNotifications";
// Saved views (deep-link sharing) + back stack
export { useSavedViews, } from "./hooks/useSavedViews";
export { useBackStack, } from "./hooks/useBackStack";
// Breadcrumbs
export { Breadcrumbs, } from "./Breadcrumbs";
// Command palette (Cmd+K)
export { CommandPalette, } from "./CommandPalette";
// Trays — TasksTray + NotificationsTray (notifications digest contract)
export { TasksTray, NotificationsTray, } from "./Trays";
// Print + shareable read-only link
export { ShareReadOnlyLink, } from "./ShareReadOnlyLink";
// Saved-views picker UI (on top of `useSavedViews`)
export { SavedViewsMenu, } from "./SavedViewsMenu";
// First-run / empty-tenant onboarding
export { FirstRunGuide, } from "./FirstRunGuide";
// Role-aware homepage cards
export { HomepageCards, } from "./HomepageCards";
// ── @aa/ui retirement — Phase 1 foundational primitives ──────────────────────
export { Button, } from "./Button";
export { Spinner, } from "./Spinner";
export { Chip, Badge, } from "./Chip";
export { Tabs, } from "./Tabs";
export { Sparkline, } from "./charts/Sparkline";
// ── DS-SIMPLIFY 02 — State primitive (unified state-messaging) ────────────────
export { State, } from "./State";
// ── @aa/ui retirement — Phase 2 utility surfaces ─────────────────────────────
// @deprecated — these individual state components are superseded by <State>.
//   Use <State variant="…" density="…"> instead. Will be removed in v1.0 (SIMPLIFY 14).
export { AwaitingState, } from "./AwaitingState";
export { StaleDataPill, } from "./StaleDataPill";
export { StateBanner, } from "./StateBanner";
export { OfflineBanner, } from "./OfflineBanner";
export { Diff, diffLines, } from "./Diff";
// ── @aa/ui retirement — Phase 3 extensions of existing components ─────────────
// Card now exported here (was previously only available via the ./react/Card
// subpath) so the extended `actions`, `footer`, `padded` props are discoverable
// from the barrel.
export { Card } from "./Card";
// ── DS-SIMPLIFY 09: ActivityTimeline (supersedes AuditLogList) ────────────────
export { ActivityTimeline, } from "./ActivityTimeline";
// AuditLogList — deprecated alias; kept for back-compat until v1.0 (SIMPLIFY 14).
export { AuditLogList, } from "./AuditLogList";
// ── @aa/ui retirement — Phase 4 composed primitives ──────────────────────────
export { useSplitPane, } from "./hooks/useSplitPane";
export { DrilldownLayout, } from "./DrilldownLayout";
export { FullScreenDetail, } from "./FullScreenDetail";
// ── DS-SIMPLIFY 05: PlatformAppShell — pre-composed shell ─────────────────────
// TopBar + AppShell are demoted to internal; consumers compose at the
// PlatformAppShell layer. Sub-primitive files remain in `react/` for
// internal composition only.
export { PlatformAppShell, } from "./PlatformAppShell";
// ── DS-SIMPLIFY 05: Deprecated re-exports of demoted shell sub-primitives ────
// AppShell, TopBar, NavRail, CompanyGroupSwitcher were demoted from the public
// barrel in DS-SIMPLIFY 05 in favour of PlatformAppShell. Re-exported here with
// @deprecated tags during the deprecation window; deleted at SIMPLIFY 14
// (v1.0 cutover) after all consumers migrate to PlatformAppShell.
/** @deprecated since 0.7 — use PlatformAppShell. Removed in v1.0 (DS-SIMPLIFY 14). */
export { AppShell } from "./AppShell";
/** @deprecated since 0.7 — use PlatformAppShell. Removed in v1.0 (DS-SIMPLIFY 14). */
export { TopBar } from "./TopBar";
/** @deprecated since 0.7 — use PlatformAppShell. Removed in v1.0 (DS-SIMPLIFY 14). */
export { CompanyGroupSwitcher, } from "./CompanyGroupSwitcher";
/** @deprecated since 0.7 — use PlatformAppShell. Removed in v1.0 (DS-SIMPLIFY 14). */
export { NavRail } from "./NavRail";
// ── @aa/ui retirement — Phase 6 navigation hook ──────────────────────────────
export { useNavigateWithOrigin, encodeOrigin, decodeOrigin, buildUrlWithOrigin, } from "./hooks/useNavigateWithOrigin";
// ── DS-SIMPLIFY 08: Graph — unified data-viz primitive ───────────────────────
// Subsumes Sparkline, MetricChartCard, DashboardChartCard, KpiTile, HeatmapChart,
// RelationshipGraph, DistributionPlot into one layout-discriminated primitive.
// force/hierarchical layouts are stubbed — coming in v1.1 with @xyflow/react.
export { Graph } from "./Graph";
// ── DS-SIMPLIFY 10: AISuggestionsPane — canonical AI-review surface ──────────
export { AISuggestionsPane, } from "./AISuggestionsPane";
// ── DS-SIMPLIFY 07: EntityPicker — standalone search + inline-create combobox ─
export { EntityPicker } from "./EntityPicker";
// ── DS-SIMPLIFY 12: layout atoms cluster ─────────────────────────────────────
export { Stack, } from "./Stack";
export { Row, } from "./Row";
export { Text, } from "./Text";
export { Menu, MenuItem, MenuSeparator, MenuLabel, } from "./Menu";
export { Disclosure, Accordion, } from "./Disclosure";
//# sourceMappingURL=index.js.map