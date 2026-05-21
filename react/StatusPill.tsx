/**
 * StatusPill — coloured dot + label for status indication.
 *
 * @deprecated Use `Tag` with `variant="pill"` and `dot` from `@ds/core/react` instead.
 * `<StatusPill status="ok" label="OK" />` → `<Tag variant="pill" tone="success" dot>OK</Tag>`
 * Cutover: DS-SIMPLIFY 14.
 *
 * Used for system health, rules-evidence rows, source freshness, and any
 * place that needs a scannable ok/warning/error/info/neutral signal.
 *
 * Accessibility contract:
 *  - The dot is aria-hidden; the label carries all readable meaning.
 *  - Both colour and shape cue encode the status (dot shape varies by tone,
 *    satisfying WCAG 1.4.1 Use of Color).
 *  - When interactive (onClick), the host element is a <button> with
 *    minimum 44×44px touch target (via padding + min-height).
 */

export type StatusPillStatus = 'ok' | 'warning' | 'error' | 'info' | 'neutral';

export interface StatusPillProps {
  /** Semantic status — drives colour and dot shape. */
  status: StatusPillStatus;
  /** Human-readable label. This is the accessible content; the dot is decorative. */
  label: string;
  /** Size variant. 'sm' uses smaller padding; 'md' (default) is standard. */
  size?: 'sm' | 'md';
  /** If provided, renders as a <button> and fires on click. */
  onClick?: () => void;
  className?: string;
}

const STATUS_DOT_SHAPES: Record<StatusPillStatus, string> = {
  ok:      'cc-status-pill__dot--round',
  warning: 'cc-status-pill__dot--diamond',
  error:   'cc-status-pill__dot--square',
  info:    'cc-status-pill__dot--round',
  neutral: 'cc-status-pill__dot--round',
};

export function StatusPill({ status, label, size = 'md', onClick, className }: StatusPillProps) {
  const classes = [
    'cc-status-pill',
    `cc-status-pill--${status}`,
    `cc-status-pill--${size}`,
    className,
  ].filter(Boolean).join(' ');

  const dotClass = ['cc-status-pill__dot', STATUS_DOT_SHAPES[status]].join(' ');

  const inner = (
    <>
      <span className={dotClass} aria-hidden="true" />
      <span className="cc-status-pill__label">{label}</span>
    </>
  );

  if (onClick) {
    return (
      <button type="button" className={classes} onClick={onClick}>
        {inner}
      </button>
    );
  }

  return (
    <span className={classes}>
      {inner}
    </span>
  );
}
