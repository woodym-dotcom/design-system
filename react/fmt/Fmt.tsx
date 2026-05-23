import * as React from 'react';

export interface FmtSettings {
  /** BCP 47 locale tag. Default 'en-GB'. */
  locale: string;
  /** IANA timezone. Default 'UTC'. */
  timezone: string;
  /** Default ISO 4217 currency code used by `Money` when not overridden. */
  currency: string;
}

export const DEFAULT_FMT: FmtSettings = {
  locale: 'en-GB',
  timezone: 'UTC',
  currency: 'GBP',
};

export interface FmtContextValue extends FmtSettings {
  /** True when a Lens override is currently active (lens stack non-empty). */
  lensActive: boolean;
  /** True when consumers should render the raw value alongside formatted. */
  showRaw: boolean;
  /** Toggle the showRaw context value. */
  setShowRaw: (next: boolean) => void;
}

/**
 * Internal sentinel — when this context value is in scope we know we are
 * outside of any FmtProvider tree and can throw under `useFmt({ strict })`.
 */
const NO_PROVIDER: FmtContextValue = {
  ...DEFAULT_FMT,
  lensActive: false,
  showRaw: false,
  setShowRaw: () => {
    /* no-op outside provider */
  },
};

const FmtContext = React.createContext<FmtContextValue>(NO_PROVIDER);
const FmtProvidedFlag = React.createContext<boolean>(false);

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
export function FmtProvider({
  children,
  lensActive,
  defaultShowRaw,
  showRaw: controlledShowRaw,
  onShowRawChange,
  ...overrides
}: FmtProviderProps) {
  const parent = React.useContext(FmtContext);
  const parentProvided = React.useContext(FmtProvidedFlag);

  const [internalShowRaw, setInternalShowRaw] = React.useState<boolean>(
    defaultShowRaw ?? parent.showRaw ?? false,
  );
  const isControlledShowRaw = controlledShowRaw !== undefined;
  const effectiveShowRaw = isControlledShowRaw ? controlledShowRaw : internalShowRaw;

  const setShowRaw = React.useCallback(
    (next: boolean) => {
      if (!isControlledShowRaw) setInternalShowRaw(next);
      onShowRawChange?.(next);
    },
    [isControlledShowRaw, onShowRawChange],
  );

  const value = React.useMemo<FmtContextValue>(
    () => ({
      locale: overrides.locale ?? (parentProvided ? parent.locale : DEFAULT_FMT.locale),
      timezone: overrides.timezone ?? (parentProvided ? parent.timezone : DEFAULT_FMT.timezone),
      currency: overrides.currency ?? (parentProvided ? parent.currency : DEFAULT_FMT.currency),
      lensActive: lensActive ?? (parentProvided ? parent.lensActive : false),
      showRaw: effectiveShowRaw,
      setShowRaw,
    }),
    [
      overrides.locale,
      overrides.timezone,
      overrides.currency,
      lensActive,
      effectiveShowRaw,
      setShowRaw,
      parent.locale,
      parent.timezone,
      parent.currency,
      parent.lensActive,
      parentProvided,
    ],
  );
  return (
    <FmtProvidedFlag.Provider value={true}>
      <FmtContext.Provider value={value}>{children}</FmtContext.Provider>
    </FmtProvidedFlag.Provider>
  );
}

export interface UseFmtOptions {
  /**
   * When true, throws if no FmtProvider is mounted above. Use this in code
   * paths that genuinely require app-level tenant settings (e.g. money
   * rendering where the wrong currency is a correctness issue).
   */
  strict?: boolean;
}

export function useFmt(opts?: UseFmtOptions): FmtContextValue {
  const provided = React.useContext(FmtProvidedFlag);
  const ctx = React.useContext(FmtContext);
  if (opts?.strict && !provided) {
    throw new Error(
      '@ds/core: useFmt({ strict: true }) called outside an <FmtProvider>.',
    );
  }
  return provided ? ctx : { ...NO_PROVIDER };
}

/** Internal helper: render the raw value in a small dim monospace span. */
function RawSibling({ value }: { value: React.ReactNode }) {
  return (
    <span className="cc-fmt__raw" aria-hidden="true">
      {value}
    </span>
  );
}

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

