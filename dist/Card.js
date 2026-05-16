import { jsxs as _jsxs } from "react/jsx-runtime";
export function Card({ title, subtitle, className, children }) {
    return (_jsxs("div", { className: ["card-base", "rounded-2xl", "border", "border-[color:var(--border-1)]", "p-4", className]
            .filter(Boolean)
            .join(" "), children: [title ? (_jsxs("div", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: [title, subtitle ? (_jsxs("span", { className: "ml-2 text-muted-foreground/70", children: ["\u00B7 ", subtitle] })) : null] })) : null, children] }));
}
//# sourceMappingURL=Card.js.map