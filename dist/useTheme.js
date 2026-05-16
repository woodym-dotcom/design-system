import { useCallback, useEffect, useState } from "react";
const STORAGE_KEY = "ds-theme";
function read() {
    if (typeof window === "undefined")
        return "system";
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "light" || v === "dark" || v === "system" ? v : "system";
}
function apply(theme) {
    const root = document.documentElement;
    if (theme === "system") {
        delete root.dataset.theme;
    }
    else {
        root.dataset.theme = theme;
    }
}
export function useTheme() {
    const [theme, setThemeState] = useState(read);
    useEffect(() => {
        apply(theme);
    }, [theme]);
    const setTheme = useCallback((next) => {
        if (next === "system") {
            window.localStorage.removeItem(STORAGE_KEY);
        }
        else {
            window.localStorage.setItem(STORAGE_KEY, next);
        }
        setThemeState(next);
    }, []);
    const cycle = useCallback(() => {
        setTheme(theme === "light" ? "dark" : theme === "dark" ? "system" : "light");
    }, [theme, setTheme]);
    return { theme, setTheme, cycle };
}
/**
 * Call once at app startup (before React renders) to avoid a flash of wrong
 * theme. Reads localStorage and sets data-theme on <html> synchronously.
 */
export function initTheme() {
    if (typeof window === "undefined")
        return;
    apply(read());
}
//# sourceMappingURL=useTheme.js.map