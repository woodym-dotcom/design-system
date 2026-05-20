import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
export const DEFAULT_FMT = {
    locale: 'en-GB',
    timezone: 'UTC',
    currency: 'GBP',
};
/**
 * Internal sentinel — when this context value is in scope we know we are
 * outside of any FmtProvider tree and can throw under `useFmt({ strict })`.
 */
const NO_PROVIDER = {
    ...DEFAULT_FMT,
    lensActive: false,
    showRaw: false,
    setShowRaw: () => {
        /* no-op outside provider */
    },
};
const FmtContext = React.createContext(NO_PROVIDER);
const FmtProvidedFlag = React.createContext(false);
/**
 * Wraps an app subtree with locale / timezone / currency defaults that
 * every Fmt.* primitive consumes. Override any of the three on a per-
 * provider basis (e.g. a tenant-scoped provider near the root).
 */
export function FmtProvider({ children, lensActive, defaultShowRaw, showRaw: controlledShowRaw, onShowRawChange, ...overrides }) {
    const parent = React.useContext(FmtContext);
    const parentProvided = React.useContext(FmtProvidedFlag);
    const [internalShowRaw, setInternalShowRaw] = React.useState(defaultShowRaw ?? parent.showRaw ?? false);
    const isControlledShowRaw = controlledShowRaw !== undefined;
    const effectiveShowRaw = isControlledShowRaw ? controlledShowRaw : internalShowRaw;
    const setShowRaw = React.useCallback((next) => {
        if (!isControlledShowRaw)
            setInternalShowRaw(next);
        onShowRawChange?.(next);
    }, [isControlledShowRaw, onShowRawChange]);
    const value = React.useMemo(() => ({
        locale: overrides.locale ?? (parentProvided ? parent.locale : DEFAULT_FMT.locale),
        timezone: overrides.timezone ?? (parentProvided ? parent.timezone : DEFAULT_FMT.timezone),
        currency: overrides.currency ?? (parentProvided ? parent.currency : DEFAULT_FMT.currency),
        lensActive: lensActive ?? (parentProvided ? parent.lensActive : false),
        showRaw: effectiveShowRaw,
        setShowRaw,
    }), [
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
    ]);
    return (_jsx(FmtProvidedFlag.Provider, { value: true, children: _jsx(FmtContext.Provider, { value: value, children: children }) }));
}
export function useFmt(opts) {
    const provided = React.useContext(FmtProvidedFlag);
    const ctx = React.useContext(FmtContext);
    if (opts?.strict && !provided) {
        throw new Error('@ds/core: useFmt({ strict: true }) called outside an <FmtProvider>.');
    }
    return provided ? ctx : { ...NO_PROVIDER };
}
/** Internal helper: render the raw value in a small dim monospace span. */
function RawSibling({ value }) {
    return (_jsx("span", { className: "cc-fmt__raw", "aria-hidden": "true", children: value }));
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
    return (_jsxs("span", { className: "cc-fmt cc-fmt--with-raw", children: [_jsx("time", { className: "cc-fmt cc-fmt--date", dateTime: d.toISOString(), title: d.toISOString(), children: fmt.format(d) }), ctx.showRaw ? _jsx(RawSibling, { value: d.toISOString() }) : null] }));
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
    return (_jsxs("span", { className: "cc-fmt cc-fmt--money", "data-currency": cur, children: [fmt.format(value), ctx.showRaw ? _jsx(RawSibling, { value: `${value} ${cur}` }) : null] }));
}
function FmtNumber({ value, locale, maxFractionDigits, style = 'decimal' }) {
    const ctx = useFmt();
    const fmt = new Intl.NumberFormat(locale ?? ctx.locale, {
        style,
        maximumFractionDigits: maxFractionDigits,
    });
    return (_jsxs("span", { className: "cc-fmt cc-fmt--number", children: [fmt.format(value), ctx.showRaw ? _jsx(RawSibling, { value: String(value) }) : null] }));
}
function formatRelativeText(d, anchor, locale) {
    const diffSec = Math.round((d.getTime() - anchor) / 1000);
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
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
    return rtf.format(Math.round(diffSec / div), unit);
}
function FmtRelative({ value, now, locale }) {
    const ctx = useFmt();
    const d = toDate(value);
    if (!d)
        return _jsx("span", { className: "cc-fmt cc-fmt--invalid", children: "\u2014" });
    const anchor = now ? (typeof now === 'number' ? now : now.getTime()) : Date.now();
    const text = formatRelativeText(d, anchor, locale ?? ctx.locale);
    return (_jsxs("time", { className: "cc-fmt cc-fmt--relative", dateTime: d.toISOString(), title: d.toISOString(), children: [text, ctx.showRaw ? _jsx(RawSibling, { value: d.toISOString() }) : null] }));
}
function FmtDateTime({ value, mode = 'absolute', locale, timezone, className, }) {
    const ctx = useFmt();
    const d = toDate(value);
    if (!d)
        return _jsx("span", { className: "cc-fmt cc-fmt--invalid", children: "\u2014" });
    const iso = d.toISOString();
    const absolute = new Intl.DateTimeFormat(locale ?? ctx.locale, {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: timezone ?? ctx.timezone,
    }).format(d);
    const relative = mode === 'absolute'
        ? null
        : formatRelativeText(d, Date.now(), locale ?? ctx.locale);
    const text = mode === 'relative'
        ? relative
        : mode === 'both'
            ? `${relative} (${absolute})`
            : absolute;
    return (_jsxs("time", { className: ['cc-fmt', 'cc-fmt--datetime', className].filter(Boolean).join(' '), dateTime: iso, title: iso, children: [text, ctx.showRaw ? _jsx(RawSibling, { value: iso }) : null] }));
}
export const Fmt = {
    Date: FmtDate,
    DateTime: FmtDateTime,
    Money: FmtMoney,
    Number: FmtNumber,
    Relative: FmtRelative,
};
//# sourceMappingURL=Fmt.js.map