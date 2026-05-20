/**
 * Card — generic surface shell for dashboard tiles and content cards.
 *
 * The classic API (title + subtitle + children) renders the legacy
 * `card-base` utility chrome and is preserved byte-for-byte so existing
 * consumers see no DOM change.
 *
 * When any of `actions`, `footer`, or `padded` are supplied, the new
 * AA-style BEM structure (<section class="cc-card">) is used:
 *   - cc-card__header (with copy + actions)
 *   - cc-card__body
 *   - cc-card__footer
 * Pass `padded={false}` to remove body padding via cc-card--flush.
 *
 * Styles use @ds/core tokens exclusively — no hardcoded values.
 */
import * as React from "react";

export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Optional heading text rendered in small-caps above the card body. */
  title?: React.ReactNode;
  /** Optional sub-label appended after the title. */
  subtitle?: React.ReactNode;
  /** Right-aligned slot inside the header (NEW). */
  actions?: React.ReactNode;
  /** Slot rendered after the body (NEW). */
  footer?: React.ReactNode;
  /**
   * Body padding (NEW). Defaults to true. Setting false applies
   * `cc-card--flush`, useful when the card body is itself a table /
   * grid that owns its own gutter.
   */
  padded?: boolean;
  className?: string;
  children: React.ReactNode;
}

function legacyTitleClass(): string {
  return "text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground";
}

function legacySubtitleSuffix(subtitle: React.ReactNode) {
  return subtitle ? (
    <span className="ml-2 text-muted-foreground/70">· {subtitle}</span>
  ) : null;
}

export function Card({
  title,
  subtitle,
  actions,
  footer,
  padded,
  className,
  children,
  ...rest
}: CardProps): React.ReactElement {
  // Legacy path: no new prop has been supplied → render the original DOM
  // so existing callers see no visual / structural change.
  const usesNew = actions !== undefined || footer !== undefined || padded !== undefined;
  if (!usesNew) {
    return (
      <div
        {...(rest as React.HTMLAttributes<HTMLDivElement>)}
        className={[
          "card-base",
          "rounded-2xl",
          "border",
          "border-[color:var(--border-1)]",
          "p-4",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {title ? (
          <div className={legacyTitleClass()}>
            {title}
            {legacySubtitleSuffix(subtitle)}
          </div>
        ) : null}
        {children}
      </div>
    );
  }

  const flush = padded === false;
  const cls = [
    "cc-card",
    flush ? "cc-card--flush" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const hasHeader = title != null || subtitle != null || actions != null;

  return (
    <section {...rest} className={cls}>
      {hasHeader ? (
        <header className="cc-card__header">
          <div className="cc-card__copy">
            {title != null ? <h3 className="cc-card__title">{title}</h3> : null}
            {subtitle != null ? (
              <p className="cc-card__subtitle">{subtitle}</p>
            ) : null}
          </div>
          {actions != null ? (
            <div className="cc-card__actions">{actions}</div>
          ) : null}
        </header>
      ) : null}
      <div className="cc-card__body">{children}</div>
      {footer != null ? (
        <div className="cc-card__footer">{footer}</div>
      ) : null}
    </section>
  );
}
