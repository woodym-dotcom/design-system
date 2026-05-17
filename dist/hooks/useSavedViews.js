import * as React from 'react';
const STORAGE_PREFIX = 'ds-saved-views.';
function slugify(name) {
    return name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || `view-${Date.now()}`;
}
/**
 * Saved views + shareable deep-link helper. Persists per-scope view
 * presets and exposes `shareableUrl(state)` to build URLs that other
 * users can open to land on the same filter/sort state.
 */
export function useSavedViews({ scope, serialise, deserialise, storage, }) {
    const ser = serialise ?? ((s) => JSON.stringify(s));
    const deser = deserialise ?? ((raw) => JSON.parse(raw));
    const store = storage ?? (typeof window !== 'undefined' ? window.localStorage : undefined);
    const storageKey = `${STORAGE_PREFIX}${scope}`;
    const [views, setViews] = React.useState(() => {
        if (!store)
            return [];
        try {
            const raw = store.getItem(storageKey);
            if (!raw)
                return [];
            const parsed = JSON.parse(raw);
            return parsed.map((v) => ({ ...v, state: deser(v.state) }));
        }
        catch {
            return [];
        }
    });
    const writeStorage = React.useCallback((next) => {
        if (!store)
            return;
        try {
            const serialised = next.map((v) => ({ ...v, state: ser(v.state) }));
            store.setItem(storageKey, JSON.stringify(serialised));
        }
        catch {
            /* private mode or quota — best-effort. */
        }
    }, [store, storageKey, ser]);
    const save = React.useCallback((name, state, opts) => {
        const id = slugify(name);
        const entry = {
            id,
            name,
            state,
            pinned: opts?.pinned,
            updatedAt: new Date().toISOString(),
        };
        setViews((prev) => {
            const next = [...prev.filter((v) => v.id !== id), entry];
            writeStorage(next);
            return next;
        });
        return entry;
    }, [writeStorage]);
    const remove = React.useCallback((id) => {
        setViews((prev) => {
            const next = prev.filter((v) => v.id !== id);
            writeStorage(next);
            return next;
        });
    }, [writeStorage]);
    const rename = React.useCallback((id, name) => {
        setViews((prev) => {
            const next = prev.map((v) => v.id === id
                ? { ...v, name, updatedAt: new Date().toISOString() }
                : v);
            writeStorage(next);
            return next;
        });
    }, [writeStorage]);
    const togglePinned = React.useCallback((id) => {
        setViews((prev) => {
            const next = prev.map((v) => v.id === id ? { ...v, pinned: !v.pinned } : v);
            writeStorage(next);
            return next;
        });
    }, [writeStorage]);
    const shareableUrl = React.useCallback((state, baseUrl) => {
        const base = baseUrl ?? (typeof window !== 'undefined'
            ? `${window.location.origin}${window.location.pathname}`
            : '');
        const serialised = ser(state);
        // If serialised already starts with "?", treat as URL search.
        if (serialised.startsWith('?'))
            return `${base}${serialised}`;
        // Otherwise embed under a single ?view= search param so the link is
        // self-contained without leaking implementation shape.
        return `${base}?view=${encodeURIComponent(serialised)}`;
    }, [ser]);
    const sorted = React.useMemo(() => [...views].sort((a, b) => {
        if (!!a.pinned !== !!b.pinned)
            return a.pinned ? -1 : 1;
        return b.updatedAt.localeCompare(a.updatedAt);
    }), [views]);
    return { views: sorted, save, remove, rename, togglePinned, shareableUrl };
}
//# sourceMappingURL=useSavedViews.js.map