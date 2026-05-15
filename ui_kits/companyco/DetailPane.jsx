/* global React */
const { useEffect, useRef } = React;

const MIN_WIDTH = 320;
const MAX_WIDTH = 880;

function DetailPane({ vendor, width, onWidthChange, fullscreen, onFullscreenChange, onClose }) {
  // Esc key — exit fullscreen first, then close
  useEffect(() => {
    if (!vendor) return;
    const onKey = e => {
      if (e.key !== "Escape") return;
      if (fullscreen) onFullscreenChange(false);
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [vendor, fullscreen, onClose, onFullscreenChange]);

  // Drag-resize the left edge
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
      const delta = startX.current - e.clientX; // dragging left = wider
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

  if (!vendor) return null;

  return (
    <aside
      style={{
        position: "relative",
        background: "var(--surface-0)",
        borderLeft: "1px solid var(--border-1)",
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
        minHeight: 0,
        minWidth: 0,
      }}
    >
      {/* Drag handle on the left edge */}
      {!fullscreen && (
        <div
          onMouseDown={onHandleDown}
          aria-label="Resize panel"
          role="separator"
          style={{
            position: "absolute",
            top: 0, bottom: 0, left: -3,
            width: 6,
            cursor: "col-resize",
            zIndex: 2,
          }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--accent-soft)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        />
      )}

      <Header vendor={vendor} fullscreen={fullscreen} onFullscreenChange={onFullscreenChange} onClose={onClose} />
      <Body vendor={vendor} fullscreen={fullscreen} />
      <Footer />
    </aside>
  );
}

function Header({ vendor, fullscreen, onFullscreenChange, onClose }) {
  return (
    <header style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "14px 16px",
      borderBottom: "1px solid var(--border-1)",
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h2 style={{
          fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em",
          color: "var(--text-1)", margin: 0,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{vendor.name}</h2>
        <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>
          {vendor.country} · {vendor.contract}
        </div>
      </div>
      <button
        className="cc-btn cc-btn--ghost cc-btn--icon"
        aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
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
  );
}

function Body({ vendor, fullscreen }) {
  return (
    <div style={{
      overflow: "auto",
      padding: fullscreen ? "20px 32px" : "16px 18px",
      display: "grid",
      gap: 18,
      maxWidth: fullscreen ? 1080 : "100%",
      margin: fullscreen ? "0 auto" : 0,
      width: "100%",
      minWidth: 0,
    }}>
      <Section title="Posture">
        <KV label="Risk score"><RiskBar value={vendor.risk} /></KV>
        <KV label="Status"><StatusChip status={vendor.status} /></KV>
        <KV label="Tier"><span className="cc-chip">{vendor.tier}</span></KV>
      </Section>
      <Section title="Contract">
        <KV label="Reference">{vendor.contract}</KV>
        <KV label="Annual spend">{vendor.spend}</KV>
        <KV label="Country">{vendor.country}</KV>
      </Section>
      <Section title="Ownership">
        <KV label="Owner">{vendor.owner}</KV>
        <KV label="Last reviewed" mono>{vendor.reviewed}</KV>
        <KV label="Open obligations">{vendor.openings}</KV>
      </Section>
      <Section title="Recent activity">
        <ActivityRow when="14:02"     who="Jin Park"      what="Marked 'Review due' — quarterly cycle"/>
        <ActivityRow when="09:11"     who="System"        what="Risk score recomputed from 47 → 52"/>
        <ActivityRow when="yesterday" who="Mara Okafor"   what="Uploaded attestation Q2-2026.pdf"/>
      </Section>
    </div>
  );
}

function Footer() {
  return (
    <footer style={{
      display: "flex", gap: 8, padding: 12,
      borderTop: "1px solid var(--border-1)",
      background: "var(--surface-1)",
    }}>
      <button className="cc-btn cc-btn--secondary cc-btn--sm">Edit</button>
      <button className="cc-btn cc-btn--secondary cc-btn--sm">Open full</button>
      <div style={{ flex: 1 }} />
      <button className="cc-btn cc-btn--danger cc-btn--sm">Block</button>
      <button className="cc-btn cc-btn--primary cc-btn--sm">Resolve</button>
    </footer>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <div style={{
        fontSize: 11, fontWeight: 500, letterSpacing: "0.08em",
        textTransform: "uppercase", color: "var(--text-4)",
        marginBottom: 8,
      }}>{title}</div>
      <div style={{ display: "grid", gap: 8 }}>{children}</div>
    </section>
  );
}

function KV({ label, children, mono }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 12, alignItems: "center" }}>
      <span style={{ fontSize: 12, color: "var(--text-3)" }}>{label}</span>
      <span style={{ fontSize: 13, color: "var(--text-1)", fontFamily: mono ? "var(--font-mono)" : "inherit" }}>{children}</span>
    </div>
  );
}

function ActivityRow({ when, who, what }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 10, padding: "8px 0", borderTop: "1px solid var(--border-1)" }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-4)", whiteSpace: "nowrap", paddingTop: 1 }}>{when}</span>
      <div>
        <div style={{ fontSize: 13, color: "var(--text-2)" }}>{what}</div>
        <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>{who}</div>
      </div>
    </div>
  );
}

window.DetailPane = DetailPane;
window.DETAIL_MIN_WIDTH = MIN_WIDTH;
window.DETAIL_MAX_WIDTH = MAX_WIDTH;
