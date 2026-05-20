import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Tabs — generic tablist with roving tabindex and arrow-key navigation.
 *
 * "Activate on focus": arrow keys move focus AND fire onChange. Home/End
 * jump to the first/last enabled tab. Disabled tabs are skipped.
 *
 * Tabs is purely presentational — it does not own panel rendering. Pair it
 * with your own conditional render of the active panel keyed by `value`.
 */
import * as React from "react";
function nextEnabledIndex(items, from, step) {
    if (items.length === 0)
        return -1;
    let i = from;
    for (let k = 0; k < items.length; k++) {
        i = (i + step + items.length) % items.length;
        if (!items[i].disabled)
            return i;
    }
    return -1;
}
export function Tabs({ items, value, onChange, ariaLabel, className, id, }) {
    const activeIndex = Math.max(0, items.findIndex((it) => it.value === value));
    const buttonsRef = React.useRef([]);
    const move = (to) => {
        const item = items[to];
        if (!item || item.disabled)
            return;
        onChange?.(item.value);
        // Focus the new tab on next frame after React commits.
        queueMicrotask(() => {
            buttonsRef.current[to]?.focus();
        });
    };
    const onKey = (event) => {
        switch (event.key) {
            case "ArrowRight": {
                event.preventDefault();
                const i = nextEnabledIndex(items, activeIndex, 1);
                if (i >= 0)
                    move(i);
                break;
            }
            case "ArrowLeft": {
                event.preventDefault();
                const i = nextEnabledIndex(items, activeIndex, -1);
                if (i >= 0)
                    move(i);
                break;
            }
            case "Home": {
                event.preventDefault();
                const i = items.findIndex((it) => !it.disabled);
                if (i >= 0)
                    move(i);
                break;
            }
            case "End": {
                event.preventDefault();
                for (let i = items.length - 1; i >= 0; i--) {
                    if (!items[i].disabled) {
                        move(i);
                        break;
                    }
                }
                break;
            }
            default:
                break;
        }
    };
    return (_jsx("div", { className: ["cc-tabs", className].filter(Boolean).join(" "), role: "tablist", "aria-label": ariaLabel, onKeyDown: onKey, children: items.map((it, i) => {
            const isActive = it.value === value;
            const tabId = id ? `${id}-tab-${it.value}` : undefined;
            const panelId = id ? `${id}-panel-${it.value}` : undefined;
            return (_jsxs("button", { type: "button", ref: (el) => {
                    buttonsRef.current[i] = el;
                }, id: tabId, role: "tab", "aria-selected": isActive, "aria-controls": panelId, disabled: it.disabled || undefined, tabIndex: isActive ? 0 : -1, className: [
                    "cc-tabs__tab",
                    isActive ? "cc-tabs__tab--active" : null,
                    it.disabled ? "cc-tabs__tab--disabled" : null,
                ]
                    .filter(Boolean)
                    .join(" "), onClick: () => {
                    if (it.disabled)
                        return;
                    if (!isActive)
                        onChange?.(it.value);
                }, children: [_jsx("span", { className: "cc-tabs__label", children: it.label }), typeof it.count === "number" ? (_jsx("span", { className: "cc-tabs__count", "aria-hidden": "true", children: it.count })) : null] }, it.value));
        }) }));
}
//# sourceMappingURL=Tabs.js.map