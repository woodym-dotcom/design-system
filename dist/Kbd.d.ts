export interface KbdProps {
    /** Key or keys to render. Strings are joined with " + ". */
    keys: string | string[];
    /** Visual size. */
    size?: 'sm' | 'md';
    /** Optional aria-label override. Defaults to "Keyboard shortcut: …". */
    label?: string;
    className?: string;
}
/**
 * Renders one or more keyboard keys as compact rounded tokens. Use for
 * shortcut hints in menus, tooltips, and command palettes.
 */
export declare function Kbd({ keys, size, label, className }: KbdProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=Kbd.d.ts.map