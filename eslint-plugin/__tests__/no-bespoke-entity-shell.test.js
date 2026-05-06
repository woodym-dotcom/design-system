/**
 * Tests for @ds/core/no-bespoke-entity-shell rule
 *
 * Detects ModuleShell + sibling DetailPane/FilterBar/BulkActionBar anti-pattern.
 * Since ESLint may not be a direct dependency, we verify rule structure/metadata.
 */

'use strict';

import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const plugin = require('../index.js');

describe('@ds/core/no-bespoke-entity-shell ESLint rule', () => {
  const rule = plugin.rules['no-bespoke-entity-shell'];

  it('should be exported as a rule', () => {
    expect(rule).toBeDefined();
  });

  it('should have correct metadata', () => {
    expect(rule.meta.type).toBe('suggestion');
    expect(rule.meta.docs.description).toMatch(/bespoke.*entity-shell/i);
    expect(rule.meta.docs.description).toMatch(/ListPage/i);
    expect(rule.meta.docs.url).toContain('notion.so');
  });

  it('should have create function', () => {
    expect(typeof rule.create).toBe('function');
  });

  it('should have correct message id', () => {
    expect(rule.meta.messages.noBespokeShell).toBeDefined();
    expect(rule.meta.messages.noBespokeShell).toMatch(/ModuleShell/);
    expect(rule.meta.messages.noBespokeShell).toMatch(/DetailPane/);
    expect(rule.meta.messages.noBespokeShell).toMatch(/ListPage/);
  });

  it('should be in the recommended config as warn', () => {
    const recommended = plugin.configs.recommended.rules;
    expect(recommended['@ds/core/no-bespoke-entity-shell']).toBe('warn');
  });
});
