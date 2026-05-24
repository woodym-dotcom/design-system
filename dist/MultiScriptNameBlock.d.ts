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
export declare function MultiScriptNameBlock({ latinName, localName, localScript, localDir, additionalScripts, copyable, onCopy, label, className, }: MultiScriptNameBlockProps): React.ReactElement;
/** Alias — LegalNameComposer is the same component. */
export declare const LegalNameComposer: typeof MultiScriptNameBlock;
export type LegalNameComposerProps = MultiScriptNameBlockProps;
//# sourceMappingURL=MultiScriptNameBlock.d.ts.map