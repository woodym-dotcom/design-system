/**
 * Detail-surface primitives — DetailRow, DetailSection, DetailMetric.
 *
 * Replace ad-hoc <div className="detail-row"> markup across consumers with
 * three composable primitives that own label/value alignment, drill-down
 * behaviour and empty-section hygiene.
 *
 *  - <DetailRow label="…">      label/value row with grid-aligned columns.
 *  - <DetailSection title="…">  collapsible section; auto-hides when empty.
 *  - <DetailMetric label value> headline number + chevron-to-expand summary.
 *
 * Design philosophy (drill-down): default to one-line summaries with a
 * chevron to expand; hide entire sections when their data set is empty
 * (no "No items yet" carcasses).
 */
import * as React from 'react';
export interface DetailRowProps {
    /** Label column content. Strings get the default label typography. */
    label: React.ReactNode;
    /**
     * Value column content. When `undefined` or `null` the row renders nothing
     * (drill-down philosophy: no empty rows).
     */
    children?: React.ReactNode;
    /**
     * When true, the row renders even if `children` is empty. Use for editable
     * forms where the value placeholder still needs the alignment slot.
     */
    showEmpty?: boolean;
    className?: string;
}
export declare function DetailRow({ label, children, showEmpty, className, }: DetailRowProps): import("react/jsx-runtime").JSX.Element | null;
export interface DetailSectionProps {
    /** Section heading. */
    title: React.ReactNode;
    /**
     * One-line summary rendered when the section is collapsed. Optional —
     * when omitted the section expands inline without a chevron.
     */
    summary?: React.ReactNode;
    /** Expanded content. */
    children?: React.ReactNode;
    /**
     * When true, the section is hidden entirely. Drill-down hygiene: callers
     * pass `empty={data.length === 0}` so empty sections don't render.
     */
    empty?: boolean;
    /**
     * Initial expanded state when `summary` is provided. Default: false.
     * The section is uncontrolled (collapsible state lives inside).
     */
    defaultOpen?: boolean;
    /** Heading level for a11y. Default: 3. */
    headingLevel?: 2 | 3 | 4 | 5;
    className?: string;
}
export declare function DetailSection({ title, summary, children, empty, defaultOpen, headingLevel, className, }: DetailSectionProps): import("react/jsx-runtime").JSX.Element | null;
export interface DetailMetricProps {
    /** Metric label, e.g. "Open obligations". */
    label: React.ReactNode;
    /** Headline value, e.g. 42, "$1.2M", or a formatted span. */
    value: React.ReactNode;
    /** Optional drill-down content shown on click (uses DetailSection chevron). */
    detail?: React.ReactNode;
    /** Optional small caption (delta, sub-label). */
    caption?: React.ReactNode;
    className?: string;
}
export declare function DetailMetric({ label, value, detail, caption, className, }: DetailMetricProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=DetailPrimitives.d.ts.map