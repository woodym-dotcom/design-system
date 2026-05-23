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
export interface FmtContextValue extends FmtSettings {
    /** True when a Lens override is currently active (lens stack non-empty). */
    lensActive: boolean;
    /** True when consumers should render the raw value alongside formatted. */
    showRaw: boolean;
    /** Toggle the showRaw context value. */
    setShowRaw: (next: boolean) => void;
}
export interface FmtProviderProps extends Partial<FmtSettings> {
    children: React.ReactNode;
    /**
     * Marks the wrapped subtree as a Lens override. Consumers can read
     * `useFmt().lensActive` to render a "Showing in X view" banner. Set
     * by the `<Lens>` primitive; rarely set by application code directly.
     */
    lensActive?: boolean;
    /**
     * Initial value for the `showRaw` context flag. Default false.
     */
    defaultShowRaw?: boolean;
    /**
     * Controlled showRaw state — when provided, takes precedence over the
     * internal value.
     */
    showRaw?: boolean;
    /**
     * Called when a descendant (e.g. <Lens>) flips showRaw. Required when
     * `showRaw` is controlled.
     */
    onShowRawChange?: (next: boolean) => void;
}
/**
 * Wraps an app subtree with locale / timezone / currency defaults that
 * every Fmt.* primitive consumes. Override any of the three on a per-
 * provider basis (e.g. a tenant-scoped provider near the root).
 */
export declare function FmtProvider({ children, lensActive, defaultShowRaw, showRaw: controlledShowRaw, onShowRawChange, ...overrides }: FmtProviderProps): import("react/jsx-runtime").JSX.Element;
export interface UseFmtOptions {
    /**
     * When true, throws if no FmtProvider is mounted above. Use this in code
     * paths that genuinely require app-level tenant settings (e.g. money
     * rendering where the wrong currency is a correctness issue).
     */
    strict?: boolean;
}
export declare function useFmt(opts?: UseFmtOptions): FmtContextValue;
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
export interface DateTimeProps {
    /** Value to format. */
    value: Date | string | number;
    /**
     * Rendering mode.
     *  - "absolute" (default): Intl.DateTimeFormat output.
     *  - "relative": relative-to-now (e.g. "2 hours ago").
     *  - "both": "<relative> (<absolute>)".
     */
    mode?: 'relative' | 'absolute' | 'both';
    locale?: string;
    timezone?: string;
    className?: string;
}
declare function FmtDateTime({ value, mode, locale, timezone, className, }: DateTimeProps): import("react/jsx-runtime").JSX.Element;
export interface DurationProps {
    /** Duration value. Default unit is milliseconds. */
    value: number;
    /** Input unit; defaults to milliseconds. */
    unit?: 'milliseconds' | 'seconds';
    /** Output verbosity; defaults to short (e.g. "5 min" vs "5 minutes"). */
    style?: 'short' | 'long';
    /** Locale override. */
    locale?: string;
    className?: string;
}
declare function FmtDuration({ value, unit, style, locale, className }: DurationProps): import("react/jsx-runtime").JSX.Element;
export declare const Fmt: {
    Date: typeof FmtDate;
    DateTime: typeof FmtDateTime;
    Duration: typeof FmtDuration;
    Money: typeof FmtMoney;
    Number: typeof FmtNumber;
    Relative: typeof FmtRelative;
};
export {};
//# sourceMappingURL=Fmt.d.ts.map