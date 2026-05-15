/* global React, AA_TIMELINE, AA_STATE_META */
const { useEffect, useRef } = React;

const MIN_WIDTH = 360;
const MAX_WIDTH = 900;

function RunPane({ run, width, onWidthChange, fullscreen, onFullscreenChange, onOpenInNewTab, onClose }) {
  useEffect(() => {
    if (!run) return;
    const onKey = e => {
      if (e.key !== "Escape") return;
      if (fullscreen) onFullscreenChange(false);
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [run, fullscreen, onClose, onFullscreenChange]);

  const dragging = useRef(false);
  const startX = useRef(0);
  const startW = useRef(width);
  const onHandleDown = e => {
    if (fullscreen) return;
    dragging.current = true;
    startX.current = e.clientX;
    startW.current = width;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };
  useEffect(() => {
    const onMove = e => {
      if (!dragging.current) return;
      const delta = startX.current - e.clientX;
      const w = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startW.current + delta));
      onWidthChange(w);
    };
    const onUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [onWidthChange]);

  if (!run) return null;
  const meta = AA_STATE_META[run.state];

  return (
    <aside style={{
      position: "relative",
      background: "var(--surface-0)",
      borderLeft: "1px solid var(--border-1)",
      display: "grid",
      gridTemplateRows: "auto auto 1fr auto",
      minHeight: 0, minWidth: 0,
    }}>
      {!fullscreen && (
        <div
          onMouseDown={onHandleDown}
          role="separator"
          aria-label="Resize panel"
          style={{ position: "absolute", top: 0, bottom: 0, left: -3, width: 6, cursor: "col-resize", zIndex: 2 }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--accent-soft)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        />
      )}

      <header style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "14px 18px",
        borderBottom: "1px solid var(--border-1)",
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{
            fontFamily: "var(--font-mono)",
            fontSize: 16, fontWeight: 600,
            color: "var(--text-1)", margin: 0,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>{run.name}</h2>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>
            {run.id} · {run.node}
          </div>
        </div>
        <span className={meta.chipClass}>{meta.label}</span>
        {onOpenInNewTab && (
          <button
            className="cc-btn cc-btn--ghost cc-btn--icon"
            aria-label="Open in new tab"
            title="Open in new tab"
            onClick={onOpenInNewTab}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
          </button>
        )}
        <button
          className="cc-btn cc-btn--ghost cc-btn--icon"
          aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
          onClick={() => onFullscreenChange(!fullscreen)}
        >
          {fullscreen
            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>
            : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>}
        </button>
        <button className="cc-btn cc-btn--ghost cc-btn--icon" aria-label="Close" onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </header>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
        padding: "10px 18px",
        borderBottom: "1px solid var(--border-1)",
        background: "var(--surface-1)",
      }}>
        <Meta label="Owner"    value={run.owner}     mono />
        <Meta label="Started"  value={run.startedAt} mono />
        <Meta label="Duration" value={run.duration}  mono />
        <Meta label="Lines"    value={run.logs.toLocaleString()} mono />
      </div>

      <div style={{
        overflow: "auto",
        padding: fullscreen ? "20px 32px" : "16px 18px",
        display: "grid", gap: 20,
        maxWidth: fullscreen ? 1100 : "100%",
        margin: fullscreen ? "0 auto" : 0,
        width: "100%", minWidth: 0,
      }}>
        <Section title="Pipeline">
          <Steps run={run} />
        </Section>
        <Section title="Logs · tail">
          <Logs />
        </Section>
      </div>

      <footer style={{
        display: "flex", gap: 8, padding: 12,
        borderTop: "1px solid var(--border-1)",
        background: "var(--surface-1)",
      }}>
        <button className="cc-btn cc-btn--secondary cc-btn--sm">Pause</button>
        <button className="cc-btn cc-btn--secondary cc-btn--sm">Retry</button>
        <div style={{ flex: 1 }} />
        <button className="cc-btn cc-btn--danger cc-btn--sm">Cancel</button>
      </footer>
    </aside>
  );
}

function Meta({ label, value, mono }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "var(--text-4)", letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 13, color: "var(--text-1)", fontFamily: mono ? "var(--font-mono)" : "inherit", marginTop: 2 }}>{value}</div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-4)", marginBottom: 10 }}>{title}</div>
      {children}
    </section>
  );
}

function Steps({ run }) {
  const steps = [
    { name: "resolve dataset",     state: "success", time: "06s" },
    { name: "materialise roll-up", state: "success", time: "44s" },
    { name: "diff yesterday",      state: "running", time: "22s" },
    { name: "publish",             state: "pending", time: "—" },
  ];
  return (
    <div style={{ display: "grid", gap: 0 }}>
      {steps.map((s, i) => <Step key={i} step={s} idx={i + 1} last={i === steps.length - 1} />)}
    </div>
  );
}

function Step({ step, idx, last }) {
  const meta = {
    success: { color: "var(--success)",  icon: "✓" },
    running: { color: "var(--accent-1)", icon: "•" },
    pending: { color: "var(--text-4)",   icon: "·" },
    failed:  { color: "var(--error)",    icon: "×" },
  }[step.state];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "22px 1fr auto", gap: 12, alignItems: "center", paddingBottom: last ? 0 : 12, position: "relative" }}>
      <div style={{
        width: 18, height: 18, borderRadius: 999,
        background: step.state === "running" ? "var(--accent-soft)" : "transparent",
        border: "1px solid " + (step.state === "running" ? "var(--accent-border)" : "var(--border-1)"),
        color: meta.color,
        display: "grid", placeItems: "center",
        fontWeight: 700, fontSize: 11, position: "relative", zIndex: 1,
      }}>{meta.icon}</div>
      {!last && <div style={{ position: "absolute", left: 8, top: 18, bottom: -4, width: 2, background: "var(--border-1)" }}/>}
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: 13,
        color: step.state === "pending" ? "var(--text-4)" : "var(--text-1)",
        fontWeight: step.state === "running" ? 500 : 400,
      }}>{idx}. {step.name}</div>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-4)" }}>{step.time}</span>
    </div>
  );
}

function Logs() {
  const colors = {
    info:  "var(--text-3)",
    debug: "var(--text-4)",
    warn:  "var(--warning-text)",
    error: "var(--error-text)",
  };
  return (
    <pre style={{
      margin: 0, padding: "12px 14px",
      background: "var(--surface-1)",
      border: "1px solid var(--border-1)",
      borderRadius: "var(--radius-md)",
      fontFamily: "var(--font-mono)",
      fontSize: 12, lineHeight: "20px",
      color: "var(--text-2)",
      overflow: "auto",
      maxHeight: 240,
    }}>
{AA_TIMELINE.map((l, i) => (
  <div key={i} style={{ display: "grid", gridTemplateColumns: "84px 56px 1fr", gap: 12 }}>
    <span style={{ color: "var(--text-4)" }}>{l.t}</span>
    <span style={{ color: colors[l.lvl] || "var(--text-3)", textTransform: "uppercase" }}>{l.lvl}</span>
    <span style={{ color: l.lvl === "warn" ? "var(--warning-text)" : "var(--text-2)" }}>{l.msg}</span>
  </div>
))}
    </pre>
  );
}

window.RunPane = RunPane;
