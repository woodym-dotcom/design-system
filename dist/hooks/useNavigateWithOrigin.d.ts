export interface OriginContext {
    /** Originating path (typically the current pathname). */
    path: string;
    /** Optional human-readable label of the origin page. */
    label?: string;
}
/**
 * base64url-encode a JSON-serialised origin context. Safe to use as a
 * URL query parameter without further escaping.
 */
export declare function encodeOrigin(ctx: OriginContext): string;
/**
 * Inverse of `encodeOrigin`. Returns null on any malformed input —
 * callers should treat the result as best-effort.
 */
export declare function decodeOrigin(encoded: string): OriginContext | null;
/**
 * Append `origin=<encoded>` to the given path. Uses `&` when the path
 * already contains a query, otherwise `?`.
 */
export declare function buildUrlWithOrigin(path: string, origin: OriginContext): string;
/**
 * Returns a wrapped `navigate` that attaches an encoded origin query param
 * built from `currentPath` (+ optional `currentLabel`).
 */
export declare function useNavigateWithOrigin(navigate: (path: string) => void, currentPath: string, currentLabel?: string): (path: string) => void;
//# sourceMappingURL=useNavigateWithOrigin.d.ts.map