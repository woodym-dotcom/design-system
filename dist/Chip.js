import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/** Normalise legacy tone values. */
function normaliseTone(tone) {
    if (tone === "danger")
        return "error";
    return tone;
}
function chipClasses(tone, interactive, className) {
    return [
        "cc-chip",
        `cc-chip--${normaliseTone(tone)}`,
        interactive ? "cc-chip--button" : null,
        className,
    ]
        .filter(Boolean)
        .join(" ");
}
export function Chip({ tone = "neutral", children, icon, onRemove, onClick, className, ...rest }) {
    const interactive = typeof onClick === "function";
    const cls = chipClasses(tone, interactive, className);
    const inner = (_jsxs(_Fragment, { children: [icon ? (_jsx("span", { className: "cc-chip__icon", "aria-hidden": "true", children: icon })) : null, _jsx("span", { className: "cc-chip__label", children: children }), onRemove ? (_jsx("button", { type: "button", className: "cc-chip__remove", "aria-label": "Remove", onClick: (event) => {
                    event.stopPropagation();
                    onRemove();
                }, children: "\u00D7" })) : null] }));
    if (interactive) {
        return (_jsx("button", { type: "button", className: cls, onClick: onClick, "aria-label": rest["aria-label"], children: inner }));
    }
    return (_jsx("span", { className: cls, "aria-label": rest["aria-label"], children: inner }));
}
/** Alias — `Badge` is the same component as `Chip`. */
export const Badge = Chip;
//# sourceMappingURL=Chip.js.map