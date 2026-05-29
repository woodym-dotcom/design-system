/**
 * @ds/core/templates/aa — Automation Armoury app-specific page templates.
 *
 * Re-exports the generic Page primitive pre-narrowed to the AA module surface.
 * Consumers import from this path to signal intent ("I am building an AA page")
 * without importing the full @ds/core barrel.
 *
 * Foundation for the zero-JSX endgame: future releases add AA-specific
 * composition helpers (e.g. data-only wrappers) here.
 *
 * §14 L1: Page already exists in @ds/core/react — this is a sub-export path,
 * not a new component.
 */
export { Page, } from '../../Page.js';
//# sourceMappingURL=index.js.map