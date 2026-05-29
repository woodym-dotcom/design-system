import { jsx as _jsx } from "react/jsx-runtime";
import { Tag } from "./Tag.js";
const FRESHNESS_META = {
    "online-hot": { label: "Online-Hot", tone: "success" },
    "online-standard": { label: "Online-Standard", tone: "info" },
    offline: { label: "Offline", tone: "neutral" },
};
export function FreshnessPill({ freshnessClass, label, size = "md", onClick, className, }) {
    const meta = FRESHNESS_META[freshnessClass];
    const displayLabel = label ?? meta.label;
    const classes = [
        "cc-freshness-pill",
        `cc-freshness-pill--${freshnessClass}`,
        className,
    ]
        .filter(Boolean)
        .join(" ");
    const tagSize = size === "sm" ? "sm" : "md";
    return (_jsx(Tag, { variant: "pill", tone: meta.tone, size: tagSize, dot: true, onClick: onClick, className: classes, children: displayLabel }));
}
//# sourceMappingURL=FreshnessPill.js.map