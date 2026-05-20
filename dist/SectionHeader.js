import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function SectionHeader({ title, description, titleExtras, metadata, actions, className, as: Heading = 'h2', }) {
    const headingClass = Heading === 'h1' ? 't-h1' : Heading === 'h3' ? 't-h3' : 't-h2';
    return (_jsxs("header", { className: ['cc-section-header', className].filter(Boolean).join(' '), children: [_jsxs("div", { className: "cc-section-header__row", children: [_jsxs(Heading, { className: `cc-section-header__title ${headingClass}`, children: [title, titleExtras ? (_jsx("span", { className: "cc-section-header__title-extras", children: titleExtras })) : null] }), (metadata || actions) && (_jsxs("div", { className: "cc-section-header__trailing", children: [metadata, actions] }))] }), description && (_jsx("p", { className: "cc-section-header__description t-body", children: description }))] }));
}
//# sourceMappingURL=SectionHeader.js.map