export { useTheme, initTheme, type Theme } from "./useTheme";
export {
  useUrlFilterState,
  useUrlFilterStateRouter,
  type UseUrlFilterStateOptions,
  type UrlFilterStateRouterAdapter,
  type TanStackRouterAdapterInput,
} from "./hooks/useUrlFilterState";
export { FormField, type FormFieldProps, type FormFieldType, type FormFieldAs } from "./FormField";
export { FormField as Field } from "./FormField";
export type { FormFieldProps as FieldProps } from "./FormField";
export { FilterBar, type FilterBarProps, type FilterChip } from "./FilterBar";
export {
  AppliedFiltersBar,
  type AppliedFiltersBarProps,
  type AppliedFilter,
} from "./AppliedFiltersBar";
// NavRail + CreateMenu demoted to internal in DS-SIMPLIFY 05 — use
// PlatformAppShell. Files remain in `react/` for internal composition.

// EntityForm module (G3) — canonical public surface
// Individual field components (TextField, NumberField, etc.) are NOT exported here.
// Use <EntityForm schema={...}> for schema-driven forms or <FormField as="shell">
// for arbitrary child inputs. Custom field types use registerFieldType().
export {
  buildEntitySchema,
  setOrchestratorBridge,
  getOrchestratorBridge,
  useEntityForm,
  EntityForm,
  registerFieldType,
  getFieldTypeComponent,
  fromJsonSchema,
} from "./entity-form/index";
export type {
  EntitySchema,
  FieldType,
  FieldMeta,
  AsyncValidator,
  AiReviewInput,
  AiReviewOutput,
  AiReviewSuggestion,
  AiReviewQuestion,
  AiReviewBlocker,
  OrchestratorBridge,
  EntityFormHandle,
  EntityFormProps,
  WizardStepDef,
  WizardStepRenderCtx,
  AiReviewConfig,
  FieldPrimitiveProps,
  SelectOption,
  MoneyValue,
  SearchResult,
  JsonSchema,
  JsonSchemaProperty,
  FromJsonSchemaResult,
} from "./entity-form/index";
export { ThemeToggle, type ThemeToggleProps } from "./ThemeToggle";
export {
  ModuleShell,
  type ModuleShellProps,
  type ModuleShellTab,
  type ModuleShellTabId,
  type ModuleShellTabDef,
} from "./ModuleShell";
export {
  ModuleShellProvider,
  useModuleShellRouter,
  type ModuleShellRouterAdapter,
  type ModuleShellProviderProps,
} from "./ModuleShellProvider";
export {
  ListPage,
  type ListPageProps,
  type ListPageListProps,
  type ListPageDetailProps,
  type ListPageFilters,
  type ListPageFiltersChips,
  type ListPageFiltersSidebar,
  type ListPageFiltersResponsive,
  type ListPageUrlState,
  type ListPagePermissions,
  type BulkAction,
  type ListPageLayout,
  type ListPageTreeNode,
} from "./ListPage";
export {
  ConfigurationsPage,
  type ConfigurationsPageProps,
  type ConfigurationsSection,
} from "./ConfigurationsPage";
export {
  ReviewQueue,
  type ReviewQueueProps,
  type ReviewQueueItem,
  type ReviewQueueCustomAction,
} from "./ReviewQueue";
export {
  MonitoringPage,
  KpiTile,
  type MonitoringPageProps,
  type KpiTileProps,
  type ChartSection,
} from "./MonitoringPage";
export {
  CreationWizard,
  type CreationWizardProps,
  type CreationWizardStep,
  type CreationWizardStepContext,
  type CreationWizardReviewResult,
} from "./CreationWizard";
export { ListPageHeader, type ListPageHeaderProps } from "./ListPageHeader";
// ── DS-SIMPLIFY 04: ModuleTemplate — unified page-template primitive ─────────
// Subsumes ListPage / ConfigurationsPage / MonitoringPage / ReviewQueue /
// ModuleShell / AuthLayout / HomepageCards into one variant-driven primitive.
// SIMPLIFY 14 deletes the subsumed primitives.
export { ModuleTemplate } from "./ModuleTemplate";
export type {
  ModuleTemplateProps,
  ModuleTemplateVariant,
  ModuleTemplateTab,
  ModuleTemplateHeader,
  ListVariantProps,
  ConfigVariantProps,
  MonitorVariantProps,
  ReviewVariantProps,
  DetailVariantProps,
  AuthVariantProps,
  HomeVariantProps,
  ColumnDef as ModuleTemplateColumnDef,
  FilterDef as ModuleTemplateFilterDef,
  PaginationProps as ModuleTemplatePaginationProps,
  KpiDef,
  ChartCardDef,
  ConfigSection as ModuleTemplateConfigSection,
  ReviewActionDef,
  ReviewItem as ModuleTemplateReviewItem,
  ListDetailSlot,
  SelectionMode,
  ModuleTemplateBrandKey,
} from "./ModuleTemplate";
export { DetailPane, type DetailPaneProps, type DetailPaneSection } from "./DetailPane";
// ListView deleted — zero consumers; use ListPage.list.{columns,rows} instead.
// Types re-exported for consumers that reference them directly.
export type {
  ListViewColumn,
  ListViewScopeFilter,
  ListViewPaginationMode,
  ListViewPaginationState,
  SortDirection,
} from "./ListView";
export {
  ExpandableDetailPane,
  type ExpandableDetailPaneProps,
  type ExpandableDetailPaneTab,
} from "./ExpandableDetailPane";
export {
  TopRightCreateWizard,
  type TopRightCreateWizardProps,
  type TopRightCreateWizardVariant,
  type AiCreateConfig,
} from "./TopRightCreateWizard";
// CompanyGroupSwitcher demoted to internal in DS-SIMPLIFY 05 — use
// PlatformAppShell. File remains in `react/` for internal composition.
export {
  ArtefactDetailPane,
  ArtefactDefinition,
  ArtefactIOContractView,
  ArtefactMetricsView,
  ArtefactHistory,
  ArtefactCallers,
  ArtefactVersioning,
  type ArtefactDetailPaneProps,
  type ArtefactDefinitionProps,
  type ArtefactIOContractProps,
  type ArtefactMetricsProps,
  type ArtefactHistoryProps,
  type ArtefactCallersProps,
  type ArtefactVersioningProps,
  type ArtefactDefinitionDoc,
  type ArtefactIOContract,
  type ArtefactMetrics,
  type ArtefactHistoryEntry,
  type ArtefactCaller,
  type ArtefactVersion,
  type ArtefactSchemaField,
} from "./ArtefactDetailPane";
export {
  FileUploadField,
  type FileUploadFieldProps,
} from "./FileUploadField";
export { formatFileSize, fileMatchesAccept } from "./fileUploadUtils";
export {
  LifecycleStateBadge,
  type LifecycleStateBadgeProps,
  type ChipTone,
} from "./LifecycleStateBadge";

