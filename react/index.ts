export { useTheme, initTheme, type Theme } from "./useTheme";
export {
  useUrlFilterState,
  useUrlFilterStateRouter,
  type UseUrlFilterStateOptions,
  type UrlFilterStateRouterAdapter,
  type TanStackRouterAdapterInput,
} from "./hooks/useUrlFilterState";
export { FormField, type FormFieldProps, type FormFieldType } from "./FormField";
export { FilterBar, type FilterBarProps, type FilterChip } from "./FilterBar";
export { NavRail, type NavRailProps, type NavRailItem, type NavRailRenderItemContext } from "./NavRail";
export { CreateMenu, type CreateMenuProps, type CreateMenuItem, type CreateMenuKind } from "./CreateMenu";

// EntityForm module (G3)
export {
  buildEntitySchema,
  setOrchestratorBridge,
  getOrchestratorBridge,
  useEntityForm,
  EntityForm,
  TextField,
  NumberField,
  SelectField,
  MultiSelectField,
  DateField,
  MoneyField,
  EntityReferenceField,
  RichTextField,
  registerFieldType,
  getFieldTypeComponent,
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
export {
  CompanyGroupSwitcher,
  type CompanyGroupSwitcherProps,
  type CompanyGroupOption,
} from "./CompanyGroupSwitcher";
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
  type DateProps as FmtDateProps,
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

