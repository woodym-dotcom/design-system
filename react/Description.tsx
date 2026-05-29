/**
 * Description — semantic <dl>-based description-list primitive.
 *
 * Subsumes DetailRow, DetailSection, DetailMetric, and MetaRow into a single
 * web-standard description-list with composable parts and a `kind` discriminator:
 *
 *   - kind="row"     → label/value row inside a parent <dl> (was DetailRow).
 *   - kind="section" → collapsible section with optional summary chevron
 *                      (was DetailSection).
 *   - kind="metric"  → label + headline value, optional drill-down detail
 *                      (was DetailMetric).
 *   - kind="meta"    → horizontal strip of label/value pairs with separators
 *                      (was MetaRow).
 *   - kind="list"    → wrapper <dl> that hosts row children (default).
 *
 * Drill-down hygiene: empty rows hide by default (no "No items yet" carcasses);
 * pass `showEmpty` to keep alignment slots in editable forms.
 */
import * as React from 'react';

// ── Shared types ────────────────────────────────────────────────────────────

export type DescriptionKind = 'list' | 'row' | 'section' | 'metric' | 'meta';
export type DescriptionMetaSize = 'sm' | 'md';
export type DescriptionMetaLayout = 'inline' | 'stacked';

export interface DescriptionMetaItem {
  label: string;
  value: React.ReactNode;
  hidden?: boolean;
}

interface BaseDescriptionProps {
  className?: string;
}

interface ListDescriptionProps extends BaseDescriptionProps {
  kind?: 'list';
  children: React.ReactNode;
}

interface RowDescriptionProps extends BaseDescriptionProps {
  kind: 'row';
  /** Label column content. */
  label: React.ReactNode;
  /** Value column content. Hidden by default when empty. */
  children?: React.ReactNode;
  /** When true, the row renders even if `children` is empty. */
  showEmpty?: boolean;
}

interface SectionDescriptionProps extends BaseDescriptionProps {
  kind: 'section';
  /** Section heading. */
  title: React.ReactNode;
  /** Optional one-line summary; presence enables the collapsible chevron. */
  summary?: React.ReactNode;
  /** Expanded content. */
  children?: React.ReactNode;
  /** When true, section is hidden entirely (drill-down hygiene). */
  empty?: boolean;
  /** Initial expanded state when `summary` is provided. Default: false. */
  defaultOpen?: boolean;
  /** Heading level. Default: 3. */
  headingLevel?: 2 | 3 | 4 | 5;
}

interface MetricDescriptionProps extends BaseDescriptionProps {
  kind: 'metric';
  /** Metric label, e.g. "Open obligations". */
  label: React.ReactNode;
  /** Headline value. */
  value: React.ReactNode;
  /** Optional drill-down content shown on click. */
  detail?: React.ReactNode;
  /** Optional small caption (delta, sub-label). */
  caption?: React.ReactNode;
}

interface MetaDescriptionProps extends BaseDescriptionProps {
  kind: 'meta';
  items: DescriptionMetaItem[];
  /** Size variant. Default 'md'. */
  size?: DescriptionMetaSize;
  /** 'inline' (default) or 'stacked'. */
  layout?: DescriptionMetaLayout;
  /** Show a separator between items. Default true. */
  separator?: boolean;
}

export type DescriptionProps =
  | ListDescriptionProps
  | RowDescriptionProps
  | SectionDescriptionProps
  | MetricDescriptionProps
  | MetaDescriptionProps;

// ── Convenience composable parts (semantic dt/dd) ───────────────────────────

export interface DescriptionTermProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}
export function DescriptionTerm({ className, children, ...rest }: DescriptionTermProps) {
  return (
    <dt className={['cc-detail-row__label', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </dt>
  );
}

export interface DescriptionValueProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}
export function DescriptionValue({ className, children, ...rest }: DescriptionValueProps) {
  return (
    <dd className={['cc-detail-row__value', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </dd>
  );
}

// ── Implementations ────────────────────────────────────────────────────────

const EMPTY_VALUES: ReadonlySet<unknown> = new Set([undefined, null, '']);

function RowBody({ label, children, showEmpty = false, className }: RowDescriptionProps) {
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

function SectionBody({
  title,
  summary,
  children,
  empty = false,
  defaultOpen = false,
  headingLevel = 3,
  className,
}: SectionDescriptionProps) {
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

function MetricBody({
  label,
  value,
  detail,
  caption,
  className,
}: MetricDescriptionProps) {
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

const META_SIZE_MAP: Record<DescriptionMetaSize, { label: string; value: string; gap: string }> = {
  sm: {
    label: 'var(--text-xs, 0.75rem)',
    value: 'var(--text-sm, 0.875rem)',
    gap: 'var(--space-3, 0.5rem)',
  },
  md: {
    label: 'var(--text-sm, 0.875rem)',
    value: 'var(--text-base, 0.875rem)',
    gap: 'var(--space-5, 1rem)',
  },
};

function MetaBody({
  items,
  size = 'md',
  layout = 'inline',
  separator = true,
  className,
}: MetaDescriptionProps) {
  const sizeTokens = META_SIZE_MAP[size];
  const visibleItems = items.filter((item) => !item.hidden);
  return (
    <dl
      className={['cc-meta-row', className].filter(Boolean).join(' ')}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: layout === 'stacked' ? 'flex-start' : 'center',
        gap: sizeTokens.gap,
        margin: 0,
        padding: 0,
      }}
    >
      {visibleItems.map((item, i) => (
        <React.Fragment key={item.label}>
          {separator && i > 0 && (
            <span
              className="cc-meta-row__separator"
              aria-hidden="true"
              style={{
                width: 1,
                height: '1em',
                background: 'var(--border-1)',
                flexShrink: 0,
                alignSelf: 'center',
              }}
            />
          )}
          <div
            className="cc-meta-row__item"
            style={{
              display: 'flex',
              flexDirection: layout === 'stacked' ? 'column' : 'row',
              alignItems: layout === 'stacked' ? 'flex-start' : 'center',
              gap: layout === 'stacked' ? 'var(--space-1, 0.25rem)' : 'var(--space-2, 0.375rem)',
            }}
          >
            <dt
              className="cc-meta-row__label"
              style={{
                margin: 0,
                fontSize: sizeTokens.label,
                fontWeight: 500,
                color: 'var(--text-3)',
                whiteSpace: 'nowrap',
              }}
            >
              {item.label}
            </dt>
            <dd
              className="cc-meta-row__value"
              style={{
                margin: 0,
                fontSize: sizeTokens.value,
                color: 'var(--text-1)',
              }}
            >
              {item.value}
            </dd>
          </div>
        </React.Fragment>
      ))}
    </dl>
  );
}

// ── Discriminated Description component ─────────────────────────────────────

/**
 * Description — unified description-list primitive. Use the `kind` prop to
 * pick the surface; see the file header for the list of kinds.
 */
export function Description(props: DescriptionProps): React.ReactElement | null {
  const kind = (props as { kind?: DescriptionKind }).kind ?? 'list';
  switch (kind) {
    case 'row':
      return <RowBody {...(props as RowDescriptionProps)} />;
    case 'section':
      return <SectionBody {...(props as SectionDescriptionProps)} />;
    case 'metric':
      return <MetricBody {...(props as MetricDescriptionProps)} />;
    case 'meta':
      return <MetaBody {...(props as MetaDescriptionProps)} />;
    case 'list':
    default: {
      const { className, children } = props as ListDescriptionProps;
      return (
        <dl className={['cc-description', className].filter(Boolean).join(' ')}>
          {children}
        </dl>
      );
    }
  }
}
