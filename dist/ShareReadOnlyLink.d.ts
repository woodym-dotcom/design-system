export interface ShareReadOnlyLinkProps {
    /** URL to share. */
    url: string;
    /** Visible label for the share button. Default 'Share'. */
    label?: string;
    /** Optional copy displayed in the popover (e.g. "Read-only — view-only access"). */
    helpText?: string;
    /** Variant — 'button' renders a button, 'inline' renders as a row with the URL visible. */
    variant?: 'button' | 'inline';
    /** Called after the URL is copied (useful for analytics). */
    onCopied?: () => void;
    /** Stable aria-label override for the share button/link. */
    'aria-label'?: string;
    /** Stable data-testid attribute for test selection. */
    'data-testid'?: string;
    className?: string;
}
/**
 * Renders a copy-to-clipboard share affordance for a read-only deep link.
 * Pairs with `useSavedViews().shareableUrl(state)` to produce a stable
 * URL that other users can open to land on the same surface state.
 *
 * The DS makes no assumptions about access control — the host app is
 * responsible for ensuring the URL routes to a view that enforces the
 * appropriate permissions for the recipient.
 */
export declare function ShareReadOnlyLink({ url, label, helpText, variant, onCopied, className, ...rest }: ShareReadOnlyLinkProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ShareReadOnlyLink.d.ts.map