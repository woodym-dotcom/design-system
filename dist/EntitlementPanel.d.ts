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
export declare function EntitlementPanel({ recipient, entitlements, title, groupBy, onEntitlementClick, className, }: EntitlementPanelProps): React.ReactElement;
//# sourceMappingURL=EntitlementPanel.d.ts.map