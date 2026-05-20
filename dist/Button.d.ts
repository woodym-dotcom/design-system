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
export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md";
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
    /** Visual variant. Defaults to "secondary". */
    variant?: ButtonVariant;
    /** Size. Defaults to "md". */
    size?: ButtonSize;
    /** Square padding for an icon-only button. */
    icon?: boolean;
    /** When set, the button is rendered as an <a>. */
    href?: string;
    /** Optional anchor target — only used when `href` is set. */
    target?: string;
    /** rel attribute — only used when `href` is set. */
    rel?: string;
    /** Native button type — defaults to "button" (so it does not submit forms). */
    type?: "button" | "submit" | "reset";
}
export declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement | HTMLAnchorElement>>;
//# sourceMappingURL=Button.d.ts.map