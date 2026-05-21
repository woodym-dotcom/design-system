/**
 * Overlay stories — one canonical baseline per placement.
 *
 * Snapshot story ids:
 *   primitives-overlay--modal
 *   primitives-overlay--drawer-right
 *   primitives-overlay--drawer-left
 *   primitives-overlay--detail-right
 *   primitives-overlay--drilldown
 *   primitives-overlay--fullscreen
 */
import * as React from "react";
import { Overlay } from "../react/Overlay";

export default {
  title: "Primitives/Overlay",
  component: Overlay,
  parameters: { layout: "fullscreen" },
};

function Stage({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: 24, minHeight: 480 }}>{children}</div>;
}

const SECTIONS = [
  { heading: "Summary", content: <p>A concise summary of the record.</p> },
  { heading: "Details", content: <p>Additional metadata appears here.</p> },
];

export const Modal = () => (
  <Stage>
    <Overlay
      placement="modal"
      open
      onOpenChange={() => {}}
      title="Confirm publish"
      subtitle="This will make the regulation visible to all tenants."
      headerActions={<button className="cc-btn cc-btn--ghost">Edit</button>}
      sections={SECTIONS}
    />
  </Stage>
);

export const DrawerRight = () => (
  <Stage>
    <Overlay
      placement="drawer-right"
      open
      onOpenChange={() => {}}
      title="Filters"
      subtitle="Refine the list view"
      sections={SECTIONS}
    />
  </Stage>
);
DrawerRight.storyName = "drawer-right";

export const DrawerLeft = () => (
  <Stage>
    <Overlay
      placement="drawer-left"
      open
      onOpenChange={() => {}}
      title="Navigation"
      sections={SECTIONS}
    />
  </Stage>
);
DrawerLeft.storyName = "drawer-left";

export const DetailRight = () => (
  <Stage>
    <Overlay
      placement="detail-right"
      open
      onOpenChange={() => {}}
      title="Regulation REG-001"
      subtitle="Draft"
      expandable
      sections={SECTIONS}
    />
  </Stage>
);
DetailRight.storyName = "detail-right";

export const Drilldown = () => (
  <Stage>
    <Overlay
      placement="drilldown"
      open
      onOpenChange={() => {}}
      ariaLabel="Regulations drilldown"
      title="REG-001"
      listSlot={
        <ul style={{ margin: 0, padding: 12 }}>
          <li>REG-001</li>
          <li>REG-002</li>
          <li>REG-003</li>
        </ul>
      }
      sections={SECTIONS}
    />
  </Stage>
);

export const Fullscreen = () => (
  <Stage>
    <Overlay
      placement="fullscreen"
      open
      onOpenChange={() => {}}
      title="Regulation REG-001 — full screen"
      subtitle="Draft"
      sections={SECTIONS}
    />
  </Stage>
);
