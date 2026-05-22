import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * <ExpandableDetailPane> — right-side detail pane with full-screen toggle
 * and composable tab structure.
 *
 * §14 L2: extends DetailPane (which already exists). Rather than modifying
 * DetailPane (breaking change), this is a superset with tab + full-screen
 * features. Shares FOCUSABLE_SELECTOR logic and CSS primitives.
 *
 * Accessibility:
 *  - role="dialog" with aria-modal, aria-labelledby.
 *  - Focus trap: Tab / Shift+Tab cycle within pane.
 *  - Escape closes pane OR exits full-screen (first press exits full-screen
 *    when in full-screen mode; second press closes pane).
 *  - Tabs use role="tablist" / role="tab" / role="tabpanel" pattern.
 *  - Full-screen toggle button has a meaningful aria-label.
 */
import * as React from 'react';
// ── Helpers ───────────────────────────────────────────────────────────────────
const FOCUSABLE_SELECTOR = [
    'a[href]',
    'area[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    'iframe',
    'object',
    'embed',
    '[tabindex="0"]',
    '[contenteditable=true]',
].join(', ');
// ── Component ─────────────────────────────────────────────────────────────────
/**
 * @deprecated Since DS-SIMPLIFY 01. Use `<Overlay placement="detail-right" expandable>`
 *   instead. Removed at v1.0 (DS-SIMPLIFY 14).
 */
export function ExpandableDetailPane({ open, onClose, title, tabs, defaultTabId, subtitle, headerActions, allowFullScreen = true, className, }) {
    const paneRef = React.useRef(null);
    const previouslyFocused = React.useRef(null);
    const titleId = React.useId();
    const tabPanelId = React.useId();
    const [activeTabId, setActiveTabId] = React.useState(defaultTabId ?? tabs[0]?.id ?? '');
    const [isFullScreen, setIsFullScreen] = React.useState(false);
    // Reset full-screen when pane closes
    React.useEffect(() => {
        if (!open)
            setIsFullScreen(false);
    }, [open]);
    // Focus management on open
    React.useEffect(() => {
        if (!open)
            return;
        if (typeof document === 'undefined')
            return;
        previouslyFocused.current = document.activeElement;
        const node = paneRef.current;
        if (node) {
            const focusables = node.querySelectorAll(FOCUSABLE_SELECTOR);
            (focusables[0] ?? node).focus();
        }
        return () => {
            previouslyFocused.current?.focus?.();
        };
    }, [open]);
    // Keyboard: Escape and Tab trap
    React.useEffect(() => {
        if (!open)
            return;
        const onKey = (event) => {
            if (event.key === 'Escape') {
                event.stopPropagation();
                if (isFullScreen) {
                    setIsFullScreen(false);
                }
                else {
                    onClose();
                }
                return;
            }
            if (event.key !== 'Tab')
                return;
            const node = paneRef.current;
            if (!node)
                return;
            const focusables = Array.from(node.querySelectorAll(FOCUSABLE_SELECTOR)).filter((el) => !el.hasAttribute('disabled'));
            if (focusables.length === 0) {
                event.preventDefault();
                node.focus();
                return;
            }
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            const active = document.activeElement;
            if (event.shiftKey && active === first) {
                event.preventDefault();
                last.focus();
            }
            else if (!event.shiftKey && active === last) {
                event.preventDefault();
                first.focus();
            }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, onClose, isFullScreen]);
    const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];
    const showTabBar = tabs.length > 1;
    const tabRefs = React.useRef({});
    const focusTab = (id) => {
        setActiveTabId(id);
        // Defer focus until the new tab's tabIndex flips to 0.
        queueMicrotask(() => tabRefs.current[id]?.focus());
    };
    const classes = [
        'cc-expandable-pane',
        open ? 'is-open' : '',
        isFullScreen ? 'is-fullscreen' : '',
        className ?? '',
    ]
        .filter(Boolean)
        .join(' ');
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: `cc-expandable-pane__backdrop${open ? ' is-open' : ''}`, onClick: onClose, "aria-hidden": "true" }), _jsxs("div", { ref: paneRef, role: "dialog", "aria-modal": "true", "aria-labelledby": titleId, "aria-hidden": !open, tabIndex: -1, className: classes, children: [_jsxs("header", { className: "cc-expandable-pane__header", children: [_jsxs("div", { className: "cc-expandable-pane__title-group", children: [_jsx("h2", { id: titleId, className: "cc-expandable-pane__title", children: title }), subtitle ? (_jsx("p", { className: "cc-expandable-pane__subtitle", children: subtitle })) : null] }), _jsxs("div", { className: "cc-expandable-pane__header-actions", children: [headerActions ?? null, allowFullScreen ? (_jsx("button", { type: "button", className: "cc-btn cc-btn--ghost cc-btn--icon cc-btn--sm", "aria-label": isFullScreen ? 'Exit full screen' : 'Expand to full screen', "aria-pressed": isFullScreen, onClick: () => setIsFullScreen((v) => !v), children: isFullScreen ? '⊡' : '⛶' })) : null, _jsx("button", { type: "button", className: "cc-expandable-pane__close cc-btn cc-btn--ghost cc-btn--sm", onClick: onClose, "aria-label": "Close panel", children: "\u2715" })] })] }), showTabBar ? (_jsx("div", { role: "tablist", "aria-label": `${title} sections`, className: "cc-expandable-pane__tabs", children: tabs.map((tab) => (_jsx("button", { ref: (el) => {
                                tabRefs.current[tab.id] = el;
                            }, type: "button", role: "tab", id: `${tabPanelId}-tab-${tab.id}`, "aria-selected": tab.id === activeTabId, "aria-controls": `${tabPanelId}-panel-${tab.id}`, tabIndex: tab.id === activeTabId ? 0 : -1, className: [
                                'cc-expandable-pane__tab',
                                tab.id === activeTabId ? 'is-active' : '',
                            ]
                                .filter(Boolean)
                                .join(' '), onClick: () => setActiveTabId(tab.id), onKeyDown: (e) => {
                                const idx = tabs.findIndex((t) => t.id === tab.id);
                                if (e.key === 'ArrowRight') {
                                    e.preventDefault();
                                    focusTab(tabs[(idx + 1) % tabs.length].id);
                                }
                                else if (e.key === 'ArrowLeft') {
                                    e.preventDefault();
                                    focusTab(tabs[(idx - 1 + tabs.length) % tabs.length].id);
                                }
                                else if (e.key === 'Home') {
                                    e.preventDefault();
                                    focusTab(tabs[0].id);
                                }
                                else if (e.key === 'End') {
                                    e.preventDefault();
                                    focusTab(tabs[tabs.length - 1].id);
                                }
                            }, children: tab.label }, tab.id))) })) : null, tabs.map((tab) => (_jsx("div", { id: `${tabPanelId}-panel-${tab.id}`, role: "tabpanel", "aria-labelledby": showTabBar ? `${tabPanelId}-tab-${tab.id}` : undefined, hidden: tab.id !== activeTab?.id, className: "cc-expandable-pane__body", children: tab.id === activeTab?.id ? tab.render() : null }, tab.id)))] })] }));
}
//# sourceMappingURL=ExpandableDetailPane.js.map