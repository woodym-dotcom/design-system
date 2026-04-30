/**
 * EntityReferenceField — FK picker backed by a search endpoint.
 * Renders a combobox pattern: text input triggers search; results shown
 * as a listbox; selection sets the ID as field value.
 */
import * as React from 'react';
import { FieldWrapper } from './FieldWrapper';
import type { FieldPrimitiveProps } from './types';

export interface SearchResult {
  value: string;
  label: string;
}

export interface EntityReferenceFieldProps extends FieldPrimitiveProps<string> {
  search: (query: string) => Promise<SearchResult[]>;
  placeholder?: string;
}

export function EntityReferenceField({ name, form, label, hint, required, disabled, search, placeholder }: EntityReferenceFieldProps) {
  const id = `ef-${name}`;
  const meta = (form as any)._schema?._fieldMeta?.[name];
  const resolvedLabel = label ?? meta?.label ?? name;
  const resolvedHint = hint ?? meta?.hint;
  const resolvedRequired = required ?? meta?.required ?? false;
  const selectedValue = ((form.values as Record<string, unknown>)[name] as string) ?? '';
  const error = form.errors[name];

  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [open, setOpen] = React.useState(false);
  const [selectedLabel, setSelectedLabel] = React.useState('');
  const abortRef = React.useRef<AbortController | null>(null);

  const handleQuery = React.useCallback((q: string) => {
    setQuery(q);
    if (!q) { setResults([]); setOpen(false); return; }
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    search(q).then((r) => {
      setResults(r);
      setOpen(r.length > 0);
    }).catch(() => {});
  }, [search]);

  const handleSelect = React.useCallback((result: SearchResult) => {
    form.setField(name, result.value);
    setSelectedLabel(result.label);
    setQuery(result.label);
    setOpen(false);
  }, [form, name]);

  return (
    <FieldWrapper id={id} label={resolvedLabel} hint={resolvedHint} error={error} required={resolvedRequired}>
      <div role="combobox" aria-expanded={open} aria-haspopup="listbox" aria-owns={`${id}-listbox`} style={{ position: 'relative' }}>
        <input
          key={id}
          id={id}
          type="text"
          value={query}
          onChange={(e) => handleQuery(e.target.value)}
          onBlur={() => { form.touchField(name); setTimeout(() => setOpen(false), 150); }}
          placeholder={placeholder}
          required={resolvedRequired}
          disabled={disabled}
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls={`${id}-listbox`}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${id}-slot`}
        />
        {open && (
          <ul
            id={`${id}-listbox`}
            role="listbox"
            aria-label={resolvedLabel}
            style={{
              position: 'absolute',
              zIndex: 50,
              background: 'var(--surface-0)',
              border: '1px solid var(--border-1)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-1)',
              width: '100%',
              maxHeight: '200px',
              overflowY: 'auto',
              listStyle: 'none',
              margin: 0,
            }}
          >
            {results.map((r) => (
              <li
                key={r.value}
                role="option"
                aria-selected={r.value === selectedValue}
                style={{ padding: 'var(--space-1) var(--space-3)', cursor: 'pointer', borderRadius: 'var(--radius-sm)' }}
                onMouseDown={() => handleSelect(r)}
              >
                {r.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </FieldWrapper>
  );
}