function toDate(value: Date | string | number): Date | null {
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function FmtDate({ value, dateStyle = 'medium', timeStyle, locale, timezone }: DateProps) {
  const ctx = useFmt();
  const d = toDate(value);
  if (!d) return <span className="cc-fmt cc-fmt--invalid" aria-label="Invalid date">—</span>;
  const fmt = new Intl.DateTimeFormat(locale ?? ctx.locale, {
    dateStyle,
    timeStyle,
    timeZone: timezone ?? ctx.timezone,
  });
  return (
    <span className="cc-fmt cc-fmt--with-raw">
      <time
        className="cc-fmt cc-fmt--date"
        dateTime={d.toISOString()}
        title={d.toISOString()}
      >
        {fmt.format(d)}
      </time>
      {ctx.showRaw ? <RawSibling value={d.toISOString()} /> : null}
    </span>
  );
}

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

function FmtMoney({ value, currency, locale, fractionDigits }: MoneyProps) {
  const ctx = useFmt();
  const cur = currency ?? ctx.currency;
  const fmt = new Intl.NumberFormat(locale ?? ctx.locale, {
    style: 'currency',
    currency: cur,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
  return (
    <span className="cc-fmt cc-fmt--money" data-currency={cur}>
      {fmt.format(value)}
      {ctx.showRaw ? <RawSibling value={`${value} ${cur}`} /> : null}
    </span>
  );
}

export interface NumberProps {
  value: number;
  locale?: string;
  /** Maximum fractional digits. */
  maxFractionDigits?: number;
  /** Number style (decimal | percent | unit). Defaults to 'decimal'. */
  style?: 'decimal' | 'percent';
}

function FmtNumber({ value, locale, maxFractionDigits, style = 'decimal' }: NumberProps) {
  const ctx = useFmt();
  const fmt = new Intl.NumberFormat(locale ?? ctx.locale, {
    style,
    maximumFractionDigits: maxFractionDigits,
  });
  return (
    <span className="cc-fmt cc-fmt--number">
      {fmt.format(value)}
      {ctx.showRaw ? <RawSibling value={String(value)} /> : null}
    </span>
  );
}

export interface RelativeProps {
  /** Date in the past or future. */
  value: Date | string | number;
  /** Optional "now" anchor (defaults to wall clock at render time). */
  now?: Date | number;
  locale?: string;
}

function formatRelativeText(
  d: Date,
  anchor: number,
  locale: string,
): string {
  const diffSec = Math.round((d.getTime() - anchor) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const abs = Math.abs(diffSec);
  let unit: Intl.RelativeTimeFormatUnit = 'second';
  let div = 1;
  if (abs >= 60 * 60 * 24 * 365) { unit = 'year'; div = 60 * 60 * 24 * 365; }
  else if (abs >= 60 * 60 * 24 * 30) { unit = 'month'; div = 60 * 60 * 24 * 30; }
  else if (abs >= 60 * 60 * 24 * 7) { unit = 'week'; div = 60 * 60 * 24 * 7; }
  else if (abs >= 60 * 60 * 24) { unit = 'day'; div = 60 * 60 * 24; }
  else if (abs >= 60 * 60) { unit = 'hour'; div = 60 * 60; }
  else if (abs >= 60) { unit = 'minute'; div = 60; }
  return rtf.format(Math.round(diffSec / div), unit);
}

function FmtRelative({ value, now, locale }: RelativeProps) {
  const ctx = useFmt();
  const d = toDate(value);
  if (!d) return <span className="cc-fmt cc-fmt--invalid">—</span>;
  const anchor = now ? (typeof now === 'number' ? now : now.getTime()) : Date.now();
  const text = formatRelativeText(d, anchor, locale ?? ctx.locale);
  return (
    <time className="cc-fmt cc-fmt--relative" dateTime={d.toISOString()} title={d.toISOString()}>
      {text}
      {ctx.showRaw ? <RawSibling value={d.toISOString()} /> : null}
    </time>
  );
}

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

function FmtDateTime({
  value,
  mode = 'absolute',
  locale,
  timezone,
  className,
}: DateTimeProps) {
  const ctx = useFmt();
  const d = toDate(value);
  if (!d) return <span className="cc-fmt cc-fmt--invalid">—</span>;
  const iso = d.toISOString();

  const absolute = new Intl.DateTimeFormat(locale ?? ctx.locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: timezone ?? ctx.timezone,
  }).format(d);

  const relative =
    mode === 'absolute'
      ? null
      : formatRelativeText(d, Date.now(), locale ?? ctx.locale);

  const text =
    mode === 'relative'
      ? relative
      : mode === 'both'
        ? `${relative} (${absolute})`
        : absolute;

  return (
    <time
      className={['cc-fmt', 'cc-fmt--datetime', className].filter(Boolean).join(' ')}
      dateTime={iso}
      title={iso}
    >
      {text}
      {ctx.showRaw ? <RawSibling value={iso} /> : null}
    </time>
  );
}

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

/**
 * Pick the largest Intl unit that the duration crosses, with the rounded
 * count in that unit. Floor to seconds for very small values; never
 * downgrade below second.
 */
function pickDurationUnit(seconds: number): { unit: Intl.NumberFormatOptions['unit']; count: number } {
  const SECOND = 1;
  const MINUTE = 60;
  const HOUR = 60 * 60;
  const DAY = 60 * 60 * 24;
  if (seconds >= DAY) return { unit: 'day', count: Math.round(seconds / DAY) };
  if (seconds >= HOUR) return { unit: 'hour', count: Math.round(seconds / HOUR) };
  if (seconds >= MINUTE) return { unit: 'minute', count: Math.round(seconds / MINUTE) };
  return { unit: 'second', count: Math.max(seconds / SECOND, 0) };
}

function FmtDuration({ value, unit = 'milliseconds', style = 'short', locale, className }: DurationProps) {
  const ctx = useFmt();
  if (!Number.isFinite(value) || value < 0) {
    return <span className="cc-fmt cc-fmt--invalid">—</span>;
  }
  const seconds = unit === 'seconds' ? value : value / 1000;
  const { unit: picked, count } = pickDurationUnit(seconds);

  // For sub-minute durations keep a single decimal to differentiate 0.75s vs 1s.
  const maxFractionDigits = picked === 'second' && seconds < 1 ? 2 : 0;

  const fmt = new Intl.NumberFormat(locale ?? ctx.locale, {
    style: 'unit',
    unit: picked,
    unitDisplay: style,
    maximumFractionDigits: maxFractionDigits,
  });

  return (
    <span
      className={['cc-fmt', 'cc-fmt--duration', className].filter(Boolean).join(' ')}
      data-unit={String(picked)}
    >
      {fmt.format(count)}
    </span>
  );
}

export const Fmt = {
  Date: FmtDate,
  DateTime: FmtDateTime,
  Duration: FmtDuration,
  Money: FmtMoney,
  Number: FmtNumber,
  Relative: FmtRelative,
};
