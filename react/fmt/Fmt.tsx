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

interface FmtContextValue extends FmtSettings {
  /** True when a Lens override is currently active (lens stack non-empty). */
  lensActive: boolean;
}

const FmtContext = React.createContext<FmtContextValue>({
  ...DEFAULT_FMT,
  lensActive: false,
});

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
export function FmtProvider({ children, lensActive, ...overrides }: FmtProviderProps) {
  const parent = React.useContext(FmtContext);
  const value = React.useMemo<FmtContextValue>(
    () => ({
      locale: overrides.locale ?? parent.locale,
      timezone: overrides.timezone ?? parent.timezone,
      currency: overrides.currency ?? parent.currency,
      lensActive: lensActive ?? parent.lensActive,
    }),
    [overrides.locale, overrides.timezone, overrides.currency, lensActive, parent.locale, parent.timezone, parent.currency, parent.lensActive],
  );
  return <FmtContext.Provider value={value}>{children}</FmtContext.Provider>;
}

export function useFmt(): FmtContextValue {
  return React.useContext(FmtContext);
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
    <time
      className="cc-fmt cc-fmt--date"
      dateTime={d.toISOString()}
      title={d.toISOString()}
    >
      {fmt.format(d)}
    </time>
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
  return <span className="cc-fmt cc-fmt--money" data-currency={cur}>{fmt.format(value)}</span>;
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
  return <span className="cc-fmt cc-fmt--number">{fmt.format(value)}</span>;
}

export interface RelativeProps {
  /** Date in the past or future. */
  value: Date | string | number;
  /** Optional "now" anchor (defaults to wall clock at render time). */
  now?: Date | number;
  locale?: string;
}

function FmtRelative({ value, now, locale }: RelativeProps) {
  const ctx = useFmt();
  const d = toDate(value);
  if (!d) return <span className="cc-fmt cc-fmt--invalid">—</span>;
  const anchor = now ? (typeof now === 'number' ? now : now.getTime()) : Date.now();
  const diffSec = Math.round((d.getTime() - anchor) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale ?? ctx.locale, { numeric: 'auto' });
  const abs = Math.abs(diffSec);
  let unit: Intl.RelativeTimeFormatUnit = 'second';
  let div = 1;
  if (abs >= 60 * 60 * 24 * 365) { unit = 'year'; div = 60 * 60 * 24 * 365; }
  else if (abs >= 60 * 60 * 24 * 30) { unit = 'month'; div = 60 * 60 * 24 * 30; }
  else if (abs >= 60 * 60 * 24 * 7) { unit = 'week'; div = 60 * 60 * 24 * 7; }
  else if (abs >= 60 * 60 * 24) { unit = 'day'; div = 60 * 60 * 24; }
  else if (abs >= 60 * 60) { unit = 'hour'; div = 60 * 60; }
  else if (abs >= 60) { unit = 'minute'; div = 60; }
  return (
    <time className="cc-fmt cc-fmt--relative" dateTime={d.toISOString()} title={d.toISOString()}>
      {rtf.format(Math.round(diffSec / div), unit)}
    </time>
  );
}

export const Fmt = {
  Date: FmtDate,
  Money: FmtMoney,
  Number: FmtNumber,
  Relative: FmtRelative,
};
