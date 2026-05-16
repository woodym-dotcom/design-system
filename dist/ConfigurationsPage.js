import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * ConfigurationsPage — two-column layout with section nav + content area.
 * Driven by ?section= URL search param (default: first section).
 */
import * as React from 'react';
import { useModuleShellRouter } from './ModuleShellProvider.js';
// ── Helpers ───────────────────────────────────────────────────────────────────
function readSectionFromUrl(paramName) {
    if (typeof window === 'undefined')
        return null;
    return new URLSearchParams(window.location.search).get(paramName);
}
function writeSectionToUrl(paramName, value) {
    if (typeof window === 'undefined')
        return;
    const url = new URL(window.location.href);
    url.searchParams.set(paramName, value);
    window.history.replaceState(null, '', url.toString());
}
// ── Component ─────────────────────────────────────────────────────────────────
export function ConfigurationsPage({ sections, searchParamName = 'section', className, }) {
    const router = useModuleShellRouter();
    const readParam = React.useCallback(() => {
        if (router)
            return router.getParam(searchParamName);
        return readSectionFromUrl(searchParamName);
    }, [router, searchParamName]);
    const writeParam = React.useCallback((value) => {
        if (router)
            router.setParam(searchParamName, value);
        else
            writeSectionToUrl(searchParamName, value);
    }, [router, searchParamName]);
    const fallbackId = sections[0]?.id ?? null;
    const [activeId, setActiveId] = React.useState(() => {
        const fromUrl = readParam();
        if (fromUrl && sections.some((s) => s.id === fromUrl))
            return fromUrl;
        return fallbackId;
    });
    // Sync on router subscribe
    React.useEffect(() => {
        if (!router)
            return;
        return router.subscribe(() => {
            const fromUrl = router.getParam(searchParamName);
            if (fromUrl && sections.some((s) => s.id === fromUrl))
                setActiveId(fromUrl);
            else
                setActiveId(fallbackId);
        });
    }, [router, searchParamName, sections, fallbackId]);
    // Fallback: popstate listener when no router adapter
    React.useEffect(() => {
        if (router)
            return;
        if (typeof window === 'undefined')
            return;
        const onPop = () => {
            const fromUrl = readSectionFromUrl(searchParamName);
            if (fromUrl && sections.some((s) => s.id === fromUrl))
                setActiveId(fromUrl);
            else
                setActiveId(fallbackId);
        };
        window.addEventListener('popstate', onPop);
        return () => window.removeEventListener('popstate', onPop);
    }, [router, searchParamName, sections, fallbackId]);
    const handleSelect = (id) => {
        setActiveId(id);
        writeParam(id);
    };
    const active = sections.find((s) => s.id === activeId);
    const classes = ['cc-config-page'];
    if (className)
        classes.push(className);
    return (_jsxs("div", { className: classes.join(' '), children: [_jsx("nav", { className: "cc-config-page__nav", "aria-label": "Configuration sections", children: _jsx("ul", { role: "list", className: "cc-config-page__nav-list", children: sections.map((section) => {
                        const isActive = section.id === activeId;
                        return (_jsx("li", { children: _jsx("button", { type: "button", className: `cc-config-page__nav-item${isActive ? ' is-active' : ''}`, "aria-current": isActive ? 'page' : undefined, onClick: () => handleSelect(section.id), children: section.label }) }, section.id));
                    }) }) }), _jsx("div", { className: "cc-config-page__content", children: active ? active.render() : null })] }));
}
//# sourceMappingURL=ConfigurationsPage.js.map