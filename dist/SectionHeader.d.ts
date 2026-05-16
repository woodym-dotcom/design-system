/**
 * <SectionHeader> — consistent h2 section header with optional description,
 * trailing metadata, and action slot.
 *
 * Enforces visual hierarchy: h2 title (t-h2) > description (t-body).
 * Replaces ad-hoc flex+heading patterns that each hardcode their own
 * type scale and spacing.
 */
import * as React from 'react';
export interface SectionHeaderProps {
    /** Section heading text. Rendered as h2. */
    title: string;
    /** Optional supporting copy rendered below the title. */
    description?: string;
    /**
     * Trailing metadata slot. Typically a <MetadataChip> but accepts any node.
     * Positioned at the right end of the heading row.
     */
    metadata?: React.ReactNode;
    /**
     * Actions slot — buttons, toggles, links. Positioned right of metadata.
     */
    actions?: React.ReactNode;
    className?: string;
    /** Override the heading level. Defaults to 'h2'. */
    as?: 'h1' | 'h2' | 'h3';
}
export declare function SectionHeader({ title, description, metadata, actions, className, as: Heading, }: SectionHeaderProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SectionHeader.d.ts.map