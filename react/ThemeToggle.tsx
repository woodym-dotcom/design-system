import * as React from "react";
import { useTheme, type Theme } from "./useTheme";

const icons: Record<Theme, React.ReactElement> = {
  light: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
      <circle cx="10" cy="10" r="3.5" />
      <path d="M10 2v1.5M10 16.5V18M2 10h1.5M16.5 10H18M4.2 4.2l1.1 1.1M14.7 14.7l1.1 1.1M4.2 15.8l1.1-1.1M14.7 5.3l1.1-1.1" />
    </svg>
  ),
  dark: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
      <path d="M16.5 11.5A7 7 0 0 1 8.5 3.5a7 7 0 1 0 8 8z" />
    </svg>
  ),
  system: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
      <rect x="2.5" y="3.5" width="15" height="11" rx="1.5" />
      <path d="M7 17h6M10 14.5V17" />
    </svg>
  ),
};

const labels: Record<Theme, string> = {
  light: "Light theme",
  dark: "Dark theme",
  system: "System theme",
};

export interface ThemeToggleProps {
  className?: string;
  includeSystem?: boolean;
}

export function ThemeToggle({ className, includeSystem = false }: ThemeToggleProps) {
  const { theme, setTheme, cycle } = useTheme();
  const classes = ["cc-btn", "cc-btn--ghost", "cc-btn--icon"];
  if (className) classes.push(className);
  return (
    <button
      type="button"
      className={classes.join(" ")}
      onClick={includeSystem ? cycle : () => setTheme(theme === "dark" ? "light" : "dark")}
      title={includeSystem ? labels[theme] + " (click to cycle)" : `${theme === "dark" ? "Dark" : "Light"} theme (click to toggle)`}
      aria-label={includeSystem ? labels[theme] : `${theme === "dark" ? "Dark" : "Light"} theme`}
    >
      {icons[theme === "system" && !includeSystem ? "light" : theme]}
    </button>
  );
}
