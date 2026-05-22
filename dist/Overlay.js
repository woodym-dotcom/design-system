import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Overlay — the single overlay primitive that subsumes the legacy stack
 * (Modal, Drawer, DetailPane, ExpandableDetailPane, ArtefactDetailPane,
 * DrilldownLayout, FullScreenDetail).
 *
 * Behaviour is selected by the `placement` discriminator (see
 * `Overlay.types.ts` for the union). Owns:
 *
 *  - focus trap (via `useFocusTrap`) for modal-class placements
 *  - ESC + backdrop dismissal, gated by `dismissible`
 *  - body scroll lock for modal/drawer
 *  - drag-to-resize for resizable placements
 *  - expandable → fullscreen toggle
 *  - portal mount to <body>
 *  - ARIA role: `dialog` (modal/drawer), `complementary` (detail/drilldown),
 *    `region` (fullscreen)
 *
 * The legacy primitives remain as `@deprecated` re-exports until SIMPLIFY 14.
 */
import * as React from "react";
import { createPortal } from "react-dom";
import { useFocusTrap } from "./a11y/useFocusTrap.js";
import { useSplitPane } from "./hooks/useSplitPane.js";
// ── helpers ──────────────────────────────────────────────────────────────────
const MIN_RESIZE_PX = 320;
const MAX_RESIZE_VW = 95;
const DEFAULT_RESIZE_PX = 480;
function clampWidth(px) {
    if (typeof window === "undefined")
        return Math.max(MIN_RESIZE_PX, px);
    const max = Math.floor((window.innerWidth * MAX_RESIZE_VW) / 100);
    return Math.min(Math.max(MIN_RESIZE_PX, Math.round(px)), max);
}
function isModalLike(placement) {
    return (placement === "modal" ||
        placement === "drawer-right" ||
        placement === "drawer-left");
}
function ariaRoleFor(placement, fullscreen) {
    if (fullscreen)
        return "region";
    if (placement === "drilldown")
        return "group";
    if (placement === "detail-right")
        return "complementary";
    if (placement === "fullscreen")
        return "region";
    return "dialog";
}
// ── component ────────────────────────────────────────────────────────────────
export function Overlay(props) {
    const { placement, open, onOpenChange, size = "md", title, subtitle, headerActions, sections, children, dismissible = true, ariaLabel, className, source: _source, } = props;
    const resizable = placement === "drawer-right" ||
        placement === "drawer-left" ||
        placement === "detail-right"
        ? Boolean(props.resizable)
        : false;
    const onResize = placement === "drawer-right" ||
        placement === "drawer-left" ||
        placement === "detail-right"
        ? props.onResize
        : undefined;
    const expandable = placement === "drawer-right" ||
        placement === "detail-right" ||
        placement === "fullscreen"
        ? Boolean(props.expandable)
        : false;
    // Modal-like surfaces get focus trap. Non-modal surfaces (detail-right,
    // drilldown, fullscreen) leave focus to move freely.
    const trapActive = open && isModalLike(placement);
    const containerRef = useFocusTrap({ active: trapActive });
    const titleId = React.useId();
    const [fullscreen, setFullscreen] = React.useState(false);
    // Reset fullscreen when overlay closes so re-open starts in normal mode.
    React.useEffect(() => {
        if (!open)
            setFullscreen(false);
    }, [open]);
    const close = React.useCallback(() => {
        if (!dismissible)
            return;
        onOpenChange(false);
    }, [dismissible, onOpenChange]);
    // Keyboard: ESC → exit fullscreen first, then close (when dismissible).
    React.useEffect(() => {
        if (!open)
            return;
        const onKey = (e) => {
            if (e.key !== "Escape")
                return;
            e.stopPropagation();
            if (fullscreen) {
                setFullscreen(false);
                return;
            }
            close();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, fullscreen, close]);
    // Body scroll lock for modal-like surfaces.
    React.useEffect(() => {
        if (!open || !isModalLike(placement))
            return;
        if (typeof document === "undefined")
            return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open, placement]);
    // Resize state (drawer-*, detail-right when `resizable`).
    const [widthPx, setWidthPx] = React.useState(DEFAULT_RESIZE_PX);
    const [resizing, setResizing] = React.useState(false);
    const startXRef = React.useRef(0);
    const startWidthRef = React.useRef(0);
    const beginResize = React.useCallback((e) => {
        e.preventDefault();
        startXRef.current = e.clientX;
        startWidthRef.current = widthPx;
        setResizing(true);
        try {
            e.target.setPointerCapture(e.pointerId);
        }
        catch {
            /* best-effort */
        }
    }, [widthPx]);
    React.useEffect(() => {
        if (!resizing)
            return;
        const onMove = (e) => {
            const dx = placement === "drawer-left"
                ? e.clientX - startXRef.current
                : startXRef.current - e.clientX;
            const next = clampWidth(startWidthRef.current + dx);
            setWidthPx(next);
            onResize?.(next);
        };
        const onUp = () => setResizing(false);
        document.addEventListener("pointermove", onMove);
        document.addEventListener("pointerup", onUp);
        return () => {
            document.removeEventListener("pointermove", onMove);
            document.removeEventListener("pointerup", onUp);
        };
    }, [resizing, onResize, placement]);
    // Drilldown split-pane state.
    const split = useSplitPane({
        storageKey: "overlay-drilldown",
        defaultLeftPercent: placement === "drilldown"
            ? (props.defaultLeftPercent ?? 42)
            : 42,
    });
    if (!open)
        return null;
    const role = ariaRoleFor(placement, fullscreen);
    const isDialog = role === "dialog";
    const hasTitle = title !== undefined && title !== null && title !== "";
    // Body content: prefer `sections` over `children`.
    const body = sections && sections.length > 0 ? (_jsx(_Fragment, { children: sections.map((s, i) => (_jsxs("section", { className: "cc-overlay__section", children: [s.heading !== undefined && s.heading !== null ? (_jsx("h3", { className: "cc-overlay__section-heading", children: s.heading })) : null, _jsx("div", { className: "cc-overlay__section-content", children: s.content })] }, i))) })) : (children);
    const header = hasTitle || subtitle || headerActions || expandable || dismissible ? (_jsxs("header", { className: "cc-overlay__header", children: [_jsxs("div", { className: "cc-overlay__header-titles", children: [hasTitle ? (_jsx("h2", { id: titleId, className: "cc-overlay__title", children: title })) : null, subtitle ? (_jsx("p", { className: "cc-overlay__subtitle", children: subtitle })) : null] }), _jsxs("div", { className: "cc-overlay__header-actions", children: [headerActions, expandable ? (_jsx("button", { type: "button", className: "cc-overlay__expand", "aria-pressed": fullscreen, "aria-label": fullscreen ? "Exit full screen" : "Expand to full screen", onClick: () => setFullscreen((v) => !v), children: fullscreen ? "Exit full screen" : "Full screen" })) : null, dismissible ? (_jsx("button", { type: "button", className: "cc-overlay__close", "aria-label": "Close", onClick: close, children: "\u00D7" })) : null] })] })) : null;
    // ── placement-specific rendering ───────────────────────────────────────────
    const sizeClass = `cc-overlay--size-${size}`;
    const baseClasses = [
        "cc-overlay",
        `cc-overlay--${placement}`,
        sizeClass,
        fullscreen ? "cc-overlay--fullscreen" : null,
        className,
    ]
        .filter(Boolean)
        .join(" ");
    // Effective placement-aware CSS layer (re-uses legacy primitives.css rules
    // so visual output matches the deprecated primitives).
    const legacyShell = (() => {
        if (fullscreen)
            return "cc-fsd";
        switch (placement) {
            case "modal":
                return `cc-modal cc-modal--${size}`;
            case "drawer-right":
                return `cc-drawer cc-drawer--right cc-drawer--size-${size === "auto" ? "md" : size === "xl" ? "lg" : size} is-open`;
            case "drawer-left":
                return `cc-drawer cc-drawer--left cc-drawer--size-${size === "auto" ? "md" : size === "xl" ? "lg" : size} is-open`;
            case "detail-right":
                return "cc-detail-pane is-open";
            case "drilldown":
                return "cc-drilldown";
            case "fullscreen":
                return "cc-fsd";
        }
    })();
    const widthStyle = resizable && !fullscreen && placement !== "drilldown"
        ? { width: widthPx, maxWidth: `${MAX_RESIZE_VW}vw` }
        : undefined;
    // Drilldown is a structural layout, not a dialog. Render inline (no portal).
    if (placement === "drilldown" && !fullscreen) {
        const listSlot = props.listSlot;
        return (_jsx("div", { ref: containerRef, role: role, "aria-label": ariaLabel, className: [baseClasses, legacyShell].filter(Boolean).join(" "), style: {
                gridTemplateColumns: `${split.leftPercent}% 6px 1fr`,
            }, children: _jsxs("div", { ref: split.containerRef, style: { display: "contents" }, children: [_jsx("div", { className: "cc-drilldown__list", children: listSlot }), _jsx("div", { className: "cc-drilldown__handle", ...split.handleProps }), _jsxs("div", { className: "cc-drilldown__detail", children: [header ? _jsx("div", { className: "cc-drilldown__detail-toolbar", children: header }) : null, _jsx("div", { className: "cc-drilldown__detail-body", children: body })] })] }) }));
    }
    // Backdrop only for modal-like and detail (when modal-like).
    const showBackdrop = isModalLike(placement) || placement === "detail-right";
    const surface = (_jsxs("div", { className: [
            placement === "modal" ? "cc-modal-root" : null,
            placement.startsWith("drawer") ? "cc-drawer-root" : null,
        ]
            .filter(Boolean)
            .join(" "), "data-overlay-placement": placement, children: [showBackdrop ? (_jsx("div", { className: placement === "modal"
                    ? "cc-modal__backdrop"
                    : placement.startsWith("drawer")
                        ? "cc-drawer__backdrop is-open"
                        : "cc-detail-pane__backdrop is-open", "aria-hidden": "true", onClick: dismissible ? close : undefined })) : null, _jsxs("div", { ref: containerRef, role: role, "aria-modal": isDialog ? "true" : undefined, "aria-labelledby": hasTitle ? titleId : undefined, "aria-label": !hasTitle ? ariaLabel : undefined, tabIndex: -1, className: [baseClasses, legacyShell].filter(Boolean).join(" "), style: widthStyle, children: [resizable && !fullscreen ? (_jsx("div", { role: "separator", "aria-orientation": "vertical", "aria-label": "Resize panel", onPointerDown: beginResize, className: `cc-overlay__resize-handle${resizing ? " is-resizing" : ""}`, "data-overlay-resize-handle": true })) : null, header, _jsx("div", { className: "cc-overlay__body", children: body })] })] }));
    // Portal modal/drawer/fullscreen to <body>; detail-right stays inline so
    // page content can shift around it.
    if (typeof document === "undefined")
        return surface;
    if (placement === "detail-right" && !fullscreen)
        return surface;
    return createPortal(surface, document.body);
}
//# sourceMappingURL=Overlay.js.map