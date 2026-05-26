/**
 * EntitlementPanel — recipient entitlement display.
 *
 * Renders a structured list of permissions, roles, and access grants
 * for a given recipient (user, service account, group). Each entitlement
 * can show its source (direct, inherited, temporary) and expiry.
 *
 * Usage:
 *   <EntitlementPanel
 *     recipient="Alice Smith"
 *     entitlements={[
 *       { id: '1', label: 'Admin', type: 'role', source: 'direct' },
 *       { id: '2', label: 'read:reports', type: 'permission', source: 'inherited', inheritedFrom: 'Editors' },
 *     ]}
 *   />
 */
import * as React from "react";
import { Card } from "./Card";

export type EntitlementType = "role" | "permission" | "group" | "scope";
export type EntitlementSource = "direct" | "inherited" | "temporary";

export interface Entitlement {
  id: string;
  label: string;
  type: EntitlementType;
  source: EntitlementSource;
  /** Where the entitlement is inherited from (when source is "inherited"). */
  inheritedFrom?: string;
  /** Expiry date for temporary entitlements. */
  expiresAt?: Date | string;
  /** Additional description or scope details. */
  description?: string;
}

export interface EntitlementPanelProps {
  /** Name or identifier of the recipient. */
  recipient: string;
  /** The entitlements to display. */
  entitlements: Entitlement[];
  /** Panel title override. Default: "{recipient}'s Entitlements". */
  title?: string;
  /** Group by type or source. Default: "type". */
  groupBy?: "type" | "source";
  /** Called when an entitlement is clicked. */
  onEntitlementClick?: (entitlement: Entitlement) => void;
  className?: string;
}

const TYPE_LABELS: Record<EntitlementType, string> = {
  role: "Roles",
  permission: "Permissions",
  group: "Groups",
  scope: "Scopes",
};

const SOURCE_LABELS: Record<EntitlementSource, string> = {
  direct: "Direct",
  inherited: "Inherited",
  temporary: "Temporary",
};

const SOURCE_COLORS: Record<EntitlementSource, string> = {
  direct: "var(--accent-text)",
  inherited: "var(--info-text)",
  temporary: "var(--warning-text)",
};

function groupEntitlements(
  items: Entitlement[],
  by: "type" | "source",
): Map<string, Entitlement[]> {
  const groups = new Map<string, Entitlement[]>();
  for (const item of items) {
    const key = by === "type" ? item.type : item.source;
    const existing = groups.get(key) ?? [];
    existing.push(item);
    groups.set(key, existing);
  }
  return groups;
}

function formatExpiry(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString();
}

export function EntitlementPanel({
  recipient,
  entitlements,
  title,
  groupBy = "type",
  onEntitlementClick,
  className,
}: EntitlementPanelProps): React.ReactElement {
  const classes = ["cc-entitlement-panel", className]
    .filter(Boolean)
    .join(" ");
  const heading = title ?? `${recipient}'s Entitlements`;
  const groups = groupEntitlements(entitlements, groupBy);
  const labelMap = groupBy === "type" ? TYPE_LABELS : SOURCE_LABELS;

  const countLabel = (
    <span
      className="cc-entitlement-panel__count"
      style={{
        fontSize: "var(--text-xs, 0.75rem)",
        color: "var(--text-3)",
      }}
    >
      {entitlements.length} entitlement{entitlements.length !== 1 ? "s" : ""}
    </span>
  );

  return (
    <Card
      title={heading}
      actions={countLabel}
      padded
      className={classes}
      role="region"
      aria-label={heading}
    >
      {Array.from(groups.entries()).map(([key, items]) => (
        <section key={key} className="cc-entitlement-panel__group" style={{ marginBottom: "var(--space-4, 0.75rem)" }}>
          <h4
            className="cc-entitlement-panel__group-label"
            style={{
              margin: "0 0 var(--space-2, 0.375rem)",
              fontSize: "var(--text-sm, 0.875rem)",
              fontWeight: 600,
              color: "var(--text-2)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {labelMap[key as keyof typeof labelMap] ?? key}
          </h4>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "var(--space-1, 0.25rem)" }}>
            {items.map((ent) => (
              <li
                key={ent.id}
                className={[
                  "cc-entitlement-panel__item",
                  `cc-entitlement-panel__item--${ent.source}`,
                  onEntitlementClick ? "cc-entitlement-panel__item--clickable" : null,
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2, 0.375rem)",
                  padding: "var(--space-2, 0.375rem) var(--space-3, 0.5rem)",
                  borderRadius: "var(--radius-1, 4px)",
                  border: "1px solid var(--border-1)",
                  cursor: onEntitlementClick ? "pointer" : "default",
                  fontSize: "var(--text-sm, 0.875rem)",
                }}
                onClick={onEntitlementClick ? () => onEntitlementClick(ent) : undefined}
                role={onEntitlementClick ? "button" : undefined}
                tabIndex={onEntitlementClick ? 0 : undefined}
                onKeyDown={
                  onEntitlementClick
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onEntitlementClick(ent);
                        }
                      }
                    : undefined
                }
              >
                <span
                  className="cc-entitlement-panel__source-dot"
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: SOURCE_COLORS[ent.source],
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                />
                <span className="cc-entitlement-panel__item-label" style={{ flex: 1, fontWeight: 500 }}>
                  {ent.label}
                </span>
                {ent.inheritedFrom && (
                  <span
                    className="cc-entitlement-panel__inherited-from"
                    style={{ fontSize: "var(--text-xs, 0.75rem)", color: "var(--text-3)" }}
                  >
                    via {ent.inheritedFrom}
                  </span>
                )}
                {ent.expiresAt && (
                  <span
                    className="cc-entitlement-panel__expiry"
                    style={{ fontSize: "var(--text-xs, 0.75rem)", color: "var(--warning-text)" }}
                  >
                    expires {formatExpiry(ent.expiresAt)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </Card>
  );
}
