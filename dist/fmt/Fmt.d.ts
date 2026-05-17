import * as React from 'react';
export interface FmtSettings {
    /** BCP 47 locale tag. Default 'en-GB'. */
    locale: string;
    /** IANA timezone. Default 'UTC'. */
    timezone: string;
    /** Default ISO 4217 currency code used by `Money` when not overridden. */
    currency: string;
}
export declare const DEFAULT_FMT: FmtSettings;
interface FmtContextValue extends FmtSettings {
    /** True when a Lens override is currently active (lens stack non-empty). */
    lensActive: boolean;
}
export interface FmtProviderProps extends Partial<FmtSettings> {
    children: React.ReactNode;
    /**
     * Marks the wrapped subtree as a Lens override. Consumers can read
     * `useFmt().lensActive` to render a "Showing in X view" banner. Set
     * by the `<Lens>` primitive; rarely set by application code directly.
     */
    lensActive?: boolean;
}
/**
 * Wraps an app subtree with locale / timezone / currency defaults that
 * every Fmt.* primitive consumes. Override any of the three on a per-
 * provider basis (e.g. a tenant-scoped provider near the root).
 */
export declare function FmtProvider({ children, lensActive, ...overrides }: FmtProviderProps): import("react/jsx-runtime").JSX.Element;
export declare function useFmt(): FmtContextValue;
export interface DateProps {
    /** Date, ISO 8601 string, or millisecond timestamp. */
    value: Date | string | number;
    /** Date style. Default 'medium'. */
    dateStyle?: 'short' | 'medium' | 'long' | 'full';
    /** Optional time style — when provided, time is appended. */
    timeStyle?: 'short' | 'medium' | 'long';
    /** Locale override. */
    locale?: string;
    /** Timezone override. */
    timezone?: string;
}
declare function FmtDate({ value, dateStyle, timeStyle, locale, timezone }: DateProps): import("react/jsx-runtime").JSX.Element;
export interface MoneyProps {
    /** Amount in major units (e.g. 12.50 GBP). */
    value: number;
    /** ISO 4217 currency code; falls back to the provider currency. */
    currency?: string;
    /** Locale override. */
    locale?: string;
    /** Minor unit precision; defaults to currency-appropriate. */
    fractionDigits?: number;
}
declare function FmtMoney({ value, currency, locale, fractionDigits }: MoneyProps): import("react/jsx-runtime").JSX.Element;
export interface NumberProps {
    value: number;
    locale?: string;
    /** Maximum fractional digits. */
    maxFractionDigits?: number;
    /** Number style (decimal | percent | unit). Defaults to 'decimal'. */
    style?: 'decimal' | 'percent';
}
declare function FmtNumber({ value, locale, maxFractionDigits, style }: NumberProps): import("react/jsx-runtime").JSX.Element;
export interface RelativeProps {
    /** Date in the past or future. */
    value: Date | string | number;
    /** Optional "now" anchor (defaults to wall clock at render time). */
    now?: Date | number;
    locale?: string;
}
declare function FmtRelative({ value, now, locale }: RelativeProps): import("react/jsx-runtime").JSX.Element;
export declare const Fmt: {
    Date: typeof FmtDate;
    Money: typeof FmtMoney;
    Number: typeof FmtNumber;
    Relative: typeof FmtRelative;
};
export {};
//# sourceMappingURL=Fmt.d.ts.map