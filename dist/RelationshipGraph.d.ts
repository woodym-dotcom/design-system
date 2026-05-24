/**
 * RelationshipGraph — interactive relationship graph visualization.
 *
 * Renders an SVG-based node-edge graph for relationship/network data.
 * Supports node selection, edge highlighting, radial layout, and
 * basic zoom/pan via viewBox manipulation.
 *
 * For simple dependency trees, prefer DependencyGraphPane. This component
 * is for richer interactive exploration of interconnected entities.
 *
 * Usage:
 *   <RelationshipGraph
 *     nodes={[
 *       { id: 'a', label: 'Alice' },
 *       { id: 'b', label: 'Bob' },
 *       { id: 'c', label: 'Carol' },
 *     ]}
 *     edges={[
 *       { source: 'a', target: 'b', label: 'manages' },
 *       { source: 'b', target: 'c', label: 'reports to' },
 *     ]}
 *   />
 */
import * as React from "react";
export type RelationshipNodeType = "person" | "entity" | "group" | "service" | "default";
export interface RelationshipNode {
    id: string;
    label: string;
    /** Node type for visual differentiation. Default: "default". */
    type?: RelationshipNodeType;
    /** Optional secondary label. */
    subtitle?: string;
    /** Custom fill color override. */
    color?: string;
}
export interface RelationshipEdge {
    source: string;
    target: string;
    /** Edge label. */
    label?: string;
    /** Edge weight (drives thickness). */
    weight?: number;
    /** Visual style. */
    style?: "solid" | "dashed";
}
export interface RelationshipGraphProps {
    nodes: RelationshipNode[];
    edges: RelationshipEdge[];
    /** Title shown above the graph. */
    title?: string;
    /** Called when a node is clicked. */
    onNodeClick?: (node: RelationshipNode) => void;
    /** Called when an edge is clicked. */
    onEdgeClick?: (edge: RelationshipEdge) => void;
    /** Currently selected node id. */
    selectedNodeId?: string;
    /** SVG width. Default: 600. */
    width?: number;
    /** SVG height. Default: 400. */
    height?: number;
    /** Node radius. Default: 24. */
    nodeRadius?: number;
    className?: string;
}
export declare function RelationshipGraph({ nodes, edges, title, onNodeClick, onEdgeClick, selectedNodeId, width, height, nodeRadius, className, }: RelationshipGraphProps): React.ReactElement;
//# sourceMappingURL=RelationshipGraph.d.ts.map