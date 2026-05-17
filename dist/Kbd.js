import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
const ALIASES = {
    mod: navigatorMetaKey(),
    cmd: '⌘',
    command: '⌘',
    ctrl: 'Ctrl',
    control: 'Ctrl',
    shift: 'Shift',
    alt: 'Alt',
    option: '⌥',
    enter: '↵',
    return: '↵',
    esc: 'Esc',
    escape: 'Esc',
    tab: 'Tab',
    space: 'Space',
    up: '↑',
    down: '↓',
    left: '←',
    right: '→',
};
function navigatorMetaKey() {
    if (typeof navigator === 'undefined')
        return 'Ctrl';
    return /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl';
}
function render(key) {
    const k = key.toLowerCase();
    return ALIASES[k] ?? key;
}
/**
 * Renders one or more keyboard keys as compact rounded tokens. Use for
 * shortcut hints in menus, tooltips, and command palettes.
 */
export function Kbd({ keys, size = 'md', label, className }) {
    const list = Array.isArray(keys) ? keys : [keys];
    const ariaLabel = label ?? `Keyboard shortcut: ${list.join(' + ')}`;
    return (_jsx("span", { className: ['cc-kbd-group', `cc-kbd-group--${size}`, className].filter(Boolean).join(' '), role: "group", "aria-label": ariaLabel, children: list.map((k, i) => (_jsxs(React.Fragment, { children: [_jsx("kbd", { className: "cc-kbd", children: render(k) }), i < list.length - 1 && _jsx("span", { "aria-hidden": "true", className: "cc-kbd-sep", children: "+" })] }, `${k}-${i}`))) }));
}
//# sourceMappingURL=Kbd.js.map