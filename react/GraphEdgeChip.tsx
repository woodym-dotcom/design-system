/**
 * GraphEdgeChip — dependency-graph edge attribute chip.
 *
 * A small inline chip representing an edge in a dependency/relationship graph.
 * Shows edge type, direction, optional weight, and can be interactive
 * (click to focus the edge in the graph view).
 *
 * Usage:
 *   <GraphEdgeChip
 *     source="Auth Service"
 *     target="User Service"
 *     edgeType="depends-on"
 *     weight={0.8}
 *     direction="outgoing"
 *   />
 */
import * as React from "react";

export type GraphEdgeDirection = "outgoing" | "incoming" | "bidirectional";
export type GraphEdgeType =
  | "depends-on"
  | "provides"
  | "consumes"
  | "related"
  | string;

export interface GraphEdgeChipProps {
  /** Source node label. */
  source: string;
  /** Target node label. */
  target: string;
  /** Type of relationship. */
  edgeType: GraphEdgeType;
  /** Edge weight / strength 0..1. */
  weight?: number;
  /** Direction indicator. Default: "outgoing". */
  direction?: GraphEdgeDirection;
  /** Click handler — makes the chip interactive. */
  onClick?: () => void;
  /** Accessible label override. */
  "aria-label"?: string;
  className?: string;
}

const DIRECTION_ARROWS: Record<GraphEdgeDirection, string> = {
  outgoing: "→",
  incoming: "←",
  bidirectional: "↔",
};

function edgeTypeColor(type: GraphEdgeType): {
  bg: string;
  border: string;
  text: string;
} {
  switch (type) {
    case "depends-on":
      return {
        bg: "var(--warning-light)",
        border: "var(--warning-border)",
        text: "var(--warning-text)",
      };
    case "provides":
      return {
        bg: "var(--success-light)",
        border: "var(--success-border)",
        text: "var(--success-text)",
      };
    case "consumes":
      return {
        bg: "var(--info-light, var(--accent-light))",
        border: "var(--info-border, var(--accent-border))",
        text: "var(--info-text, var(--accent-text))",
      };
    default:
      return {
        bg: "var(--surface-2)",
        border: "var(--border-1)",
        text: "var(--text-2)",
      };
  }
}

export function GraphEdgeChip({
  source,
  target,
  edgeType,
  weight,
  direction = "outgoing",
  onClick,
  className,
  ...rest
}: GraphEdgeChipProps): React.ReactElement {
  const interactive = typeof onClick === "function";
  const colors = edgeTypeColor(edgeType);
  const arrow = DIRECTION_ARROWS[direction];

  const classes = [
    "cc-graph-edge-chip",
    `cc-graph-edge-chip--${edgeType}`,
    interactive ? "cc-graph-edge-chip--interactive" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const style: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "var(--space-1, 0.25rem)",
    padding: "var(--space-1, 0.25rem) var(--space-2, 0.375rem)",
    borderRadius: "999px",
    background: colors.bg,
    border: `1px solid ${colors.border}`,
    color: colors.text,
    fontSize: "var(--text-xs, 0.75rem)",
    fontWeight: 500,
    lineHeight: 1,
    whiteSpace: "nowrap",
    cursor: interactive ? "pointer" : "default",
  };

  const inner = (
    <>
      <span className="cc-graph-edge-chip__source">{source}</span>
      <span className="cc-graph-edge-chip__arrow" aria-hidden="true">
        {arrow}
      </span>
      <span className="cc-graph-edge-chip__target">{target}</span>
      <span
        className="cc-graph-edge-chip__type"
        style={{
          padding: "0 var(--space-1, 0.25rem)",
          borderLeft: `1px solid ${colors.border}`,
          marginLeft: "var(--space-1, 0.25rem)",
        }}
      >
        {edgeType}
      </span>
      {weight !== undefined && (
        <span
          className="cc-graph-edge-chip__weight"
          style={{
            fontWeight: 700,
            fontSize: "var(--text-xs, 0.75rem)",
          }}
        >
          {Math.round(weight * 100)}%
        </span>
      )}
    </>
  );

  if (interactive) {
    return (
      <button
        type="button"
        className={classes}
        onClick={onClick}
        aria-label={
          rest["aria-label"] ?? `${source} ${edgeType} ${target}`
        }
        style={style}
      >
        {inner}
      </button>
    );
  }

  return (
    <span
      className={classes}
      aria-label={rest["aria-label"] ?? `${source} ${edgeType} ${target}`}
      style={style}
    >
      {inner}
    </span>
  );
}
