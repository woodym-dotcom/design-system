/**
 * useSplitPane — wires a horizontal resize handle to a left-pane percentage,
 * persisted under `split-pane:${storageKey}` in localStorage.
 *
 * The hook returns:
 *  - containerRef → must be attached to the outer wrapper so the hook can
 *    measure its clientWidth during drag.
 *  - handleProps   → spread onto the drag handle div. Includes role="separator",
 *    aria-orientation="vertical", aria-valuemin/max/now, and the keyboard /
 *    pointer event handlers.
 *  - leftPercent   → current left pane percentage [min, max].
 *
 * Arrow Left/Right on the focused handle nudges by 2% within [min, max].
 */
import * as React from "react";
const STORAGE_PREFIX = "split-pane:";
const NUDGE = 2;
function clamp(n, lo, hi) {
    return Math.max(lo, Math.min(hi, n));
}
function readStored(key, fallback) {
    if (typeof window === "undefined")
        return fallback;
    try {
        const v = window.localStorage.getItem(STORAGE_PREFIX + key);
        if (v == null)
            return fallback;
        const n = Number(v);
        return Number.isFinite(n) ? n : fallback;
    }
    catch {
        return fallback;
    }
}
function persist(key, value) {
    if (typeof window === "undefined")
        return;
    try {
        window.localStorage.setItem(STORAGE_PREFIX + key, String(value));
    }
    catch {
        /* ignore quota errors */
    }
}
export function useSplitPane({ storageKey, defaultLeftPercent = 50, minLeftPercent = 20, maxLeftPercent = 80, }) {
    const [leftPercent, setLeftPercent] = React.useState(() => clamp(readStored(storageKey, defaultLeftPercent), minLeftPercent, maxLeftPercent));
    const containerRef = React.useRef(null);
    const dragging = React.useRef(false);
    const setAndClamp = React.useCallback((next) => {
        const c = clamp(next, minLeftPercent, maxLeftPercent);
        setLeftPercent(c);
        return c;
    }, [minLeftPercent, maxLeftPercent]);
    const onMove = React.useCallback((clientX) => {
        const el = containerRef.current;
        if (!el)
            return;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0)
            return;
        const pct = ((clientX - rect.left) / rect.width) * 100;
        setAndClamp(pct);
    }, [setAndClamp]);
    const endDrag = React.useCallback(() => {
        if (!dragging.current)
            return;
        dragging.current = false;
        persist(storageKey, leftPercent);
        if (typeof document !== "undefined") {
            document.body.style.userSelect = "";
            document.body.style.cursor = "";
        }
    }, [storageKey, leftPercent]);
    React.useEffect(() => {
        if (typeof window === "undefined")
            return;
        const onMouseMove = (e) => {
            if (!dragging.current)
                return;
            onMove(e.clientX);
        };
        const onTouchMove = (e) => {
            if (!dragging.current)
                return;
            const touch = e.touches[0];
            if (touch)
                onMove(touch.clientX);
        };
        const onUp = () => endDrag();
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("touchmove", onTouchMove);
        window.addEventListener("mouseup", onUp);
        window.addEventListener("touchend", onUp);
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("mouseup", onUp);
            window.removeEventListener("touchend", onUp);
        };
    }, [onMove, endDrag]);
    const onMouseDown = React.useCallback((e) => {
        e.preventDefault();
        dragging.current = true;
        if (typeof document !== "undefined") {
            document.body.style.userSelect = "none";
            document.body.style.cursor = "col-resize";
        }
    }, []);
    const onTouchStart = React.useCallback((_e) => {
        dragging.current = true;
    }, []);
    const onKeyDown = React.useCallback((e) => {
        if (e.key === "ArrowLeft") {
            e.preventDefault();
            const next = setAndClamp(leftPercent - NUDGE);
            persist(storageKey, next);
        }
        else if (e.key === "ArrowRight") {
            e.preventDefault();
            const next = setAndClamp(leftPercent + NUDGE);
            persist(storageKey, next);
        }
    }, [leftPercent, setAndClamp, storageKey]);
    const handleProps = {
        role: "separator",
        "aria-orientation": "vertical",
        "aria-valuemin": minLeftPercent,
        "aria-valuemax": maxLeftPercent,
        "aria-valuenow": Math.round(leftPercent),
        "aria-label": "Resize panes",
        tabIndex: 0,
        onMouseDown,
        onTouchStart,
        onKeyDown,
    };
    return { containerRef, handleProps, leftPercent };
}
//# sourceMappingURL=useSplitPane.js.map