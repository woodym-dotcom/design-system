/**
 * @deprecated Use `<ModuleTemplate header={{ title, subtitle, actions }} ...>`
 * (DS-SIMPLIFY 04). Will be removed in v1.0 (SIMPLIFY 14).
 */
import * as React from 'react';
export interface ListPageHeaderProps {
    title: string;
    subtitle?: string;
    /** Filter controls (search, dropdowns, chips). Rendered as a flexible slot. */
    filters?: React.ReactNode;
    /** Primary create-button (or button group). Rendered on the right. */
    createAction?: React.ReactNode;
    className?: string;
}
export declare function ListPageHeader({ title, subtitle, filters, createAction, className, }: ListPageHeaderProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ListPageHeader.d.ts.map