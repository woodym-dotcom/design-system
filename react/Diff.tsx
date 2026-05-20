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
export function diffLines(before: string, after: string): DiffLine[] {
  const a = before.split("\n");
  const b = after.split("\n");
  const m = a.length;
  const n = b.length;

  // LCS DP table.
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0),
  );
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (a[i] === b[j]) dp[i][j] = dp[i + 1][j + 1] + 1;
      else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const out: DiffLine[] = [];
  let i = 0;
  let j = 0;
  let oldNo = 1;
  let newNo = 1;
  while (i < m && j < n) {
    if (a[i] === b[j]) {
      out.push({ type: "context", text: a[i], oldNo, newNo });
      i++;
      j++;
      oldNo++;
      newNo++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      out.push({ type: "remove", text: a[i], oldNo });
      i++;
      oldNo++;
    } else {
      out.push({ type: "add", text: b[j], newNo });
      j++;
      newNo++;
    }
  }
  while (i < m) {
    out.push({ type: "remove", text: a[i], oldNo });
    i++;
    oldNo++;
  }
  while (j < n) {
    out.push({ type: "add", text: b[j], newNo });
    j++;
    newNo++;
  }
  return out;
}

function counts(lines: DiffLine[]): { added: number; removed: number } {
  let added = 0;
  let removed = 0;
  for (const line of lines) {
    if (line.type === "add") added++;
    else if (line.type === "remove") removed++;
  }
  return { added, removed };
}

function UnifiedView({ lines }: { lines: DiffLine[] }): React.ReactElement {
  return (
    <pre className="cc-diff__pane cc-diff__pane--unified">
      {lines.map((l, i) => {
        const sigil = l.type === "add" ? "+" : l.type === "remove" ? "-" : " ";
        return (
          <span key={i} className={`cc-diff__line cc-diff__line--${l.type}`}>
            <span className="cc-diff__gutter">{l.oldNo ?? ""}</span>
            <span className="cc-diff__gutter">{l.newNo ?? ""}</span>
            <span className="cc-diff__sigil" aria-hidden="true">
              {sigil}
            </span>
            <span className="cc-diff__text">{l.text}</span>
          </span>
        );
      })}
    </pre>
  );
}

function SplitView({ lines }: { lines: DiffLine[] }): React.ReactElement {
  // Pair removes on the left with adds on the right; context appears on both.
  type Pair = { left: DiffLine | null; right: DiffLine | null };
  const pairs: Pair[] = [];
  let k = 0;
  while (k < lines.length) {
    const l = lines[k];
    if (l.type === "context") {
      pairs.push({ left: l, right: l });
      k++;
      continue;
    }
    // Collect a run of removes immediately followed by a run of adds.
    const removes: DiffLine[] = [];
    while (k < lines.length && lines[k].type === "remove") {
      removes.push(lines[k]);
      k++;
    }
    const adds: DiffLine[] = [];
    while (k < lines.length && lines[k].type === "add") {
      adds.push(lines[k]);
      k++;
    }
    const max = Math.max(removes.length, adds.length);
    for (let p = 0; p < max; p++) {
      pairs.push({
        left: removes[p] ?? null,
        right: adds[p] ?? null,
      });
    }
  }

  return (
    <div className="cc-diff__split">
      <pre className="cc-diff__pane cc-diff__pane--left">
        {pairs.map((p, i) => (
          <span
            key={i}
            className={[
              "cc-diff__line",
              p.left ? `cc-diff__line--${p.left.type}` : "cc-diff__line--empty",
            ].join(" ")}
          >
            <span className="cc-diff__gutter">{p.left?.oldNo ?? ""}</span>
            <span className="cc-diff__text">{p.left?.text ?? ""}</span>
          </span>
        ))}
      </pre>
      <pre className="cc-diff__pane cc-diff__pane--right">
        {pairs.map((p, i) => (
          <span
            key={i}
            className={[
              "cc-diff__line",
              p.right
                ? `cc-diff__line--${p.right.type}`
                : "cc-diff__line--empty",
            ].join(" ")}
          >
            <span className="cc-diff__gutter">{p.right?.newNo ?? ""}</span>
            <span className="cc-diff__text">{p.right?.text ?? ""}</span>
          </span>
        ))}
      </pre>
    </div>
  );
}

export function Diff({
  lines,
  mode = "split",
  title,
  leftLabel,
  rightLabel,
  noEmpty,
  className,
}: DiffProps): React.ReactElement | null {
  const { added, removed } = counts(lines);
  const hasChanges = added > 0 || removed > 0;

  if (!hasChanges && noEmpty) return null;

  return (
    <section
      className={[
        "cc-diff",
        `cc-diff--${mode}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <header className="cc-diff__header">
        {title ? <span className="cc-diff__title">{title}</span> : null}
        <span className="cc-diff__counts" aria-label={`${added} added, ${removed} removed`}>
          <span className="cc-diff__count cc-diff__count--add">+{added}</span>
          <span className="cc-diff__count cc-diff__count--remove">-{removed}</span>
        </span>
      </header>
      {mode === "split" ? (
        <>
          {(leftLabel || rightLabel) && (
            <div className="cc-diff__labels">
              <span className="cc-diff__label cc-diff__label--left">
                {leftLabel}
              </span>
              <span className="cc-diff__label cc-diff__label--right">
                {rightLabel}
              </span>
            </div>
          )}
          {hasChanges ? (
            <SplitView lines={lines} />
          ) : (
            <p className="cc-diff__empty">No differences</p>
          )}
        </>
      ) : hasChanges ? (
        <UnifiedView lines={lines} />
      ) : (
        <p className="cc-diff__empty">No differences</p>
      )}
    </section>
  );
}
