import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSplitPane } from "./hooks/useSplitPane.js";
import { Button } from "./Button.js";
export function DrilldownLayout({ listSlot, detailSlot, selectedId, onExpandFullScreen, storageKey = "drilldown", defaultLeftPercent = 42, ariaLabel, className, }) {
    const { containerRef, handleProps, leftPercent } = useSplitPane({
        storageKey,
        defaultLeftPercent,
    });
    const canExpand = Boolean(selectedId && onExpandFullScreen);
    return (_jsxs("div", { ref: containerRef, role: "group", "aria-label": ariaLabel, className: ["cc-drilldown", className].filter(Boolean).join(" "), style: { gridTemplateColumns: `${leftPercent}% 6px 1fr` }, children: [_jsx("div", { className: "cc-drilldown__list", children: listSlot }), _jsx("div", { className: "cc-drilldown__handle", ...handleProps }), _jsxs("div", { className: "cc-drilldown__detail", children: [canExpand ? (_jsx("div", { className: "cc-drilldown__detail-toolbar", children: _jsx(Button, { variant: "ghost", size: "sm", onClick: () => onExpandFullScreen?.(selectedId), children: "Expand" }) })) : null, _jsx("div", { className: "cc-drilldown__detail-body", children: detailSlot })] })] }));
}
//# sourceMappingURL=DrilldownLayout.js.map