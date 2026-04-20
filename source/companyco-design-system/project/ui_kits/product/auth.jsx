// CompanyCo UI Kit — Auth (brand/editorial) surface

function AuthScreen({ headline = 'CompanyCo', tagline = "Your one-stop shop to manage your company's performance and risks.", eyebrow = 'ENTERPRISE GOVERNANCE, SIMPLIFIED', children }) {
  return (
    <div className="cc-auth">
      <aside className="cc-auth__brand">
        <div className="cc-auth__glow cc-auth__glow--tr" />
        <div className="cc-auth__glow cc-auth__glow--bl" />
        <div className="cc-auth__brand-inner">
          <div className="cc-auth__mark">
            <svg viewBox="0 0 280 280" aria-hidden>
              <defs>
                <linearGradient id="cc-auth-g1" x1="0" y1="0" x2="280" y2="280" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#e8b87a"/><stop offset="50%" stopColor="#d4a574"/><stop offset="100%" stopColor="#b8865c"/>
                </linearGradient>
                <linearGradient id="cc-auth-g2" x1="280" y1="0" x2="0" y2="280" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#f0c896"/><stop offset="100%" stopColor="#c9956a"/>
                </linearGradient>
              </defs>
              <rect className="cc-auth__mark-a" x="40" y="60" width="120" height="160" rx="4" fill="url(#cc-auth-g1)" opacity="0.9"/>
              <rect className="cc-auth__mark-b" x="90" y="40" width="120" height="160" rx="4" fill="url(#cc-auth-g2)" opacity="0.6"/>
              <rect className="cc-auth__mark-c" x="140" y="80" width="100" height="140" rx="4" fill="url(#cc-auth-g1)" opacity="0.35"/>
            </svg>
          </div>
          {eyebrow && <span className="cc-auth__eyebrow">{eyebrow}</span>}
          <h1 className="cc-auth__headline">{headline}</h1>
          <p className="cc-auth__tagline">{tagline}</p>
        </div>
      </aside>
      <main className="cc-auth__form">
        <div className="cc-auth__form-inner">{children}</div>
      </main>
    </div>
  );
}

Object.assign(window, { AuthScreen });