// ── DS-SIMPLIFY 03: Tag primitive ─────────────────────────────────────────────
// Canonical tone-coded text-indicator. Subsumes Chip, Badge, StatusPill,
// LifecycleStateBadge, and MetadataChip inline badge patterns.
export {
  Tag,
  type TagProps,
  type TagVariant,
  type TagSize,
  // TagTone is the canonical tone vocabulary going forward.
  type TagTone,
} from "./Tag";
// Deprecated alias for TagTone — use TagTone directly for new code.
export type { TagTone as ChipPaletteToneCanonical } from "./Tag";
export {
  DetailRow,
  DetailSection,
  DetailMetric,
  type DetailRowProps,
  type DetailSectionProps,
  type DetailMetricProps,
} from "./DetailPrimitives";
export {
  EntityCard,
  EntityCardList,
  type EntityCardProps,
  type EntityCardListProps,
  type EntityCardDensity,
} from "./EntityCard";

// Dashboard primitives (Phase 1A)
export {
  StatusPill,
  type StatusPillProps,
  type StatusPillStatus,
} from "./StatusPill";

export {
  MetadataChip,
  type MetadataChipProps,
  type MetadataChipFreshness,
  type MetadataChipTone,
} from "./MetadataChip";

export {
  SectionHeader,
  type SectionHeaderProps,
} from "./SectionHeader";

