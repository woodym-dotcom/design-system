import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Compute a DiffLine[] from two strings using a longest-common-subsequence
 * walk. Lines are split on \n; trailing empty entries are preserved so the
 * line count matches the input exactly.
 */
export function diffLines(before, after) {
    const a = before.split("\n");
    const b = after.split("\n");
    const m = a.length;
    const n = b.length;
    // LCS DP table.
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = m - 1; i >= 0; i--) {
        for (let j = n - 1; j >= 0; j--) {
            if (a[i] === b[j])
                dp[i][j] = dp[i + 1][j + 1] + 1;
            else
                dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
        }
    }
    const out = [];
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
        }
        else if (dp[i + 1][j] >= dp[i][j + 1]) {
            out.push({ type: "remove", text: a[i], oldNo });
            i++;
            oldNo++;
        }
        else {
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
function counts(lines) {
    let added = 0;
    let removed = 0;
    for (const line of lines) {
        if (line.type === "add")
            added++;
        else if (line.type === "remove")
            removed++;
    }
    return { added, removed };
}
function UnifiedView({ lines }) {
    return (_jsx("pre", { className: "cc-diff__pane cc-diff__pane--unified", children: lines.map((l, i) => {
            const sigil = l.type === "add" ? "+" : l.type === "remove" ? "-" : " ";
            return (_jsxs("span", { className: `cc-diff__line cc-diff__line--${l.type}`, children: [_jsx("span", { className: "cc-diff__gutter", children: l.oldNo ?? "" }), _jsx("span", { className: "cc-diff__gutter", children: l.newNo ?? "" }), _jsx("span", { className: "cc-diff__sigil", "aria-hidden": "true", children: sigil }), _jsx("span", { className: "cc-diff__text", children: l.text })] }, i));
        }) }));
}
function SplitView({ lines }) {
    const pairs = [];
    let k = 0;
    while (k < lines.length) {
        const l = lines[k];
        if (l.type === "context") {
            pairs.push({ left: l, right: l });
            k++;
            continue;
        }
        // Collect a run of removes immediately followed by a run of adds.
        const removes = [];
        while (k < lines.length && lines[k].type === "remove") {
            removes.push(lines[k]);
            k++;
        }
        const adds = [];
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
    return (_jsxs("div", { className: "cc-diff__split", children: [_jsx("pre", { className: "cc-diff__pane cc-diff__pane--left", children: pairs.map((p, i) => (_jsxs("span", { className: [
                        "cc-diff__line",
                        p.left ? `cc-diff__line--${p.left.type}` : "cc-diff__line--empty",
                    ].join(" "), children: [_jsx("span", { className: "cc-diff__gutter", children: p.left?.oldNo ?? "" }), _jsx("span", { className: "cc-diff__text", children: p.left?.text ?? "" })] }, i))) }), _jsx("pre", { className: "cc-diff__pane cc-diff__pane--right", children: pairs.map((p, i) => (_jsxs("span", { className: [
                        "cc-diff__line",
                        p.right
                            ? `cc-diff__line--${p.right.type}`
                            : "cc-diff__line--empty",
                    ].join(" "), children: [_jsx("span", { className: "cc-diff__gutter", children: p.right?.newNo ?? "" }), _jsx("span", { className: "cc-diff__text", children: p.right?.text ?? "" })] }, i))) })] }));
}
export function Diff({ lines, mode = "split", title, leftLabel, rightLabel, noEmpty, className, }) {
    const { added, removed } = counts(lines);
    const hasChanges = added > 0 || removed > 0;
    if (!hasChanges && noEmpty)
        return null;
    return (_jsxs("section", { className: [
            "cc-diff",
            `cc-diff--${mode}`,
            className,
        ]
            .filter(Boolean)
            .join(" "), children: [_jsxs("header", { className: "cc-diff__header", children: [title ? _jsx("span", { className: "cc-diff__title", children: title }) : null, _jsxs("span", { className: "cc-diff__counts", "aria-label": `${added} added, ${removed} removed`, children: [_jsxs("span", { className: "cc-diff__count cc-diff__count--add", children: ["+", added] }), _jsxs("span", { className: "cc-diff__count cc-diff__count--remove", children: ["-", removed] })] })] }), mode === "split" ? (_jsxs(_Fragment, { children: [(leftLabel || rightLabel) && (_jsxs("div", { className: "cc-diff__labels", children: [_jsx("span", { className: "cc-diff__label cc-diff__label--left", children: leftLabel }), _jsx("span", { className: "cc-diff__label cc-diff__label--right", children: rightLabel })] })), hasChanges ? (_jsx(SplitView, { lines: lines })) : (_jsx("p", { className: "cc-diff__empty", children: "No differences" }))] })) : hasChanges ? (_jsx(UnifiedView, { lines: lines })) : (_jsx("p", { className: "cc-diff__empty", children: "No differences" }))] }));
}
//# sourceMappingURL=Diff.js.map