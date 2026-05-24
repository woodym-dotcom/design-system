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
export type GraphEdgeType = "depends-on" | "provides" | "consumes" | "related" | string;
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
export declare function GraphEdgeChip({ source, target, edgeType, weight, direction, onClick, className, ...rest }: GraphEdgeChipProps): React.ReactElement;
//# sourceMappingURL=GraphEdgeChip.d.ts.map