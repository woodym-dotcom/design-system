export type Density = "compact" | "cozy" | "spacious";
export declare function useDensity(): {
    density: Density;
    setDensity: (d: Density) => void;
    cycle: () => void;
};
/**
 * Call once at app startup (before React renders) to avoid a flash of
 * wrong density. Reads localStorage and sets data-density on <html>
 * synchronously.
 */
export declare function initDensity(): void;
//# sourceMappingURL=useDensity.d.ts.map