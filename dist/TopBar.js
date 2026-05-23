import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "./Button";
import { ThemeToggle } from "./ThemeToggle";
export function TopBar({ brand, identity, showCmdK = true, onCmdK, onIdentityClick, extras, className, }) {
    return (_jsxs("header", { role: "banner", className: ["cc-topbar", className].filter(Boolean).join(" "), children: [_jsx("div", { className: "cc-topbar__brand", children: brand }), _jsxs("div", { className: "cc-topbar__controls", children: [showCmdK ? (_jsxs(Button, { variant: "ghost", size: "sm", onClick: onCmdK, "aria-label": "Open command palette", className: "cc-topbar__cmdk", children: [_jsx("span", { "aria-hidden": "true", children: "\u2318K" }), _jsx("span", { className: "cc-topbar__cmdk-label", children: "Search" })] })) : null, _jsx(ThemeToggle, {}), extras, identity ? (_jsx("button", { type: "button", className: "cc-topbar__identity", onClick: onIdentityClick, "aria-label": "Open account menu", children: _jsx("span", { "aria-hidden": "true", children: identity.slice(0, 2).toUpperCase() }) })) : null] })] }));
}
//# sourceMappingURL=TopBar.js.map