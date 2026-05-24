/**
 * DependencyGraphPane — feature/model dependency graph visualization.
 *
 * Renders a directed graph of dependencies using SVG. Nodes are positioned
 * using a simple layered layout (Sugiyama-lite). Supports node selection,
 * edge highlighting, and status indicators.
 *
 * Usage:
 *   <DependencyGraphPane
 *     nodes={[
 *       { id: 'auth', label: 'Auth Service' },
 *       { id: 'users', label: 'User Service' },
 *     ]}
 *     edges={[
 *       { source: 'users', target: 'auth' },
 *     ]}
 *   />
 */
import * as React from "react";
export type DependencyNodeStatus = "healthy" | "degraded" | "down" | "unknown";
export interface DependencyNode {
    id: string;
    label: string;
    status?: DependencyNodeStatus;
    /** Group/layer hint — nodes in the same group are placed at the same depth. */
    group?: string;
}
export interface DependencyEdge {
    source: string;
    target: string;
    /** Edge label. */
    label?: string;
    /** Visual style hint. */
    style?: "solid" | "dashed";
}
export interface DependencyGraphPaneProps {
    nodes: DependencyNode[];
    edges: DependencyEdge[];
    /** Title shown above the graph. */
    title?: string;
    /** Called when a node is clicked. */
    onNodeClick?: (node: DependencyNode) => void;
    /** Currently selected node id. */
    selectedNodeId?: string;
    /** Node width in px. Default: 140. */
    nodeWidth?: number;
    /** Node height in px. Default: 40. */
    nodeHeight?: number;
    /** Horizontal gap between nodes. Default: 60. */
    hGap?: number;
    /** Vertical gap between layers. Default: 80. */
    vGap?: number;
    className?: string;
}
export declare function DependencyGraphPane({ nodes, edges, title, onNodeClick, selectedNodeId, nodeWidth, nodeHeight, hGap, vGap, className, }: DependencyGraphPaneProps): React.ReactElement;
//# sourceMappingURL=DependencyGraphPane.d.ts.map