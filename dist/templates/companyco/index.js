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
export { Page, } from '../../Page.js';
export { SectionHeader, } from '../../SectionHeader.js';
export { AppShell, } from '../../AppShell.js';
export { Tag, } from '../../Tag.js';
export { Overlay, } from '../../Overlay.js';
export { Description, DescriptionTerm, DescriptionValue, } from '../../Description.js';
//# sourceMappingURL=index.js.map