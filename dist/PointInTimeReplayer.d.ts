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
export interface Snapshot {
    id: string;
    timestamp: Date | string;
    /** Human-readable label for this snapshot. */
    label?: string;
}
export interface PointInTimeReplayerProps {
    /** Ordered list of snapshots (oldest first). */
    snapshots: Snapshot[];
    /** Currently active snapshot index. */
    currentIndex: number;
    /** Called when the user selects a different snapshot. */
    onChange: (index: number) => void;
    /** Display mode. Default: "slider". */
    mode?: "slider" | "stepper";
    /** Whether playback controls (play/pause) are shown. Default: false. */
    playable?: boolean;
    /** Playback interval in ms when playable. Default: 1000. */
    playInterval?: number;
    /** Format function for timestamp display. */
    formatTimestamp?: (ts: Date) => string;
    /** Label above the control. */
    label?: string;
    className?: string;
}
export declare function PointInTimeReplayer({ snapshots, currentIndex, onChange, mode, playable, playInterval, formatTimestamp, label, className, }: PointInTimeReplayerProps): React.ReactElement;
//# sourceMappingURL=PointInTimeReplayer.d.ts.map