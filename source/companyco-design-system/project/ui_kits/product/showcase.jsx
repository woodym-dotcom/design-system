// Showcase page for the CompanyCo UI Kit

const { useState: useSC } = React;

function Showcase() {
  const [tab, setTab] = useSC('overview');
  const [nav, setNav] = useSC('companies');

  const sampleCompanies = [
    { id:1, name:'Woodym Holdings',     jur:'GB-ENG', status:'active',  num:'09871234' },
    { id:2, name:'Woodym Trading Ltd',  jur:'GB-ENG', status:'active',  num:'10298411' },
    { id:3, name:'Woodym Europe B.V.',  jur:'NL',     status:'dormant', num:'67891245' },
    { id:4, name:'Woodym Labs Inc',     jur:'US-DE',  status:'active',  num:'7729441' },
  ];
  const [selectedId, setSelectedId] = useSC(1);

  return (
    <div className="showcase">
      <nav className="showcase__nav">
        <a href="#foundations">Foundations</a>
        <a href="#primitives">Primitives</a>
        <a href="#composition">Composition</a>
        <a href="#shell">App shell</a>
        <a href="#auth">Auth screen</a>
      </nav>

      {/* FOUNDATIONS ---------------------------------------------------- */}
      <section className="showcase__section" id="foundations">
        <h2>Foundations</h2>
        <p className="lede">Type, color, spacing are in <code>colors_and_type.css</code>. This kit consumes them.</p>
        <div className="showcase__row" style={{ gap:32 }}>
          <div style={{ flex:'1 1 300px' }}>
            <div className="t-eyebrow" style={{ marginBottom:6 }}>TYPE</div>
            <div style={{ fontSize:20, fontWeight:600, letterSpacing:'-0.02em' }}>Page title · 20/600</div>
            <div style={{ fontSize:18, fontWeight:600, letterSpacing:'-0.02em' }}>Section header · 18/600</div>
            <div style={{ fontSize:14, color:'var(--text-2)' }}>Body · 14/400 — Inter</div>
            <div style={{ fontSize:12, color:'var(--text-3)' }}>Caption · 12/400</div>
          </div>
          <div style={{ flex:'1 1 300px' }}>
            <div className="t-eyebrow" style={{ marginBottom:6 }}>ACCENT</div>
            <div style={{ display:'flex', gap:8 }}>
              {['#4f46e5','#4338ca','#eef2ff','#c7d2fe'].map(c => (
                <div key={c} style={{ width:56, height:56, borderRadius:8, background:c, border:'1px solid rgba(0,0,0,0.06)' }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRIMITIVES ---------------------------------------------------- */}
      <section className="showcase__section" id="primitives">
        <h2>Primitives</h2>
        <p className="lede">Button · Chip · Field · Tabs · EmptyState · Spinner</p>

        <div className="showcase__grid showcase__grid--2">
          <Panel title="Buttons" description="Primary, secondary, ghost, danger, icon, disabled.">
            <div className="showcase__row">
              <Button variant="primary">Sign in</Button>
              <Button>Cancel</Button>
              <Button variant="ghost">Skip</Button>
              <Button variant="danger">Delete</Button>
              <Button variant="primary" disabled>Signing in…</Button>
              <Button icon aria-label="Close">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15"/></svg>
              </Button>
            </div>
          </Panel>

          <Panel title="Chips" description="Neutral · accent · success · warning · info · danger.">
            <div className="showcase__row">
              <Chip>Admin</Chip>
              <Chip tone="accent">3 pending</Chip>
              <Chip tone="success">Active</Chip>
              <Chip tone="warning">At risk</Chip>
              <Chip tone="info">Draft</Chip>
              <Chip tone="danger">Critical</Chip>
              <Chip>DIRECTOR</Chip>
              <Chip>BENEFICIAL_OWNER</Chip>
            </div>
          </Panel>

          <Panel title="Fields" description="Text, required, error, readonly, inline, select, textarea.">
            <Field label="Email" defaultValue="jane@companyco.com" placeholder="you@domain.com" />
            <Field label="Password" required type="password" defaultValue="password123" hint="8+ chars, one number" />
            <Field label="Company number" error="Must be 8 digits" defaultValue="12345" />
            <Field label="Jurisdiction" readOnly defaultValue="GB-ENG" />
            <Field label="Type" as="select" defaultValue="ltd">
              <option value="ltd">Private limited</option>
              <option value="plc">Public limited</option>
              <option value="llp">LLP</option>
            </Field>
            <Field label="Notes" as="textarea" placeholder="Add context…" />
            <Field inline label="Name" defaultValue="Woodym Holdings" />
          </Panel>

          <Panel title="Tabs + Empty state + Spinner">
            <Tabs
              value={tab}
              onChange={setTab}
              items={[
                { value:'overview',  label:'Overview' },
                { value:'people',    label:'People' },
                { value:'relations', label:'Relationships' },
                { value:'log',       label:'Change log' },
              ]}
            />
            <div style={{ height:12 }} />
            <EmptyState title="All clear" description="No pending actions right now." />
            <div className="showcase__row" style={{ marginTop:12 }}>
              <Spinner />
              <span className="t-caption">Loading…</span>
            </div>
          </Panel>
        </div>
      </section>

      {/* COMPOSITION --------------------------------------------------- */}
      <section className="showcase__section" id="composition">
        <h2>Composition</h2>
        <p className="lede">Section header + panel + table + chip, as it appears in the product.</p>

        <SectionHeader eyebrow="COMPANIES" title="Woodym Holdings" description="12 entities across 4 jurisdictions." />

        <Panel
          title="Entities"
          description="All companies in this group."
          actions={<Button size="sm" variant="primary">Add company</Button>}
        >
          <table className="cc-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Jurisdiction</th>
                <th>Status</th>
                <th>Number</th>
              </tr>
            </thead>
            <tbody>
              {sampleCompanies.map(c => (
                <tr key={c.id} className={c.id === selectedId ? 'is-selected' : ''} onClick={() => setSelectedId(c.id)}>
                  <td><strong>{c.name}</strong></td>
                  <td>{c.jur}</td>
                  <td>
                    {c.status === 'active'
                      ? <Chip tone="success">Active</Chip>
                      : <Chip>Dormant</Chip>}
                  </td>
                  <td style={{ fontFamily:'var(--font-mono)', fontSize:13 }}>{c.num}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </section>

      {/* APP SHELL ----------------------------------------------------- */}
      <section className="showcase__section" id="shell">
        <h2>App shell</h2>
        <p className="lede">TopBar + NavRail + Breadcrumbs, plumbed together.</p>
        <div className="showcase__shell-frame">
          <AppShell
            groupInitials="WH"
            activeId={nav}
            onNavigate={setNav}
            identity="JW"
            crumbs={['Woodym Holdings', nav.charAt(0).toUpperCase() + nav.slice(1)]}
          >
            <SectionHeader eyebrow={nav.toUpperCase()} title="Actions" description="Items across the system that need your attention." />
            <div className="showcase__grid showcase__grid--2">
              <Panel title="Pending reviews" description="2 items awaiting sign-off.">
                <EmptyState title="All clear" description="No pending actions right now." />
              </Panel>
              <Panel title="Recent activity">
                <div style={{ display:'grid', gap:8 }}>
                  <div className="showcase__row" style={{ justifyContent:'space-between' }}>
                    <span style={{ fontSize:14 }}><strong>Woodym Trading Ltd</strong> · director resigned</span>
                    <span className="t-caption">3m ago</span>
                  </div>
                  <div className="showcase__row" style={{ justifyContent:'space-between' }}>
                    <span style={{ fontSize:14 }}><strong>Woodym Europe B.V.</strong> · address updated</span>
                    <span className="t-caption">2h ago</span>
                  </div>
                  <div className="showcase__row" style={{ justifyContent:'space-between' }}>
                    <span style={{ fontSize:14 }}><strong>Woodym Holdings</strong> · annual filing due</span>
                    <span className="t-caption">4d ago</span>
                  </div>
                </div>
              </Panel>
            </div>
          </AppShell>
        </div>
      </section>

      {/* AUTH ---------------------------------------------------------- */}
      <section className="showcase__section" id="auth">
        <h2>Auth screen</h2>
        <p className="lede">Editorial brand surface. Reserved for sign-in + marketing-adjacent.</p>
        <div className="showcase__auth-frame">
          <AuthScreen>
            <SectionHeader title="Sign in" description="Welcome back. Enter your details to continue." />
            <Field label="Email" defaultValue="jane@companyco.com" />
            <Field label="Password" required type="password" defaultValue="••••••••" />
            <div className="showcase__row" style={{ justifyContent:'space-between' }}>
              <Button variant="ghost" size="sm">Forgot password?</Button>
              <Button variant="primary">Sign in</Button>
            </div>
          </AuthScreen>
        </div>
      </section>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Showcase />);
