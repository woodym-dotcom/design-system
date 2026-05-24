import { jsx as _jsx } from "react/jsx-runtime";
import { State } from './State.js';
/**
 * NotFound -- 404 error page. Wraps `<State variant="not-found">` with
 * a default "Go home" action.
 */
export function NotFound({ title, description, icon, primaryAction, secondaryAction, className, }) {
    return (_jsx(State, { variant: "not-found", density: "page", title: title, description: description, icon: icon, primaryAction: primaryAction, secondaryAction: secondaryAction, className: className }));
}
/**
 * ServerError -- 500 error page. Wraps `<State variant="error">` with
 * an optional "Retry" button.
 */
export function ServerError({ title, description, icon, primaryAction, secondaryAction, onRetry, className, }) {
    const resolvedPrimary = primaryAction ?? (onRetry
        ? { label: 'Retry', onClick: onRetry }
        : undefined);
    return (_jsx(State, { variant: "error", density: "page", title: title, description: description, icon: icon, primaryAction: resolvedPrimary, secondaryAction: secondaryAction, className: className }));
}
/**
 * Degraded -- degraded-service page/banner. Wraps `<State variant="degraded">`.
 */
export function Degraded({ title, description, icon, primaryAction, secondaryAction, className, }) {
    return (_jsx(State, { variant: "degraded", density: "page", title: title, description: description, icon: icon, primaryAction: primaryAction, secondaryAction: secondaryAction, className: className }));
}
//# sourceMappingURL=ErrorPage.js.map