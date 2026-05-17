/**
 * Modal stories — sizes, footer, description.
 */
import * as React from 'react';
import { Modal } from '../react/Modal';

export default {
  title: 'Foundation/Modal',
  component: Modal,
  parameters: { layout: 'fullscreen' },
};

function Stage({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: 24, minHeight: 360 }}>{children}</div>;
}

export function Default() {
  return (
    <Stage>
      <Modal
        open
        onClose={() => {}}
        title="Confirm publish"
        description="This will make the regulation visible to all tenants."
        footer={
          <>
            <button className="cc-btn cc-btn--ghost">Cancel</button>
            <button className="cc-btn cc-btn--primary">Publish</button>
          </>
        }
      >
        <p>
          Once published, the regulation cannot be unpublished — only superseded
          by a new version.
        </p>
      </Modal>
    </Stage>
  );
}

export function Sizes() {
  return (
    <Stage>
      <Modal open onClose={() => {}} title="Large modal" size="lg">
        <p>A wider modal for richer review surfaces.</p>
      </Modal>
    </Stage>
  );
}
