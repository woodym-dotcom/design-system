export type Theme = "light" | "dark" | "system";
export declare function useTheme(): {
    theme: Theme;
    setTheme: (t: Theme) => void;
    cycle: () => void;
};
/**
 * Call once at app startup (before React renders) to avoid a flash of wrong
 * theme. Reads localStorage and sets data-theme on <html> synchronously.
 */
export declare function initTheme(): void;
//# sourceMappingURL=useTheme.d.ts.map