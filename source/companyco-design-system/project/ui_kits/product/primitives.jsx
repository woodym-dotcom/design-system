// CompanyCo UI Kit — React primitives (JSX / Babel-standalone compatible)
// Requires React in scope + ui_kits/product/kit.css loaded.
// Exports to window for cross-file use.

const { useState, useMemo } = React;

// ---------- Button ----------
function Button({ variant = 'secondary', size, icon, disabled, children, ...rest }) {
  const cls = [
    'cc-btn',
    variant === 'primary' && 'cc-btn--primary',
    variant === 'ghost'   && 'cc-btn--ghost',
    variant === 'danger'  && 'cc-btn--danger',
    icon && 'cc-btn--icon',
    size === 'sm' && 'cc-btn--sm',
    disabled && 'is-disabled',
  ].filter(Boolean).join(' ');
  return <button className={cls} disabled={disabled} {...rest}>{children}</button>;
}

// ---------- Chip ----------
function Chip({ tone = 'neutral', children }) {
  const cls = ['cc-chip', tone !== 'neutral' && `cc-chip--${tone}`].filter(Boolean).join(' ');
  return <span className={cls}>{children}</span>;
}

// ---------- Field ----------
function Field({ label, required, error, hint, readOnly, inline, type = 'text', as = 'input', children, ...inputProps }) {
  const cls = [
    'cc-field',
    inline && 'cc-field--inline',
    error && 'cc-field--error',
    readOnly && 'cc-field--readonly',
  ].filter(Boolean).join(' ');
  const Control = as === 'textarea' ? 'textarea' : as === 'select' ? 'select' : 'input';
  const controlCls = as === 'textarea' ? 'cc-field__textarea' : as === 'select' ? 'cc-field__select' : 'cc-field__input';
  return (
    <label className={cls}>
      {label && <span className="cc-field__label">{label}{required && <span className="req" aria-hidden> *</span>}</span>}
      <Control
        className={controlCls}
        type={as === 'input' ? type : undefined}
        readOnly={readOnly}
        {...inputProps}
      >{children}</Control>
      {error && <span className="cc-field__error">{error}</span>}
      {!error && hint && <span className="cc-field__hint">{hint}</span>}
    </label>
  );
}

// ---------- Panel ----------
function Panel({ title, description, actions, children }) {
  return (
    <section className="cc-panel">
      {(title || description || actions) && (
        <header className="cc-panel__header" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12 }}>
          <div>
            {title && <h3 className="cc-panel__title">{title}</h3>}
            {description && <p className="cc-panel__desc">{description}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className="cc-panel__body">{children}</div>
    </section>
  );
}

// ---------- SectionHeader ----------
function SectionHeader({ eyebrow, title, description }) {
  return (
    <header className="cc-section-header">
      {eyebrow && <span className="cc-section-header__eyebrow">{eyebrow}</span>}
      {title && <h2 className="cc-section-header__title">{title}</h2>}
      {description && <p className="cc-section-header__desc">{description}</p>}
    </header>
  );
}

// ---------- Tabs ----------
function Tabs({ items, value, onChange }) {
  return (
    <div className="cc-tabs">
      {items.map(it => (
        <button
          key={it.value}
          className={`cc-tab${it.value === value ? ' is-active' : ''}`}
          onClick={() => onChange?.(it.value)}
        >{it.label}</button>
      ))}
    </div>
  );
}

// ---------- EmptyState ----------
function EmptyState({ title, description }) {
  return (
    <div className="cc-empty">
      <div className="cc-empty__title">{title}</div>
      {description && <p className="cc-empty__desc">{description}</p>}
    </div>
  );
}

// ---------- Spinner ----------
function Spinner() { return <span className="cc-spinner" role="status" aria-label="Loading" />; }

Object.assign(window, {
  Button, Chip, Field, Panel, SectionHeader, Tabs, EmptyState, Spinner,
});
