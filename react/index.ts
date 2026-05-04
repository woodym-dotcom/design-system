export { useTheme, initTheme, type Theme } from "./useTheme";
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
export {
  ListView,
  type ListViewProps,
  type ListViewColumn,
  type ListViewScopeFilter,
  type ListViewPaginationMode,
  type ListViewPaginationState,
  type SortDirection,
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
} from "./TopRightCreateWizard";
