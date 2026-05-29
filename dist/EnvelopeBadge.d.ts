/**
 * EnvelopeBadge — multi-field chip group for a resolved envelope.
 *
 * Renders a compact horizontal group of `Tag` chips representing
 * the fields of a resolved envelope (e.g. name, DOB, address, ID number).
 *
 * Usage:
 *   <EnvelopeBadge
 *     fields={[
 *       { label: "Name", value: "John Doe" },
 *       { label: "DOB", value: "1990-01-15" },
 *       { label: "ID", value: "ABC-123" },
 *     ]}
 *   />
 */
import * as React from "react";
export interface EnvelopeBadgeField {
    label: string;
    value: string;
    /** Optional tone for this field's chip. */
    tone?: "neutral" | "success" | "warning" | "error" | "info";
}
export interface EnvelopeBadgeProps {
    /** Fields to display in the envelope chip group. */
    fields: EnvelopeBadgeField[];
    /** Size variant. Default: "md". */
    size?: "sm" | "md";
    /** Click handler — makes the entire badge interactive. */
    onClick?: () => void;
    /** Accessible label for the group. */
    "aria-label"?: string;
    className?: string;
}
export declare function EnvelopeBadge({ fields, size, onClick, className, ...rest }: EnvelopeBadgeProps): React.ReactElement;
//# sourceMappingURL=EnvelopeBadge.d.ts.map