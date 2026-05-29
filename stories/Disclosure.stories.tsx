/**
 * Disclosure stories — single Disclosure variants + accordion composition.
 *
 * Accordion is no longer a distinct primitive — compose multiple <Disclosure>
 * instances directly and lift `open`/`onOpenChange` for coordinated behaviour.
 */
import * as React from 'react';
import { Disclosure } from '../react/Disclosure';

export default {
  title: 'Layout/Disclosure',
  component: Disclosure,
};

const Content = ({ text }: { text: string }) => (
  <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-2)', lineHeight: 1.5 }}>
    {text}
  </p>
);

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.';

export function UncontrolledDisclosure() {
  return (
    <div style={{ padding: 24, maxWidth: 480 }}>
      <Disclosure summary="What is this?">
        <Content text={LOREM} />
      </Disclosure>
    </div>
  );
}

export function DefaultOpen() {
  return (
    <div style={{ padding: 24, maxWidth: 480 }}>
      <Disclosure summary="Open by default" defaultOpen>
        <Content text={LOREM} />
      </Disclosure>
    </div>
  );
}

export function ControlledDisclosure() {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ padding: 24, maxWidth: 480 }}>
      <p style={{ marginBottom: 12, fontSize: 'var(--text-sm)', color: 'var(--text-3)' }}>
        State: {open ? 'open' : 'closed'}
      </p>
      <Disclosure summary="Controlled panel" open={open} onOpenChange={setOpen}>
        <Content text={LOREM} />
      </Disclosure>
    </div>
  );
}

export function IconVariants() {
  const icons = ['chevron', 'plus-minus', 'none'] as const;
  return (
    <div style={{ padding: 24, maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 0 }}>
      {icons.map((icon) => (
        <Disclosure key={icon} summary={`icon="${icon}"`} icon={icon} open={false} onOpenChange={() => {}}>
          <Content text="Hidden content" />
        </Disclosure>
      ))}
    </div>
  );
}

// ── Accordion composition ───────────────────────────────────────────────────

const ITEMS = [
  {
    id: 'what',
    summary: 'What is a design system?',
    content: 'A design system is a collection of reusable components, patterns, and guidelines that help teams build consistent user interfaces.',
  },
  {
    id: 'why',
    summary: 'Why use tokens?',
    content: 'Design tokens abstract visual decisions (colors, spacing, typography) into named variables so they can be maintained centrally and consumed consistently.',
  },
  {
    id: 'how',
    summary: 'How are components structured?',
    content: 'Each component is a focused React primitive that consumes tokens directly via CSS custom properties. No hardcoded values are allowed.',
  },
] as const;

export function AccordionSingleMode() {
  const [openId, setOpenId] = React.useState<string | null>(null);
  return (
    <div style={{ padding: 24, maxWidth: 480 }}>
      <p style={{ marginBottom: 12, fontSize: 'var(--text-xs)', color: 'var(--text-3)' }}>
        Compose Disclosures; lift `open` to parent — at most one item open.
      </p>
      {ITEMS.map((item) => (
        <Disclosure
          key={item.id}
          summary={item.summary}
          open={openId === item.id}
          onOpenChange={(o) => setOpenId(o ? item.id : null)}
        >
          <Content text={item.content} />
        </Disclosure>
      ))}
    </div>
  );
}

export function AccordionMultipleMode() {
  return (
    <div style={{ padding: 24, maxWidth: 480 }}>
      <p style={{ marginBottom: 12, fontSize: 'var(--text-xs)', color: 'var(--text-3)' }}>
        Independent Disclosures — any number can be open at once.
      </p>
      {ITEMS.map((item) => (
        <Disclosure key={item.id} summary={item.summary} defaultOpen={item.id === 'what' || item.id === 'why'}>
          <Content text={item.content} />
        </Disclosure>
      ))}
    </div>
  );
}
