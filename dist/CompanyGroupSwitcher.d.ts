export interface CompanyGroupOption {
    /** Stable UUID for the company group. */
    companyGroupUuid: string;
    /** Human-readable name. */
    name: string;
}
/**
 * An upper-tenancy level shown as a breadcrumb segment above the active
 * company in the trigger. Click-to-switch is delegated to `onSelect`.
 *
 * Example: an account → group → company hierarchy renders as
 *   `Account · Group › Company`
 * with each upper crumb opening its own popover when clicked.
 */
export interface CompanyGroupAncestor {
    /** Stable id for this hierarchy level. */
    id: string;
    /** Display label (e.g. account name, group name). */
    label: string;
    /**
     * Called when the user clicks this crumb. Consumers typically open their
     * own selector or navigate. Omit for non-clickable display-only crumbs.
     */
    onSelect?: () => void;
}
export interface CompanyGroupSwitcherProps {
    /** The currently active group UUID. */
    currentGroupUuid: string | null;
    /** All groups the user belongs to (from /api/session memberships). */
    memberships: CompanyGroupOption[];
    /** Called when the user selects a different group. */
    onChange: (companyGroupUuid: string) => void;
    /**
     * Optional upper-tenancy hierarchy rendered as a breadcrumb in the trigger.
     * Replaces the legacy "three stacked rows for account → group → company"
     * shell layout with a single compact switcher.
     */
    ancestors?: CompanyGroupAncestor[];
    /** Accessible label for the combobox. Default: "Switch company group". */
    ariaLabel?: string;
    /** Whether the switcher is in a loading state. */
    loading?: boolean;
    className?: string;
}
export declare function CompanyGroupSwitcher({ currentGroupUuid, memberships, onChange, ancestors, ariaLabel, loading, className, }: CompanyGroupSwitcherProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=CompanyGroupSwitcher.d.ts.map