import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * PointInTimeReplayer — temporal replay control.
 *
 * Provides a slider or stepper UI to navigate point-in-time snapshots.
 * Used for audit trails, versioned entity views, and temporal queries
 * where users need to "rewind" to see historical state.
 *
 * Usage:
 *   <PointInTimeReplayer
 *     snapshots={[
 *       { id: '1', timestamp: new Date('2024-01-01'), label: 'v1' },
 *       { id: '2', timestamp: new Date('2024-06-01'), label: 'v2' },
 *     ]}
 *     currentIndex={0}
 *     onChange={(index) => loadSnapshot(index)}
 *   />
 */
import * as React from "react";
function defaultFormatTimestamp(ts) {
    return ts.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}
function toDate(ts) {
    return typeof ts === "string" ? new Date(ts) : ts;
}
export function PointInTimeReplayer({ snapshots, currentIndex, onChange, mode = "slider", playable = false, playInterval = 1000, formatTimestamp = defaultFormatTimestamp, label, className, }) {
    const [playing, setPlaying] = React.useState(false);
    const intervalRef = React.useRef(null);
    const current = snapshots[currentIndex];
    const canPrev = currentIndex > 0;
    const canNext = currentIndex < snapshots.length - 1;
    React.useEffect(() => {
        if (playing && canNext) {
            intervalRef.current = setInterval(() => {
                onChange(currentIndex + 1);
            }, playInterval);
        }
        return () => {
            if (intervalRef.current)
                clearInterval(intervalRef.current);
        };
    }, [playing, currentIndex, canNext, onChange, playInterval]);
    // Stop playing when we reach the end.
    React.useEffect(() => {
        if (playing && !canNext) {
            setPlaying(false);
        }
    }, [playing, canNext]);
    const classes = [
        "cc-point-in-time-replayer",
        `cc-point-in-time-replayer--${mode}`,
        className,
    ]
        .filter(Boolean)
        .join(" ");
    return (_jsxs("div", { className: classes, role: "group", "aria-label": label ?? "Point-in-time replayer", style: {
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2, 0.375rem)",
            padding: "var(--space-3, 0.5rem) var(--space-4, 0.75rem)",
            border: "1px solid var(--border-1)",
            borderRadius: "var(--radius-2, 8px)",
            background: "var(--surface-1)",
        }, children: [label && (_jsx("span", { className: "cc-point-in-time-replayer__label", style: {
                    fontSize: "var(--text-sm, 0.875rem)",
                    fontWeight: 600,
                    color: "var(--text-2)",
                }, children: label })), current && (_jsxs("div", { className: "cc-point-in-time-replayer__current", style: {
                    fontSize: "var(--text-sm, 0.875rem)",
                    color: "var(--text-1)",
                    display: "flex",
                    alignItems: "baseline",
                    gap: "var(--space-2, 0.375rem)",
                }, children: [_jsx("span", { style: { fontWeight: 600 }, children: current.label ?? `Snapshot ${currentIndex + 1}` }), _jsx("span", { style: { color: "var(--text-3)", fontSize: "var(--text-xs, 0.75rem)" }, children: formatTimestamp(toDate(current.timestamp)) })] })), _jsxs("div", { className: "cc-point-in-time-replayer__controls", style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2, 0.375rem)",
                }, children: [playable && (_jsx("button", { type: "button", className: "cc-point-in-time-replayer__play", onClick: () => setPlaying((p) => !p), "aria-label": playing ? "Pause" : "Play", style: {
                            background: "none",
                            border: "1px solid var(--border-1)",
                            borderRadius: "var(--radius-1, 4px)",
                            padding: "var(--space-1, 0.25rem) var(--space-2, 0.375rem)",
                            cursor: "pointer",
                            fontSize: "var(--text-sm, 0.875rem)",
                        }, children: playing ? "||" : "▶" })), _jsx("button", { type: "button", className: "cc-point-in-time-replayer__prev", onClick: () => onChange(currentIndex - 1), disabled: !canPrev, "aria-label": "Previous snapshot", style: {
                            background: "none",
                            border: "1px solid var(--border-1)",
                            borderRadius: "var(--radius-1, 4px)",
                            padding: "var(--space-1, 0.25rem) var(--space-2, 0.375rem)",
                            cursor: canPrev ? "pointer" : "not-allowed",
                            opacity: canPrev ? 1 : 0.4,
                            fontSize: "var(--text-sm, 0.875rem)",
                        }, children: "\u25C0" }), mode === "slider" ? (_jsx("input", { type: "range", className: "cc-point-in-time-replayer__slider", min: 0, max: snapshots.length - 1, value: currentIndex, onChange: (e) => onChange(Number(e.target.value)), "aria-label": "Snapshot position", style: { flex: 1 } })) : (_jsxs("span", { className: "cc-point-in-time-replayer__position", style: {
                            flex: 1,
                            textAlign: "center",
                            fontSize: "var(--text-sm, 0.875rem)",
                            color: "var(--text-2)",
                        }, children: [currentIndex + 1, " / ", snapshots.length] })), _jsx("button", { type: "button", className: "cc-point-in-time-replayer__next", onClick: () => onChange(currentIndex + 1), disabled: !canNext, "aria-label": "Next snapshot", style: {
                            background: "none",
                            border: "1px solid var(--border-1)",
                            borderRadius: "var(--radius-1, 4px)",
                            padding: "var(--space-1, 0.25rem) var(--space-2, 0.375rem)",
                            cursor: canNext ? "pointer" : "not-allowed",
                            opacity: canNext ? 1 : 0.4,
                            fontSize: "var(--text-sm, 0.875rem)",
                        }, children: "\u25B6" })] })] }));
}
//# sourceMappingURL=PointInTimeReplayer.js.map