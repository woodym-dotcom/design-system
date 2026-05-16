import * as React from 'react';
export type ModuleShellTabId = 'review' | 'monitoring' | 'list' | 'configurations';
export interface ModuleShellTab {
    id: ModuleShellTabId;
    label: string;
    render: () => React.ReactNode;
}
/**
 * A caller-controlled tab definition for use with the {@link ModuleShellProps.tabs} prop.
 *
 * **Contract:** Supply an ordered array of tabs; the shell renders them in the
 * order given. Set `hidden: true` to suppress a tab without removing it from
 * the array (useful when tab visibility depends on runtime data or role).
 * Omitting `hidden` (or passing `false`) keeps the tab visible.
 *
 * The `id` is any string unique within the shell instance — it is used as the
 * URL `?tab=` value, the ARIA `id` suffix, and the React key. Keep it URL-safe
 * (lowercase, hyphens OK).
 *
 * When `tabs` is provided it takes full precedence over the legacy named props
 * (`review`, `monitoring`, `list`, `configurations`). Do not mix the two forms
 * in a single call-site.
 */
export interface ModuleShellTabDef {
    /** Stable, URL-safe identifier (e.g. `'list'`, `'review-queue'`). */
    id: string;
    /** Human-readable tab label. */
    label: string;
    /**
     * When `true` the tab is removed from the strip and never rendered.
     * Defaults to `false`.
     */
    hidden?: boolean;
    /** Returns the content to render when this tab is active. */
    render: () => React.ReactNode;
}
export interface ModuleShellProps {
    title: string;
    /** Optional icon rendered before the title. */
    icon?: React.ReactNode;
    actions?: React.ReactNode;
    /**
     * **Preferred API.** Ordered array of tab definitions; the shell renders
     * them in the supplied order. See {@link ModuleShellTabDef} for the full
     * contract.
     *
     * When this prop is supplied the legacy named props (`review`, `monitoring`,
     * `list`, `configurations`) are ignored.
     *
     * **Canonical ordering:** the shell sorts canonical tab ids
     * (`monitoring → list → review-queue → configurations`) into a fixed order
     * regardless of supplied position. Non-canonical ids keep their relative
     * order and are spliced in at their first canonical neighbour's slot.
     * Configurations always renders last when present. Pass `enforceTabOrder`
     * to disable.
     */
    tabs?: ModuleShellTabDef[];
    /**
     * When false, tab order is exactly as supplied (no canonical sorting).
     * Default: true.
     */
    enforceTabOrder?: boolean;
    /**
     * **Legacy API — named props.** Each tab is individually optional; omit by
     * leaving the prop undefined. Ignored when the `tabs` array prop is present.
     * At least one tab (named or via `tabs`) must be supplied.
     */
    review?: Omit<ModuleShellTab, 'id'>;
    monitoring?: Omit<ModuleShellTab, 'id'>;
    list?: Omit<ModuleShellTab, 'id'>;
    configurations?: Omit<ModuleShellTab, 'id'>;
    /**
     * URL search-param name driving the active tab. Default: `tab`.
     */
    searchParamName?: string;
    /**
     * Default active tab when the URL param is missing or invalid.
     * Default: `list` when using named props; first visible tab when using
     * the `tabs` array prop.
     */
    defaultTab?: string;
    className?: string;
}
export declare function ModuleShell({ title, icon, actions, tabs: tabsProp, enforceTabOrder, review, monitoring, list, configurations, searchParamName, defaultTab, className, }: ModuleShellProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ModuleShell.d.ts.map