export {
  EmptyState,
  type EmptyStateProps,
  type EmptyStateAction,
} from "./EmptyState";

export {
  CompactListRow,
  type CompactListRowProps,
} from "./CompactListRow";

// DashboardChartCard intentionally NOT re-exported here.
// Import directly from "@ds/core/react/charts/DashboardChartCard" — keeps
// recharts (optional peer) out of the bundle path for consumers that don't
// use charts.

// ── Phase 2 foundation primitives ────────────────────────────────────────────
// Accessibility utilities
export { useReducedMotion } from "./a11y/useReducedMotion";
export { useFocusTrap, type UseFocusTrapOptions } from "./a11y/useFocusTrap";
export {
  LiveRegion,
  AnnounceProvider,
  useAnnounce,
  type LiveRegionProps,
  type LiveRegionPoliteness,
  type AnnounceProviderProps,
} from "./a11y/LiveRegion";

// Toast — provider + hook are the public surface; consumers should not
// render an individual toast manually. The `Toast` type is exported below.
export {
  ToastProvider,
  useToast,
} from "./Toast";
export type {
  Toast,
  ToastTone,
  ToastAction,
  ToastInput,
  ToastContextValue,
  ToastProviderProps,
} from "./Toast";

// Overlay — unified primitive (SIMPLIFY 01). Modal/Drawer/DetailPane/
// ExpandableDetailPane/ArtefactDetailPane/DrilldownLayout/FullScreenDetail
// remain as @deprecated re-exports until SIMPLIFY 14.
export {
  Overlay,
  type OverlayProps,
  type OverlayPlacement,
  type OverlaySize,
  type OverlaySection,
} from "./Overlay";

// Modal + Drawer
export {
  Modal,
  type ModalProps,
  type ModalSize,
} from "./Modal";
export {
  Drawer,
  type DrawerProps,
  type DrawerSide,
  type DrawerSize,
} from "./Drawer";

// Kbd, Tooltip, Avatar, Skeleton bundle
export { Kbd, type KbdProps } from "./Kbd";
export { Tooltip, type TooltipProps, type TooltipPlacement } from "./Tooltip";
export {
  Avatar,
  type AvatarProps,
  type AvatarSize,
  type AvatarShape,
} from "./Avatar";
export {
  Skeleton,
  type SkeletonProps,
  type SkeletonShape,
} from "./Skeleton";

// Locale / timezone / currency Fmt + Lens
export {
  FmtProvider,
  useFmt,
  Fmt,
  DEFAULT_FMT,
  type FmtSettings,
  type FmtProviderProps,
  type FmtContextValue,
  type UseFmtOptions,
  type DateProps as FmtDateProps,
  type DateTimeProps as FmtDateTimeProps,
  type MoneyProps as FmtMoneyProps,
  type NumberProps as FmtNumberProps,
  type RelativeProps as FmtRelativeProps,
} from "./fmt/Fmt";
export { Lens, type LensProps } from "./fmt/Lens";

