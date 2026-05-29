/**
 * @deprecated Use `<Page variant="review">` from `./Page`
 * (DS-SIMPLIFY 04).
 *
 * ReviewQueue — renders a queue of items pending human review.
 * Each item has approve / reject / escalate actions + optional custom actions.
 */
import * as React from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ReviewQueueItem {
  id: string;
  title: string;
  meta?: string;
  /** Arbitrary extra data consumers can use in customActions */
  data?: Record<string, unknown>;
}

export interface ReviewQueueCustomAction<T extends ReviewQueueItem = ReviewQueueItem> {
  label: string;
  onAction: (item: T) => void;
  /** Disable for a given item */
  isDisabled?: (item: T) => boolean;
}

export interface ReviewQueueProps<T extends ReviewQueueItem = ReviewQueueItem> {
  items: T[];
  onApprove: (item: T) => void;
  onReject: (item: T) => void;
  onEscalate?: (item: T) => void;
  customActions?: ReviewQueueCustomAction<T>[];
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  className?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ReviewQueue<T extends ReviewQueueItem = ReviewQueueItem>({
  items,
  onApprove,
  onReject,
  onEscalate,
  customActions,
  isLoading = false,
  emptyState,
  className,
}: ReviewQueueProps<T>) {
  const classes = ['cc-review-queue'];
  if (className) classes.push(className);

  if (isLoading) {
    return (
      <div className={classes.join(' ')} aria-busy="true">
        <div className="cc-review-queue__loading" aria-label="Loading review queue">
          Loading…
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={classes.join(' ')}>
        <div className="cc-review-queue__empty">
          {emptyState ?? 'No items to review.'}
        </div>
      </div>
    );
  }

  return (
    <div className={classes.join(' ')}>
      <ul className="cc-review-queue__list" role="list">
        {items.map((item) => (
          <li key={item.id} className="cc-review-queue__item">
            <div className="cc-review-queue__item-body">
              <p className="cc-review-queue__item-title">{item.title}</p>
              {item.meta ? (
                <p className="cc-review-queue__item-meta">{item.meta}</p>
              ) : null}
            </div>
            <div className="cc-review-queue__item-actions">
              <button
                type="button"
                className="cc-btn cc-btn--primary cc-btn--sm"
                onClick={() => onApprove(item)}
              >
                Approve
              </button>
              <button
                type="button"
                className="cc-btn cc-btn--danger cc-btn--sm"
                onClick={() => onReject(item)}
              >
                Reject
              </button>
              {onEscalate ? (
                <button
                  type="button"
                  className="cc-btn cc-btn--ghost cc-btn--sm"
                  onClick={() => onEscalate(item)}
                >
                  Escalate
                </button>
              ) : null}
              {customActions?.map((action) => {
                const disabled = action.isDisabled?.(item) ?? false;
                return (
                  <button
                    key={action.label}
                    type="button"
                    className="cc-btn cc-btn--ghost cc-btn--sm"
                    disabled={disabled}
                    aria-disabled={disabled}
                    onClick={() => { if (!disabled) action.onAction(item); }}
                  >
                    {action.label}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
