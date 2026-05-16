/**
 * ConfigurationsPage — two-column layout with section nav + content area.
 * Driven by ?section= URL search param (default: first section).
 */
import * as React from 'react';
export interface ConfigurationsSection {
    id: string;
    label: string;
    render: () => React.ReactNode;
}
export interface ConfigurationsPageProps {
    sections: ConfigurationsSection[];
    /** URL search-param name for the active section. Default: `section`. */
    searchParamName?: string;
    className?: string;
}
export declare function ConfigurationsPage({ sections, searchParamName, className, }: ConfigurationsPageProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ConfigurationsPage.d.ts.map