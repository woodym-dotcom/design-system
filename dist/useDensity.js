import { useCallback, useEffect, useState } from "react";
const STORAGE_KEY = "ds-density";
function read() {
    if (typeof window === "undefined")
        return "cozy";
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "compact" || v === "cozy" || v === "spacious" ? v : "cozy";
}
function apply(density) {
    const root = document.documentElement;
    if (density === "cozy") {
        delete root.dataset.density;
    }
    else {
        root.dataset.density = density;
    }
}
export function useDensity() {
    const [density, setDensityState] = useState(read);
    useEffect(() => {
        apply(density);
    }, [density]);
    const setDensity = useCallback((next) => {
        if (next === "cozy") {
            window.localStorage.removeItem(STORAGE_KEY);
        }
        else {
            window.localStorage.setItem(STORAGE_KEY, next);
        }
        setDensityState(next);
    }, []);
    const cycle = useCallback(() => {
        setDensity(density === "compact" ? "cozy" : density === "cozy" ? "spacious" : "compact");
    }, [density, setDensity]);
    return { density, setDensity, cycle };
}
/**
 * Call once at app startup (before React renders) to avoid a flash of
 * wrong density. Reads localStorage and sets data-density on <html>
 * synchronously.
 */
export function initDensity() {
    if (typeof window === "undefined")
        return;
    apply(read());
}
//# sourceMappingURL=useDensity.js.map