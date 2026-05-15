/* global React */
const { useState, useEffect } = React;

/* ============================================================
   Shell — horizontal topbar + navrail.
   Renders the canonical CompanyCo shell chrome. Pass <main>
   children; the breadcrumb is supplied by the page.
   ============================================================ */

function Brand() {
  return (
    <div className="cc-topbar__brand" style={{ fontWeight: 600, fontSize: 14, letterSpacing: "-0.01em" }}>
      company<span style={{ color: "var(--accent-text)" }}>co</span>
    </div>
  );
}

function KbdHint() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-3)" }}>
      <kbd>⌘</kbd><kbd>K</kbd>
      <span>commands</span>
      <span style={{ marginLeft: 12, color: "var(--text-4)" }}>·</span>
      <kbd>⌘</kbd><kbd>/</kbd>
      <span>search</span>
    </div>
  );
}

function IconBtn({ children, label, onClick, active }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={"cc-btn cc-btn--ghost cc-btn--icon" + (active ? " is-active" : "")}
      style={{ width: 36, height: 36 }}
    >
      {children}
    </button>
  );
}

function Avatar({ initials = "MO" }) {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: 999,
      background: "var(--accent-1)", color: "var(--accent-contrast)",
      fontSize: 12, fontWeight: 600,
      display: "grid", placeItems: "center",
    }}>{initials}</div>
  );
}

function NavRail({ active, onChange }) {
  const items = [
    { id: "vendors", icon: <UsersIcon />, label: "Vendors" },
    { id: "alerts", icon: <AlertIcon />, label: "Alerts" },
    { id: "obligations", icon: <ShieldIcon />, label: "Obligations" },
    { id: "audit", icon: <ActivityIcon />, label: "Audit" },
    { id: "filings", icon: <FileIcon />, label: "Filings" },
  ];
  return (
    <nav className="cc-navrail">
      <div className="cc-navrail__group" style={{
        width: 36, height: 36, borderRadius: 8,
        background: "var(--accent-soft)", color: "var(--accent-text)",
        fontWeight: 700, fontSize: 12,
        display: "grid", placeItems: "center",
      }}>RA</div>
      <div className="cc-navrail__divider" style={{ width: "80%", height: 1, background: "var(--border-1)", margin: "4px 0" }}/>
      {items.map(it => (
        <button
          key={it.id}
          type="button"
          aria-label={it.label}
          title={it.label}
          onClick={() => onChange(it.id)}
          className={"cc-navrail__icon" + (active === it.id ? " is-active" : "")}
          style={{
            width: 38, height: 38, borderRadius: 8, border: "1px solid transparent",
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

function Topbar({ children }) {
  return (
    <header className="cc-topbar" style={{
      display: "flex", alignItems: "center", gap: 16,
      padding: "0 16px", height: 44,
      borderBottom: "1px solid var(--border-1)",
      background: "var(--surface-0)",
    }}>
      <Brand />
      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}><KbdHint /></div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <IconBtn label="Notifications"><BellIcon /></IconBtn>
        <IconBtn label="Settings"><SettingsIcon /></IconBtn>
        <Avatar />
      </div>
    </header>
  );
}

function Breadcrumbs({ items }) {
  return (
    <div className="cc-crumbs" style={{
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

function Shell({ activeNav, onNavChange, breadcrumbs, children }) {
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
          <div style={{ overflow: "auto", background: "var(--surface-0)" }}>{children}</div>
        </main>
      </div>
    </div>
  );
}

/* ---------- Lucide icons used in the shell ---------- */
function UsersIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}
function AlertIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>;
}
function ShieldIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>;
}
function ActivityIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
}
function FileIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>;
}
function BellIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>;
}
function SettingsIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
}

window.Shell = Shell;
window.IconBtn = IconBtn;
