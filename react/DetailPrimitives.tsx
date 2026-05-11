/**
 * Detail-surface primitives — DetailRow, DetailSection, DetailMetric.
 *
 * Replace ad-hoc <div className="detail-row"> markup across consumers with
 * three composable primitives that own label/value alignment, drill-down
 * behaviour and empty-section hygiene.
 *
 *  - <DetailRow label="…">      label/value row with grid-aligned columns.
 *  - <DetailSection title="…">  collapsible section; auto-hides when empty.
 *  - <DetailMetric label value> headline number + chevron-to-expand summary.
 *
 * Design philosophy (drill-down): default to one-line summaries with a
 * chevron to expand; hide entire sections when their data set is empty
 * (no "No items yet" carcasses).
 */
import * as React from 'react';

// ── DetailRow ────────────────────────────────────────────────────────────────

export interface DetailRowProps {
  /** Label column content. Strings get the default label typography. */
  label: React.ReactNode;
  /**
   * Value column content. When `undefined` or `null` the row renders nothing
   * (drill-down philosophy: no empty rows).
   */
  children?: React.ReactNode;
  /**
   * When true, the row renders even if `children` is empty. Use for editable
   * forms where the value placeholder still needs the alignment slot.
   */
  showEmpty?: boolean;
  className?: string;
}

const EMPTY_VALUES: ReadonlySet<unknown> = new Set([undefined, null, '']);

export function DetailRow({
  label,
  children,
  showEmpty = false,
  className,
}: DetailRowProps) {
  if (!showEmpty && EMPTY_VALUES.has(children)) return null;
  const classes = ['cc-detail-row'];
  if (className) classes.push(className);
  return (
    <div className={classes.join(' ')}>
      <dt className="cc-detail-row__label">{label}</dt>
      <dd className="cc-detail-row__value">{children}</dd>
    </div>
  );
}

// ── DetailSection ────────────────────────────────────────────────────────────

export interface DetailSectionProps {
  /** Section heading. */
  title: React.ReactNode;
  /**
   * One-line summary rendered when the section is collapsed. Optional —
   * when omitted the section expands inline without a chevron.
   */
  summary?: React.ReactNode;
  /** Expanded content. */
  children?: React.ReactNode;
  /**
   * When true, the section is hidden entirely. Drill-down hygiene: callers
   * pass `empty={data.length === 0}` so empty sections don't render.
   */
  empty?: boolean;
  /**
   * Initial expanded state when `summary` is provided. Default: false.
   * The section is uncontrolled (collapsible state lives inside).
   */
  defaultOpen?: boolean;
  /** Heading level for a11y. Default: 3. */
  headingLevel?: 2 | 3 | 4 | 5;
  className?: string;
}

export function DetailSection({
  title,
  summary,
  children,
  empty = false,
  defaultOpen = false,
  headingLevel = 3,
  className,
}: DetailSectionProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  if (empty) return null;
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4' | 'h5';
  const hasSummary = summary !== undefined && summary !== null;
  const classes = ['cc-detail-section'];
  if (hasSummary) classes.push('cc-detail-section--collapsible');
  if (open || !hasSummary) classes.push('is-open');
  if (className) classes.push(className);
  const bodyId = React.useId();

  return (
    <section className={classes.join(' ')}>
      <header className="cc-detail-section__header">
        <Heading className="cc-detail-section__title">{title}</Heading>
        {hasSummary ? (
          <button
            type="button"
            className="cc-detail-section__toggle"
            aria-expanded={open}
            aria-controls={bodyId}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="cc-detail-section__summary">{summary}</span>
            <span className="cc-detail-section__chevron" aria-hidden="true">
              {open ? '▾' : '▸'}
            </span>
          </button>
        ) : null}
      </header>
      {open || !hasSummary ? (
        <div id={bodyId} className="cc-detail-section__body">
          {children}
        </div>
      ) : null}
    </section>
  );
}

// ── DetailMetric ─────────────────────────────────────────────────────────────

export interface DetailMetricProps {
  /** Metric label, e.g. "Open obligations". */
  label: React.ReactNode;
  /** Headline value, e.g. 42, "$1.2M", or a formatted span. */
  value: React.ReactNode;
  /** Optional drill-down content shown on click (uses DetailSection chevron). */
  detail?: React.ReactNode;
  /** Optional small caption (delta, sub-label). */
  caption?: React.ReactNode;
  className?: string;
}

export function DetailMetric({
  label,
  value,
  detail,
  caption,
  className,
}: DetailMetricProps) {
  const [open, setOpen] = React.useState(false);
  const bodyId = React.useId();
  const classes = ['cc-detail-metric'];
  if (className) classes.push(className);
  if (detail) classes.push('cc-detail-metric--drill');
  if (open) classes.push('is-open');

  const hasDetail = detail !== undefined && detail !== null;

  return (
    <div className={classes.join(' ')}>
      <button
        type="button"
        className="cc-detail-metric__header"
        aria-expanded={hasDetail ? open : undefined}
        aria-controls={hasDetail ? bodyId : undefined}
        onClick={hasDetail ? () => setOpen((o) => !o) : undefined}
        disabled={!hasDetail}
      >
        <span className="cc-detail-metric__label">{label}</span>
        <span className="cc-detail-metric__value">{value}</span>
        {caption ? (
          <span className="cc-detail-metric__caption">{caption}</span>
        ) : null}
        {hasDetail ? (
          <span className="cc-detail-metric__chevron" aria-hidden="true">
            {open ? '▾' : '▸'}
          </span>
        ) : null}
      </button>
      {hasDetail && open ? (
        <div id={bodyId} className="cc-detail-metric__body">
          {detail}
        </div>
      ) : null}
    </div>
  );
}
