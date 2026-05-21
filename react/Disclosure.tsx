/**
 * Disclosure — collapsible summary/content panel.
 * Accordion — composes Disclosures with single or multiple open semantics.
 *
 * Uses native <details>/<summary> for uncontrolled mode.
 * Controlled mode manages open state externally.
 */
import * as React from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

export type DisclosureIcon = 'chevron' | 'plus-minus' | 'none';

export interface DisclosureProps {
  summary: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  icon?: DisclosureIcon;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export interface AccordionItem {
  id: string;
  summary: React.ReactNode;
  content: React.ReactNode;
}

export interface AccordionProps {
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (v: string | string[]) => void;
  items: AccordionItem[];
  icon?: DisclosureIcon;
  className?: string;
  style?: React.CSSProperties;
}

// ── Icon helpers ──────────────────────────────────────────────────────────────

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      style={{
        flexShrink: 0,
        transition: 'transform 0.15s ease',
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        color: 'var(--text-3)',
      }}
    >
      <path
        d="M2.5 5L7 9.5L11.5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusMinusIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      style={{ flexShrink: 0, color: 'var(--text-3)' }}
    >
      {open ? (
        <path
          d="M2.5 7h9"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ) : (
        <>
          <path
            d="M7 2.5v9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M2.5 7h9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}

function DisclosureIconNode({ icon, open }: { icon: DisclosureIcon; open: boolean }) {
  if (icon === 'none') return null;
  if (icon === 'plus-minus') return <PlusMinusIcon open={open} />;
  return <ChevronIcon open={open} />;
}

// ── Disclosure ────────────────────────────────────────────────────────────────

export function Disclosure({
  summary,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  icon = 'chevron',
  className,
  style,
  children,
}: DisclosureProps): React.ReactElement {
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = isControlled ? controlledOpen : internalOpen;

  const handleToggle = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const summaryStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    padding: 'var(--space-3) var(--space-4)',
    cursor: 'pointer',
    userSelect: 'none',
    listStyle: 'none',
    color: 'var(--text-1)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
  };

  const contentStyle: React.CSSProperties = {
    padding: 'var(--space-3) var(--space-4) var(--space-4)',
    fontSize: 'var(--text-sm)',
    color: 'var(--text-2)',
  };

  if (!isControlled && !onOpenChange) {
    // Native details/summary — fully uncontrolled
    return (
      <details
        className={className}
        style={{
          borderBottom: '1px solid var(--border-1)',
          ...style,
        }}
        open={defaultOpen}
      >
        <summary style={summaryStyle}>
          <DisclosureIconNode icon={icon} open={open} />
          {summary}
        </summary>
        <div style={contentStyle}>{children}</div>
      </details>
    );
  }

  // Controlled / hybrid
  return (
    <div
      className={className}
      style={{
        borderBottom: '1px solid var(--border-1)',
        ...style,
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        style={{
          ...summaryStyle,
          background: 'none',
          border: 'none',
          width: '100%',
          textAlign: 'left',
        }}
        onClick={() => handleToggle(!open)}
      >
        <DisclosureIconNode icon={icon} open={open} />
        {summary}
      </button>
      {open && <div style={contentStyle}>{children}</div>}
    </div>
  );
}

// ── Accordion ─────────────────────────────────────────────────────────────────

export function Accordion({
  type = 'single',
  defaultValue,
  value: controlledValue,
  onValueChange,
  items,
  icon = 'chevron',
  className,
  style,
}: AccordionProps): React.ReactElement {
  const isControlled = controlledValue !== undefined;

  const normalise = (v: string | string[] | undefined): string[] => {
    if (v === undefined) return [];
    return Array.isArray(v) ? v : [v];
  };

  const [internalOpen, setInternalOpen] = React.useState<string[]>(
    normalise(defaultValue),
  );
  const openIds = isControlled ? normalise(controlledValue) : internalOpen;

  const toggle = (id: string) => {
    let next: string[];
    if (type === 'single') {
      next = openIds.includes(id) ? [] : [id];
    } else {
      next = openIds.includes(id)
        ? openIds.filter((x) => x !== id)
        : [...openIds, id];
    }
    if (!isControlled) setInternalOpen(next);
    if (onValueChange) {
      onValueChange(type === 'single' ? (next[0] ?? '') : next);
    }
  };

  return (
    <div
      className={className}
      style={{
        border: '1px solid var(--border-1)',
        borderRadius: '6px',
        overflow: 'hidden',
        ...style,
      }}
    >
      {items.map((item) => (
        <Disclosure
          key={item.id}
          summary={item.summary}
          open={openIds.includes(item.id)}
          onOpenChange={() => toggle(item.id)}
          icon={icon}
          style={{ borderBottom: 'none' }}
        >
          {item.content}
        </Disclosure>
      ))}
    </div>
  );
}
