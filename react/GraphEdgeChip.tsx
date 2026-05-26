/**
 * GraphEdgeChip — dependency-graph edge attribute chip.
 *
 * A small inline chip representing an edge in a dependency/relationship graph.
 * Shows edge type, direction, optional weight, and can be interactive
 * (click to focus the edge in the graph view).
 *
 * Composes the `Tag` primitive for tone-driven styling.
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
import { Tag } from "./Tag";
import type { TagTone } from "./Tag";

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

function edgeTypeTone(type: GraphEdgeType): TagTone {
  switch (type) {
    case "depends-on":
      return "warning";
    case "provides":
      return "success";
    case "consumes":
      return "info";
    default:
      return "neutral";
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
  const arrow = DIRECTION_ARROWS[direction];
  const classes = [
    "cc-graph-edge-chip",
    `cc-graph-edge-chip--${edgeType}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag
      tone={edgeTypeTone(edgeType)}
      onClick={onClick}
      aria-label={rest["aria-label"] ?? `${source} ${edgeType} ${target}`}
      className={classes}
    >
      <span className="cc-graph-edge-chip__source">{source}</span>
      <span className="cc-graph-edge-chip__arrow" aria-hidden="true">
        {arrow}
      </span>
      <span className="cc-graph-edge-chip__target">{target}</span>
      <span className="cc-graph-edge-chip__type">{edgeType}</span>
      {weight !== undefined && (
        <span className="cc-graph-edge-chip__weight">
          {Math.round(weight * 100)}%
        </span>
      )}
    </Tag>
  );
}
