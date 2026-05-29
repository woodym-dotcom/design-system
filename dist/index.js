export { useTheme, initTheme } from "./useTheme.js";
export { useUrlFilterState, useUrlFilterStateRouter, } from "./hooks/useUrlFilterState.js";
export { FormField } from "./FormField.js";
export { FilterBar } from "./FilterBar.js";
// EntityForm — canonical public surface. Individual field components are NOT
// exported here. Use <EntityForm schema={...}> for schema-driven forms or
// <FormField as="shell"> for arbitrary child inputs. Custom field types use
// registerFieldType(). Type surface is intentionally minimal — the 6 most-used
// types only. Other types remain internal.
export { buildEntitySchema, setOrchestratorBridge, getOrchestratorBridge, useEntityForm, EntityForm, registerFieldType, getFieldTypeComponent, fromJsonSchema, } from "./entity-form/index.js";
export { ThemeToggle } from "./ThemeToggle.js";
export { CreationWizard, } from "./CreationWizard.js";
// ── Page — unified page-template primitive ───────────────────────────────────
export { Page } from "./Page.js";
export { TopRightCreateWizard, } from "./TopRightCreateWizard.js";
export { ArtefactDetailPane, } from "./ArtefactDetailPane.js";
export { FileUploadField, } from "./FileUploadField.js";
export { formatFileSize, fileMatchesAccept } from "./fileUploadUtils.js";
// ── Tag — canonical tone-coded text-indicator ────────────────────────────────
// Subsumes Chip, Badge, StatusPill, LifecycleStateBadge, and MetadataChip
// inline badge patterns.
export { Tag, } from "./Tag.js";
// Description — semantic <dl> primitive that subsumes DetailRow / DetailSection
// / DetailMetric / MetaRow. Use `kind="row" | "section" | "metric" | "meta"`.
export { Description, DescriptionTerm, DescriptionValue, } from "./Description.js";
export { SectionHeader, } from "./SectionHeader.js";
export { EmptyState, } from "./EmptyState.js";
// DashboardChartCard intentionally NOT re-exported here.
// Import directly from "@ds/core/react/charts/DashboardChartCard" — keeps
// recharts (optional peer) out of the bundle path for consumers that don't
// use charts.
// ── Foundation: accessibility utilities ──────────────────────────────────────
export { useReducedMotion } from "./a11y/useReducedMotion.js";
export { useFocusTrap } from "./a11y/useFocusTrap.js";
export { LiveRegion, AnnounceProvider, useAnnounce, } from "./a11y/LiveRegion.js";
// Toast — provider + hook are the public surface; consumers should not
// render an individual toast manually. The `Toast` type is exported below.
export { ToastProvider, useToast, } from "./Toast.js";
// Overlay — unified primitive.
export { Overlay, } from "./Overlay.js";
// Kbd, Tooltip, Avatar, Skeleton bundle
export { Kbd } from "./Kbd.js";
export { Tooltip } from "./Tooltip.js";
export { Avatar, } from "./Avatar.js";
export { Skeleton, } from "./Skeleton.js";
// Locale / timezone / currency Fmt + Lens
export { FmtProvider, useFmt, Fmt, DEFAULT_FMT, } from "./fmt/Fmt.js";
export { Lens } from "./fmt/Lens.js";
// Multi-select hook
export { useMultiSelect, } from "./hooks/useMultiSelect.js";
export { BulkSelectableTable, } from "./BulkSelectableTable.js";
export { Printable, PrintHeader, PrintFooter, ShareableSnapshotButton, } from "./Printable.js";
export { useNotifications, } from "./useNotifications.js";
// Saved views (deep-link sharing) + back stack
export { useSavedViews, } from "./hooks/useSavedViews.js";
export { useBackStack, } from "./hooks/useBackStack.js";
// Breadcrumbs
export { Breadcrumbs, } from "./Breadcrumbs.js";
// Command palette (Cmd+K)
export { CommandPalette, } from "./CommandPalette.js";
// TasksTray + NotificationsTray (notifications digest contract).
// Direct exports — no umbrella alias.
export { TasksTray } from "./Trays.js";
export { NotificationsTray } from "./Trays.js";
// Print + shareable read-only link
export { ShareReadOnlyLink, } from "./ShareReadOnlyLink.js";
// Saved-views picker UI (on top of `useSavedViews`)
export { SavedViewsMenu, } from "./SavedViewsMenu.js";
// First-run / empty-tenant onboarding
export { FirstRunGuide, } from "./FirstRunGuide.js";
// ── Foundational primitives ──────────────────────────────────────────────────
export { Button, } from "./Button.js";
export { Spinner, } from "./Spinner.js";
export { Tabs, } from "./Tabs.js";
// ── State primitive — unified state-messaging ─────────────────────────────────
export { State, } from "./State.js";
export { Diff, diffLines, } from "./Diff.js";
// Card — generic surface shell + entity record-card (variant="entity").
// Subsumes the legacy EntityCard / EntityCardList primitives via
// `variant="entity"` with `leading` / `trailing` / `metadata` / `density` props.
export { Card } from "./Card.js";
// ── ActivityTimeline ─────────────────────────────────────────────────────────
export { ActivityTimeline, } from "./ActivityTimeline.js";
export { useSplitPane, } from "./hooks/useSplitPane.js";
export { AppShell, } from "./AppShell.js";
// ── Navigation hook ──────────────────────────────────────────────────────────
export { useNavigateWithOrigin, encodeOrigin, decodeOrigin, buildUrlWithOrigin, } from "./hooks/useNavigateWithOrigin.js";
// ── Graph — unified data-viz primitive ───────────────────────────────────────
// Subsumes Sparkline, MetricChartCard, DashboardChartCard, KpiTile, HeatmapChart,
// RelationshipGraph, DistributionPlot into one layout-discriminated primitive.
// force/hierarchical layouts are stubbed — coming in v1.1 with @xyflow/react.
export { Graph } from "./Graph.js";
// ── AISuggestionsPane — canonical AI-review surface ──────────────────────────
export { AISuggestionsPane, } from "./AISuggestionsPane.js";
// ── EntityPicker — standalone search + inline-create combobox ────────────────
export { EntityPicker } from "./EntityPicker.js";
// ── Layout atoms cluster ─────────────────────────────────────────────────────
export { Stack, } from "./Stack.js";
export { Row, } from "./Row.js";
export { Text, } from "./Text.js";
export { Menu, MenuItem, MenuSeparator, MenuLabel, } from "./Menu.js";
// Disclosure — single collapsible primitive. To compose an accordion, render
// multiple <Disclosure>s; lift `open`/`onOpenChange` to a parent for single-open
// semantics.
export { Disclosure, } from "./Disclosure.js";
// ── DataTable — sort/filter/select/paginate table ───────────────────────────
export { DataTable, } from "./DataTable.js";
// ── AppSwitcher — standalone cross-app nav dropdown ─────────────────────────
export { AppSwitcher, } from "./AppSwitcher.js";
// ── UserMenu — standalone user popover ──────────────────────────────────────
export { UserMenu, } from "./UserMenu.js";
// ── EXT primitives — domain extension components ────────────────────────────
// EXT-AIProvenanceChip — AI provenance metadata chip
export { AIProvenanceChip, ProvenanceChip, } from "./AIProvenanceChip.js";
// EXT-DryRunPanel — blast-radius preview panel
export { DryRunPanel, } from "./DryRunPanel.js";
// EXT-CommanderView — three-pane incident command layout
export { CommanderView, } from "./CommanderView.js";
// EXT-DualMeasurementLayout — side-by-side continuous + discrete cadence
export { DualMeasurementLayout, } from "./DualMeasurementLayout.js";
// EXT-CascadePanel — parent-child cascade visualization
export { CascadePanel, } from "./CascadePanel.js";
// EXT-EntitlementPanel — recipient entitlement display
export { EntitlementPanel, } from "./EntitlementPanel.js";
// EXT-ConcentrationHeatmap — risk/vendor concentration grid
export { ConcentrationHeatmap, } from "./ConcentrationHeatmap.js";
// EXT-LegalNameComposer / MultiScriptNameBlock — multi-script name display
export { MultiScriptNameBlock, LegalNameComposer, } from "./MultiScriptNameBlock.js";
// EXT-PointInTimeReplayer — temporal replay control
export { PointInTimeReplayer, } from "./PointInTimeReplayer.js";
// DependencyGraphPane — feature/model dependency graph
export { DependencyGraphPane, } from "./DependencyGraphPane.js";
// EvidenceBundleViewer — structured evidence bundle viewer
export { EvidenceBundleViewer, } from "./EvidenceBundleViewer.js";
// HashChainVerifier — hash chain integrity verification
export { HashChainVerifier, } from "./HashChainVerifier.js";
// EXT-SuggestedFieldRow — Description row with AI provenance + accept/decline
export { SuggestedFieldRow, } from "./SuggestedFieldRow.js";
// EXT-GraphEdgeChip — dependency-graph edge attribute chip
export { GraphEdgeChip, } from "./GraphEdgeChip.js";
// DS: RelationshipGraph — interactive relationship graph visualization
export { RelationshipGraph, } from "./RelationshipGraph.js";
// ── DS variant / improvement components ─────────────────────────────────────
// Toolbar — variants + bulk mode (subsumes BulkBar via `mode="bulk"`)
export { Toolbar, } from "./Toolbar.js";
// EnvelopeBadge — multi-field chip group for resolved envelope
export { EnvelopeBadge, } from "./EnvelopeBadge.js";
// FreshnessPill — freshness class display
export { FreshnessPill, } from "./FreshnessPill.js";
// ── ThreadView — messaging pane for outreach/chat ───────────────────────────
export { ThreadView, } from "./ThreadView.js";
//# sourceMappingURL=index.js.map