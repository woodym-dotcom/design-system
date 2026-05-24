/**
 * ErrorPage family -- NotFound, ServerError, Degraded.
 *
 * DS-MIG P1-02. Composes the existing <State> primitive into pre-configured
 * error page components with sensible defaults.
 *
 * Usage:
 *   <NotFound />
 *   <ServerError onRetry={() => location.reload()} />
 *   <Degraded description="Payment processing is temporarily unavailable." />
 */
import * as React from 'react';
import { type StateProps } from './State.js';
export interface ErrorPageProps {
    /** Override the default title. */
    title?: string;
    /** Override the default description. */
    description?: string;
    /** Custom icon. */
    icon?: React.ReactNode;
    /** Primary action button (e.g. "Go home", "Retry"). */
    primaryAction?: StateProps['primaryAction'];
    /** Secondary action link. */
    secondaryAction?: StateProps['secondaryAction'];
    className?: string;
}
export interface NotFoundProps extends ErrorPageProps {
}
/**
 * NotFound -- 404 error page. Wraps `<State variant="not-found">` with
 * a default "Go home" action.
 */
export declare function NotFound({ title, description, icon, primaryAction, secondaryAction, className, }: NotFoundProps): React.ReactElement;
export interface ServerErrorProps extends ErrorPageProps {
    /** Convenience shortcut: calls primaryAction with a "Retry" button. */
    onRetry?: () => void;
}
/**
 * ServerError -- 500 error page. Wraps `<State variant="error">` with
 * an optional "Retry" button.
 */
export declare function ServerError({ title, description, icon, primaryAction, secondaryAction, onRetry, className, }: ServerErrorProps): React.ReactElement;
export interface DegradedProps extends ErrorPageProps {
}
/**
 * Degraded -- degraded-service page/banner. Wraps `<State variant="degraded">`.
 */
export declare function Degraded({ title, description, icon, primaryAction, secondaryAction, className, }: DegradedProps): React.ReactElement;
//# sourceMappingURL=ErrorPage.d.ts.map