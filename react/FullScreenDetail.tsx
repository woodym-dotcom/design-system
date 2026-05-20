/**
 * FullScreenDetail — sticky-header + scrollable-body layout for full-screen
 * detail surfaces (drilldown expansion, modal-equivalent pages).
 *
 * Composes Breadcrumbs at the top of the sticky header, the title +
 * eyebrow + actions row, optional sticky tabs strip, the scrollable body,
 * and an optional sticky bottom bar.
 */
import * as React from "react";
import { Breadcrumbs, type BreadcrumbItem } from "./Breadcrumbs";
import { Tabs, type TabItem } from "./Tabs";

export interface FullScreenDetailProps<T extends string = string> {
  breadcrumbs: BreadcrumbItem[];
  title: React.ReactNode;
  eyebrow?: React.ReactNode;
  actions?: React.ReactNode;
  headerMeta?: React.ReactNode;
  tabs?: {
    items: TabItem<T>[];
    value: T;
    onChange?: (next: T) => void;
  };
  children: React.ReactNode;
  bottomBar?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export function FullScreenDetail<T extends string = string>({
  breadcrumbs,
  title,
  eyebrow,
  actions,
  headerMeta,
  tabs,
  children,
  bottomBar,
  onClose,
  className,
}: FullScreenDetailProps<T>): React.ReactElement {
  return (
    <div className={["cc-fsd", className].filter(Boolean).join(" ")}>
      <header className="cc-fsd__header">
        <div className="cc-fsd__crumbs-row">
          <Breadcrumbs items={breadcrumbs} />
          {onClose ? (
            <button
              type="button"
              className="cc-fsd__close"
              aria-label="Close"
              onClick={onClose}
            >
              ×
            </button>
          ) : null}
        </div>
        {eyebrow ? <div className="cc-fsd__eyebrow">{eyebrow}</div> : null}
        <div className="cc-fsd__title-row">
          <h1 className="cc-fsd__title">{title}</h1>
          {actions ? <div className="cc-fsd__actions">{actions}</div> : null}
        </div>
        {headerMeta ? <div className="cc-fsd__meta">{headerMeta}</div> : null}
        {tabs ? (
          <div className="cc-fsd__tabs">
            <Tabs
              items={tabs.items}
              value={tabs.value}
              onChange={tabs.onChange}
            />
          </div>
        ) : null}
      </header>
      <div className="cc-fsd__body">{children}</div>
      {bottomBar ? (
        <div className="cc-fsd__bottom-bar">{bottomBar}</div>
      ) : null}
    </div>
  );
}
