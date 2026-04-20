// CompanyCo UI Kit — shell + navigation components

const { useState: useShellState } = React;

const NavIcons = {
  intro: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10L10 4l7 6"/><path d="M5 9v7h4v-4h2v4h4V9"/>
    </svg>
  ),
  companies: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="6" width="12" height="11" rx="1"/><path d="M4 6h12"/>
      <path d="M7 9h2M7 12h2M11 9h2M11 12h2"/>
    </svg>
  ),
  measurement: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3,14 7,10 11,12 17,6"/><polyline points="13,6 17,6 17,10"/>
    </svg>
  ),
  portfolio: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="14" height="10" rx="1.5"/>
      <path d="M7 7V5.5A1.5 1.5 0 018.5 4h3A1.5 1.5 0 0113 5.5V7"/><path d="M3 11h14"/>
    </svg>
  ),
  services: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 3.5a3.5 3.5 0 00-4.95 0L5 8l7 7 4.5-4.55a3.5 3.5 0 000-4.95"/>
      <path d="M3 17l3-3"/><path d="M12 8l-4 4"/>
    </svg>
  ),
  risks: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 3L2 17h16L10 3z"/><path d="M10 8v4"/><circle cx="10" cy="14" r=".5" fill="currentColor"/>
    </svg>
  ),
  regulatory: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="12" height="14" rx="1.5"/><path d="M7 2.5h6v2H7z"/>
      <path d="M7 9h6M7 12h4"/>
    </svg>
  ),
  incidents: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="4.5"/><path d="M12.5 12.5L17 17"/>
    </svg>
  ),
  admin: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="2.5"/>
      <path d="M10 3v2M10 15v2M3 10h2M15 10h2M5 5l1.4 1.4M13.6 13.6L15 15M5 15l1.4-1.4M13.6 6.4L15 5"/>
    </svg>
  ),
};

// ---------- NavRail ----------
function NavRail({ groupInitials = 'WH', items, activeId, onChange }) {
  const defaults = items || [
    { id:'intro',       icon:NavIcons.intro,       label:'Intro' },
    { id:'companies',   icon:NavIcons.companies,   label:'Companies' },
    { id:'measurement', icon:NavIcons.measurement, label:'Measurement' },
    { id:'portfolio',   icon:NavIcons.portfolio,   label:'Portfolio' },
    { id:'services',    icon:NavIcons.services,    label:'Services' },
    { id:'risks',       icon:NavIcons.risks,       label:'Risks' },
    { id:'regulatory',  icon:NavIcons.regulatory,  label:'Regulatory' },
    { id:'incidents',   icon:NavIcons.incidents,   label:'Incidents' },
  ];
  return (
    <nav className="cc-navrail" aria-label="Modules">
      <div className="cc-navrail__group" title="Company Group">{groupInitials}</div>
      <div className="cc-navrail__divider" />
      {defaults.map(it => (
        <button
          key={it.id}
          className={`cc-navrail__icon${it.id === activeId ? ' is-active' : ''}`}
          title={it.label}
          onClick={() => onChange?.(it.id)}
        >{it.icon}</button>
      ))}
      <div style={{ flex:1 }} />
      <button className="cc-navrail__icon" title="Admin">{NavIcons.admin}</button>
    </nav>
  );
}

// ---------- TopBar ----------
function TopBar({ brand = 'CompanyCo', identity = 'JW', showCmdK = true }) {
  return (
    <header className="cc-topbar">
      <span className="cc-topbar__brand">{brand}</span>
      <div className="cc-topbar__actions">
        {showCmdK && (
          <div className="cc-topbar__kbd"><kbd>Cmd</kbd> + <kbd>K</kbd> to search</div>
        )}
        <div className="cc-identity" title="Account">{identity}</div>
      </div>
    </header>
  );
}

// ---------- Breadcrumbs ----------
function Breadcrumbs({ items }) {
  return (
    <nav className="cc-crumbs" aria-label="Breadcrumb">
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <React.Fragment key={i}>
            <span className={last ? 'cc-crumbs__last' : ''}>{it}</span>
            {!last && <span className="cc-crumbs__sep">/</span>}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

// ---------- AppShell ----------
function AppShell({ groupInitials, activeId, onNavigate, crumbs, children, identity, brand }) {
  return (
    <div className="cc-shell">
      <TopBar brand={brand} identity={identity} />
      <div className="cc-workspace">
        <NavRail groupInitials={groupInitials} activeId={activeId} onChange={onNavigate} />
        <div className="cc-main">
          {crumbs && <Breadcrumbs items={crumbs} />}
          <div className="cc-content">{children}</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { NavRail, TopBar, Breadcrumbs, AppShell, NavIcons });
