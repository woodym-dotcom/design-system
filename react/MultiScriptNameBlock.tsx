/**
 * MultiScriptNameBlock — multi-script legal name display.
 *
 * Renders a name in multiple scripts (Latin + local script) with a copy
 * affordance. Used for KYC/identity workflows where legal names appear
 * in the entity's native script alongside a transliterated Latin form.
 *
 * Usage:
 *   <MultiScriptNameBlock
 *     latinName="Tanaka Taro"
 *     localName="田中太郎"
 *     localScript="Japanese"
 *   />
 */
import * as React from "react";

export interface NameScript {
  /** The name text in this script. */
  value: string;
  /** Script/language label, e.g. "Japanese", "Arabic", "Cyrillic". */
  script: string;
  /** Writing direction hint. Default: "ltr". */
  dir?: "ltr" | "rtl";
}

export interface MultiScriptNameBlockProps {
  /** Latin-script (transliterated) name. */
  latinName: string;
  /** Local-script name. */
  localName: string;
  /** Label for the local script, e.g. "Japanese", "Arabic". */
  localScript: string;
  /** Direction for the local script. Default: "ltr". */
  localDir?: "ltr" | "rtl";
  /** Additional script variants beyond Latin + local. */
  additionalScripts?: NameScript[];
  /** Whether to show copy buttons. Default: true. */
  copyable?: boolean;
  /** Called when a name variant is copied. */
  onCopy?: (value: string, script: string) => void;
  /** Label displayed above the block. */
  label?: string;
  className?: string;
}

function CopyButton({
  value,
  script,
  onCopy,
}: {
  value: string;
  script: string;
  onCopy?: (value: string, script: string) => void;
}): React.ReactElement {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(value).then(() => {
        setCopied(true);
        onCopy?.(value, script);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <button
      type="button"
      className="cc-multi-script-name__copy"
      onClick={handleCopy}
      aria-label={`Copy ${script} name`}
      title={copied ? "Copied!" : `Copy ${script} name`}
      style={{
        flexShrink: 0,
        background: "none",
        border: "1px solid var(--border-1)",
        borderRadius: "var(--radius-1, 4px)",
        padding: "var(--space-1, 0.25rem) var(--space-2, 0.375rem)",
        cursor: "pointer",
        fontSize: "var(--text-xs, 0.75rem)",
        color: copied ? "var(--success-text)" : "var(--text-3)",
      }}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function NameRow({
  value,
  script,
  dir,
  copyable,
  onCopy,
}: {
  value: string;
  script: string;
  dir?: "ltr" | "rtl";
  copyable: boolean;
  onCopy?: (value: string, script: string) => void;
}): React.ReactElement {
  return (
    <div
      className="cc-multi-script-name__row"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-3, 0.5rem)",
        padding: "var(--space-2, 0.375rem) 0",
      }}
    >
      <span
        className="cc-multi-script-name__script-label"
        style={{
          flexShrink: 0,
          width: "5rem",
          fontSize: "var(--text-xs, 0.75rem)",
          color: "var(--text-3)",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {script}
      </span>
      <span
        className="cc-multi-script-name__value"
        dir={dir}
        style={{
          flex: 1,
          fontSize: "var(--text-base, 1rem)",
          fontWeight: 500,
        }}
      >
        {value}
      </span>
      {copyable && <CopyButton value={value} script={script} onCopy={onCopy} />}
    </div>
  );
}

export function MultiScriptNameBlock({
  latinName,
  localName,
  localScript,
  localDir = "ltr",
  additionalScripts = [],
  copyable = true,
  onCopy,
  label,
  className,
}: MultiScriptNameBlockProps): React.ReactElement {
  const classes = ["cc-multi-script-name", className]
    .filter(Boolean)
    .join(" ");

  const allScripts: NameScript[] = [
    { value: latinName, script: "Latin", dir: "ltr" },
    { value: localName, script: localScript, dir: localDir },
    ...additionalScripts,
  ];

  return (
    <div
      className={classes}
      style={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid var(--border-1)",
        borderRadius: "var(--radius-2, 8px)",
        padding: "var(--space-3, 0.5rem) var(--space-4, 0.75rem)",
        background: "var(--surface-1)",
      }}
    >
      {label && (
        <span
          className="cc-multi-script-name__label"
          style={{
            fontSize: "var(--text-sm, 0.875rem)",
            fontWeight: 600,
            color: "var(--text-2)",
            marginBottom: "var(--space-2, 0.375rem)",
          }}
        >
          {label}
        </span>
      )}
      {allScripts.map((ns) => (
        <NameRow
          key={ns.script}
          value={ns.value}
          script={ns.script}
          dir={ns.dir}
          copyable={copyable}
          onCopy={onCopy}
        />
      ))}
    </div>
  );
}

/** Alias — LegalNameComposer is the same component. */
export const LegalNameComposer = MultiScriptNameBlock;
export type LegalNameComposerProps = MultiScriptNameBlockProps;
