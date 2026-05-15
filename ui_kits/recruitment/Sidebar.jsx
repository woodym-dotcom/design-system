/* global React */

function Sidebar({ active, onChange }) {
  const items = [
    { id: "pipeline", icon: <UsersIcon />, label: "Pipeline" },
    { id: "roles",    icon: <BriefcaseIcon />, label: "Roles" },
    { id: "calendar", icon: <CalendarIcon />, label: "Calendar" },
    { id: "messages", icon: <MailIcon />, label: "Messages" },
    { id: "reports",  icon: <ActivityIcon />, label: "Reports" },
  ];
  return (
    <aside style={{
      width: 72, background: "var(--surface-1)",
      borderRight: "1px solid var(--border-1)",
      display: "flex", flexDirection: "column",
      alignItems: "center",
      padding: "16px 0",
    }}>
      <Logo />
      <nav style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 22, flex: 1 }}>
        {items.map(it => (
          <button
            key={it.id}
            type="button"
            aria-label={it.label}
            title={it.label}
            onClick={() => onChange(it.id)}
            style={{
              width: 44, height: 44, borderRadius: 8,
              border: "1px solid transparent",
              background: active === it.id ? "var(--accent-soft)" : "transparent",
              color: active === it.id ? "var(--accent-text)" : "var(--text-3)",
              borderColor: active === it.id ? "var(--accent-border)" : "transparent",
              cursor: "pointer",
              display: "grid", placeItems: "center",
              transition: "background 120ms ease, color 120ms ease",
            }}
          >{it.icon}</button>
        ))}
      </nav>
      <div style={{ display: "grid", gap: 8, alignItems: "center", justifyItems: "center" }}>
        <button className="cc-btn cc-btn--ghost cc-btn--icon" aria-label="Settings">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 10v6M4.22 4.22l4.24 4.24m7.08 7.08 4.24 4.24M1 12h6m10 0h6M4.22 19.78l4.24-4.24m7.08-7.08 4.24-4.24"/></svg>
        </button>
        <div style={{
          width: 32, height: 32, borderRadius: 999,
          background: "var(--accent-1)", color: "#fff",
          fontSize: 12, fontWeight: 600,
          display: "grid", placeItems: "center",
        }}>MO</div>
      </div>
    </aside>
  );
}

function Logo() {
  return (
    <div style={{
      width: 40, height: 40, borderRadius: 999,
      background: "var(--accent-1)",
      display: "grid", placeItems: "center",
    }}>
      <div style={{ width: 18, height: 18, borderRadius: 999, background: "var(--paper, #fafaf8)" }}/>
    </div>
  );
}

function UsersIcon()      { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function BriefcaseIcon()  { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>; }
function CalendarIcon()   { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>; }
function MailIcon()       { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>; }
function ActivityIcon()   { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>; }

window.Sidebar = Sidebar;
