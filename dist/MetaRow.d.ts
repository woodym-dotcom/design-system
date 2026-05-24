/**
 * MetaRow -- horizontal metadata display row (label-value pairs).
 *
 * DS-MIG P1-14. The missing layout primitive for displaying inline
 * metadata key-value pairs. Composes with Row and Text internally.
 *
 * Usage:
 *   <MetaRow
 *     items={[
 *       { label: 'Status', value: <Tag tone="success">Active</Tag> },
 *       { label: 'Created', value: '2024-01-15' },
 *       { label: 'Owner', value: 'Jane Doe' },
 *     ]}
 *   />
 *
 * Renders as a horizontal row of label-value pairs separated by a subtle
 * divider. Wraps on small screens.
 */
import * as React from 'react';
export interface MetaRowItem {
    /** Label text (key). */
    label: string;
    /** Value content -- can be text or a React node (e.g. Tag, StatusPill). */
    value: React.ReactNode;
    /** Optional: hide this item. */
    hidden?: boolean;
}
export type MetaRowSize = 'sm' | 'md';
export type MetaRowLayout = 'inline' | 'stacked';
export interface MetaRowProps {
    items: MetaRowItem[];
    /** Size variant. Default: 'md'. */
    size?: MetaRowSize;
    /**
     * Layout of each label-value pair.
     * - 'inline': label and value on the same line (default)
     * - 'stacked': label above value
     */
    layout?: MetaRowLayout;
    /** Show a separator between items. Default: true. */
    separator?: boolean;
    className?: string;
}
/**
 * MetaRow -- renders a horizontal strip of label: value pairs.
 */
export declare function MetaRow({ items, size, layout, separator, className, }: MetaRowProps): React.ReactElement;
//# sourceMappingURL=MetaRow.d.ts.map