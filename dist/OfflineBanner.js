import { jsx as _jsx } from "react/jsx-runtime";
/**
 * @deprecated Use `<State variant="offline" density="banner">` from `./State` instead.
 * This component will be removed in v1.0 (DS-SIMPLIFY 14).
 *
 * OfflineBanner — subscribes to window 'online'/'offline' events and
 * renders <StateBanner kind="offline" /> while navigator.onLine is false.
 */
import * as React from "react";
import { StateBanner } from "./StateBanner.js";
function isOnline() {
    if (typeof navigator === "undefined")
        return true;
    return navigator.onLine !== false;
}
export function OfflineBanner({ message, className, }) {
    const [online, setOnline] = React.useState(isOnline);
    React.useEffect(() => {
        const onOnline = () => setOnline(true);
        const onOffline = () => setOnline(false);
        window.addEventListener("online", onOnline);
        window.addEventListener("offline", onOffline);
        // In case events fired before mount.
        setOnline(isOnline());
        return () => {
            window.removeEventListener("online", onOnline);
            window.removeEventListener("offline", onOffline);
        };
    }, []);
    if (online)
        return null;
    return (_jsx(StateBanner, { kind: "offline", description: message, className: className }));
}
//# sourceMappingURL=OfflineBanner.js.map