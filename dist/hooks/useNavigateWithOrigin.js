/**
 * useNavigateWithOrigin — wrap a router-agnostic `navigate` function so
 * every call appends `?origin=<encoded>` describing where the user came
 * from. Use on detail pages so the destination can render a "back to <X>"
 * affordance even after a hard reload.
 *
 * Helper functions are exported so callers outside React (e.g. service
 * workers, tests, link generators) can encode/decode the same payload.
 */
import * as React from "react";
/**
 * base64url-encode a JSON-serialised origin context. Safe to use as a
 * URL query parameter without further escaping.
 */
export function encodeOrigin(ctx) {
    const json = JSON.stringify(ctx);
    // btoa is available in browsers + jsdom + modern Node (>=16).
    const b64 = btoa(unescape(encodeURIComponent(json)));
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
/**
 * Inverse of `encodeOrigin`. Returns null on any malformed input —
 * callers should treat the result as best-effort.
 */
export function decodeOrigin(encoded) {
    try {
        let b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
        while (b64.length % 4 !== 0)
            b64 += "=";
        const json = decodeURIComponent(escape(atob(b64)));
        const parsed = JSON.parse(json);
        if (parsed &&
            typeof parsed === "object" &&
            typeof parsed.path === "string") {
            return {
                path: parsed.path,
                label: typeof parsed.label === "string" ? parsed.label : undefined,
            };
        }
        return null;
    }
    catch {
        return null;
    }
}
/**
 * Append `origin=<encoded>` to the given path. Uses `&` when the path
 * already contains a query, otherwise `?`.
 */
export function buildUrlWithOrigin(path, origin) {
    const enc = encodeOrigin(origin);
    const sep = path.includes("?") ? "&" : "?";
    return `${path}${sep}origin=${enc}`;
}
/**
 * Returns a wrapped `navigate` that attaches an encoded origin query param
 * built from `currentPath` (+ optional `currentLabel`).
 */
export function useNavigateWithOrigin(navigate, currentPath, currentLabel) {
    // Re-create the wrapped function whenever path / label / navigate change.
    return React.useCallback((path) => {
        navigate(buildUrlWithOrigin(path, { path: currentPath, label: currentLabel }));
    }, [navigate, currentPath, currentLabel]);
}
//# sourceMappingURL=useNavigateWithOrigin.js.map