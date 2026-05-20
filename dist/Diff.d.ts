/**
 * Diff — text diff viewer with two render modes (split/unified) and an
 * LCS-based `diffLines` helper for computing the line set from two
 * strings.
 *
 * Self-contained — no external diff library. The LCS table is O(m·n) but
 * fine for typical workloads (audit log payloads, decision-record bodies).
 */
import * as React from "react";
export type DiffMode = "split" | "unified";
export interface DiffLine {
    type: "context" | "add" | "remove";
    text: string;
    oldNo?: number;
    newNo?: number;
}
export interface DiffProps {
    lines: DiffLine[];
    /** Render mode. Defaults to "split". */
    mode?: DiffMode;
    title?: React.ReactNode;
    leftLabel?: React.ReactNode;
    rightLabel?: React.ReactNode;
    /** When true, an empty diff renders nothing instead of the empty state. */
    noEmpty?: boolean;
    className?: string;
}
/**
 * Compute a DiffLine[] from two strings using a longest-common-subsequence
 * walk. Lines are split on \n; trailing empty entries are preserved so the
 * line count matches the input exactly.
 */
export declare function diffLines(before: string, after: string): DiffLine[];
export declare function Diff({ lines, mode, title, leftLabel, rightLabel, noEmpty, className, }: DiffProps): React.ReactElement | null;
//# sourceMappingURL=Diff.d.ts.map