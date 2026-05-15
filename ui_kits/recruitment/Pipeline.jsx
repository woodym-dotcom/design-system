/* global React, RW_CANDIDATES, RW_PHASES, RW_ROLES, RW_DEPARTMENTS */
const { useState, useMemo } = React;

const PHASE_CLASS = {
  screen:   "cc-chip cc-chip--phase-screen",
  allocate: "cc-chip cc-chip--phase-allocate",
  score:    "cc-chip cc-chip--phase-score",
  approve:  "cc-chip cc-chip--phase-approve",
  complete: "cc-chip cc-chip--phase-complete",
};

function PipelinePage({ candidates, roleFilter, onRoleFilter, onSelect, selectedId }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "220px 1fr",
      height: "100%", background: "var(--surface-0)",
    }}>
      <FilterRail roleFilter={roleFilter} onRoleFilter={onRoleFilter} />
      <Board candidates={candidates} onSelect={onSelect} selectedId={selectedId} />
    </div>
  );
}

function FilterRail({ roleFilter, onRoleFilter }) {
  const [collapsed, setCollapsed] = useState(new Set());
  const toggle = id => {
    setCollapsed(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <aside style={{
      borderRight: "1px solid var(--border-1)",
      padding: "20px 16px",
      display: "grid", gap: 24, alignContent: "start",
      background: "var(--surface-1)",
    }}>
      <FilterGroup label="Role">
        {/* Top-level "All roles" — flat. */}
        {RW_ROLES.map(r => (
          <FilterOption
            key={r.id}
            active={roleFilter === r.id}
            onClick={() => onRoleFilter(r.id)}
            count={r.count}
          >{r.label}</FilterOption>
        ))}

        <div style={{ height: 4 }} />

        {/* Function → Specialisation → Role (3 levels). */}
        {RW_DEPARTMENTS.map(d => {
          const fnCollapsed = collapsed.has(d.id);
          return (
            <div key={d.id}>
              <TreeHeader
                level="function"
                label={d.label}
                count={d.count}
                collapsed={fnCollapsed}
                onToggle={() => toggle(d.id)}
                dim={d.count === 0}
              />
              {!fnCollapsed && d.specialisations.map(s => {
                const spCollapsed = collapsed.has(s.id);
                return (
                  <div key={s.id} style={{ position: "relative" }}>
                    {/* Function → spec connector line */}
                    <span aria-hidden="true" style={{
                      position: "absolute", left: 14, top: 0, bottom: 0,
                      width: 1, background: "var(--border-1)",
                    }}/>
                    <TreeHeader
                      level="specialisation"
                      label={s.label}
                      count={s.count}
                      collapsed={spCollapsed}
                      onToggle={() => toggle(s.id)}
                      dim={s.count === 0}
                      indent={1}
                    />
                    {!spCollapsed && s.roles.map(r => (
                      <FilterOption
                        key={r.id}
                        indent={2}
                        dim={r.count === 0}
                        active={roleFilter === r.id}
                        onClick={() => r.count > 0 && onRoleFilter(r.id)}
                        count={r.count}
                      >{r.label}</FilterOption>
                    ))}
                  </div>
                );
              })}
            </div>
          );
        })}
      </FilterGroup>

      <FilterGroup label="Stage">
        <FilterOption active>All stages</FilterOption>
        {RW_PHASES.map(p => (
          <FilterOption key={p.id}>{p.label}</FilterOption>
        ))}
      </FilterGroup>
      <FilterGroup label="Source">
        <FilterOption>Referral</FilterOption>
        <FilterOption>Inbound</FilterOption>
        <FilterOption>LinkedIn</FilterOption>
        <FilterOption>Conference</FilterOption>
      </FilterGroup>
    </aside>
  );
}

function TreeHeader({ level, label, count, collapsed, onToggle, dim, indent = 0 }) {
  const isFunction = level === "function";
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={dim}
      style={{
        display: "flex", alignItems: "center", gap: 6,
        width: "100%",
        padding: "5px 8px 5px " + (8 + indent * 18) + "px",
        border: 0, background: "transparent",
        fontFamily: "inherit", textAlign: "left",
        color: dim ? "var(--text-4)" : (isFunction ? "var(--text-1)" : "var(--text-2)"),
        fontSize: isFunction ? 12 : 12.5,
        fontWeight: isFunction ? 600 : 500,
        letterSpacing: isFunction ? "0.02em" : 0,
        cursor: dim ? "default" : "pointer",
        position: "relative",
      }}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{
        color: "var(--text-3)",
        flexShrink: 0,
        transform: collapsed ? "rotate(0deg)" : "rotate(90deg)",
        transition: "transform 120ms ease",
        opacity: dim ? 0.4 : 1,
      }}>
        <path d="m9 18 6-6-6-6"/>
      </svg>
      <span style={{ flex: 1 }}>{label}</span>
      <span style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11, fontWeight: 400,
        color: "var(--text-4)",
      }}>{count}</span>
    </button>
  );
}

