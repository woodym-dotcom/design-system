import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/** Resolve back-compat tone alias. */
function resolveTone(tone) {
    return tone === "danger" ? "error" : tone;
}
function tagClasses(variant, tone, size, interactive, className) {
    return [
        "cc-tag",
        `cc-tag--${variant}`,
        `cc-tag--${tone}`,
        `cc-tag--${size}`,
        interactive ? "cc-tag--interactive" : null,
        className,
    ]
        .filter(Boolean)
        .join(" ");
}
export function Tag({ variant = "chip", tone: toneProp = "neutral", size = "md", dot = false, icon, onRemove, onClick, children, className, ...rest }) {
    const tone = resolveTone(toneProp);
    const interactive = typeof onClick === "function";
    const cls = tagClasses(variant, tone, size, interactive, className);
    const handleKeyDown = interactive
        ? (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
            }
        }
        : undefined;
    const inner = (_jsxs(_Fragment, { children: [dot ? (_jsx("span", { className: `cc-tag__dot cc-tag__dot--${tone}`, "aria-hidden": "true" })) : null, icon ? (_jsx("span", { className: "cc-tag__icon", "aria-hidden": "true", children: icon })) : null, _jsx("span", { className: "cc-tag__label", children: children }), onRemove ? (_jsx("button", { type: "button", className: "cc-tag__remove", "aria-label": "Remove", onClick: (e) => {
                    e.stopPropagation();
                    onRemove();
                }, onKeyDown: (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        onRemove();
                    }
                }, children: "\u00D7" })) : null] }));
    if (interactive) {
        return (_jsx("button", { type: "button", className: cls, onClick: onClick, onKeyDown: handleKeyDown, "aria-label": rest["aria-label"], "aria-pressed": rest["aria-pressed"], children: inner }));
    }
    return (_jsx("span", { className: cls, "aria-label": rest["aria-label"], children: inner }));
}
//# sourceMappingURL=Tag.js.map