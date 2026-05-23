/**
 * ModuleTemplate — discriminated-union prop types (DS-SIMPLIFY 04).
 *
 * One `variant` discriminator selects between 7 module page surfaces:
 *
 *   - 'list'    → entity table + filters + optional detail pane (was ListPage)
 *   - 'config'  → section nav + section content (was ConfigurationsPage)
 *   - 'monitor' → KPI tiles + chart cards (was MonitoringPage)
 *   - 'review'  → queue with approve/reject/escalate + custom actions (was ReviewQueue)
 *   - 'detail'  → full-page detail view
 *   - 'auth'    → login/signup/SSO callback
 *   - 'home'    → role-aware homepage cards (was HomepageCards)
 *
 * Optional `tabs?` prop subsumes ModuleShell — when provided, the template
 * renders a tab strip; the active panel renders the variant body. Each tab
 * may carry pre-rendered `content`, allowing one ModuleTemplate to host the
 * classic monitoring/list/review/configurations 4-tab module shell.
 *
 * TypeScript prop narrowing: per-variant props are only accepted when the
 * matching `variant` literal is set. E.g. `kpis` is rejected on
 * `variant="list"` at compile time.
 */
import type * as React from "react";
import type { BreadcrumbItem } from "./Breadcrumbs";
import type { OverlayProps } from "./Overlay.types";
import type { FilterChip } from "./FilterBar";
import type { ListViewColumn, ListViewPaginationState, SortDirection } from "./ListView";
import type { GraphProps } from "./Graph.types";
import type { HomepageCard } from "./HomepageCards";
import type { BulkAction, ListPageFilters, ListPagePermissions, ListPageUrlState } from "./ListPage";
import type { BrandKey as PlatformBrandKey } from "./PlatformAppShell";
export type ModuleTemplateVariant = "list" | "config" | "monitor" | "review" | "detail" | "auth" | "home";
/**
 * One tab in a tabbed ModuleTemplate. Pre-render `content` so the host can
 * own data loading per tab. `count` renders as a small numeric badge.
 */