// Multi-select hook + BulkBar
export {
  useMultiSelect,
  type UseMultiSelectOptions,
  type UseMultiSelectResult,
} from "./hooks/useMultiSelect";
export {
  BulkBar,
  type BulkBarProps,
  type BulkBarAction,
} from "./BulkBar";
export {
  BulkSelectableTable,
  type BulkSelectableTableProps,
  type BulkSelectableTableAction,
  type BulkActionResult,
} from "./BulkSelectableTable";
export {
  Printable,
  PrintHeader,
  PrintFooter,
  ShareableSnapshotButton,
  type PrintableProps,
  type PrintHeaderProps,
  type PrintFooterProps,
  type ShareableSnapshotButtonProps,
  type SnapshotMintRequest,
  type SnapshotMintResult,
} from "./Printable";
export {
  useNotifications,
  type NotificationsState,
  type UseNotificationsOptions,
  type QuietHoursWindow,
  type AddOptions,
  type SnoozeOptions,
} from "./useNotifications";
export { type NotificationPriority } from "./Trays";

// Saved views (deep-link sharing) + back stack
export {
  useSavedViews,
  type SavedView,
  type UseSavedViewsOptions,
  type UseSavedViewsResult,
} from "./hooks/useSavedViews";
export {
  useBackStack,
  type BackStackEntry,
  type UseBackStackOptions,
  type UseBackStackResult,
} from "./hooks/useBackStack";

// Breadcrumbs
export {
  Breadcrumbs,
  type BreadcrumbsProps,
  type BreadcrumbItem,
} from "./Breadcrumbs";

// Command palette (Cmd+K)
export {
  CommandPalette,
  type CommandPaletteProps,
  type CommandItem,
} from "./CommandPalette";

// Trays — TasksTray + NotificationsTray (notifications digest contract)
export {
  TasksTray,
  NotificationsTray,
  type TasksTrayProps,
  type NotificationsTrayProps,
  type TrayTask,
  type TrayNotification,
} from "./Trays";

// Print + shareable read-only link
export {
  ShareReadOnlyLink,
  type ShareReadOnlyLinkProps,
} from "./ShareReadOnlyLink";

// Saved-views picker UI (on top of `useSavedViews`)
export {
  SavedViewsMenu,
  type SavedViewsMenuProps,
} from "./SavedViewsMenu";

// First-run / empty-tenant onboarding
export {
  FirstRunGuide,
  type FirstRunGuideProps,
  type FirstRunStep,
} from "./FirstRunGuide";

// Role-aware homepage cards
export {
  HomepageCards,
  type HomepageCardsProps,
  type HomepageCard,
} from "./HomepageCards";

// ── @aa/ui retirement — Phase 1 foundational primitives ──────────────────────
export {
  Button,
  type ButtonProps,
  type ButtonVariant,
  type ButtonSize,
} from "./Button";
export {
  Spinner,
  type SpinnerProps,
  type SpinnerSize,
} from "./Spinner";
export {
  Chip,
  Badge,
  type ChipProps,
  type ChipTone as ChipPaletteTone,
  type BadgeProps,
} from "./Chip";
export {
  Tabs,
  type TabsProps,
  type TabItem,
} from "./Tabs";
export {
  Sparkline,
  type SparklineProps,
  type SparklineTone,
  type SparklineSize,
} from "./charts/Sparkline";

// ── DS-SIMPLIFY 02 — State primitive (unified state-messaging) ────────────────
export {
  State,
  type StateProps,
  type StateVariant,
  type StateDensity,
} from "./State";

// ── @aa/ui retirement — Phase 2 utility surfaces ─────────────────────────────
// @deprecated — these individual state components are superseded by <State>.
//   Use <State variant="…" density="…"> instead. Will be removed in v1.0 (SIMPLIFY 14).
export {
  AwaitingState,
  type AwaitingStateProps,
  type AwaitingStatus,
} from "./AwaitingState";
export {
  StaleDataPill,
  type StaleDataPillProps,
} from "./StaleDataPill";
export {
  StateBanner,
  type StateBannerProps,
  type StateBannerKind,
  type StateBannerAction,
} from "./StateBanner";
export {
  OfflineBanner,
  type OfflineBannerProps,
} from "./OfflineBanner";
export {
  Diff,
  diffLines,
  type DiffProps,
  type DiffMode,
  type DiffLine,
} from "./Diff";

