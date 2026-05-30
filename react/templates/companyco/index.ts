/**
 * @ds/core/templates/companyco — CompanyCo app-specific page templates.
 *
 * Re-exports the generic Page primitive pre-narrowed to the CompanyCo module
 * surface. Consumers import from this path to signal intent ("I am building a
 * CompanyCo page") without importing the full @ds/core barrel.
 *
 * AppShell (renamed from PlatformAppShell in DS aggressive-simplification),
 * SectionHeader, and Tag cover the remaining page-level imports across all
 * CompanyCo hub views.
 *
 * §14 L1: all primitives already exist in @ds/core/react — this is a
 * sub-export path, not new components.
 */

export {
  Page,
  type PageProps,
  type PageTab,
  type PageHeader,
  type PageVariant,
  type ListVariantProps,
  type ConfigVariantProps,
  type MonitorVariantProps,
  type ReviewVariantProps,
  type DetailVariantProps,
  type AuthVariantProps,
  type HomeVariantProps,
  type WorkbenchVariantProps,
  type StudioVariantProps,
  type ConsoleVariantProps,
  type InspectorVariantProps,
  type DashboardVariantProps,
} from '../../Page';

export {
  SectionHeader,
  type SectionHeaderProps,
} from '../../SectionHeader';

export {
  AppShell,
  type AppShellProps,
  type BrandKey,
  type AppKey,
  type ModuleDef,
  type UserDef,
  type CompanyGroup,
  type AppDef,
} from '../../AppShell';

export {
  Tag,
  type TagProps,
  type TagVariant,
  type TagTone,
  type TagSize,
} from '../../Tag';

export {
  Overlay,
  type OverlayProps,
  type OverlayPlacement,
  type OverlaySize,
  type OverlaySection,
} from '../../Overlay';

export {
  Description,
  DescriptionTerm,
  DescriptionValue,
  type DescriptionProps,
  type DescriptionKind,
} from '../../Description';
