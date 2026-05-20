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

export interface ButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "type"
  > {
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

function classes(
  variant: ButtonVariant,
  size: ButtonSize,
  icon: boolean | undefined,
  className: string | undefined,
): string {
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

export const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(
  {
    variant = "secondary",
    size = "md",
    icon,
    href,
    target,
    rel,
    className,
    children,
    disabled,
    type = "button",
    ...rest
  },
  ref,
) {
  const cls = classes(variant, size, icon, className);

  if (href !== undefined) {
    const isDisabled = Boolean(disabled);
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={cls}
        href={isDisabled ? undefined : href}
        target={target}
        rel={rel}
        aria-disabled={isDisabled || undefined}
        {...(rest as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      className={cls}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
});
