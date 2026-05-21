/**
 * Disclosure stories — single Disclosure + Accordion (single + multiple) modes.
 */
import * as React from 'react';
import { Disclosure, Accordion } from '../react/Disclosure';

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

const ACCORDION_ITEMS = [
  {
    id: 'what',
    summary: 'What is a design system?',
    content: <Content text="A design system is a collection of reusable components, patterns, and guidelines that help teams build consistent user interfaces." />,
  },
  {
    id: 'why',
    summary: 'Why use tokens?',
    content: <Content text="Design tokens abstract visual decisions (colors, spacing, typography) into named variables so they can be maintained centrally and consumed consistently." />,
  },
  {
    id: 'how',
    summary: 'How are components structured?',
    content: <Content text="Each component is a focused React primitive that consumes tokens directly via CSS custom properties. No hardcoded values are allowed." />,
  },
  {
    id: 'when',
    summary: 'When should I use Accordion vs Disclosure?',
    content: <Content text="Use Disclosure for standalone collapsible sections. Use Accordion to group related disclosures with coordinated open/close behavior." />,
  },
];

export function AccordionSingleMode() {
  return (
    <div style={{ padding: 24, maxWidth: 480 }}>
      <p style={{ marginBottom: 12, fontSize: 'var(--text-xs)', color: 'var(--text-3)' }}>
        type="single" — at most one item open at a time
      </p>
      <Accordion type="single" items={ACCORDION_ITEMS} />
    </div>
  );
}

export function AccordionMultipleMode() {
  return (
    <div style={{ padding: 24, maxWidth: 480 }}>
      <p style={{ marginBottom: 12, fontSize: 'var(--text-xs)', color: 'var(--text-3)' }}>
        type="multiple" — any number of items can be open
      </p>
      <Accordion type="multiple" items={ACCORDION_ITEMS} defaultValue={['what', 'why']} />
    </div>
  );
}

export function AccordionDefaultValue() {
  return (
    <div style={{ padding: 24, maxWidth: 480 }}>
      <p style={{ marginBottom: 12, fontSize: 'var(--text-xs)', color: 'var(--text-3)' }}>
        defaultValue="why" — pre-opened
      </p>
      <Accordion type="single" items={ACCORDION_ITEMS} defaultValue="why" />
    </div>
  );
}

export function AccordionWithPlusMinus() {
  return (
    <div style={{ padding: 24, maxWidth: 480 }}>
      <Accordion type="single" items={ACCORDION_ITEMS} icon="plus-minus" />
    </div>
  );
}

export function ControlledAccordion() {
  const [value, setValue] = React.useState<string>('what');
  return (
    <div style={{ padding: 24, maxWidth: 480 }}>
      <p style={{ marginBottom: 12, fontSize: 'var(--text-xs)', color: 'var(--text-3)' }}>
        Controlled — current: {value || '(none)'}
      </p>
      <Accordion
        type="single"
        items={ACCORDION_ITEMS}
        value={value}
        onValueChange={(v) => setValue(v as string)}
      />
    </div>
  );
}
