/**
 * DetailPane stories — RW lift additions.
 * Covers: subtitle, resizeKey, fullscreen (controlled + uncontrolled), all-props.
 */
import * as React from 'react';
import { DetailPane, type DetailPaneSection } from '../react/DetailPane';

export default {
  title: 'Shell Primitives/DetailPane',
  component: DetailPane,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Right-side slide-in detail pane. ' +
          'RW lift adds: subtitle (entity status below title), ' +
          'drag-resize with localStorage persistence (resizeKey), ' +
          'and fullscreen toggle (controlled or uncontrolled).',
      },
    },
  },
};

const SECTIONS: DetailPaneSection[] = [
  {
    heading: 'Overview',
    content: (
      <dl style={{ display: 'grid', gap: '8px' }}>
        <div>
          <dt style={{ fontWeight: 600, fontSize: '12px', color: 'var(--text-3)' }}>Department</dt>
          <dd style={{ margin: 0 }}>Engineering</dd>
        </div>
        <div>
          <dt style={{ fontWeight: 600, fontSize: '12px', color: 'var(--text-3)' }}>Location</dt>
          <dd style={{ margin: 0 }}>Remote</dd>
        </div>
      </dl>
    ),
  },
  {
    heading: 'Experience',
    content: <p>8 years in distributed systems.</p>,
  },
];

// ---------------------------------------------------------------------------
// Subtitle
// ---------------------------------------------------------------------------

export function WithSubtitle() {
  const [open, setOpen] = React.useState(true);
  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <button onClick={() => setOpen(true)}>Open panel</button>
      <DetailPane
        open={open}
        onClose={() => setOpen(false)}
        title="Alex Johnson"
        subtitle="Senior Engineer · Active"
        sections={SECTIONS}
      />
    </div>
  );
}
WithSubtitle.storyName = 'Subtitle';

// ---------------------------------------------------------------------------
// Resize (resizeKey)
// ---------------------------------------------------------------------------

export function WithResize() {
  const [open, setOpen] = React.useState(true);
  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <button onClick={() => setOpen(true)}>Open panel</button>
      <DetailPane
        open={open}
        onClose={() => setOpen(false)}
        title="Alex Johnson"
        subtitle="Senior Engineer · Active"
        resizeKey="story-candidate-detail"
        sections={SECTIONS}
      />
    </div>
  );
}
WithResize.storyName = 'Resize (persisted width)';

// ---------------------------------------------------------------------------
// Fullscreen — uncontrolled
// ---------------------------------------------------------------------------

export function WithFullscreenUncontrolled() {
  const [open, setOpen] = React.useState(true);
  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <button onClick={() => setOpen(true)}>Open panel</button>
      <DetailPane
        open={open}
        onClose={() => setOpen(false)}
        title="Alex Johnson"
        subtitle="Senior Engineer"
        sections={SECTIONS}
      />
    </div>
  );
}
WithFullscreenUncontrolled.storyName = 'Fullscreen (uncontrolled)';

// ---------------------------------------------------------------------------
// Fullscreen — controlled
// ---------------------------------------------------------------------------

export function WithFullscreenControlled() {
  const [open, setOpen] = React.useState(true);
  const [fullscreen, setFullscreen] = React.useState(false);
  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <button onClick={() => setOpen(true)}>Open panel</button>
      <p style={{ fontFamily: 'monospace', fontSize: '12px' }}>
        fullscreen: {String(fullscreen)}
      </p>
      <DetailPane
        open={open}
        onClose={() => setOpen(false)}
        title="Alex Johnson"
        subtitle="Senior Engineer"
        fullscreen={fullscreen}
        onFullscreenChange={setFullscreen}
        sections={SECTIONS}
      />
    </div>
  );
}
WithFullscreenControlled.storyName = 'Fullscreen (controlled)';

// ---------------------------------------------------------------------------
// All props combined
// ---------------------------------------------------------------------------

export function AllProps() {
  const [open, setOpen] = React.useState(true);
  const [fullscreen, setFullscreen] = React.useState(false);
  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <button onClick={() => setOpen(true)}>Open panel</button>
      <DetailPane
        open={open}
        onClose={() => setOpen(false)}
        title="Alex Johnson"
        subtitle="Senior Engineer · Active"
        resizeKey="story-all-props"
        fullscreen={fullscreen}
        onFullscreenChange={setFullscreen}
        sections={SECTIONS}
      />
    </div>
  );
}
AllProps.storyName = 'All new props combined';
