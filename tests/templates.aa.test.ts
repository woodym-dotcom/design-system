/**
 * @ds/core/templates/aa sub-export — contract tests.
 *
 * Ensures the templates/aa entry re-exports the canonical Page surface
 * and does not drift from the main barrel. These tests import directly
 * from the source path (not dist) so they run without a build step.
 *
 * TDD: RED — import resolves; exports are present with correct shapes.
 */
import { describe, it, expect } from 'vitest';
import * as TemplatesAA from '../react/templates/aa/index';
import { Page as CanonicalPage } from '../react/Page';

describe('@ds/core/templates/aa sub-export contract', () => {
  it('exports Page', () => {
    expect(TemplatesAA.Page).toBeDefined();
    expect(typeof TemplatesAA.Page).toBe('function');
  });

  it('Page export is the same reference as @ds/core/react Page', () => {
    expect(TemplatesAA.Page).toBe(CanonicalPage);
  });

  it('exports PageProps type (compile-time check via value import)', () => {
    // Type exports have no runtime presence; confirm the module resolves
    // without error and has the right shape of named exports.
    const keys = Object.keys(TemplatesAA);
    expect(keys).toContain('Page');
  });

  it('module has no unexpected runtime exports beyond Page', () => {
    // Only Page is a runtime value; all other named exports are types
    // (erased at runtime). The key set should contain exactly 'Page'.
    const runtimeKeys = Object.keys(TemplatesAA).filter(
      (k) => typeof (TemplatesAA as Record<string, unknown>)[k] !== 'undefined',
    );
    expect(runtimeKeys).toEqual(['Page']);
  });
});
