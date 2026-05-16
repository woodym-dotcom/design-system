import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function ListPageHeader({ title, subtitle, filters, createAction, className, }) {
    const classes = ['cc-list-page-header'];
    if (className)
        classes.push(className);
    return (_jsxs("header", { className: classes.join(' '), children: [_jsxs("div", { className: "cc-list-page-header__lead", children: [_jsx("h1", { className: "cc-list-page-header__title", children: title }), subtitle ? _jsx("p", { className: "cc-list-page-header__subtitle", children: subtitle }) : null] }), filters ? _jsx("div", { className: "cc-list-page-header__filters", children: filters }) : null, createAction ? _jsx("div", { className: "cc-list-page-header__actions", children: createAction }) : null] }));
}
//# sourceMappingURL=ListPageHeader.js.map