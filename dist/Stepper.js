import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function StepCircle({ status, index }) {
    const base = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "1.4rem",
        height: "1.4rem",
        borderRadius: "50%",
        fontSize: "0.68rem",
        fontWeight: 700,
        flexShrink: 0,
    };
    const style = status === "completed"
        ? {
            ...base,
            background: "var(--status-healthy, #22c55e)",
            color: "var(--surface-0)",
            border: "2px solid var(--status-healthy, #22c55e)",
        }
        : status === "current"
            ? {
                ...base,
                background: "var(--accent-1)",
                color: "var(--surface-0)",
                border: "2px solid var(--accent-1)",
            }
            : {
                ...base,
                background: "transparent",
                color: "var(--text-2)",
                border: "2px solid var(--border-2, var(--border-1))",
            };
    return (_jsx("span", { "aria-hidden": "true", style: style, children: status === "completed" ? "✓" : index + 1 }));
}
export function Stepper({ steps, ariaLabel = "Progress" }) {
    return (_jsx("ol", { "aria-label": ariaLabel, style: {
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem 0.75rem",
            listStyle: "none",
            margin: 0,
            padding: 0,
        }, children: steps.map((step, index) => (_jsxs("li", { "aria-current": step.status === "current" ? "step" : undefined, style: { display: "flex", alignItems: "center", gap: "0.35rem" }, children: [_jsx(StepCircle, { status: step.status, index: index }), _jsx("span", { style: {
                        fontSize: "0.75rem",
                        color: step.status === "pending" ? "var(--text-2)" : "var(--text-1)",
                        fontWeight: step.status === "current" ? 600 : 400,
                    }, children: step.label })] }, step.id))) }));
}
//# sourceMappingURL=Stepper.js.map