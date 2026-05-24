/**
 * CascadePanel — parent-child cascade visualization.
 *
 * Renders a tree of cascading items with indentation, expand/collapse,
 * and optional status indicators. Used for policy cascades, org hierarchy
 * views, and any parent-child relationship that fans out.
 *
 * Usage:
 *   <CascadePanel
 *     nodes={[
 *       { id: '1', label: 'Root Policy', children: [
 *         { id: '1.1', label: 'Region Override' },
 *         { id: '1.2', label: 'Tenant Override', children: [...] },
 *       ]},
 *     ]}
 *   />
 */
import * as React from "react";
export type CascadeNodeStatus = "active" | "overridden" | "inherited" | "disabled";
export interface CascadeNode {
    id: string;
    label: string;
    /** Optional status indicator. */
    status?: CascadeNodeStatus;
    /** Optional metadata shown to the right of the label. */
    meta?: React.ReactNode;
    /** Child nodes. */
    children?: CascadeNode[];
}
export interface CascadePanelProps {
    /** Tree of cascade nodes. */
    nodes: CascadeNode[];
    /** Panel heading. */
    title?: string;
    /** Indent per level in px. Default: 20. */
    indent?: number;
    /** Initially expand all nodes. Default: true. */
    defaultExpanded?: boolean;
    /** Called when a node is clicked. */
    onNodeClick?: (node: CascadeNode) => void;
    className?: string;
}
export declare function CascadePanel({ nodes, title, indent, defaultExpanded, onNodeClick, className, }: CascadePanelProps): React.ReactElement;
//# sourceMappingURL=CascadePanel.d.ts.map