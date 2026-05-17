/**
 * Tooltip stories — placements and default-open (for snapshot).
 */
import * as React from 'react';
import { Tooltip } from '../react/Tooltip';

export default {
  title: 'Foundation/Tooltip',
  component: Tooltip,
};

export function Default() {
  return (
    <div style={{ padding: 64, display: 'flex', gap: 32 }}>
      <Tooltip label="Sends the form" placement="top">
        <button className="cc-btn cc-btn--primary">Submit</button>
      </Tooltip>
      <Tooltip label="Discard pending changes" placement="bottom">
        <button className="cc-btn">Cancel</button>
      </Tooltip>
    </div>
  );
}

/** Force-open so the snapshot captures the bubble. */
export function OpenForSnapshot() {
  return (
    <div style={{ padding: 64 }}>
      <span className="cc-tooltip-wrap">
        <button className="cc-btn">Hover-target</button>
        <span
          role="tooltip"
          className="cc-tooltip cc-tooltip--top is-open"
          aria-hidden="false"
        >
          Always-on tooltip for snapshot
        </span>
      </span>
    </div>
  );
}
