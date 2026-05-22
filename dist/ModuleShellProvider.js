import { jsx as _jsx } from "react/jsx-runtime";
/**
 * @deprecated The wider primitives that consume this provider (ListPage,
 * ConfigurationsPage, ModuleShell, ModuleTemplate) all read the same router
 * adapter via `useModuleShellRouter`. Until SIMPLIFY 14 deletes the legacy
 * primitives we keep this file available; new code should rely on the
 * ModuleTemplate API instead. (DS-SIMPLIFY 04)
 *
 * ModuleShellProvider — router adapter context for ModuleShell + friends.
 *
 * Consumers provide a ModuleShellRouterAdapter so the shell can read/write
 * the active tab from the router (TanStack, React Router, etc.) rather than
 * raw window.location.search.
 *
 * If no adapter is provided, the shell falls back to window.location.search.
 */
import * as React from 'react';
// ── Context ───────────────────────────────────────────────────────────────────
const ModuleShellRouterCtx = React.createContext(null);
export function ModuleShellProvider({ adapter, children }) {
    return (_jsx(ModuleShellRouterCtx.Provider, { value: adapter, children: children }));
}
export function useModuleShellRouter() {
    return React.useContext(ModuleShellRouterCtx);
}
//# sourceMappingURL=ModuleShellProvider.js.map