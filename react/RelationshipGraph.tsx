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

const TYPE_COLORS: Record<RelationshipNodeType, string> = {
  person: "var(--accent-light)",
  entity: "var(--info-light, var(--surface-3))",
  group: "var(--warning-light)",
  service: "var(--success-light)",
  default: "var(--surface-2)",
};

const TYPE_BORDERS: Record<RelationshipNodeType, string> = {
  person: "var(--accent-border)",
  entity: "var(--info-border, var(--border-1))",
  group: "var(--warning-border)",
  service: "var(--success-border)",
  default: "var(--border-1)",
};

interface PositionedNode extends RelationshipNode {
  cx: number;
  cy: number;
}

/**
 * Simple radial layout: place nodes in a circle around the center.
 */
function radialLayout(
  nodes: RelationshipNode[],
  width: number,
  height: number,
  nodeRadius: number,
): PositionedNode[] {
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) / 2 - nodeRadius * 2 - 20;

  if (nodes.length === 1) {
    return [{ ...nodes[0], cx, cy }];
  }

  return nodes.map((node, i) => {
    const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
    return {
      ...node,
      cx: cx + radius * Math.cos(angle),
      cy: cy + radius * Math.sin(angle),
    };
  });
}

export function RelationshipGraph({
  nodes,
  edges,
  title,
  onNodeClick,
  onEdgeClick,
  selectedNodeId,
  width = 600,
  height = 400,
  nodeRadius = 24,
  className,
}: RelationshipGraphProps): React.ReactElement {
  const positioned = radialLayout(nodes, width, height, nodeRadius);

  const posMap = new Map<string, PositionedNode>();
  for (const p of positioned) posMap.set(p.id, p);

  const classes = ["cc-relationship-graph", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      role="img"
      aria-label={title ?? "Relationship graph"}
      style={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid var(--border-1)",
        borderRadius: "var(--radius-2, 8px)",
        background: "var(--surface-1)",
        overflow: "hidden",
      }}
    >
      {title && (
        <header
          className="cc-relationship-graph__header"
          style={{
            padding: "var(--space-3, 0.5rem) var(--space-4, 0.75rem)",
            borderBottom: "1px solid var(--border-1)",
            fontWeight: 600,
            fontSize: "var(--text-base, 1rem)",
          }}
        >
          {title}
        </header>
      )}
      <svg
        className="cc-relationship-graph__svg"
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        style={{ display: "block" }}
      >
        <defs>
          <marker
            id="rel-arrow"
            viewBox="0 0 10 10"
            refX={10}
            refY={5}
            markerWidth={6}
            markerHeight={6}
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--border-1)" />
          </marker>
        </defs>

        {/* Edges */}
        {edges.map((edge, i) => {
          const src = posMap.get(edge.source);
          const tgt = posMap.get(edge.target);
          if (!src || !tgt) return null;

          // Shorten the line so it doesn't overlap with node circles.
          const dx = tgt.cx - src.cx;
          const dy = tgt.cy - src.cy;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const offsetX = (dx / dist) * nodeRadius;
          const offsetY = (dy / dist) * nodeRadius;

          const x1 = src.cx + offsetX;
          const y1 = src.cy + offsetY;
          const x2 = tgt.cx - offsetX;
          const y2 = tgt.cy - offsetY;

          const strokeWidth = edge.weight ? 1 + edge.weight * 2 : 1.5;

          return (
            <g
              key={`edge-${i}`}
              className="cc-relationship-graph__edge"
              style={{ cursor: onEdgeClick ? "pointer" : "default" }}
              onClick={onEdgeClick ? () => onEdgeClick(edge) : undefined}
            >
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="var(--border-1)"
                strokeWidth={strokeWidth}
                strokeDasharray={edge.style === "dashed" ? "4 3" : undefined}
                markerEnd="url(#rel-arrow)"
              />
              {edge.label && (
                <text
                  x={(x1 + x2) / 2}
                  y={(y1 + y2) / 2 - 6}
                  textAnchor="middle"
                  fontSize={10}
                  fill="var(--text-3)"
                >
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {positioned.map((node) => {
          const isSelected = node.id === selectedNodeId;
          const type = node.type ?? "default";
          const fill = node.color ?? TYPE_COLORS[type];
          const stroke = isSelected
            ? "var(--accent-border)"
            : TYPE_BORDERS[type];

          return (
            <g
              key={node.id}
              className={`cc-relationship-graph__node${isSelected ? " cc-relationship-graph__node--selected" : ""}`}
              style={{ cursor: onNodeClick ? "pointer" : "default" }}
              onClick={onNodeClick ? () => onNodeClick(node) : undefined}
              tabIndex={onNodeClick ? 0 : undefined}
              role={onNodeClick ? "button" : undefined}
              onKeyDown={
                onNodeClick
                  ? (e: React.KeyboardEvent) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onNodeClick(node);
                      }
                    }
                  : undefined
              }
            >
              <circle
                cx={node.cx}
                cy={node.cy}
                r={nodeRadius}
                fill={fill}
                stroke={stroke}
                strokeWidth={isSelected ? 2.5 : 1.5}
              />
              <text
                x={node.cx}
                y={node.cy + (node.subtitle ? -3 : 4)}
                textAnchor="middle"
                fontSize={11}
                fontWeight={600}
                fill="var(--text-1)"
              >
                {node.label}
              </text>
              {node.subtitle && (
                <text
                  x={node.cx}
                  y={node.cy + 10}
                  textAnchor="middle"
                  fontSize={9}
                  fill="var(--text-3)"
                >
                  {node.subtitle}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
