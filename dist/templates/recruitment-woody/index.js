/**
 * @ds/core/templates/recruitment-woody — Recruitment Woody app-specific page templates.
 *
 * Re-exports the page-level primitives pre-narrowed to the recruitment-woody
 * module surface. Consumers import from this path to signal intent ("I am
 * building a recruitment-woody page") without importing the full @ds/core barrel.
 *
 * Page is the canonical page-template primitive (formerly ModuleTemplate).
 * ListPageHeader, SectionHeader, and Avatar cover the remaining page-level
 * imports across all recruitment-woody domain pages.
 *
 * §14 L1: all primitives already exist in @ds/core/react — this is a
 * sub-export path, not new components.
 */
export { Page, } from '../../Page.js';
export { ListPageHeader, } from '../../ListPageHeader.js';
export { SectionHeader, } from '../../SectionHeader.js';
export { Avatar, } from '../../Avatar.js';
//# sourceMappingURL=index.js.map