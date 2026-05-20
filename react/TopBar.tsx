/**
 * TopBar — single-row app chrome (brand left, controls right).
 *
 * Composes the existing ThemeToggle, a Cmd+K trigger Button, an optional
 * extras slot, and an identity button rendering initials in a circle.
 * Brand is a free-form ReactNode prop — no hardcoded app name.
 */
import * as React from "react";
import { Button } from "./Button";
import { ThemeToggle } from "./ThemeToggle";

export interface TopBarProps {
  /** Brand slot (logo + product name). */
  brand?: React.ReactNode;
  /** Identity initials shown in the right-hand identity button. */
  identity?: string;
  /** Show the Cmd+K trigger. Default true. */
  showCmdK?: boolean;
  /** Click handler for the Cmd+K trigger. */
  onCmdK?: () => void;
  /** Click handler for the identity button. */
  onIdentityClick?: () => void;
  /** Free-form slot rendered between extras and the identity button. */
  extras?: React.ReactNode;
  className?: string;
}

export function TopBar({
  brand,
  identity,
  showCmdK = true,
  onCmdK,
  onIdentityClick,
  extras,
  className,
}: TopBarProps): React.ReactElement {
  return (
    <header
      role="banner"
      className={["cc-topbar", className].filter(Boolean).join(" ")}
    >
      <div className="cc-topbar__brand">{brand}</div>
      <div className="cc-topbar__controls">
        {showCmdK ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCmdK}
            aria-label="Open command palette"
            className="cc-topbar__cmdk"
          >
            <span aria-hidden="true">⌘K</span>
            <span className="cc-topbar__cmdk-label">Search</span>
          </Button>
        ) : null}
        <ThemeToggle />
        {extras}
        {identity ? (
          <button
            type="button"
            className="cc-topbar__identity"
            onClick={onIdentityClick}
            aria-label="Open account menu"
          >
            <span aria-hidden="true">{identity.slice(0, 2).toUpperCase()}</span>
          </button>
        ) : null}
      </div>
    </header>
  );
}
