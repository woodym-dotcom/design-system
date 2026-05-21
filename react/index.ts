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

// ── @aa/ui retirement — Phase 5 shell layer ──────────────────────────────────
export {
  TopBar,
  type TopBarProps,
} from "./TopBar";
export {
  AppShell,
  type AppShellProps,
} from "./AppShell";

// ── @aa/ui retirement — Phase 6 navigation hook ──────────────────────────────
export {
  useNavigateWithOrigin,
  encodeOrigin,
  decodeOrigin,
  buildUrlWithOrigin,
  type OriginContext,
} from "./hooks/useNavigateWithOrigin";

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

