import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
const EMPTY_VALUES = new Set([undefined, null, '']);
export function DetailRow({ label, children, showEmpty = false, className, }) {
    if (!showEmpty && EMPTY_VALUES.has(children))
        return null;
    const classes = ['cc-detail-row'];
    if (className)
        classes.push(className);
    return (_jsxs("div", { className: classes.join(' '), children: [_jsx("dt", { className: "cc-detail-row__label", children: label }), _jsx("dd", { className: "cc-detail-row__value", children: children })] }));
}
export function DetailSection({ title, summary, children, empty = false, defaultOpen = false, headingLevel = 3, className, }) {
    const [open, setOpen] = React.useState(defaultOpen);
    if (empty)
        return null;
    const Heading = `h${headingLevel}`;
    const hasSummary = summary !== undefined && summary !== null;
    const classes = ['cc-detail-section'];
    if (hasSummary)
        classes.push('cc-detail-section--collapsible');
    if (open || !hasSummary)
        classes.push('is-open');
    if (className)
        classes.push(className);
    const bodyId = React.useId();
    return (_jsxs("section", { className: classes.join(' '), children: [_jsxs("header", { className: "cc-detail-section__header", children: [_jsx(Heading, { className: "cc-detail-section__title", children: title }), hasSummary ? (_jsxs("button", { type: "button", className: "cc-detail-section__toggle", "aria-expanded": open, "aria-controls": bodyId, onClick: () => setOpen((o) => !o), children: [_jsx("span", { className: "cc-detail-section__summary", children: summary }), _jsx("span", { className: "cc-detail-section__chevron", "aria-hidden": "true", children: open ? '▾' : '▸' })] })) : null] }), open || !hasSummary ? (_jsx("div", { id: bodyId, className: "cc-detail-section__body", children: children })) : null] }));
}
export function DetailMetric({ label, value, detail, caption, className, }) {
    const [open, setOpen] = React.useState(false);
    const bodyId = React.useId();
    const classes = ['cc-detail-metric'];
    if (className)
        classes.push(className);
    if (detail)
        classes.push('cc-detail-metric--drill');
    if (open)
        classes.push('is-open');
    const hasDetail = detail !== undefined && detail !== null;
    return (_jsxs("div", { className: classes.join(' '), children: [_jsxs("button", { type: "button", className: "cc-detail-metric__header", "aria-expanded": hasDetail ? open : undefined, "aria-controls": hasDetail ? bodyId : undefined, onClick: hasDetail ? () => setOpen((o) => !o) : undefined, disabled: !hasDetail, children: [_jsx("span", { className: "cc-detail-metric__label", children: label }), _jsx("span", { className: "cc-detail-metric__value", children: value }), caption ? (_jsx("span", { className: "cc-detail-metric__caption", children: caption })) : null, hasDetail ? (_jsx("span", { className: "cc-detail-metric__chevron", "aria-hidden": "true", children: open ? '▾' : '▸' })) : null] }), hasDetail && open ? (_jsx("div", { id: bodyId, className: "cc-detail-metric__body", children: detail })) : null] }));
}
//# sourceMappingURL=DetailPrimitives.js.map