/**
 * Description — semantic <dl>-based description-list primitive.
 *
 * Subsumes DetailRow, DetailSection, DetailMetric, and MetaRow into a single
 * web-standard description-list with composable parts and a `kind` discriminator:
 *
 *   - kind="row"     → label/value row inside a parent <dl> (was DetailRow).
 *   - kind="section" → collapsible section with optional summary chevron
 *                      (was DetailSection).
 *   - kind="metric"  → label + headline value, optional drill-down detail
 *                      (was DetailMetric).
 *   - kind="meta"    → horizontal strip of label/value pairs with separators
 *                      (was MetaRow).
 *   - kind="list"    → wrapper <dl> that hosts row children (default).
 *
 * Drill-down hygiene: empty rows hide by default (no "No items yet" carcasses);
 * pass `showEmpty` to keep alignment slots in editable forms.
 */
import * as React from 'react';
export type DescriptionKind = 'list' | 'row' | 'section' | 'metric' | 'meta';
export type DescriptionMetaSize = 'sm' | 'md';
export type DescriptionMetaLayout = 'inline' | 'stacked';
export interface DescriptionMetaItem {
    label: string;
    value: React.ReactNode;
    hidden?: boolean;
}
interface BaseDescriptionProps {
    className?: string;
}
interface ListDescriptionProps extends BaseDescriptionProps {
    kind?: 'list';
    children: React.ReactNode;
}
interface RowDescriptionProps extends BaseDescriptionProps {
    kind: 'row';
    /** Label column content. */
    label: React.ReactNode;
    /** Value column content. Hidden by default when empty. */
    children?: React.ReactNode;
    /** When true, the row renders even if `children` is empty. */
    showEmpty?: boolean;
}
interface SectionDescriptionProps extends BaseDescriptionProps {
    kind: 'section';
    /** Section heading. */
    title: React.ReactNode;
    /** Optional one-line summary; presence enables the collapsible chevron. */
    summary?: React.ReactNode;
    /** Expanded content. */
    children?: React.ReactNode;
    /** When true, section is hidden entirely (drill-down hygiene). */
    empty?: boolean;
    /** Initial expanded state when `summary` is provided. Default: false. */
    defaultOpen?: boolean;
    /** Heading level. Default: 3. */
    headingLevel?: 2 | 3 | 4 | 5;
}
interface MetricDescriptionProps extends BaseDescriptionProps {
    kind: 'metric';
    /** Metric label, e.g. "Open obligations". */
    label: React.ReactNode;
    /** Headline value. */
    value: React.ReactNode;
    /** Optional drill-down content shown on click. */
    detail?: React.ReactNode;
    /** Optional small caption (delta, sub-label). */
    caption?: React.ReactNode;
}
interface MetaDescriptionProps extends BaseDescriptionProps {
    kind: 'meta';
    items: DescriptionMetaItem[];
    /** Size variant. Default 'md'. */
    size?: DescriptionMetaSize;
    /** 'inline' (default) or 'stacked'. */
    layout?: DescriptionMetaLayout;
    /** Show a separator between items. Default true. */
    separator?: boolean;
}
export type DescriptionProps = ListDescriptionProps | RowDescriptionProps | SectionDescriptionProps | MetricDescriptionProps | MetaDescriptionProps;
export interface DescriptionTermProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
}
export declare function DescriptionTerm({ className, children, ...rest }: DescriptionTermProps): import("react/jsx-runtime").JSX.Element;
export interface DescriptionValueProps extends React.HTMLAttributes<HTMLElement> {
    children?: React.ReactNode;
}
export declare function DescriptionValue({ className, children, ...rest }: DescriptionValueProps): import("react/jsx-runtime").JSX.Element;
/**
 * Description — unified description-list primitive. Use the `kind` prop to
 * pick the surface; see the file header for the list of kinds.
 */
export declare function Description(props: DescriptionProps): React.ReactElement | null;
export {};
//# sourceMappingURL=Description.d.ts.map