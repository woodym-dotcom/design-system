import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { useToast } from './Toast';
/**
 * Renders a copy-to-clipboard share affordance for a read-only deep link.
 * Pairs with `useSavedViews().shareableUrl(state)` to produce a stable
 * URL that other users can open to land on the same surface state.
 *
 * The DS makes no assumptions about access control — the host app is
 * responsible for ensuring the URL routes to a view that enforces the
 * appropriate permissions for the recipient.
 */
export function ShareReadOnlyLink({ url, label = 'Share', helpText, variant = 'button', onCopied, className, }) {
    const { toast } = useToast();
    const [copied, setCopied] = React.useState(false);
    const copy = React.useCallback(async () => {
        try {
            if (typeof navigator !== 'undefined' && navigator.clipboard) {
                await navigator.clipboard.writeText(url);
            }
            else if (typeof document !== 'undefined') {
                // Fallback: synthesize a temporary textarea + execCommand.
                const ta = document.createElement('textarea');
                ta.value = url;
                ta.setAttribute('readonly', '');
                ta.style.position = 'absolute';
                ta.style.left = '-9999px';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
            }
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
            toast({
                message: 'Link copied. Anyone with the URL can open this view.',
                tone: 'success',
                durationMs: 3500,
            });
            onCopied?.();
        }
        catch {
            toast({
                message: 'Couldn’t copy automatically. Select the URL and copy manually.',
                tone: 'error',
            });
        }
    }, [url, toast, onCopied]);
    if (variant === 'inline') {
        return (_jsxs("div", { className: ['cc-share-link', 'cc-share-link--inline', className].filter(Boolean).join(' '), children: [_jsx("input", { type: "text", readOnly: true, value: url, className: "cc-share-link__url", "aria-label": "Shareable URL", onClick: (e) => e.target.select() }), _jsx("button", { type: "button", className: "cc-btn cc-btn--primary", onClick: copy, children: copied ? 'Copied' : 'Copy' }), helpText && _jsx("p", { className: "cc-share-link__help", children: helpText })] }));
    }
    return (_jsx("button", { type: "button", className: ['cc-btn', 'cc-btn--ghost', 'cc-share-link__btn', className].filter(Boolean).join(' '), onClick: copy, "aria-label": `Copy shareable link: ${url}`, children: copied ? 'Copied' : label }));
}
//# sourceMappingURL=ShareReadOnlyLink.js.map