// ── @aa/ui retirement — Phase 3 extensions of existing components ─────────────
// Card now exported here (was previously only available via the ./react/Card
// subpath) so the extended `actions`, `footer`, `padded` props are discoverable
// from the barrel.
export { Card, type CardProps } from "./Card";

// ── DS-SIMPLIFY 09: ActivityTimeline (supersedes AuditLogList) ────────────────
export {
  ActivityTimeline,
  type ActivityTimelineProps,
  type ActivityEntry,
  type ActivityEntryKind,
} from "./ActivityTimeline";

// AuditLogList — deprecated alias; kept for back-compat until v1.0 (SIMPLIFY 14).
export {
  AuditLogList,
  type AuditLogListProps,
  type AuditEvent,
} from "./AuditLogList";

// ── @aa/ui retirement — Phase 4 composed primitives ──────────────────────────
export {
  useSplitPane,
  type UseSplitPaneOptions,
  type UseSplitPaneResult,
} from "./hooks/useSplitPane";
export {
  DrilldownLayout,
  type DrilldownLayoutProps,
} from "./DrilldownLayout";
export {
  FullScreenDetail,
  type FullScreenDetailProps,
} from "./FullScreenDetail";

// ── DS-SIMPLIFY 05: PlatformAppShell — pre-composed shell ─────────────────────
// TopBar + AppShell are demoted to internal; consumers compose at the
// PlatformAppShell layer. Sub-primitive files remain in `react/` for
// internal composition only.
export {
  PlatformAppShell,
  type PlatformAppShellProps,
  type BrandKey,
  type AppKey,
  type ModuleDef,
  type UserDef,
  type CompanyGroup,
  type AppDef,
} from "./PlatformAppShell";

// ── DS-SIMPLIFY 05: Deprecated re-exports of demoted shell sub-primitives ────
// AppShell, TopBar, NavRail, CompanyGroupSwitcher were demoted from the public
// barrel in DS-SIMPLIFY 05 in favour of PlatformAppShell. Re-exported here with
// @deprecated tags during the deprecation window; deleted at SIMPLIFY 14
// (v1.0 cutover) after all consumers migrate to PlatformAppShell.
/** @deprecated since 0.7 — use PlatformAppShell. Removed in v1.0 (DS-SIMPLIFY 14). */
export { AppShell, type AppShellProps } from "./AppShell";
/** @deprecated since 0.7 — use PlatformAppShell. Removed in v1.0 (DS-SIMPLIFY 14). */
export { TopBar, type TopBarProps } from "./TopBar";
/** @deprecated since 0.7 — use PlatformAppShell. Removed in v1.0 (DS-SIMPLIFY 14). */
export {
  CompanyGroupSwitcher,
  type CompanyGroupSwitcherProps,
} from "./CompanyGroupSwitcher";
/** @deprecated since 0.7 — use PlatformAppShell. Removed in v1.0 (DS-SIMPLIFY 14). */
export { NavRail, type NavRailProps, type NavRailItem } from "./NavRail";

// ── @aa/ui retirement — Phase 6 navigation hook ──────────────────────────────
export {
  useNavigateWithOrigin,
  encodeOrigin,
  decodeOrigin,
  buildUrlWithOrigin,
  type OriginContext,
} from "./hooks/useNavigateWithOrigin";

// ── DS-SIMPLIFY 08: Graph — unified data-viz primitive ───────────────────────
// Subsumes Sparkline, MetricChartCard, DashboardChartCard, KpiTile, HeatmapChart,
// RelationshipGraph, DistributionPlot into one layout-discriminated primitive.
// force/hierarchical layouts are stubbed — coming in v1.1 with @xyflow/react.
export { Graph } from "./Graph";
export type {
  GraphProps,
  GraphLayout,
  GraphData,
  LegendDef,
  LegendItem,
  TimeSeriesData,
  TimeSeriesPoint,
  HeatmapData,
  HeatmapCell,
  DistributionData,
  DistributionBin,
  NetworkData,
  GraphNode,
  GraphEdge,
} from "./Graph.types";

