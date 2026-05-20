import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Button — accessible, tokenised button primitive.
 *
 * Variants follow the brand accent system (primary, secondary, ghost, danger).
 * Sizes: sm (compact, 22px), md (default, 26px).
 * `icon` prop applies square padding suitable for an icon-only button.
 *
 * When `href` is provided, renders as <a> (with the same visual chrome). A
 * disabled link is rendered without the `href` attribute and with
 * `aria-disabled="true"` so keyboard / screen-reader users get the same
 * disabled treatment.
 *
 * Class convention matches the existing `cc-btn` CSS in primitives.css; this
 * component formalises the API surface around it.
 */
import * as React from "react";
function classes(variant, size, icon, className) {
    return [
        "cc-btn",
        `cc-btn--${variant}`,
        size === "sm" ? "cc-btn--sm" : null,
        icon ? "cc-btn--icon" : null,
        className,
    ]
        .filter(Boolean)
        .join(" ");
}
export const Button = React.forwardRef(function Button({ variant = "secondary", size = "md", icon, href, target, rel, className, children, disabled, type = "button", ...rest }, ref) {
    const cls = classes(variant, size, icon, className);
    if (href !== undefined) {
        const isDisabled = Boolean(disabled);
        return (_jsx("a", { ref: ref, className: cls, href: isDisabled ? undefined : href, target: target, rel: rel, "aria-disabled": isDisabled || undefined, ...rest, children: children }));
    }
    return (_jsx("button", { ref: ref, type: type, className: cls, disabled: disabled, ...rest, children: children }));
});
//# sourceMappingURL=Button.js.map