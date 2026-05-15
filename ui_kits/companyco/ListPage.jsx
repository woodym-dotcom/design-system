/* global React, VENDORS, FILTER_CHIPS */
const { useState, useEffect, useMemo } = React;

function PageHeader({ title, count, onCreate }) {
  return (
    <div className="cc-page-header" style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      marginBottom: 16,
    }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <h1 style={{
          fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em",
          color: "var(--text-1)", margin: 0,
        }}>{title}</h1>
        <span className="cc-chip" style={{ background: "var(--surface-2)" }}>{count}</span>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="cc-btn cc-btn--secondary">
          <SearchIcon />
          <span style={{ marginLeft: 6 }}>Search</span>
        </button>
        <button className="cc-btn cc-btn--secondary">Save view</button>
        <button className="cc-btn cc-btn--primary" onClick={onCreate}>
          <PlusIcon /><span style={{ marginLeft: 6 }}>New vendor</span>
        </button>
      </div>
    </div>
  );
}

function FilterBar({ active, onToggle, onClear }) {
  return (
    <div className="cc-filter-bar" style={{
      display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
      padding: "10px 0 14px",
    }}>
      <span style={{
        fontSize: 11, fontWeight: 500, letterSpacing: "0.08em",
        textTransform: "uppercase", color: "var(--text-4)",
        marginRight: 4,
      }}>Filters</span>
      {FILTER_CHIPS.map(c => (
        <button
          key={c.id}
          type="button"
          className="cc-chip cc-chip--button"
          aria-pressed={active.has(c.id)}
          onClick={() => onToggle(c.id)}
          style={{ cursor: "pointer", fontFamily: "inherit" }}
        >
          {c.label}
          <span style={{
            marginLeft: 6,
            fontSize: 11,
            color: active.has(c.id) ? "var(--accent-text)" : "var(--text-4)",
            fontVariantNumeric: "tabular-nums",
          }}>{c.count}</span>
        </button>
      ))}
      {active.size > 0 && (
        <button className="cc-btn cc-btn--ghost cc-btn--sm" onClick={onClear} style={{ marginLeft: 4 }}>
          Clear all
        </button>
      )}
    </div>
  );
}

function VendorTable({ rows, selected, onSelect, onCheck, checked }) {
  return (
    <div style={{ border: "1px solid var(--border-1)", borderRadius: 10, overflow: "hidden", background: "var(--surface-0)" }}>
      <table className="cc-table">
        <thead>
          <tr>
            <th className="cc-table__select"><input type="checkbox" /></th>
            <th>Vendor</th>
            <th>Tier</th>
            <th>Status</th>
            <th>Risk</th>
            <th>Owner</th>
            <th style={{ textAlign: "right" }}>Last review</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(v => (
            <tr key={v.id}
                className={(selected === v.id ? "is-selected " : "") + (checked.has(v.id) ? "is-multi-selected" : "")}
                onClick={() => onSelect(v.id)}
            >
              <td className="cc-table__select" onClick={e => e.stopPropagation()}>
                <input type="checkbox" checked={checked.has(v.id)} onChange={() => onCheck(v.id)} />
              </td>
              <td><strong>{v.name}</strong><div style={{ fontSize: 12, color: "var(--text-3)" }}>{v.country} · {v.contract}</div></td>
              <td>{v.tier}</td>
              <td><StatusChip status={v.status} /></td>
              <td><RiskBar value={v.risk} /></td>
              <td>{v.owner}</td>
              <td className="cc-num" style={{ textAlign: "right", color: "var(--text-3)" }}>{v.reviewed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusChip({ status }) {
  const map = {
    active:  { cls: "cc-chip cc-chip--success", label: "Active" },
    review:  { cls: "cc-chip cc-chip--warning", label: "Review due" },
    blocked: { cls: "cc-chip cc-chip--danger",  label: "Blocked" },
  };
  const s = map[status] || { cls: "cc-chip", label: status };
  return <span className={s.cls}>{s.label}</span>;
}

function RiskBar({ value }) {
  const color = value >= 70 ? "var(--severity-critical)" : value >= 45 ? "var(--severity-high)" : value >= 25 ? "var(--severity-medium)" : "var(--severity-low)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 64, height: 6, borderRadius: 999, background: "var(--surface-2)", overflow: "hidden" }}>
        <div style={{ width: value + "%", height: "100%", background: color }}/>
      </div>
      <span className="cc-num" style={{ fontSize: 12, color: "var(--text-2)", minWidth: 22, textAlign: "right" }}>{value}</span>
    </div>
  );
}

function PlusIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
}
function SearchIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
}

window.PageHeader = PageHeader;
window.FilterBar = FilterBar;
window.VendorTable = VendorTable;
window.StatusChip = StatusChip;
window.RiskBar = RiskBar;
