/**
 * DualMeasurementLayout — side-by-side continuous + discrete cadence display.
 *
 * Renders two measurement panels side by side: one for continuous metrics
 * (e.g. time-series, real-time values) and one for discrete/periodic
 * observations (e.g. audit snapshots, scheduled checks).
 *
 * Usage:
 *   <DualMeasurementLayout
 *     continuous={<Graph layout="sparkline" ... />}
 *     continuousLabel="Real-time monitoring"
 *     discrete={<DataTable ... />}
 *     discreteLabel="Quarterly reviews"
 *   />
 */
import * as React from "react";

/** Circuit breaker band — rendered between or overlaid on the two panes. */
export interface CircuitBreakerBand {
  id: string;
  label: string;
  state: "closed" | "open" | "half-open";
  detail?: React.ReactNode;
}

/** Layout variant for the DualMeasurementLayout. */
export type DualMeasurementVariant = "default" | "horizon-stack";

export interface DualMeasurementLayoutProps {
  /** Continuous measurement pane content. */
  continuous: React.ReactNode;
  /** Label for the continuous pane. */
  continuousLabel?: string;
  /** Discrete measurement pane content. */
  discrete: React.ReactNode;
  /** Label for the discrete pane. */
  discreteLabel?: string;
  /** Layout direction. Default: "horizontal". */
  direction?: "horizontal" | "vertical";
  /** Relative size ratio [continuous, discrete]. Default: [1, 1]. */
  ratio?: [number, number];
  /** Optional header above both panes. */
  title?: string;
  /**
   * Layout variant.
   *   - "default" — standard two-pane layout.
   *   - "horizon-stack" — 4-pane layout: top-left, top-right, bottom-left, bottom-right.
   */
  variant?: DualMeasurementVariant;
  /** Top-right pane content (horizon-stack variant only). */
  topRight?: React.ReactNode;
  /** Top-right label (horizon-stack variant only). */
  topRightLabel?: string;
  /** Bottom-right pane content (horizon-stack variant only). */
  bottomRight?: React.ReactNode;
  /** Bottom-right label (horizon-stack variant only). */
  bottomRightLabel?: string;
  /** Circuit breaker bands — rendered as status strips between the panes. */
  circuitBreakerBands?: CircuitBreakerBand[];
  className?: string;
}

const CB_BAND_COLOR: Record<string, string> = {
  closed: "var(--success-light, #dcfce7)",
  open: "var(--error-light, #fef2f2)",
  "half-open": "var(--warning-light, #fefce8)",
};

