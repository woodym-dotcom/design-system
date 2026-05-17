import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
export const DEFAULT_FMT = {
    locale: 'en-GB',
    timezone: 'UTC',
    currency: 'GBP',
};
const FmtContext = React.createContext({
    ...DEFAULT_FMT,
    lensActive: false,
});
/**
 * Wraps an app subtree with locale / timezone / currency defaults that
 * every Fmt.* primitive consumes. Override any of the three on a per-
 * provider basis (e.g. a tenant-scoped provider near the root).
 */
export function FmtProvider({ children, lensActive, ...overrides }) {
    const parent = React.useContext(FmtContext);
    const value = React.useMemo(() => ({
        locale: overrides.locale ?? parent.locale,
        timezone: overrides.timezone ?? parent.timezone,
        currency: overrides.currency ?? parent.currency,
        lensActive: lensActive ?? parent.lensActive,
    }), [overrides.locale, overrides.timezone, overrides.currency, lensActive, parent.locale, parent.timezone, parent.currency, parent.lensActive]);
    return _jsx(FmtContext.Provider, { value: value, children: children });
}
export function useFmt() {
    return React.useContext(FmtContext);
}
function toDate(value) {
    const d = value instanceof Date ? value : new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
}
function FmtDate({ value, dateStyle = 'medium', timeStyle, locale, timezone }) {
    const ctx = useFmt();
    const d = toDate(value);
    if (!d)
        return _jsx("span", { className: "cc-fmt cc-fmt--invalid", "aria-label": "Invalid date", children: "\u2014" });
    const fmt = new Intl.DateTimeFormat(locale ?? ctx.locale, {
        dateStyle,
        timeStyle,
        timeZone: timezone ?? ctx.timezone,
    });
    return (_jsx("time", { className: "cc-fmt cc-fmt--date", dateTime: d.toISOString(), title: d.toISOString(), children: fmt.format(d) }));
}
function FmtMoney({ value, currency, locale, fractionDigits }) {
    const ctx = useFmt();
    const cur = currency ?? ctx.currency;
    const fmt = new Intl.NumberFormat(locale ?? ctx.locale, {
        style: 'currency',
        currency: cur,
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    });
    return _jsx("span", { className: "cc-fmt cc-fmt--money", "data-currency": cur, children: fmt.format(value) });
}
function FmtNumber({ value, locale, maxFractionDigits, style = 'decimal' }) {
    const ctx = useFmt();
    const fmt = new Intl.NumberFormat(locale ?? ctx.locale, {
        style,
        maximumFractionDigits: maxFractionDigits,
    });
    return _jsx("span", { className: "cc-fmt cc-fmt--number", children: fmt.format(value) });
}
function FmtRelative({ value, now, locale }) {
    const ctx = useFmt();
    const d = toDate(value);
    if (!d)
        return _jsx("span", { className: "cc-fmt cc-fmt--invalid", children: "\u2014" });
    const anchor = now ? (typeof now === 'number' ? now : now.getTime()) : Date.now();
    const diffSec = Math.round((d.getTime() - anchor) / 1000);
    const rtf = new Intl.RelativeTimeFormat(locale ?? ctx.locale, { numeric: 'auto' });
    const abs = Math.abs(diffSec);
    let unit = 'second';
    let div = 1;
    if (abs >= 60 * 60 * 24 * 365) {
        unit = 'year';
        div = 60 * 60 * 24 * 365;
    }
    else if (abs >= 60 * 60 * 24 * 30) {
        unit = 'month';
        div = 60 * 60 * 24 * 30;
    }
    else if (abs >= 60 * 60 * 24 * 7) {
        unit = 'week';
        div = 60 * 60 * 24 * 7;
    }
    else if (abs >= 60 * 60 * 24) {
        unit = 'day';
        div = 60 * 60 * 24;
    }
    else if (abs >= 60 * 60) {
        unit = 'hour';
        div = 60 * 60;
    }
    else if (abs >= 60) {
        unit = 'minute';
        div = 60;
    }
    return (_jsx("time", { className: "cc-fmt cc-fmt--relative", dateTime: d.toISOString(), title: d.toISOString(), children: rtf.format(Math.round(diffSec / div), unit) }));
}
export const Fmt = {
    Date: FmtDate,
    Money: FmtMoney,
    Number: FmtNumber,
    Relative: FmtRelative,
};
//# sourceMappingURL=Fmt.js.map