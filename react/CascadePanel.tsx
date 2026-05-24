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

const STATUS_COLORS: Record<CascadeNodeStatus, string> = {
  active: "var(--success-text)",
  overridden: "var(--warning-text)",
  inherited: "var(--info-text)",
  disabled: "var(--text-4)",
};

const STATUS_LABELS: Record<CascadeNodeStatus, string> = {
  active: "Active",
  overridden: "Overridden",
  inherited: "Inherited",
  disabled: "Disabled",
};

function CascadeNodeItem({
  node,
  depth,
  indent,
  defaultExpanded,
  onNodeClick,
}: {
  node: CascadeNode;
  depth: number;
  indent: number;
  defaultExpanded: boolean;
  onNodeClick?: (node: CascadeNode) => void;
}): React.ReactElement {
  const hasChildren = node.children && node.children.length > 0;
  const [expanded, setExpanded] = React.useState(defaultExpanded);

  return (
    <li className="cc-cascade-panel__item" style={{ listStyle: "none" }}>
      <div
        className={[
          "cc-cascade-panel__row",
          onNodeClick ? "cc-cascade-panel__row--clickable" : null,
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2, 0.375rem)",
          paddingLeft: `${depth * indent}px`,
          padding: `var(--space-2, 0.375rem) var(--space-3, 0.5rem) var(--space-2, 0.375rem) ${depth * indent + 8}px`,
          cursor: onNodeClick ? "pointer" : "default",
          borderRadius: "var(--radius-1, 4px)",
        }}
        onClick={onNodeClick ? () => onNodeClick(node) : undefined}
        role={onNodeClick ? "button" : undefined}
        tabIndex={onNodeClick ? 0 : undefined}
        onKeyDown={
          onNodeClick
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onNodeClick(node);
                }
              }
            : undefined
        }
      >
        {hasChildren ? (
          <button
            type="button"
            className="cc-cascade-panel__toggle"
            aria-expanded={expanded}
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((v) => !v);
            }}
            style={{
              flexShrink: 0,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              fontSize: "var(--text-sm, 0.875rem)",
              lineHeight: 1,
              color: "var(--text-3)",
            }}
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? "▾" : "▸"}
          </button>
        ) : (
          <span style={{ width: "0.875rem", flexShrink: 0 }} />
        )}

        {node.status && (
          <span
            className={`cc-cascade-panel__status cc-cascade-panel__status--${node.status}`}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: STATUS_COLORS[node.status],
              flexShrink: 0,
            }}
            title={STATUS_LABELS[node.status]}
            aria-label={STATUS_LABELS[node.status]}
          />
        )}

        <span
          className="cc-cascade-panel__label"
          style={{
            flex: 1,
            fontSize: "var(--text-sm, 0.875rem)",
            fontWeight: depth === 0 ? 600 : 400,
          }}
        >
          {node.label}
        </span>

        {node.meta && (
          <span
            className="cc-cascade-panel__meta"
            style={{
              fontSize: "var(--text-xs, 0.75rem)",
              color: "var(--text-3)",
              flexShrink: 0,
            }}
          >
            {node.meta}
          </span>
        )}
      </div>

      {hasChildren && expanded && (
        <ul
          className="cc-cascade-panel__children"
          style={{ margin: 0, padding: 0 }}
        >
          {node.children!.map((child) => (
            <CascadeNodeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              indent={indent}
              defaultExpanded={defaultExpanded}
              onNodeClick={onNodeClick}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function CascadePanel({
  nodes,
  title,
  indent = 20,
  defaultExpanded = true,
  onNodeClick,
  className,
}: CascadePanelProps): React.ReactElement {
  const classes = ["cc-cascade-panel", className].filter(Boolean).join(" ");

  return (
    <div
      className={classes}
      role="tree"
      aria-label={title ?? "Cascade tree"}
      style={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid var(--border-1)",
        borderRadius: "var(--radius-2, 8px)",
        background: "var(--surface-1)",
      }}
    >
      {title && (
        <header
          className="cc-cascade-panel__header"
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
      <ul
        className="cc-cascade-panel__list"
        style={{ margin: 0, padding: "var(--space-2, 0.375rem) 0" }}
      >
        {nodes.map((node) => (
          <CascadeNodeItem
            key={node.id}
            node={node}
            depth={0}
            indent={indent}
            defaultExpanded={defaultExpanded}
            onNodeClick={onNodeClick}
          />
        ))}
      </ul>
    </div>
  );
}
