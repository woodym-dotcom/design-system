/**
 * CommanderView — three-pane incident command layout.
 *
 * Provides a structured layout for incident response and entity investigation:
 *   Left pane:   entity list (selectable)
 *   Center pane:  entity detail
 *   Right pane:  activity timeline
 *
 * Each pane accepts arbitrary children; the layout handles sizing, dividers,
 * and responsive collapse behaviour.
 *
 * Usage:
 *   <CommanderView
 *     list={<EntityList items={items} />}
 *     detail={<EntityDetail entity={selected} />}
 *     timeline={<ActivityTimeline entries={events} />}
 *   />
 */
import * as React from "react";

/** Circuit breaker status for the CB overlay. */
export type CircuitBreakerState = "closed" | "open" | "half-open";

/** A vendor cohort lane rendered alongside the three main panes. */
export interface VendorCohortLane {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface CommanderViewProps {
  /** Left pane — typically an entity list. */
  list: React.ReactNode;
  /** Center pane — entity detail / main content. */
  detail: React.ReactNode;
  /** Right pane — timeline / activity feed. */
  timeline: React.ReactNode;
  /** Relative width ratios for [list, detail, timeline]. Default: [1, 2, 1]. */
  ratios?: [number, number, number];
  /** Minimum width for each pane in px. Default: 200. */
  minPaneWidth?: number;
  /** Panel heading shown above the layout. */
  title?: string;
  /** ARIA label for the landmark region. */
  "aria-label"?: string;
  /**
   * Circuit breaker overlay — renders a status badge in the header
   * and optional detail node when the CB is not closed.
   */
  circuitBreaker?: {
    state: CircuitBreakerState;
    label?: string;
    detail?: React.ReactNode;
  };
  /** Vendor cohort lane columns rendered after the timeline pane. */
  vendorLanes?: VendorCohortLane[];
  className?: string;
}

const CB_TONE: Record<CircuitBreakerState, string> = {
  closed: "var(--success-text, #16a34a)",
  open: "var(--error-text, #dc2626)",
  "half-open": "var(--warning-text, #ca8a04)",
};

export function CommanderView({
  list,
  detail,
  timeline,
  ratios = [1, 2, 1],
  minPaneWidth = 200,
  title,
  circuitBreaker,
  vendorLanes,
  className,
  ...rest
}: CommanderViewProps): React.ReactElement {
  const classes = ["cc-commander-view", className].filter(Boolean).join(" ");

  return (
    <div
      role="region"
      aria-label={rest["aria-label"] ?? title ?? "Commander view"}
      className={classes}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
      }}
    >
      {(title || circuitBreaker) && (
        <header
          className="cc-commander-view__header"
          style={{
            padding: "var(--space-3, 0.5rem) var(--space-4, 0.75rem)",
            borderBottom: "1px solid var(--border-1)",
            fontWeight: 600,
            fontSize: "var(--text-lg, 1.125rem)",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3, 0.5rem)",
          }}
        >
          {title && <span>{title}</span>}
          {circuitBreaker && (
            <span
              className={`cc-commander-view__cb cc-commander-view__cb--${circuitBreaker.state}`}
              aria-label={`Circuit breaker: ${circuitBreaker.label ?? circuitBreaker.state}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                fontSize: "var(--text-sm, 0.875rem)",
                fontWeight: 500,
                color: CB_TONE[circuitBreaker.state],
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  display: "inline-block",
                  width: "0.5rem",
                  height: "0.5rem",
                  borderRadius: "50%",
                  background: CB_TONE[circuitBreaker.state],
                }}
              />
              {circuitBreaker.label ?? circuitBreaker.state}
            </span>
          )}
        </header>
      )}
      {circuitBreaker && circuitBreaker.state !== "closed" && circuitBreaker.detail && (
        <div
          className="cc-commander-view__cb-detail"
          role="alert"
          style={{
            padding: "var(--space-2, 0.375rem) var(--space-4, 0.75rem)",
            borderBottom: "1px solid var(--border-1)",
            fontSize: "var(--text-sm, 0.875rem)",
            background: "var(--surface-2, #f5f5f5)",
          }}
        >
          {circuitBreaker.detail}
        </div>
      )}
      <div
        className="cc-commander-view__panes"
        style={{
          display: "flex",
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <div
          className="cc-commander-view__pane cc-commander-view__pane--list"
          style={{
            flex: `${ratios[0]} 1 0%`,
            minWidth: `${minPaneWidth}px`,
            borderRight: "1px solid var(--border-1)",
            overflowY: "auto",
          }}
        >
          {list}
        </div>
        <div
          className="cc-commander-view__pane cc-commander-view__pane--detail"
          style={{
            flex: `${ratios[1]} 1 0%`,
            minWidth: `${minPaneWidth}px`,
            borderRight: "1px solid var(--border-1)",
            overflowY: "auto",
          }}
        >
          {detail}
        </div>
        <div
          className="cc-commander-view__pane cc-commander-view__pane--timeline"
          style={{
            flex: `${ratios[2]} 1 0%`,
            minWidth: `${minPaneWidth}px`,
            borderRight: vendorLanes && vendorLanes.length > 0 ? "1px solid var(--border-1)" : undefined,
            overflowY: "auto",
          }}
        >
          {timeline}
        </div>
        {vendorLanes && vendorLanes.map((lane) => (
          <div
            key={lane.id}
            className="cc-commander-view__pane cc-commander-view__pane--vendor-lane"
            aria-label={lane.label}
            style={{
              flex: "1 1 0%",
              minWidth: `${minPaneWidth}px`,
              borderRight: "1px solid var(--border-1)",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                padding: "var(--space-2, 0.375rem) var(--space-3, 0.5rem)",
                fontWeight: 600,
                fontSize: "var(--text-sm, 0.875rem)",
                borderBottom: "1px solid var(--border-1)",
              }}
            >
              {lane.label}
            </div>
            {lane.content}
          </div>
        ))}
      </div>
    </div>
  );
}
