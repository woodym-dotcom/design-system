/**
 * <CompanyGroupSwitcher> — controlled tenancy-context selector (Phase 1.2).
 *
 * Renders a combobox-role widget for switching the active company group.
 * Data flows from outside: consumer fetches from /api/session (memberships[])
 * and passes the result in via props — no fetch inside this component.
 *
 * A11y contract:
 *  - role="combobox" on the trigger button (aria-expanded, aria-haspopup)
 *  - role="listbox" on the dropdown  (aria-label)
 *  - role="option"  on each group entry (aria-selected)
 *  - Keyboard: ArrowDown/ArrowUp moves focus, Enter/Space selects, Escape closes
 *  - Search input (when memberships.length > 5) is focussed on open
 *
 * Guardrail: this component is the only sanctioned tenancy UI in @ds/core.
 * Any consumer that rolls its own group selector will be flagged by the
 * @ds/core/no-adhoc-tenancy-selector ESLint rule.
 */
import * as React from 'react';

export interface CompanyGroupOption {
  /** Stable UUID for the company group. */
  companyGroupUuid: string;
  /** Human-readable name. */
  name: string;
}

export interface CompanyGroupSwitcherProps {
  /** The currently active group UUID. */
  currentGroupUuid: string | null;
  /** All groups the user belongs to (from /api/session memberships). */
  memberships: CompanyGroupOption[];
  /** Called when the user selects a different group. */
  onChange: (companyGroupUuid: string) => void;
  /** Accessible label for the combobox. Default: "Switch company group". */
  ariaLabel?: string;
  /** Whether the switcher is in a loading state. */
  loading?: boolean;
  className?: string;
}

/** Threshold above which search-on-type is activated. */
const SEARCH_THRESHOLD = 5;

export function CompanyGroupSwitcher({
  currentGroupUuid,
  memberships,
  onChange,
  ariaLabel = 'Switch company group',
  loading = false,
  className,
}: CompanyGroupSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [focusedIndex, setFocusedIndex] = React.useState(0);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  const optionRefs = React.useRef<(HTMLLIElement | null)[]>([]);

  const showSearch = memberships.length > SEARCH_THRESHOLD;

  const filtered = showSearch
    ? memberships.filter((m) =>
        m.name.toLowerCase().includes(query.toLowerCase()),
      )
    : memberships;

  const currentGroup =
    memberships.find((m) => m.companyGroupUuid === currentGroupUuid) ?? null;

  const initials = (name: string) =>
    name
      .split(/\s+/)
      .map((part) => part[0] ?? '')
      .join('')
      .slice(0, 2)
      .toUpperCase();

  // ── Open / close ────────────────────────────────────────────────────────────

  const openDropdown = () => {
    setQuery('');
    setFocusedIndex(0);
    setOpen(true);
  };

  const closeDropdown = () => {
    setOpen(false);
    setQuery('');
  };

  // Focus search or first option when opening
  React.useEffect(() => {
    if (!open) return;
    if (showSearch) {
      searchRef.current?.focus();
    } else {
      optionRefs.current[0]?.focus();
    }
  }, [open, showSearch]);

  // Reset focusedIndex when filter changes
  React.useEffect(() => {
    setFocusedIndex(0);
  }, [query]);

  // Click-outside to close
  React.useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        closeDropdown();
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  // ── Keyboard navigation ──────────────────────────────────────────────────────

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openDropdown();
    }
  };

  const handleListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeDropdown();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.min(focusedIndex + 1, filtered.length - 1);
      setFocusedIndex(next);
      optionRefs.current[next]?.focus();
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = Math.max(focusedIndex - 1, 0);
      setFocusedIndex(prev);
      optionRefs.current[prev]?.focus();
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      closeDropdown();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      optionRefs.current[0]?.focus();
      setFocusedIndex(0);
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const last = Math.max(filtered.length - 1, 0);
      optionRefs.current[last]?.focus();
      setFocusedIndex(last);
    }
  };

  const handleSelect = (uuid: string) => {
    onChange(uuid);
    closeDropdown();
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  const listboxId = React.useId();
  const searchId = React.useId();

  const containerClasses = [
    'cc-group-switcher',
    open ? 'is-open' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses} ref={containerRef}>
      <button
        type="button"
        role="combobox"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        className="cc-group-switcher__trigger"
        onClick={() => (open ? closeDropdown() : openDropdown())}
        onKeyDown={handleTriggerKeyDown}
        disabled={loading}
        title={currentGroup?.name ?? 'Select company group'}
      >
        <span className="cc-group-switcher__initials" aria-hidden="true">
          {loading ? '…' : currentGroup ? initials(currentGroup.name) : '?'}
        </span>
        {currentGroup && (
          <span
            className="cc-group-switcher__name"
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              minWidth: 0,
            }}
          >
            {currentGroup.name}
          </span>
        )}
      </button>

      {open && (
        <div className="cc-group-switcher__dropdown">
          {showSearch && (
            <div className="cc-group-switcher__search-wrap">
              <label htmlFor={searchId} className="sr-only">
                Search groups
              </label>
              <input
                id={searchId}
                ref={searchRef}
                type="search"
                role="searchbox"
                className="cc-group-switcher__search"
                placeholder="Search…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                aria-label="Search groups"
              />
            </div>
          )}

          <ul
            id={listboxId}
            ref={listRef}
            role="listbox"
            aria-label={ariaLabel}
            className="cc-group-switcher__list"
            onKeyDown={handleListKeyDown}
          >
            {filtered.length === 0 ? (
              <li className="cc-group-switcher__empty" role="option" aria-selected={false}>
                No groups match
              </li>
            ) : (
              filtered.map((m, i) => {
                const isSelected = m.companyGroupUuid === currentGroupUuid;
                return (
                  <li
                    key={m.companyGroupUuid}
                    ref={(el) => {
                      optionRefs.current[i] = el;
                    }}
                    role="option"
                    aria-selected={isSelected}
                    tabIndex={-1}
                    className={[
                      'cc-group-switcher__option',
                      isSelected ? 'is-selected' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => handleSelect(m.companyGroupUuid)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelect(m.companyGroupUuid);
                      }
                    }}
                  >
                    <span
                      className="cc-group-switcher__option-initials"
                      aria-hidden="true"
                    >
                      {initials(m.name)}
                    </span>
                    <span
                      className="cc-group-switcher__option-name"
                      title={m.name}
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        minWidth: 0,
                      }}
                    >
                      {m.name}
                    </span>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
