import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
// Fullscreen mode portals the pane to <body> so it covers ModuleShell +
// NavRail chrome that would otherwise clip it. react-dom types come from
// the local shim in react-dom-shim.d.ts.
import { createPortal } from 'react-dom';
const FOCUSABLE_SELECTOR = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable=true]';
const MIN_WIDTH = 320;
const MAX_WIDTH_VW = 95;
const STORAGE_PREFIX = 'ds-detailpane-width-';
const DEFAULT_WIDTH = 480;
function clampWidth(px) {
    if (typeof window === 'undefined')
        return Math.max(MIN_WIDTH, px);
    const max = Math.floor((window.innerWidth * MAX_WIDTH_VW) / 100);
    return Math.min(Math.max(MIN_WIDTH, Math.round(px)), max);
}
function readStoredWidth(key, fallback) {
    if (typeof window === 'undefined')
        return fallback;
    try {
        const stored = window.localStorage.getItem(key);
        if (!stored)
            return fallback;
        const n = parseInt(stored, 10);
        return Number.isFinite(n) ? clampWidth(n) : fallback;
    }
    catch {
        return fallback;
    }
}
/**
 * @deprecated Since DS-SIMPLIFY 01. Use `<Overlay placement="detail-right">`
 *   instead. Removed at v1.0 (DS-SIMPLIFY 14).
 */
export function DetailPane({ open, onClose, title, sections, className, subtitle, resizeKey, fullscreen: fullscreenProp, onFullscreenChange, sectionHeading, headerActions, onResize, }) {
    const paneRef = React.useRef(null);
    const previouslyFocused = React.useRef(null);
    const titleId = React.useId();
    // Fullscreen — controlled if `fullscreen` prop provided, otherwise internal.
    const isControlled = fullscreenProp !== undefined;
    const [internalFullscreen, setInternalFullscreen] = React.useState(false);
    const fullscreen = isControlled ? fullscreenProp : internalFullscreen;
    const toggleFullscreen = React.useCallback(() => {
        const next = !fullscreen;
        if (!isControlled)
            setInternalFullscreen(next);
        onFullscreenChange?.(next);
    }, [fullscreen, isControlled, onFullscreenChange]);
    // Resize state — only active when resizeKey provided.
    const storageKey = resizeKey ? `${STORAGE_PREFIX}${resizeKey}` : null;
    const [panelWidth, setPanelWidth] = React.useState(() => storageKey ? readStoredWidth(storageKey, DEFAULT_WIDTH) : DEFAULT_WIDTH);
    const [resizing, setResizing] = React.useState(false);
    const startXRef = React.useRef(0);
    const startWidthRef = React.useRef(0);
    // Mirrors `panelWidth` so the resize-end handler can read the latest value
    // without forcing the effect (and its pointer listeners) to re-attach on
    // every pointermove.
    const panelWidthRef = React.useRef(panelWidth);
    React.useEffect(() => {
        panelWidthRef.current = panelWidth;
    }, [panelWidth]);
    const beginResize = React.useCallback((e) => {
        e.preventDefault();
        startXRef.current = e.clientX;
        startWidthRef.current = panelWidth;
        setResizing(true);
        try {
            e.target.setPointerCapture(e.pointerId);
        }
        catch {
            /* pointer capture is best-effort */
        }
    }, [panelWidth]);
    React.useEffect(() => {
        if (!resizing)
            return;
        const onMove = (e) => {
            const dx = startXRef.current - e.clientX;
            setPanelWidth(clampWidth(startWidthRef.current + dx));
        };
        const onUp = () => {
            setResizing(false);
            if (storageKey) {
                try {
                    window.localStorage.setItem(storageKey, String(panelWidthRef.current));
                }
                catch {
                    /* localStorage may be unavailable (private mode); ignore. */
                }
            }
            onResize?.(panelWidthRef.current);
        };
        document.addEventListener('pointermove', onMove);
        document.addEventListener('pointerup', onUp);
        return () => {
            document.removeEventListener('pointermove', onMove);
            document.removeEventListener('pointerup', onUp);
        };
    }, [resizing, storageKey]);
    // Focus management.
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
    // Keyboard: Escape exits fullscreen first, then closes on second press.
    React.useEffect(() => {
        if (!open)
            return;
        const onKey = (event) => {
            if (event.key === 'Escape') {
                event.stopPropagation();
                if (fullscreen) {
                    if (!isControlled)
                        setInternalFullscreen(false);
                    onFullscreenChange?.(false);
                    return;
                }
                onClose();
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
    }, [open, onClose, fullscreen, isControlled, onFullscreenChange]);
    const classes = ['cc-detail-pane'];
    if (open)
        classes.push('is-open');
    if (fullscreen)
        classes.push('cc-detail-pane--fullscreen');
    if (className)
        classes.push(className);
    const widthStyle = resizeKey && !fullscreen
        ? { width: panelWidth, maxWidth: `${MAX_WIDTH_VW}vw` }
        : undefined;
    const content = (_jsxs(_Fragment, { children: [_jsx("div", { className: `cc-detail-pane__backdrop${open ? ' is-open' : ''}`, onClick: onClose, "aria-hidden": "true" }), _jsxs("div", { ref: paneRef, role: "dialog", "aria-modal": "true", "aria-labelledby": titleId, "aria-hidden": !open, tabIndex: -1, className: classes.join(' '), style: widthStyle, children: [resizeKey && !fullscreen && (_jsx("div", { role: "separator", "aria-orientation": "vertical", "aria-label": "Resize panel", onPointerDown: beginResize, className: `cc-detail-pane__resize-handle${resizing ? ' is-resizing' : ''}` })), _jsxs("header", { className: "cc-detail-pane__header", children: [_jsxs("div", { className: "cc-detail-pane__header-title", children: [_jsx("h2", { id: titleId, className: "cc-detail-pane__title", children: title }), subtitle && (_jsx("p", { className: "cc-detail-pane__subtitle", children: subtitle }))] }), _jsxs("div", { className: "cc-detail-pane__header-actions", children: [headerActions, _jsx("button", { type: "button", className: "cc-detail-pane__fullscreen-toggle", onClick: toggleFullscreen, "aria-label": fullscreen ? 'Exit full screen' : 'Full screen panel', "aria-pressed": fullscreen, children: fullscreen ? 'Exit full screen' : 'Full screen' }), _jsx("button", { type: "button", className: "cc-detail-pane__close", onClick: onClose, "aria-label": "Close panel", children: "Close" })] })] }), _jsxs("div", { className: "cc-detail-pane__body", children: [sectionHeading && (_jsx("h3", { className: "cc-detail-pane__section-heading cc-detail-pane__section-heading--top", children: sectionHeading })), sections.map((section, index) => (_jsxs("section", { className: "cc-detail-pane__section", children: [_jsx("h3", { className: "cc-detail-pane__section-heading", children: section.heading }), _jsx("div", { className: "cc-detail-pane__section-content", children: section.content })] }, index)))] })] })] }));
    // In fullscreen the pane must cover the surrounding ModuleShell + NavRail
    // chrome (a stacking-context inside a transformed parent would otherwise
    // clip it). Portal to <body> when fullscreen is active and the DOM is
    // available; render in-tree otherwise (SSR-safe fallback).
    if (fullscreen && open && typeof document !== 'undefined') {
        return createPortal(content, document.body);
    }
    return content;
}
//# sourceMappingURL=DetailPane.js.map