// ── DS-SIMPLIFY 10: AISuggestionsPane — canonical AI-review surface ──────────
export {
  AISuggestionsPane,
  type AISuggestionsPaneProps,
  type Suggestion,
} from "./AISuggestionsPane";

// ── DS-SIMPLIFY 07: EntityPicker — standalone search + inline-create combobox ─
export { EntityPicker, type EntityPickerProps } from "./EntityPicker";

// ── DS-SIMPLIFY 12: layout atoms cluster ─────────────────────────────────────
export {
  Stack,
  type StackProps,
  type StackGap,
  type StackAlign,
} from "./Stack";
export {
  Row,
  type RowProps,
  type RowAlign,
  type RowJustify,
} from "./Row";
export {
  Text,
  type TextProps,
  type TextSize,
  type TextWeight,
  type TextTone,
  type TextAs,
} from "./Text";
export {
  Menu,
  MenuItem,
  MenuSeparator,
  MenuLabel,
  type MenuProps,
  type MenuItemProps,
  type MenuSeparatorProps,
  type MenuLabelProps,
  type MenuPlacement,
} from "./Menu";
export {
  Disclosure,
  Accordion,
  type DisclosureProps,
  type DisclosureIcon,
  type AccordionProps,
  type AccordionItem,
} from "./Disclosure";

// ── DS-MIG P1-01: AuthLayout — login/signup/SSO callback layout ─────────────
export {
  AuthLayout,
  AuthScreen,
  type AuthLayoutProps,
  type AuthLayoutVariant,
} from "./AuthLayout";

// ── DS-MIG P1-02: ErrorPage family — NotFound, ServerError, Degraded ────────
export {
  NotFound,
  ServerError,
  Degraded,
  type ErrorPageProps,
  type NotFoundProps,
  type ServerErrorProps,
  type DegradedProps,
} from "./ErrorPage";

// ── DS-MIG P1-03: DataTable — sort/filter/select/paginate table ─────────────
export {
  DataTable,
  type DataTableProps,
  type DataTableColumn,
  type DataTableSortState,
  type DataTableSortDirection,
  type DataTablePagination,
  type DataTableSelection,
} from "./DataTable";

// ── DS-MIG P1-04: HeatmapChart / MatrixChart — matrix visualization ─────────
export {
  HeatmapChart,
  MatrixChart,
  type HeatmapChartProps,
  type MatrixChartProps,
  type HeatmapCell as HeatmapChartCell,
} from "./HeatmapChart";

// ── DS-MIG P1-12: AppSwitcher — standalone cross-app nav dropdown ───────────
export {
  AppSwitcher,
  type AppSwitcherProps,
  type AppSwitcherApp,
} from "./AppSwitcher";

// ── DS-MIG P1-13: UserMenu — standalone user popover ────────────────────────
export {
  UserMenu,
  type UserMenuProps,
  type UserMenuUser,
} from "./UserMenu";

// ── DS-MIG P1-14: MetaRow — horizontal label-value metadata strip ───────────
export {
  MetaRow,
  type MetaRowProps,
  type MetaRowItem,
  type MetaRowSize,
  type MetaRowLayout,
} from "./MetaRow";

// ── EXT primitives — domain extension components ────────────────────────────

// EXT-AIProvenanceChip — AI provenance metadata chip
export {
  AIProvenanceChip,
  ProvenanceChip,
  type AIProvenanceChipProps,
  type AIProvenanceConfidenceLevel,
  type AIProvenanceVariant,
} from "./AIProvenanceChip";

// EXT-DryRunPanel — blast-radius preview panel
export {
  DryRunPanel,
  type DryRunPanelProps,
  type DryRunEntity,
  type DryRunRiskLevel,
} from "./DryRunPanel";

// EXT-CommanderView — three-pane incident command layout
export {
  CommanderView,
  type CommanderViewProps,
  type CircuitBreakerState,
  type VendorCohortLane,
} from "./CommanderView";

