import * as React from 'react';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  /** Tooltip body. */
  label: React.ReactNode;
  /** Element the tooltip describes. Must be a single focusable child. */
  children: React.ReactElement;
  /** Preferred placement. Default 'top'. */
  placement?: TooltipPlacement;
  /** Open delay in ms. Default 300. */
  delayMs?: number;
  /** Optional id; auto-generated otherwise. */
  id?: string;
  className?: string;
}

/**
 * Lightweight tooltip — hover- and focus-triggered, ESC-dismissible.
 * Uses CSS positioning (no portal) so it inherits typography/contrast
 * naturally. Wraps a single focusable child and wires `aria-describedby`.
 */
export function Tooltip({
  label,
  children,
  placement = 'top',
  delayMs = 300,
  id,
  className,
}: TooltipProps) {
  const generatedId = React.useId();
  const tipId = id ?? `cc-tooltip-${generatedId}`;
  const [open, setOpen] = React.useState(false);
  const timer = React.useRef<number | null>(null);

  const show = React.useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(true), delayMs);
  }, [delayMs]);

  const hide = React.useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
    setOpen(false);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hide();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, hide]);

  React.useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  const child = React.Children.only(children) as React.ReactElement<Record<string, unknown>>;
  const existingDescribedBy = child.props['aria-describedby'] as string | undefined;
  const describedBy = open
    ? [existingDescribedBy, tipId].filter(Boolean).join(' ')
    : existingDescribedBy;

  const trigger = React.cloneElement(child, {
    'aria-describedby': describedBy,
    onMouseEnter: (e: React.MouseEvent) => {
      (child.props.onMouseEnter as ((e: React.MouseEvent) => void) | undefined)?.(e);
      show();
    },
    onMouseLeave: (e: React.MouseEvent) => {
      (child.props.onMouseLeave as ((e: React.MouseEvent) => void) | undefined)?.(e);
      hide();
    },
    onFocus: (e: React.FocusEvent) => {
      (child.props.onFocus as ((e: React.FocusEvent) => void) | undefined)?.(e);
      show();
    },
    onBlur: (e: React.FocusEvent) => {
      (child.props.onBlur as ((e: React.FocusEvent) => void) | undefined)?.(e);
      hide();
    },
  });

  return (
    <span className={['cc-tooltip-wrap', className].filter(Boolean).join(' ')}>
      {trigger}
      <span
        id={tipId}
        role="tooltip"
        className={`cc-tooltip cc-tooltip--${placement}${open ? ' is-open' : ''}`}
        aria-hidden={!open}
      >
        {label}
      </span>
    </span>
  );
}
