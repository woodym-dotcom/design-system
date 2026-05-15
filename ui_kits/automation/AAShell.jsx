/* global React */

/* AA Shell mirrors CompanyCo: 44px topbar + 52px nav rail + 40px breadcrumbs. */

function AAShell({ activeNav, onNavChange, breadcrumbs, children }) {
  return (
    <div style={{
      display: "grid", gridTemplateRows: "44px 1fr",
      height: "100vh", background: "var(--surface-0)",
    }}>
      <Topbar />
      <div style={{ display: "grid", gridTemplateColumns: "52px 1fr", minHeight: 0 }}>
        <NavRail active={activeNav} onChange={onNavChange} />
        <main style={{ display: "grid", gridTemplateRows: "40px 1fr", minHeight: 0 }}>
          <Breadcrumbs items={breadcrumbs} />
          <div style={{ overflow: "hidden", background: "var(--surface-0)" }}>{children}</div>
        </main>
      </div>
    </div>
  );
}

function Topbar() {
  return (
    <header style={{
      display: "flex", alignItems: "center", gap: 16,
      padding: "0 16px", height: 44,
      borderBottom: "1px solid var(--border-1)",
      background: "var(--surface-0)",
    }}>
      <div style={{ fontWeight: 600, fontSize: 14, letterSpacing: "-0.01em", color: "var(--text-1)" }}>
        automation<span style={{ color: "var(--accent-text)" }}>Armoury</span>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <IconBtn label="Notifications"><BellIcon /></IconBtn>
        <IconBtn label="Settings"><SettingsIcon /></IconBtn>
        <Avatar />
      </div>
    </header>
  );
}

function IconBtn({ children, label, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="cc-btn cc-btn--ghost cc-btn--icon"
      style={{ width: 32, height: 32 }}
    >{children}</button>
  );
}

function Avatar() {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: "var(--radius-pill)",
      background: "var(--accent-1)", color: "var(--accent-contrast)",
      fontSize: 11, fontWeight: 600,
      display: "grid", placeItems: "center",
    }}>JP</div>
  );
}

function NavRail({ active, onChange }) {
  const items = [
    { id: "runs",      icon: <ActivityIcon />, label: "Runs" },
    { id: "schedules", icon: <CalendarIcon />, label: "Schedules" },
    { id: "datasets",  icon: <DatabaseIcon />, label: "Datasets" },
    { id: "pipelines", icon: <BranchIcon />,   label: "Pipelines" },
  ];
  return (
    <nav style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", padding: "10px 4px", gap: 4,
      borderRight: "1px solid var(--border-1)",
      background: "var(--surface-0)",
    }}>
      {items.map(it => (
        <button
          key={it.id}
          type="button"
          aria-label={it.label}
          title={it.label}
          onClick={() => onChange(it.id)}
          style={{
            width: 38, height: 38, borderRadius: "var(--radius-md)",
            border: "1px solid transparent",
            background: active === it.id ? "var(--accent-soft)" : "transparent",
            color: active === it.id ? "var(--accent-text)" : "var(--text-3)",
            borderColor: active === it.id ? "var(--accent-border)" : "transparent",
            display: "grid", placeItems: "center", cursor: "pointer",
            transition: "background 120ms ease, color 120ms ease",
          }}
        >{it.icon}</button>
      ))}
    </nav>
  );
}

function Breadcrumbs({ items }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "0 16px", height: 40,
      borderBottom: "1px solid var(--border-1)",
      background: "var(--surface-0)",
      fontSize: 13,
    }}>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span style={{ color: "var(--text-4)" }}>/</span>}
          <span style={{
            color: i === items.length - 1 ? "var(--text-1)" : "var(--text-3)",
            fontWeight: i === items.length - 1 ? 500 : 400,
          }}>{it}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

function ActivityIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>; }
function CalendarIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>; }
function DatabaseIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>; }
function BranchIcon()   { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>; }
function BellIcon()     { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>; }
function SettingsIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>; }

window.AAShell = AAShell;
