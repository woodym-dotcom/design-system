/* global React, AA_RUNS */
const { useState } = React;

const STATE_META = {
  running: { color: "var(--accent-1)",   label: "Running",  chipClass: "cc-chip cc-chip--info" },
  queued:  { color: "var(--warning)",    label: "Queued",   chipClass: "cc-chip cc-chip--warning" },
  success: { color: "var(--success)",    label: "Success",  chipClass: "cc-chip cc-chip--success" },
  failed:  { color: "var(--error)",      label: "Failed",   chipClass: "cc-chip cc-chip--danger" },
  paused:  { color: "var(--text-4)",     label: "Paused",   chipClass: "cc-chip" },
};

function RunsList({ runs, selected, onSelect, expanded, onToggleExpand, onOpenInNewTab }) {
  // Build visible row list: parents always; children only if parent is expanded.
  const parents = runs.filter(r => !r.parent);
  const rows = [];
  for (const p of parents) {
    rows.push(p);
    if (expanded.has(p.id) && p.children) {
      for (const childId of p.children) {
        const c = runs.find(x => x.id === childId);
        if (c) rows.push(c);
      }
    }
  }

  return (
    <div style={{ border: "1px solid var(--border-1)", borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--surface-0)" }}>
      <table className="cc-table">
        <thead>
          <tr>
            <th style={{ width: 28 }}></th>
            <th>Run</th>
            <th>State</th>
            <th>Owner</th>
            <th>Node</th>
            <th>Started</th>
            <th style={{ textAlign: "right" }}>Duration</th>
            <th style={{ width: 80 }}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => {
            const meta = STATE_META[r.state];
            const isChild = !!r.parent;
            const hasChildren = !!r.children;
            return (
              <tr
                key={r.id}
                className={selected === r.id ? "is-selected" : ""}
                onClick={() => onSelect(r.id)}
                style={{ background: isChild ? "var(--surface-1)" : undefined }}
              >
                <td onClick={e => { if (hasChildren) { e.stopPropagation(); onToggleExpand(r.id); } }}
                    style={{ paddingLeft: 12, paddingRight: 0, cursor: hasChildren ? "pointer" : "default" }}>
                  {hasChildren && (
                    <span style={{
                      display: "inline-grid", placeItems: "center",
                      width: 18, height: 18, borderRadius: 4,
                      color: "var(--text-3)",
                      transition: "transform 120ms ease, background 120ms ease",
                      transform: expanded.has(r.id) ? "rotate(90deg)" : "rotate(0deg)",
                    }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </span>
                  )}
                </td>
                <td style={{ paddingLeft: isChild ? 28 : undefined }}>
                  <strong style={{
                    fontFamily: "var(--font-mono)",
                    fontWeight: isChild ? 400 : 500,
                    color: isChild ? "var(--text-2)" : "var(--text-1)",
                  }}>{r.name}</strong>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-4)", marginTop: 2 }}>
                    {r.id}{hasChildren && <span style={{ marginLeft: 8 }}>· {r.children.length} steps</span>}
                  </div>
                </td>
                <td><span className={meta.chipClass}>{meta.label}</span></td>
                <td style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{r.owner}</td>
                <td style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{r.node}</td>
                <td className="cc-num" style={{ color: "var(--text-3)" }}>{r.startedAt}</td>
                <td className="cc-num" style={{ textAlign: "right", color: "var(--text-3)" }}>{r.duration}</td>
                <td onClick={e => e.stopPropagation()} style={{ textAlign: "right", paddingRight: 8 }}>
                  <button
                    className="cc-btn cc-btn--ghost cc-btn--icon cc-btn--sm"
                    aria-label="Open in new tab"
                    title="Open in new tab"
                    onClick={() => onOpenInNewTab(r.id)}
                    style={{ width: 24, height: 24 }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    </svg>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function RunsPageHeader({ count, runningCount, failedCount }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--text-1)", margin: 0 }}>Runs</h1>
        <span className="cc-chip">{count}</span>
        {runningCount > 0 && <span className="cc-chip cc-chip--info">{runningCount} running</span>}
        {failedCount > 0 && <span className="cc-chip cc-chip--danger">{failedCount} failed</span>}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="cc-btn cc-btn--secondary">Filter</button>
        <button className="cc-btn cc-btn--secondary">Schedules</button>
        <button className="cc-btn cc-btn--primary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}><polygon points="6 3 20 12 6 21 6 3"/></svg>
          Trigger run
        </button>
      </div>
    </div>
  );
}

window.RunsList = RunsList;
window.RunsPageHeader = RunsPageHeader;
window.AA_STATE_META = STATE_META;
