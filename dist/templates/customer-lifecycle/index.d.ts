/**
 * @ds/core/templates/customer-lifecycle — Customer Lifecycle app-specific page templates.
 *
 * Re-exports the generic Page primitive pre-narrowed to the CL module surface.
 * Consumers import from this path to signal intent ("I am building a CL page")
 * without importing the full @ds/core barrel.
 *
 * Foundation for the zero-JSX endgame: future releases add CL-specific
 * composition helpers (e.g. data-only wrappers) here.
 *
 * §14 L1: Page already exists in @ds/core/react — this is a sub-export path,
 * not a new component.
 */
export { Page, type PageProps, type PageTab, type PageHeader, type PageVariant, type ListVariantProps, type ConfigVariantProps, type MonitorVariantProps, type ReviewVariantProps, type DetailVariantProps, type AuthVariantProps, type HomeVariantProps, type WorkbenchVariantProps, type StudioVariantProps, type ConsoleVariantProps, type InspectorVariantProps, type DashboardVariantProps, } from '../../Page.js';
//# sourceMappingURL=index.d.ts.map