import type { PageProps } from "./Page.types.js";
export type { PageProps, PageTab, PageHeader, PageVariant, ListVariantProps, ConfigVariantProps, MonitorVariantProps, ReviewVariantProps, DetailVariantProps, AuthVariantProps, HomeVariantProps, WorkbenchVariantProps, StudioVariantProps, ConsoleVariantProps, InspectorVariantProps, DashboardVariantProps, } from "./Page.types.js";
/**
 * Page — render any page surface from a single primitive.
 * See `Page.types.ts` for the discriminated-union prop contract.
 */
export declare function Page<Row extends {
    id: string;
} = {
    id: string;
}>(props: PageProps<Row>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=Page.d.ts.map