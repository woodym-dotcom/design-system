export { useTheme, initTheme, type Theme } from "./useTheme";
export {
  useUrlFilterState,
  useUrlFilterStateRouter,
  type UseUrlFilterStateOptions,
  type UrlFilterStateRouterAdapter,
  type TanStackRouterAdapterInput,
} from "./hooks/useUrlFilterState";
export { FormField, type FormFieldProps, type FormFieldType, type FormFieldAs } from "./FormField";
export { FilterBar, type FilterBarProps, type FilterChip } from "./FilterBar";

// EntityForm — canonical public surface. Individual field components are NOT
// exported here. Use <EntityForm schema={...}> for schema-driven forms or
// <FormField as="shell"> for arbitrary child inputs. Custom field types use
// registerFieldType(). Type surface is intentionally minimal — the 6 most-used
// types only. Other types remain internal.
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
  EntityFormProps,
  EntityFormHandle,
  EntitySchema,
  FieldType,
  FieldMeta,
  SelectOption,
} from "./entity-form/index";
export { ThemeToggle, type ThemeToggleProps } from "./ThemeToggle";
export {
  CreationWizard,
  type CreationWizardProps,
  type CreationWizardStep,
  type CreationWizardStepContext,
  type CreationWizardReviewResult,
} from "./CreationWizard";
// ── Page — unified page-template primitive ───────────────────────────────────
export { Page } from "./Page";
export type {
  PageProps,
  PageVariant,
  PageTab,
  PageHeader,
  ListVariantProps,
  ConfigVariantProps,
  MonitorVariantProps,
  ReviewVariantProps,
  DetailVariantProps,
  AuthVariantProps,
  HomeVariantProps,
} from "./Page";
export {
  TopRightCreateWizard,
  type TopRightCreateWizardProps,
  type TopRightCreateWizardVariant,
  type AiCreateConfig,
} from "./TopRightCreateWizard";
export {
  ArtefactDetailPane,
  type ArtefactDetailPaneProps,
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
// ── Tag — canonical tone-coded text-indicator ────────────────────────────────
// Subsumes Chip, Badge, StatusPill, LifecycleStateBadge, and MetadataChip
// inline badge patterns.
export {
  Tag,
  type TagProps,
  type TagVariant,
  type TagSize,
  // TagTone is the canonical tone vocabulary going forward.
  type TagTone,
} from "./Tag";
// Description — semantic <dl> primitive that subsumes DetailRow / DetailSection
// / DetailMetric / MetaRow. Use `kind="row" | "section" | "metric" | "meta"`.
export {
  Description,
  DescriptionTerm,
  DescriptionValue,
  type DescriptionProps,
  type DescriptionKind,
  type DescriptionMetaItem,
  type DescriptionMetaSize,
  type DescriptionMetaLayout,
  type DescriptionTermProps,
  type DescriptionValueProps,
} from "./Description";

export {
  SectionHeader,
  type SectionHeaderProps,
} from "./SectionHeader";

export {
  EmptyState,
  type EmptyStateProps,
  type EmptyStateAction,
} from "./EmptyState";

// DashboardChartCard intentionally NOT re-exported here.
// Import directly from "@ds/core/react/charts/DashboardChartCard" — keeps
// recharts (optional peer) out of the bundle path for consumers that don't
// use charts.

// ── Foundation: accessibility utilities ──────────────────────────────────────
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

// Overlay — unified primitive.
export {
  Overlay,
  type OverlayProps,
  type OverlayPlacement,
  type OverlaySize,
  type OverlaySection,
} from "./Overlay";

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

// Multi-select hook
export {
  useMultiSelect,
  type UseMultiSelectOptions,
  type UseMultiSelectResult,
} from "./hooks/useMultiSelect";
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

// TasksTray + NotificationsTray (notifications digest contract).
// Direct exports — no umbrella alias.
export { TasksTray, type TasksTrayProps, type TrayTask } from "./Trays";
export { NotificationsTray, type NotificationsTrayProps, type TrayNotification } from "./Trays";

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

// ── Foundational primitives ──────────────────────────────────────────────────
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
  Tabs,
  type TabsProps,
  type TabItem,
} from "./Tabs";

// ── State primitive — unified state-messaging ─────────────────────────────────
export {
  State,
  type StateProps,
  type StateVariant,
  type StateDensity,
} from "./State";

export {
  Diff,
  diffLines,
  type DiffProps,
  type DiffMode,
  type DiffLine,
} from "./Diff";

// Card — generic surface shell + entity record-card (variant="entity").
// Subsumes the legacy EntityCard / EntityCardList primitives via
// `variant="entity"` with `leading` / `trailing` / `metadata` / `density` props.
export { Card, type CardProps, type CardVariant, type CardDensity } from "./Card";

// ── ActivityTimeline ─────────────────────────────────────────────────────────
export {
  ActivityTimeline,
  type ActivityTimelineProps,
  type ActivityEntry,
  type ActivityEntryKind,
} from "./ActivityTimeline";

export {
  useSplitPane,
  type UseSplitPaneOptions,
  type UseSplitPaneResult,
} from "./hooks/useSplitPane";

export {
  AppShell,
  type AppShellProps,
  type BrandKey,
  type AppKey,
  type ModuleDef,
  type UserDef,
  type CompanyGroup,
  type AppDef,
} from "./AppShell";

// ── Navigation hook ──────────────────────────────────────────────────────────
export {
  useNavigateWithOrigin,
  encodeOrigin,
  decodeOrigin,
  buildUrlWithOrigin,
  type OriginContext,
} from "./hooks/useNavigateWithOrigin";

// ── Graph — unified data-viz primitive ───────────────────────────────────────
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

// ── AISuggestionsPane — canonical AI-review surface ──────────────────────────
export {
  AISuggestionsPane,
  type AISuggestionsPaneProps,
  type Suggestion,
} from "./AISuggestionsPane";

// ── EntityPicker — standalone search + inline-create combobox ────────────────
export { EntityPicker, type EntityPickerProps } from "./EntityPicker";

// ── Layout atoms cluster ─────────────────────────────────────────────────────
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
  type RowDensity,
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
// Disclosure — single collapsible primitive. To compose an accordion, render
// multiple <Disclosure>s; lift `open`/`onOpenChange` to a parent for single-open
// semantics.
export {
  Disclosure,
  type DisclosureProps,
  type DisclosureIcon,
} from "./Disclosure";


// ── DataTable — sort/filter/select/paginate table ───────────────────────────
export {
  DataTable,
  type DataTableProps,
  type DataTableColumn,
  type DataTableSortState,
  type DataTableSortDirection,
  type DataTablePagination,
  type DataTableSelection,
} from "./DataTable";


// ── AppSwitcher — standalone cross-app nav dropdown ─────────────────────────
export {
  AppSwitcher,
  type AppSwitcherProps,
  type AppSwitcherApp,
} from "./AppSwitcher";

// ── UserMenu — standalone user popover ──────────────────────────────────────
export {
  UserMenu,
  type UserMenuProps,
  type UserMenuUser,
} from "./UserMenu";

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

// EXT-SuggestedFieldRow — Description row with AI provenance + accept/decline
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

// Toolbar — variants + bulk mode (subsumes BulkBar via `mode="bulk"`)
export {
  Toolbar,
  type ToolbarProps,
  type ToolbarVariant,
  type ToolbarMode,
  type ToolbarAction,
  type ToolbarBulkPosition,
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

// ── ThreadView — messaging pane for outreach/chat ───────────────────────────
export {
  ThreadView,
  type ThreadViewProps,
  type ThreadMessage,
} from "./ThreadView";
