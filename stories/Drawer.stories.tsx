/**
 * Drawer stories — sides, sizes, with footer.
 */
import * as React from 'react';
import { Drawer } from '../react/Drawer';

export default {
  title: 'Foundation/Drawer',
  component: Drawer,
  parameters: { layout: 'fullscreen' },
};

function Stage({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: 24, minHeight: 480 }}>{children}</div>;
}

export function Default() {
  return (
    <Stage>
      <Drawer
        open
        onClose={() => {}}
        title="Filters"
        subtitle="Refine the list below"
        footer={
          <>
            <button className="cc-btn cc-btn--ghost">Reset</button>
            <button className="cc-btn cc-btn--primary">Apply</button>
          </>
        }
      >
        <div style={{ display: 'grid', gap: 12 }}>
          <label><input type="checkbox" /> Active only</label>
          <label><input type="checkbox" /> Has open alerts</label>
          <label><input type="checkbox" /> Owned by my team</label>
        </div>
      </Drawer>
    </Stage>
  );
}

export function LeftSide() {
  return (
    <Stage>
      <Drawer open onClose={() => {}} title="Nav" side="left" size="sm">
        <p>Side-anchor drawer for module navigation.</p>
      </Drawer>
    </Stage>
  );
}