// EXT-DualMeasurementLayout — side-by-side continuous + discrete cadence
export {
  DualMeasurementLayout,
  type DualMeasurementLayoutProps,
  type DualMeasurementVariant,
  type CircuitBreakerBand,
} from "./DualMeasurementLayout";

// EXT-CascadePanel — parent-child cascade visualization
export {
  CascadePanel,
  type CascadePanelProps,
  type CascadeNode,
  type CascadeNodeStatus,
} from "./CascadePanel";

// EXT-EntitlementPanel — recipient entitlement display
export {
  EntitlementPanel,
  type EntitlementPanelProps,
  type Entitlement,
  type EntitlementType,
  type EntitlementSource,
} from "./EntitlementPanel";

// EXT-ConcentrationHeatmap — risk/vendor concentration grid
export {
  ConcentrationHeatmap,
  type ConcentrationHeatmapProps,
  type ConcentrationCell,
  type ConcentrationThresholds,
} from "./ConcentrationHeatmap";

// EXT-LegalNameComposer / MultiScriptNameBlock — multi-script name display
export {
  MultiScriptNameBlock,
  LegalNameComposer,
  type MultiScriptNameBlockProps,
  type LegalNameComposerProps,
  type NameScript,
} from "./MultiScriptNameBlock";

// EXT-PointInTimeReplayer — temporal replay control
export {
  PointInTimeReplayer,
  type PointInTimeReplayerProps,
  type Snapshot,
} from "./PointInTimeReplayer";

// DependencyGraphPane — feature/model dependency graph
export {
  DependencyGraphPane,
  type DependencyGraphPaneProps,
  type DependencyNode,
  type DependencyEdge,
  type DependencyNodeStatus,
} from "./DependencyGraphPane";

// EvidenceBundleViewer — structured evidence bundle viewer
export {
  EvidenceBundleViewer,
  type EvidenceBundleViewerProps,
  type EvidenceFile,
  type EvidenceFileStatus,
} from "./EvidenceBundleViewer";

// HashChainVerifier — hash chain integrity verification
export {
  HashChainVerifier,
  type HashChainVerifierProps,
  type ChainBlock,
  type ChainBlockStatus,
} from "./HashChainVerifier";

// EXT-SuggestedFieldRow — DetailRow with AI provenance + accept/decline
export {
  SuggestedFieldRow,
  type SuggestedFieldRowProps,
} from "./SuggestedFieldRow";

// EXT-GraphEdgeChip — dependency-graph edge attribute chip
export {
  GraphEdgeChip,
  type GraphEdgeChipProps,
  type GraphEdgeDirection,
  type GraphEdgeType,
} from "./GraphEdgeChip";

// DS: RelationshipGraph — interactive relationship graph visualization
export {
  RelationshipGraph,
  type RelationshipGraphProps,
  type RelationshipNode,
  type RelationshipEdge,
  type RelationshipNodeType,
} from "./RelationshipGraph";

// ── DS variant / improvement components ─────────────────────────────────────

// Toolbar / PrimaryActionBar — queue-position variant
export {
  Toolbar,
  PrimaryActionBar,
  type ToolbarProps,
  type PrimaryActionBarProps,
  type ToolbarVariant,
  type ToolbarAction,
} from "./Toolbar";

// EnvelopeBadge — multi-field chip group for resolved envelope
export {
  EnvelopeBadge,
  type EnvelopeBadgeProps,
  type EnvelopeBadgeField,
} from "./EnvelopeBadge";

// FreshnessPill — freshness class display
export {
  FreshnessPill,
  type FreshnessPillProps,
  type FreshnessClass,
} from "./FreshnessPill";

// ── DS-MIG P1-05: ThreadView — messaging pane for outreach/chat ────────────
export {
  ThreadView,
  type ThreadViewProps,
  type ThreadMessage,
} from "./ThreadView";

