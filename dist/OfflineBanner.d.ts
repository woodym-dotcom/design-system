/**
 * @deprecated Use `<State variant="offline" density="banner">` from `./State` instead.
 * This component will be removed in v1.0 (DS-SIMPLIFY 14).
 *
 * OfflineBanner — subscribes to window 'online'/'offline' events and
 * renders <StateBanner kind="offline" /> while navigator.onLine is false.
 */
import * as React from "react";
export interface OfflineBannerProps {
    /** Override the default banner copy. */
    message?: string;
    className?: string;
}
export declare function OfflineBanner({ message, className, }: OfflineBannerProps): React.ReactElement | null;
//# sourceMappingURL=OfflineBanner.d.ts.map