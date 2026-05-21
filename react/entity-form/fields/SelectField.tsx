/**
 * @deprecated SelectField is an internal field primitive; it is no longer part of
 * the public API. Use <EntityForm schema={...}> or <FormField as="shell"> instead.
 * Will be removed from public exports in v1.0 (DS-SIMPLIFY 14).
 */
import * as React from 'react';
import { FieldWrapper } from './FieldWrapper';
import type { FieldPrimitiveProps } from './types';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

export interface SelectFieldProps<T extends string = string> extends FieldPrimitiveProps<T> {
  options: SelectOption<T>[] | ((values: Record<string, unknown>) => SelectOption<T>[]);
  placeholder?: string;
  /** When true, renders as a combobox with typeahead filtering instead of a plain <select>. */
  searchable?: boolean;
  /**
   * Maximum number of options to show in the searchable dropdown at once.
   * Defaults to 8. Only used when `searchable=true`.
   */
  maxVisible?: number;
  /**
   * Custom filter predicate for the searchable combobox.
   * Receives the option and the current query string; return true to include.
   * Defaults to case-insensitive substring match on option.label.
   */
  filter?: (option: SelectOption<T>, query: string) => boolean;
}

export function SelectField<T extends string = string>({
  name, form, label, hint, required, disabled, readOnly, options, placeholder,
  searchable = false, maxVisible = 8, filter,
}: SelectFieldProps<T>) {
  const reactId = React.useId();
  const id = `ef-${reactId}-${name}`;
  const meta = (form as any)._schema?._fieldMeta?.[name];
  const resolvedLabel = label ?? meta?.label ?? name;
  const resolvedHint = hint ?? meta?.hint;
  const resolvedRequired = required ?? meta?.required ?? false;
  const value = ((form.values as Record<string, unknown>)[name] as string) ?? '';
  const error = form.errors[name];

  const resolvedOptions = typeof options === 'function'
    ? options(form.values as Record<string, unknown>)
    : options;

  // ── Plain <select> path ──────────────────────────────────────────────────
  if (!searchable) {
    return (
      <FieldWrapper id={id} label={resolvedLabel} hint={resolvedHint} error={error} required={resolvedRequired}>
        <select
          key={id}
          id={id}
          value={value}
          onChange={(e) => form.setField(name, e.target.value as T)}
          onBlur={() => form.touchField(name)}
          required={resolvedRequired}
          disabled={disabled || readOnly}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${id}-slot`}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {resolvedOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </FieldWrapper>
    );
  }

  // ── Searchable combobox path ─────────────────────────────────────────────
  return (
    <SearchableSelect
      id={id}
      label={resolvedLabel}
      hint={resolvedHint}
      error={error}
      required={resolvedRequired}
      disabled={disabled}
      readOnly={readOnly}
      value={value}
      options={resolvedOptions}
      placeholder={placeholder}
      maxVisible={maxVisible}
      filter={filter}
      onChange={(v) => form.setField(name, v as T)}
      onBlur={() => form.touchField(name)}
    />
  );
}

// ---------------------------------------------------------------------------
// SearchableSelect — combobox implementation (ARIA 1.2 combobox pattern)
// ---------------------------------------------------------------------------
interface SearchableSelectProps<T extends string = string> {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  value: string;
  options: SelectOption<T>[];
  placeholder?: string;
  maxVisible: number;
  filter?: (option: SelectOption<T>, query: string) => boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
}

function SearchableSelect<T extends string = string>({
  id, label, hint, error, required, disabled, readOnly,
  value, options, placeholder, maxVisible, filter,
  onChange, onBlur,
}: SearchableSelectProps<T>) {
  const listboxId = `${id}-listbox`;

  // Display text: show label of selected option, or empty string when nothing selected
  const selectedLabel = options.find((o) => o.value === value)?.label ?? '';

  const [query, setQuery] = React.useState(selectedLabel);
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  // Tracks whether focus-back is from a programmatic refocus after selection;
  // prevents onFocus from re-opening the listbox immediately after a pick.
  const suppressNextFocusOpenRef = React.useRef(false);

  // Sync display when value changes externally
  React.useEffect(() => {
    if (!open) {
      setQuery(selectedLabel);
    }
  }, [selectedLabel, open]);

  const defaultFilter = React.useCallback(
    (opt: SelectOption<T>, q: string) =>
      opt.label.toLowerCase().includes(q.toLowerCase()),
    [],
  );
  const applyFilter = filter ?? defaultFilter;

  const filtered = React.useMemo(
    () => (open ? options.filter((o) => applyFilter(o, query)).slice(0, maxVisible) : []),
    [options, query, open, applyFilter, maxVisible],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setOpen(true);
    setActiveIndex(-1);
  };

  const handleSelect = (opt: SelectOption<T>) => {
    onChange(opt.value);
    setQuery(opt.label);
    setOpen(false);
    setActiveIndex(-1);
    suppressNextFocusOpenRef.current = true;
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setOpen(true);
      setActiveIndex(0);
      e.preventDefault();
      return;
    }
    if (e.key === 'Escape') {
      setOpen(false);
      setQuery(selectedLabel);
      return;
    }
    if (e.key === 'ArrowDown') {
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      setActiveIndex((i) => Math.max(i - 1, 0));
      e.preventDefault();
    } else if (e.key === 'Enter' && activeIndex >= 0 && filtered[activeIndex]) {
      handleSelect(filtered[activeIndex]);
      e.preventDefault();
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    // Close only when focus leaves the entire combobox container
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setOpen(false);
      setQuery(selectedLabel);
      onBlur();
    }
  };

  const activeOptionId = activeIndex >= 0 ? `${id}-opt-${activeIndex}` : undefined;

  return (
    <FieldWrapper id={id} label={label} hint={hint} error={error} required={required}>
      {/* Visually-hidden input carries the actual value for form submission */}
      <input type="hidden" name={id} value={value} />
      <div
        style={{ position: 'relative' }}
        onBlur={handleBlur}
      >
        <input
          key={id}
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-activedescendant={activeOptionId}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${id}-slot`}
          value={query}
          placeholder={placeholder}
          required={required}
          disabled={disabled || readOnly}
          onChange={handleInputChange}
          onFocus={() => {
            if (suppressNextFocusOpenRef.current) {
              suppressNextFocusOpenRef.current = false;
              return;
            }
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className="cc-form-field__combobox-input"
        />
        {open && filtered.length > 0 && (
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-label={label}
            className="cc-form-field__combobox-listbox"
            style={{
              position: 'absolute',
              zIndex: 100,
              top: '100%',
              left: 0,
              right: 0,
              margin: 0,
              padding: 0,
              listStyle: 'none',
              background: 'var(--cc-surface-overlay, #fff)',
              border: '1px solid var(--cc-border, #ccc)',
              borderRadius: '4px',
              maxHeight: `${maxVisible * 2.25}rem`,
              overflowY: 'auto',
            }}
          >
            {filtered.map((opt, idx) => (
              <li
                key={opt.value}
                id={`${id}-opt-${idx}`}
                role="option"
                aria-selected={opt.value === value}
                className={[
                  'cc-form-field__combobox-option',
                  idx === activeIndex ? 'cc-form-field__combobox-option--active' : '',
                  opt.value === value ? 'cc-form-field__combobox-option--selected' : '',
                ].filter(Boolean).join(' ')}
                onMouseDown={(e) => e.preventDefault()} // prevent blur before click
                onClick={() => handleSelect(opt)}
                style={{
                  padding: '0.5rem 0.75rem',
                  cursor: 'pointer',
                  background: idx === activeIndex
                    ? 'var(--cc-surface-hover, #f0f0f0)'
                    : 'transparent',
                }}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </FieldWrapper>
  );
}