function FilterGroup({ label, children }) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <span style={{
        fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
        textTransform: "uppercase", color: "var(--text-4)",
        paddingBottom: 6,
        borderBottom: "1px solid var(--border-1)",
      }}>{label}</span>
      <div style={{ display: "grid", gap: 2 }}>{children}</div>
    </div>
  );
}

function FilterOption({ active, onClick, count, indent, dim, children }) {
  const indentLevel = indent === true ? 1 : (indent || 0);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active || undefined}
      disabled={dim}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        width: "100%",
        padding: "5px 8px 5px " + (8 + indentLevel * 18) + "px",
        border: "none",
        borderRadius: "var(--radius-sm)",
        background: active ? "var(--accent-soft)" : "transparent",
        color: active ? "var(--accent-text)" : (dim ? "var(--text-4)" : "var(--text-2)"),
        fontFamily: "inherit",
        fontSize: 13,
        fontWeight: active ? 500 : 400,
        cursor: dim ? "default" : "pointer",
        textAlign: "left",
        position: "relative",
        transition: "background 120ms ease, color 120ms ease",
      }}
      onMouseEnter={e => { if (!active && !dim) e.currentTarget.style.background = "var(--surface-2)"; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
    >
      <span>{children}</span>
      {count !== undefined && (
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: active ? "var(--accent-text)" : "var(--text-4)",
        }}>{count}</span>
      )}
    </button>
  );
}

function Board({ candidates, onSelect, selectedId }) {
  return (
    <div style={{ overflow: "auto", padding: "20px 22px 32px" }}>
      <PageHeader candidates={candidates} />
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, minmax(220px, 1fr))",
        gap: 14, marginTop: 18,
      }}>
        {RW_PHASES.map(phase => (
          <Column key={phase.id} phase={phase}
            candidates={candidates.filter(c => c.phase === phase.id)}
            onSelect={onSelect} selectedId={selectedId}
          />
        ))}
      </div>
    </div>
  );
}

function PageHeader({ candidates }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--text-1)", margin: 0 }}>Pipeline</h1>
      <span className="cc-chip">{candidates.length} candidates</span>
      <div style={{ flex: 1 }}/>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="cc-btn cc-btn--secondary cc-btn--sm">Export</button>
        <button className="cc-btn cc-btn--secondary cc-btn--sm">Saved views</button>
        <button className="cc-btn cc-btn--primary cc-btn--sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          New candidate
        </button>
      </div>
    </div>
  );
}

function Column({ phase, candidates, onSelect, selectedId }) {
  return (
    <div style={{ display: "grid", gap: 10, alignContent: "start" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span className={PHASE_CLASS[phase.id]} style={{ borderRadius: 999 }}>{phase.label}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-4)" }}>{candidates.length}</span>
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {candidates.length === 0 && (
          <div className="cc-empty" style={{
            padding: 12, border: "1px dashed var(--border-1)",
            borderRadius: 8, color: "var(--text-4)", fontSize: 12, textAlign: "center",
            background: "var(--surface-1)",
          }}>No candidates in this stage.</div>
        )}
        {candidates.map(c => (
          <CandidateCard
            key={c.id}
            candidate={c}
            onSelect={onSelect}
            selected={selectedId === c.id}
          />
        ))}
      </div>
    </div>
  );
}

function CandidateCard({ candidate, onSelect, selected }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(candidate.id)}
      className={"cc-record-card" + (selected ? " is-selected" : "")}
      style={{
        display: "grid", gap: 8,
        padding: 12, textAlign: "left",
        border: "1px solid " + (selected ? "var(--accent-border)" : "var(--border-1)"),
        borderRadius: 8,
        background: selected ? "var(--accent-soft)" : "var(--surface-0)",
        cursor: "pointer", fontFamily: "inherit", color: "inherit",
        transition: "background 120ms ease, border-color 120ms ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Avatar name={candidate.name} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, color: "var(--text-1)", fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{candidate.name}</div>
          <div style={{ fontSize: 11, color: "var(--text-3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{candidate.role}</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, fontSize: 11, color: "var(--text-3)" }}>
        <span>{candidate.years}y · {candidate.source}</span>
        {candidate.score && (
          <span style={{
            fontFamily: "var(--font-mono)", fontWeight: 600,
            color: candidate.score >= 8.5 ? "var(--success-text)" : candidate.score >= 7 ? "var(--warning-text)" : "var(--text-2)",
          }}>{candidate.score}</span>
        )}
      </div>
    </button>
  );
}

function Avatar({ name }) {
  const initials = name.split(/\s+/).map(p => p[0]).slice(0,2).join("").toUpperCase();
  // Deterministic hue from name
  const hue = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <div style={{
      width: 28, height: 28, borderRadius: 999,
      background: `oklch(85% 0.06 ${hue})`,
      color: `oklch(35% 0.12 ${hue})`,
      fontSize: 11, fontWeight: 600,
      display: "grid", placeItems: "center",
      flexShrink: 0,
    }}>{initials}</div>
  );
}

window.PipelinePage = PipelinePage;
window.RW_PHASE_CLASS = PHASE_CLASS;