export function DualMeasurementLayout({
  continuous,
  continuousLabel,
  discrete,
  discreteLabel,
  direction = "horizontal",
  ratio = [1, 1],
  title,
  variant = "default",
  topRight,
  topRightLabel,
  bottomRight,
  bottomRightLabel,
  circuitBreakerBands,
  className,
}: DualMeasurementLayoutProps): React.ReactElement {
  const classes = [
    "cc-dual-measurement",
    `cc-dual-measurement--${direction}`,
    variant !== "default" ? `cc-dual-measurement--${variant}` : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const isHorizontal = direction === "horizontal";

  return (
    <div
      className={classes}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3, 0.5rem)",
      }}
    >
      {title && (
        <h3
          className="cc-dual-measurement__title"
          style={{
            margin: 0,
            fontSize: "var(--text-lg, 1.125rem)",
            fontWeight: 600,
          }}
        >
          {title}
        </h3>
      )}
      {/* Circuit breaker bands */}
      {circuitBreakerBands && circuitBreakerBands.length > 0 && (
        <div className="cc-dual-measurement__cb-bands" role="group" aria-label="Circuit breaker status">
          {circuitBreakerBands.map((band) => (
            <div
              key={band.id}
              className={`cc-dual-measurement__cb-band cc-dual-measurement__cb-band--${band.state}`}
              style={{
                padding: "var(--space-2, 0.375rem) var(--space-3, 0.5rem)",
                borderRadius: "var(--radius-1, 4px)",
                background: CB_BAND_COLOR[band.state] ?? "var(--surface-2)",
                fontSize: "var(--text-sm, 0.875rem)",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2, 0.375rem)",
              }}
            >
              <span style={{ fontWeight: 600 }}>{band.label}: {band.state}</span>
              {band.detail && <span>{band.detail}</span>}
            </div>
          ))}
        </div>
      )}

      {variant === "horizon-stack" ? (
        <div
          className="cc-dual-measurement__horizon-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: "var(--space-4, 0.75rem)",
          }}
        >
          {[
            { content: continuous, label: continuousLabel ?? "Top-left", cls: "continuous" },
            { content: topRight, label: topRightLabel ?? "Top-right", cls: "top-right" },
            { content: discrete, label: discreteLabel ?? "Bottom-left", cls: "discrete" },
            { content: bottomRight, label: bottomRightLabel ?? "Bottom-right", cls: "bottom-right" },
          ].map((pane) => (
            <section
              key={pane.cls}
              className={`cc-dual-measurement__pane cc-dual-measurement__pane--${pane.cls}`}
              aria-label={pane.label}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-2, 0.375rem)",
                padding: "var(--space-4, 0.75rem)",
                borderRadius: "var(--radius-2, 8px)",
                border: "1px solid var(--border-1)",
                background: "var(--surface-1)",
                minWidth: 0,
              }}
            >
              <h4
                className="cc-dual-measurement__pane-label"
                style={{
                  margin: 0,
                  fontSize: "var(--text-sm, 0.875rem)",
                  fontWeight: 600,
                  color: "var(--text-2)",
                }}
              >
                {pane.label}
              </h4>
              <div className="cc-dual-measurement__pane-content">{pane.content}</div>
            </section>
          ))}
        </div>
      ) : (
        <div
          className="cc-dual-measurement__panes"
          style={{
            display: "flex",
            flexDirection: isHorizontal ? "row" : "column",
            gap: "var(--space-4, 0.75rem)",
          }}
        >
          <section
            className="cc-dual-measurement__pane cc-dual-measurement__pane--continuous"
            aria-label={continuousLabel ?? "Continuous measurement"}
            style={{
              flex: `${ratio[0]} 1 0%`,
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-2, 0.375rem)",
              padding: "var(--space-4, 0.75rem)",
              borderRadius: "var(--radius-2, 8px)",
              border: "1px solid var(--border-1)",
              background: "var(--surface-1)",
              minWidth: 0,
            }}
          >
            {continuousLabel && (
              <h4
                className="cc-dual-measurement__pane-label"
                style={{
                  margin: 0,
                  fontSize: "var(--text-sm, 0.875rem)",
                  fontWeight: 600,
                  color: "var(--text-2)",
                }}
              >
                {continuousLabel}
              </h4>
            )}
            <div className="cc-dual-measurement__pane-content">{continuous}</div>
          </section>

          <section
            className="cc-dual-measurement__pane cc-dual-measurement__pane--discrete"
            aria-label={discreteLabel ?? "Discrete measurement"}
            style={{
              flex: `${ratio[1]} 1 0%`,
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-2, 0.375rem)",
              padding: "var(--space-4, 0.75rem)",
              borderRadius: "var(--radius-2, 8px)",
              border: "1px solid var(--border-1)",
              background: "var(--surface-1)",
              minWidth: 0,
            }}
          >
            {discreteLabel && (
              <h4
                className="cc-dual-measurement__pane-label"
                style={{
                  margin: 0,
                  fontSize: "var(--text-sm, 0.875rem)",
                  fontWeight: 600,
                  color: "var(--text-2)",
                }}
              >
                {discreteLabel}
              </h4>
            )}
            <div className="cc-dual-measurement__pane-content">{discrete}</div>
          </section>
        </div>
      )}
    </div>
  );
}
