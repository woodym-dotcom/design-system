import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { useModuleShellRouter } from './ModuleShellProvider.js';
const DEFAULT_LABELS = {
    review: 'Review queue',
    monitoring: 'Monitoring',
    list: 'List',
    configurations: 'Configurations',
};
/**
 * Canonical tab order for the standard module shell. Tabs whose id matches
 * one of these values are sorted into this order regardless of how the
 * caller supplied them; tabs with other ids retain their relative order
 * and slot in at the position of their nearest canonical sibling.
 */
const CANONICAL_TAB_ORDER = [
    'monitoring',
    'list',
    'review-queue',
    'review',
    'configurations',
];
function sortByCanonicalOrder(tabs) {
    const rank = (id) => {
        const idx = CANONICAL_TAB_ORDER.indexOf(id);
        return idx === -1 ? CANONICAL_TAB_ORDER.length : idx;
    };
    // Stable sort by canonical rank. Configurations is the last canonical entry
    // so it always renders last when present.
    return [...tabs]
        .map((t, i) => ({ t, i }))
        .sort((a, b) => {
        const ra = rank(a.t.id);
        const rb = rank(b.t.id);
        if (ra !== rb)
            return ra - rb;
        return a.i - b.i;
    })
        .map(({ t }) => t);
}
function readTabFromUrl(paramName) {
    if (typeof window === 'undefined')
        return null;
    const params = new URLSearchParams(window.location.search);
    return params.get(paramName);
}
function writeTabToUrl(paramName, value) {
    if (typeof window === 'undefined')
        return;
    const url = new URL(window.location.href);
    url.searchParams.set(paramName, value);
    window.history.replaceState(null, '', url.toString());
}
export function ModuleShell({ title, icon, actions, tabs: tabsProp, enforceTabOrder = true, review, monitoring, list, configurations, searchParamName = 'tab', defaultTab, className, }) {
    const router = useModuleShellRouter();
    const idScope = React.useId();
    const tabRefs = React.useRef({});
    // Resolve the effective tab list: caller-controlled array takes precedence.
    const tabs = React.useMemo(() => {
        let resolved;
        if (tabsProp) {
            resolved = tabsProp
                .filter((t) => !t.hidden)
                .map((t) => ({ id: t.id, label: t.label, render: t.render }));
        }
        else {
            const ordered = [
                ['monitoring', monitoring],
                ['list', list],
                ['review', review],
                ['configurations', configurations],
            ];
            resolved = ordered
                .filter((entry) => entry[1] !== undefined)
                .map(([id, tab]) => ({ id, label: tab.label || DEFAULT_LABELS[id], render: tab.render }));
        }
        return enforceTabOrder ? sortByCanonicalOrder(resolved) : resolved;
    }, [tabsProp, review, monitoring, list, configurations, enforceTabOrder]);
    // Default-tab resolution: caller-supplied > 'list' (named-props mode) > first visible tab.
    const resolvedDefaultTab = defaultTab ??
        (tabsProp ? (tabs[0]?.id ?? 'list') : 'list');
    const fallback = tabs.find((tab) => tab.id === resolvedDefaultTab)?.id ?? tabs[0]?.id;
    const readParam = React.useCallback(() => {
        if (router)
            return router.getParam(searchParamName);
        return readTabFromUrl(searchParamName);
    }, [router, searchParamName]);
    const writeParam = React.useCallback((value) => {
        if (router)
            router.setParam(searchParamName, value);
        else
            writeTabToUrl(searchParamName, value);
    }, [router, searchParamName]);
    const [activeId, setActiveId] = React.useState(() => {
        const fromUrl = readParam();
        if (fromUrl && tabs.some((tab) => tab.id === fromUrl))
            return fromUrl;
        return fallback;
    });
    // Sync via router adapter subscribe
    React.useEffect(() => {
        if (!router)
            return;
        return router.subscribe(() => {
            const fromUrl = router.getParam(searchParamName);
            if (fromUrl && tabs.some((tab) => tab.id === fromUrl))
                setActiveId(fromUrl);
            else
                setActiveId(fallback);
        });
    }, [router, searchParamName, tabs, fallback]);
    // Fallback: popstate when no router adapter
    React.useEffect(() => {
        if (router)
            return;
        if (typeof window === 'undefined')
            return;
        const onPop = () => {
            const fromUrl = readTabFromUrl(searchParamName);
            if (fromUrl && tabs.some((tab) => tab.id === fromUrl))
                setActiveId(fromUrl);
            else
                setActiveId(fallback);
        };
        window.addEventListener('popstate', onPop);
        return () => window.removeEventListener('popstate', onPop);
    }, [router, searchParamName, tabs, fallback]);
    React.useEffect(() => {
        if (activeId && !tabs.some((tab) => tab.id === activeId))
            setActiveId(fallback);
    }, [tabs, activeId, fallback]);
    const handleSelect = (id) => {
        setActiveId(id);
        writeParam(id);
    };
    const handleSelectAndFocus = (id) => {
        handleSelect(id);
        queueMicrotask(() => tabRefs.current[id]?.focus());
    };
    const handleKeyDown = (event) => {
        if (!activeId)
            return;
        const currentIndex = tabs.findIndex((tab) => tab.id === activeId);
        if (currentIndex === -1)
            return;
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            handleSelectAndFocus(tabs[(currentIndex + 1) % tabs.length].id);
        }
        else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            handleSelectAndFocus(tabs[(currentIndex - 1 + tabs.length) % tabs.length].id);
        }
        else if (event.key === 'Home') {
            event.preventDefault();
            handleSelectAndFocus(tabs[0].id);
        }
        else if (event.key === 'End') {
            event.preventDefault();
            handleSelectAndFocus(tabs[tabs.length - 1].id);
        }
    };
    const active = tabs.find((tab) => tab.id === activeId);
    const classes = ['cc-module-shell'];
    if (className)
        classes.push(className);
    return (_jsxs("section", { className: classes.join(' '), children: [_jsxs("header", { className: "cc-module-shell__header", children: [_jsxs("div", { className: "cc-module-shell__title-group", children: [icon ? _jsx("span", { className: "cc-module-shell__icon", "aria-hidden": "true", children: icon }) : null, _jsx("h1", { className: "cc-module-shell__title", children: title })] }), actions ? _jsx("div", { className: "cc-module-shell__actions", children: actions }) : null] }), tabs.length > 1 ? (_jsx("div", { className: "cc-tabs cc-module-shell__tabs", role: "tablist", "aria-label": `${title} sections`, onKeyDown: handleKeyDown, children: tabs.map((tab) => {
                    const isActive = tab.id === activeId;
                    return (_jsx("button", { ref: (el) => {
                            tabRefs.current[tab.id] = el;
                        }, type: "button", role: "tab", id: `cc-module-shell-tab-${idScope}-${tab.id}`, "aria-selected": isActive, "aria-controls": `cc-module-shell-panel-${idScope}-${tab.id}`, tabIndex: isActive ? 0 : -1, className: `cc-tab${isActive ? ' is-active' : ''}`, onClick: () => handleSelect(tab.id), children: tab.label }, tab.id));
                }) })) : null, active ? (_jsx("div", { id: `cc-module-shell-panel-${idScope}-${active.id}`, role: "tabpanel", "aria-labelledby": `cc-module-shell-tab-${idScope}-${active.id}`, className: "cc-module-shell__panel", children: active.render() })) : null] }));
}
//# sourceMappingURL=ModuleShell.js.map