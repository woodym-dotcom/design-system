/**
 * Card — generic surface shell for dashboard tiles, content cards, and
 * entity-list record cards (variant="entity").
 *
 * The classic API (title + subtitle + children) renders the legacy
 * `card-base` utility chrome and is preserved byte-for-byte so existing
 * consumers see no DOM change.
 *
 * When any of `actions`, `footer`, or `padded` are supplied, the new
 * BEM structure (<section class="cc-card">) is used:
 *   - cc-card__header (with copy + actions)
 *   - cc-card__body
 *   - cc-card__footer
 * Pass `padded={false}` to remove body padding via cc-card--flush.
 *
 * Pass `variant="entity"` to render a record-card with leading/trailing
 * slots, metadata, and optional compact density (chevron-disclosed metadata).
 *
 * Styles use @ds/core tokens exclusively — no hardcoded values.
 */
import * as React from "react";

export type CardVariant = "default" | "entity";
export type CardDensity = "standard" | "compact";

export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onClick"> {
  /** Visual variant. Default: "default". */
  variant?: CardVariant;
  /** Optional heading text / record title. */
  title?: React.ReactNode;
  /** Optional sub-label appended after the title. */
  subtitle?: React.ReactNode;
  /** Right-aligned slot inside the header. */
  actions?: React.ReactNode;
  /** Slot rendered after the body. */
  footer?: React.ReactNode;
  /**
   * Body padding. Defaults to true. Setting false applies `cc-card--flush`,
   * useful when the card body is itself a table / grid that owns its own
   * gutter.
   */
  padded?: boolean;
  /** Entity variant: leading slot (avatar, icon). */
  leading?: React.ReactNode;
  /** Entity variant: trailing slot (badge, action button). */
  trailing?: React.ReactNode;
  /** Entity variant: secondary metadata. In compact density, hides behind a chevron. */
  metadata?: React.ReactNode;
  /** Entity variant: density — "standard" (default) or "compact". */
  density?: CardDensity;
  /** Entity variant: when supplied, the card is a clickable record. */
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
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
  variant = "default",
  title,
  subtitle,
  actions,
  footer,
  padded,
  leading,
  trailing,
  metadata,
  density = "standard",
  onClick,
  className,
  children,
  ...rest
}: CardProps): React.ReactElement {
  // ── Entity variant: record-card with leading / trailing / metadata. ────────
  if (variant === "entity") {
    return (
      <EntityCardBody
        title={title}
        subtitle={subtitle}
        leading={leading}
        trailing={trailing}
        metadata={metadata}
        density={density}
        onClick={onClick}
        className={className}
      />
    );
  }

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

// ── Entity variant body ─────────────────────────────────────────────────────

interface EntityCardBodyProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  metadata?: React.ReactNode;
  density: CardDensity;
  onClick?: () => void;
  className?: string;
}

function EntityCardBody({
  title,
  subtitle,
  leading,
  trailing,
  metadata,
  density,
  onClick,
  className,
}: EntityCardBodyProps) {
  const [open, setOpen] = React.useState(false);
  const hasMetadata = metadata !== undefined && metadata !== null;
  const isCompact = density === "compact";
  const bodyId = React.useId();

  const classes = [
    "cc-entity-card",
    isCompact ? "cc-entity-card--compact" : "cc-entity-card--standard",
  ];
  if (onClick) classes.push("cc-entity-card--clickable");
  if (open) classes.push("is-open");
  if (className) classes.push(className);

  const headerContent = (
    <>
      {leading ? (
        <span className="cc-entity-card__leading" aria-hidden="true">
          {leading}
        </span>
      ) : null}
      <span className="cc-entity-card__primary">
        <span className="cc-entity-card__title">{title}</span>
        {subtitle ? (
          <span className="cc-entity-card__subtitle">{subtitle}</span>
        ) : null}
      </span>
      {trailing ? (
        <span className="cc-entity-card__trailing">{trailing}</span>
      ) : null}
      {isCompact && hasMetadata ? (
        <button
          type="button"
          className="cc-entity-card__disclosure"
          aria-expanded={open}
          aria-controls={bodyId}
          aria-label={open ? "Hide details" : "Show details"}
          onClick={(e) => {
            e.stopPropagation();
            setOpen((o) => !o);
          }}
        >
          {open ? "▾" : "▸"}
        </button>
      ) : null}
    </>
  );

  return (
    <article className={classes.join(" ")}>
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          className="cc-entity-card__header cc-entity-card__header--clickable"
        >
          {headerContent}
        </button>
      ) : (
        <div className="cc-entity-card__header">{headerContent}</div>
      )}
      {hasMetadata && (!isCompact || open) ? (
        <div id={bodyId} className="cc-entity-card__metadata">
          {metadata}
        </div>
      ) : null}
    </article>
  );
}