export interface ModuleTemplateTab {
    id: string;
    label: string;
    count?: number;
    content: React.ReactNode;
    /** Optional anchor href when the tab acts as a navigation link. */
    href?: string;
    /** Hide without removing from the array — useful for role-gated tabs. */
    hidden?: boolean;
}
export interface ModuleTemplateHeader {
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    actions?: React.ReactNode;
    /** When set, renders a "back" anchor before the breadcrumbs. */
    backHref?: string;
}
export interface FilterDef extends FilterChip {
}
export interface ColumnDef<Row> extends Omit<ListViewColumn<Row>, "render"> {
    render: (row: Row) => React.ReactNode;
}
export type SelectionMode = "none" | "single" | "multi";
export interface PaginationProps extends ListViewPaginationState {
    onPageChange: (page: number) => void;
}
export interface ListDetailSlot<Row> {
    /** Currently open row, or null when the detail pane is closed. */
    open: Row | null;
    /** Build the Overlay props for the active row. */
    render: (row: Row) => OverlayProps;
}
/** Single config section — `render` can return any node, typically an EntityForm. */
export interface ConfigSection {
    id: string;
    label: string;
    render: () => React.ReactNode;
}
export interface KpiDef {
    /** Stable key for React reconciliation. */
    id: string;
    label: string;
    value: React.ReactNode;
    delta?: React.ReactNode;
    /** When provided, renders a `<Graph layout="tile">` for trend context. */
    graph?: Omit<GraphProps, "ariaLabel"> & {
        ariaLabel?: string;
    };
}
export interface ChartCardDef {
    id: string;
    heading: React.ReactNode;
    subtitle?: React.ReactNode;
    /** Either pass a structured Graph definition, or render arbitrary content. */
    graph?: GraphProps;
    render?: () => React.ReactNode;
}
export interface ReviewItem {
    id: string;
    title: React.ReactNode;
    meta?: React.ReactNode;
    data?: Record<string, unknown>;
}
export interface ReviewActionDef<Item extends ReviewItem = ReviewItem> {
    id: string;
    label: string;
    /** Visual tone — defaults to 'ghost'. */
    tone?: "primary" | "danger" | "ghost";
    onAction: (item: Item) => void;
    isDisabled?: (item: Item) => boolean;
}
/** Re-export the canonical brand key from PlatformAppShell. */
export type ModuleTemplateBrandKey = PlatformBrandKey;
interface BaseTemplateProps {
    header: ModuleTemplateHeader;
    /** When supplied, the header is followed by a tab strip; active tab content renders below the variant body. */
    tabs?: ModuleTemplateTab[];
    /** ARIA label override for the tablist (defaults to header.title + " sections"). */
    tabsAriaLabel?: string;
    /** URL search-param name driving the active tab. Default: 'tab'. */
    tabsSearchParamName?: string;
    /** Slot rendered when the variant body would otherwise be empty. */
    emptyState?: React.ReactNode;
    loading?: boolean;
    error?: string;
    /** §18 AI provenance metadata — surfaced when present. */
    source?: {
        model?: string;
        promptVersion?: string;
    };
    className?: string;
}
export interface ListVariantProps<Row extends {
    id: string;
} = {
    id: string;
}> extends BaseTemplateProps {
    variant: "list";
    filters?: ListPageFilters;
    rows: Row[];
    columns: ColumnDef<Row>[];
    rowKey?: (r: Row) => string;
    selectable?: SelectionMode;
    selectedIds?: string[];
    onSelectionChange?: (ids: string[]) => void;
    bulkActions?: BulkAction<Row>[];
    sort?: {
        key: string;
        direction: SortDirection;
    };
    onSortChange?: (key: string, direction: SortDirection) => void;
    pagination?: PaginationProps;
    detail?: ListDetailSlot<Row>;
    search?: React.ReactNode;
    urlState?: ListPageUrlState;
    permissions?: ListPagePermissions;
    onRowClick?: (id: string) => void;
}
export interface ConfigVariantProps extends BaseTemplateProps {
    variant: "config";
    sections: ConfigSection[];
    /** URL search-param name for the active section. Default: 'section'. */
    searchParamName?: string;
}
export interface MonitorVariantProps extends BaseTemplateProps {
    variant: "monitor";
    kpis?: KpiDef[];
    chartCards?: ChartCardDef[];
}
export interface ReviewVariantProps<Item extends ReviewItem = ReviewItem> extends BaseTemplateProps {
    variant: "review";
    items: Item[];
    reviewActions?: ReviewActionDef<Item>[];
    /** Standard approve action — when omitted, no Approve button renders. */
    onApprove?: (item: Item) => void;
    onReject?: (item: Item) => void;
    onEscalate?: (item: Item) => void;
}
export interface DetailVariantProps extends BaseTemplateProps {
    variant: "detail";
    /** Body content — typically an entity detail layout. */
    children?: React.ReactNode;
}
export interface AuthVariantProps extends BaseTemplateProps {
    variant: "auth";
    /** The actual auth form (login fields + submit). */
    authForm?: React.ReactNode;
    /** Brand identifier — surfaced for theming hooks. */
    authBrand?: PlatformBrandKey;
    /** Inline error banner (e.g. "Invalid credentials"). */
    authError?: string;
    /** Slot rendered below the form (forgot password / signup links). */
    authFooter?: React.ReactNode;
}
export interface HomeVariantProps extends BaseTemplateProps {
    variant: "home";
    homepageCards: HomepageCard[];
    viewerRoles: ReadonlyArray<string>;
    columns?: 1 | 2 | 3 | 4;
}
export type ModuleTemplateProps<Row extends {
    id: string;
} = {
    id: string;
}> = ListVariantProps<Row> | ConfigVariantProps | MonitorVariantProps | ReviewVariantProps | DetailVariantProps | AuthVariantProps | HomeVariantProps;
export {};
//# sourceMappingURL=ModuleTemplate.types.d.ts.map