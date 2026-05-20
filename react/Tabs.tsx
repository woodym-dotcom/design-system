/**
 * Tabs — generic tablist with roving tabindex and arrow-key navigation.
 *
 * "Activate on focus": arrow keys move focus AND fire onChange. Home/End
 * jump to the first/last enabled tab. Disabled tabs are skipped.
 *
 * Tabs is purely presentational — it does not own panel rendering. Pair it
 * with your own conditional render of the active panel keyed by `value`.
 */
import * as React from "react";

export interface TabItem<T extends string = string> {
  value: T;
  label: React.ReactNode;
  disabled?: boolean;
  /** Optional count badge rendered after the label. */
  count?: number;
}

export interface TabsProps<T extends string = string> {
  items: TabItem<T>[];
  value: T;
  onChange?: (next: T) => void;
  ariaLabel?: string;
  className?: string;
  /** Optional id, used to associate panels via aria-controls. */
  id?: string;
}

function nextEnabledIndex<T extends string>(
  items: TabItem<T>[],
  from: number,
  step: 1 | -1,
): number {
  if (items.length === 0) return -1;
  let i = from;
  for (let k = 0; k < items.length; k++) {
    i = (i + step + items.length) % items.length;
    if (!items[i].disabled) return i;
  }
  return -1;
}

export function Tabs<T extends string = string>({
  items,
  value,
  onChange,
  ariaLabel,
  className,
  id,
}: TabsProps<T>): React.ReactElement {
  const activeIndex = Math.max(
    0,
    items.findIndex((it) => it.value === value),
  );
  const buttonsRef = React.useRef<Array<HTMLButtonElement | null>>([]);

  const move = (to: number) => {
    const item = items[to];
    if (!item || item.disabled) return;
    onChange?.(item.value);
    // Focus the new tab on next frame after React commits.
    queueMicrotask(() => {
      buttonsRef.current[to]?.focus();
    });
  };

  const onKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowRight": {
        event.preventDefault();
        const i = nextEnabledIndex(items, activeIndex, 1);
        if (i >= 0) move(i);
        break;
      }
      case "ArrowLeft": {
        event.preventDefault();
        const i = nextEnabledIndex(items, activeIndex, -1);
        if (i >= 0) move(i);
        break;
      }
      case "Home": {
        event.preventDefault();
        const i = items.findIndex((it) => !it.disabled);
        if (i >= 0) move(i);
        break;
      }
      case "End": {
        event.preventDefault();
        for (let i = items.length - 1; i >= 0; i--) {
          if (!items[i].disabled) {
            move(i);
            break;
          }
        }
        break;
      }
      default:
        break;
    }
  };

  return (
    <div
      className={["cc-tabs", className].filter(Boolean).join(" ")}
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={onKey}
    >
      {items.map((it, i) => {
        const isActive = it.value === value;
        const tabId = id ? `${id}-tab-${it.value}` : undefined;
        const panelId = id ? `${id}-panel-${it.value}` : undefined;
        return (
          <button
            type="button"
            key={it.value}
            ref={(el) => {
              buttonsRef.current[i] = el;
            }}
            id={tabId}
            role="tab"
            aria-selected={isActive}
            aria-controls={panelId}
            disabled={it.disabled || undefined}
            tabIndex={isActive ? 0 : -1}
            className={[
              "cc-tabs__tab",
              isActive ? "cc-tabs__tab--active" : null,
              it.disabled ? "cc-tabs__tab--disabled" : null,
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => {
              if (it.disabled) return;
              if (!isActive) onChange?.(it.value);
            }}
          >
            <span className="cc-tabs__label">{it.label}</span>
            {typeof it.count === "number" ? (
              <span className="cc-tabs__count" aria-hidden="true">
                {it.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
