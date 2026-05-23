/**
 * Tests for @ds/core/no-locale-string-in-features rule.
 *
 * Bans direct `Date.prototype.toLocaleString` / `toLocaleDateString` /
 * `toLocaleTimeString` calls in consumer feature code where Fmt.* primitives
 * should be used. Allows the calls inside the design-system itself
 * (Fmt.tsx implements them) and inside test files (fixture freedom).
 *
 * Verifies rule structure/metadata; ESLint is not a direct dependency.
 */

'use strict';

import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const plugin = require('../index.js');

describe('@ds/core/no-locale-string-in-features ESLint rule', () => {
  const rule = plugin.rules['no-locale-string-in-features'];

  it('should be exported as a rule', () => {
    expect(rule).toBeDefined();
  });

  it('should have correct metadata', () => {
    expect(rule.meta.type).toBe('problem');
    expect(rule.meta.docs.description).toMatch(/toLocaleString/);
    expect(rule.meta.docs.description).toMatch(/Fmt/);
    expect(rule.meta.docs.url).toContain('notion.so');
  });

  it('should have create function', () => {
    expect(typeof rule.create).toBe('function');
  });

  it('should declare message ids for each banned API', () => {
    expect(rule.meta.messages.noToLocaleString).toMatch(/Fmt\.DateTime/);
    expect(rule.meta.messages.noToLocaleDateString).toMatch(/Fmt\.Date/);
    expect(rule.meta.messages.noToLocaleTimeString).toMatch(/Fmt\.DateTime/);
  });

  it('should be in the recommended config as error', () => {
    const recommended = plugin.configs.recommended.rules;
    expect(recommended['@ds/core/no-locale-string-in-features']).toBe('error');
  });

  it('create() returns AST visitor with CallExpression handler', () => {
    const context = {
      getFilename: () => '/repo/frontend/src/features/foo/Bar.tsx',
      report: () => {},
    };
    const visitor = rule.create(context);
    expect(typeof visitor.CallExpression).toBe('function');
  });

  it('reports toLocaleString call on a Date member expression inside features/', () => {
    let reported = null;
    const context = {
      getFilename: () => '/repo/frontend/src/features/timestamps/Surface.tsx',
      report: (descriptor) => {
        reported = descriptor;
      },
    };
    const visitor = rule.create(context);
    const node = {
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        object: { type: 'NewExpression' }, // new Date().toLocaleString()
        property: { type: 'Identifier', name: 'toLocaleString' },
        computed: false,
      },
      arguments: [],
    };
    visitor.CallExpression(node);
    expect(reported).not.toBeNull();
    expect(reported.messageId).toBe('noToLocaleString');
  });

  it('does NOT report when called outside features/', () => {
    let reported = null;
    const context = {
      getFilename: () => '/repo/design-system/react/fmt/Fmt.tsx',
      report: (descriptor) => {
        reported = descriptor;
      },
    };
    const visitor = rule.create(context);
    const node = {
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        object: { type: 'NewExpression' },
        property: { type: 'Identifier', name: 'toLocaleString' },
        computed: false,
      },
      arguments: [],
    };
    visitor.CallExpression(node);
    expect(reported).toBeNull();
  });

  it('does NOT report inside test files (allowed for fixtures)', () => {
    let reported = null;
    const context = {
      getFilename: () => '/repo/frontend/src/features/timestamps/Surface.test.tsx',
      report: (descriptor) => {
        reported = descriptor;
      },
    };
    const visitor = rule.create(context);
    const node = {
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        object: { type: 'NewExpression' },
        property: { type: 'Identifier', name: 'toLocaleString' },
        computed: false,
      },
      arguments: [],
    };
    visitor.CallExpression(node);
    expect(reported).toBeNull();
  });
});
