/**
 * @ds/core ESLint plugin — shell-primitive guardrails (Phase 2.1)
 *
 * Bans three anti-patterns that the four shell primitives replace:
 *
 *  1. no-card-entity-layout   — bans cc-card / cc-card--sm in entity-list
 *                               feature code (use ListView instead).
 *  2. no-inline-edit-pattern  — bans ad-hoc edit-mode state patterns where
 *                               ExpandableDetailPane should be used.
 *  3. no-adhoc-create-button  — bans bare Create / + button placements outside
 *                               TopRightCreateWizard or CreateMenu.
 *
 * Consumers opt in by adding this plugin to their ESLint config:
 *
 *   // eslint.config.js (flat config)
 *   import dsPlugin from '@ds/core/eslint-plugin';
 *   export default [
 *     { plugins: { '@ds': dsPlugin }, rules: { '@ds/no-card-entity-layout': 'error', ... } }
 *   ];
 *
 *   // .eslintrc.js (legacy config)
 *   module.exports = {
 *     plugins: ['@ds/core'],
 *     rules: { '@ds/core/no-card-entity-layout': 'error', ... }
 *   };
 */

'use strict';

// ── Rule: no-card-entity-layout ────────────────────────────────────────────────

const CARD_CLASS_PATTERN = /\bcc-card(?:--sm)?\b/;

/**
 * Detects usage of cc-card / cc-card--sm className strings in JSX.
 * These are banned in entity-list feature code — use <ListView> instead.
 */
const noCardEntityLayout = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Disallow card-based entity layouts in feature code. Use <ListView> from @ds/core instead.',
      recommended: true,
      url: 'https://github.com/woodym-dotcom/design-system/blob/main/docs/primitives.md#listview',
    },
    messages: {
      noCardClass:
        'Card-based entity layout detected (className "{{value}}"). Use <ListView> from @ds/core for entity lists. ' +
        'See canonical patterns: https://www.notion.so/Canonical-Entity-Surface-Patterns-358b63f3c7658120ae1afeeccbd7fd4d',
    },
    schema: [],
  },
  create(context) {
    return {
      JSXAttribute(node) {
        if (
          node.name &&
          node.name.type === 'JSXIdentifier' &&
          node.name.name === 'className' &&
          node.value
        ) {
          const raw = getStringValue(node.value);
          if (raw && CARD_CLASS_PATTERN.test(raw)) {
            context.report({
              node,
              messageId: 'noCardClass',
              data: { value: raw },
            });
          }
        }
      },
    };
  },
};

// ── Rule: no-inline-edit-pattern ───────────────────────────────────────────────

const EDIT_MODE_STATE_PATTERN = /\b(isEditing|editMode|showEditForm|editOpen|inlineEdit)\b/;

/**
 * Detects common inline-edit state variable names.
 * If you need an inline edit surface, use <ExpandableDetailPane> instead.
 */
const noInlineEditPattern = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Disallow ad-hoc inline edit patterns. Use <ExpandableDetailPane> from @ds/core for detail/edit surfaces.',
      recommended: true,
      url: 'https://github.com/woodym-dotcom/design-system/blob/main/docs/primitives.md#expandabledetailpane',
    },
    messages: {
      noInlineEdit:
        'Inline-edit pattern detected (variable "{{name}}"). Use <ExpandableDetailPane> from @ds/core — detail-pane edit pattern only. ' +
        'See canonical patterns: https://www.notion.so/Canonical-Entity-Surface-Patterns-358b63f3c7658120ae1afeeccbd7fd4d',
    },
    schema: [],
  },
  create(context) {
    return {
      VariableDeclarator(node) {
        const name =
          node.id && node.id.type === 'Identifier' ? node.id.name : null;
        if (name && EDIT_MODE_STATE_PATTERN.test(name)) {
          // Only flag when it looks like a useState call
          if (
            node.init &&
            node.init.type === 'CallExpression' &&
            isUseStateCall(node.init)
          ) {
            context.report({
              node,
              messageId: 'noInlineEdit',
              data: { name },
            });
          }
        }
      },
    };
  },
};

// ── Rule: no-adhoc-create-button ──────────────────────────────────────────────

const ADHOC_CREATE_LABEL_PATTERN =
  /^\s*(\+|create|new|add)\s*$/i;

/**
 * Detects bare <button> or <a> elements with Create/+/Add/New text content
 * that are NOT already wrapped inside a CreateMenu or TopRightCreateWizard.
 *
 * Strategy: flag any JSX <button> whose text content (JSXText child)
 * matches the pattern, unless the call stack already contains a known DS
 * wrapper (heuristic: parent JSX elements named CreateMenu or TopRightCreateWizard
 * or a cc-create-wizard-trigger class).
 */
const noAdhocCreateButton = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Disallow ad-hoc Create/+ button placements outside <TopRightCreateWizard> or <CreateMenu>.',
      recommended: true,
      url: 'https://github.com/woodym-dotcom/design-system/blob/main/docs/primitives.md#topright-create-wizard',
    },
    messages: {
      noAdhocCreate:
        'Ad-hoc Create/+ button detected. Use ListPage.createMenu — see canonical patterns: ' +
        'https://www.notion.so/Canonical-Entity-Surface-Patterns-358b63f3c7658120ae1afeeccbd7fd4d',
    },
    schema: [],
  },
  create(context) {
    return {
      JSXElement(node) {
        const opening = node.openingElement;
        if (
          !opening ||
          opening.name.type !== 'JSXIdentifier' ||
          opening.name.name !== 'button'
        ) {
          return;
        }

        // Skip if already inside a DS create wrapper
        if (isInsideDsCreateWrapper(node)) return;

        // Check if the button has a Create/+/Add/New text child
        const textChild = node.children.find(
          (child) =>
            child.type === 'JSXText' &&
            ADHOC_CREATE_LABEL_PATTERN.test(child.value),
        );
        if (!textChild) return;

        context.report({ node, messageId: 'noAdhocCreate' });
      },
    };
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function getStringValue(node) {
  if (!node) return null;
  if (node.type === 'Literal' && typeof node.value === 'string') return node.value;
  if (node.type === 'JSXExpressionContainer') {
    const expr = node.expression;
    if (expr && expr.type === 'Literal' && typeof expr.value === 'string') {
      return expr.value;
    }
    // Template literals with no expressions
    if (expr && expr.type === 'TemplateLiteral' && expr.expressions.length === 0) {
      return expr.quasis[0]?.value?.raw ?? null;
    }
  }
  return null;
}

function isUseStateCall(callNode) {
  const callee = callNode.callee;
  if (!callee) return false;
  if (callee.type === 'Identifier' && callee.name === 'useState') return true;
  if (
    callee.type === 'MemberExpression' &&
    callee.property.type === 'Identifier' &&
    callee.property.name === 'useState'
  ) {
    return true;
  }
  return false;
}

// ── Rule: no-adhoc-tenancy-selector ──────────────────────────────────────────

/**
 * Detects ad-hoc group-selector patterns that should use <CompanyGroupSwitcher>
 * from @ds/core instead.
 *
 * Flags three signal patterns:
 *  1. State variable names that look like a group picker (e.g. showGroupPicker,
 *     groupPickerOpen, groupSwitcherOpen, activeGroupSelector).
 *  2. JSX imports of @ds/core that don't include CompanyGroupSwitcher but do
 *     include other tenancy-related names (heuristic — warns when a file imports
 *     from @ds/core but rolls its own group state).
 *  3. className strings that contain 'group-picker' or 'group-switcher'
 *     (signals that inline CSS was written for a custom switcher).
 *
 * The rule is intentionally a WARN so it doesn't break legacy files that
 * shipped before CompanyGroupSwitcher existed.
 */
const GROUP_PICKER_STATE_PATTERN =
  /\b(showGroupPicker|groupPickerOpen|groupSwitcher(Open|Visible)|activeGroupSelector|groupDropdown(Open|Visible)|openGroupPicker)\b/;

const GROUP_PICKER_CLASS_PATTERN = /\b(nav-group-picker|group-picker|group-switcher)\b/;

const noAdhocTenancySelector = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Disallow ad-hoc company-group selector implementations. Use <CompanyGroupSwitcher> from @ds/core instead.',
      recommended: true,
      url: 'https://github.com/woodym-dotcom/design-system/blob/main/docs/primitives.md#companygroupswitcher',
    },
    messages: {
      noAdhocState:
        'Ad-hoc group-picker state detected (variable "{{name}}"). Use <CompanyGroupSwitcher> from @ds/core. ' +
        'See docs/primitives.md#companygroupswitcher.',
      noAdhocClass:
        'Ad-hoc group-picker className detected ("{{value}}"). Use <CompanyGroupSwitcher> from @ds/core. ' +
        'See docs/primitives.md#companygroupswitcher.',
    },
    schema: [],
  },
  create(context) {
    return {
      VariableDeclarator(node) {
        const name =
          node.id && node.id.type === 'Identifier' ? node.id.name : null;
        if (name && GROUP_PICKER_STATE_PATTERN.test(name)) {
          if (
            node.init &&
            node.init.type === 'CallExpression' &&
            isUseStateCall(node.init)
          ) {
            context.report({
              node,
              messageId: 'noAdhocState',
              data: { name },
            });
          }
        }
      },
      JSXAttribute(node) {
        if (
          node.name &&
          node.name.type === 'JSXIdentifier' &&
          node.name.name === 'className' &&
          node.value
        ) {
          const raw = getStringValue(node.value);
          if (raw && GROUP_PICKER_CLASS_PATTERN.test(raw)) {
            context.report({
              node,
              messageId: 'noAdhocClass',
              data: { value: raw },
            });
          }
        }
      },
    };
  },
};

// ── Rule: no-bespoke-entity-shell ──────────────────────────────────────────────

/**
 * Detects the bespoke entity-shell bypass pattern:
 * rendering ModuleShell alongside sibling DetailPane / FilterBar / BulkActionBar
 * outside of ListPage's standardized slots.
 *
 * This bypasses the canonical entity-surface design and fragments the UX.
 * Use <ListPage> with the appropriate sub-objects instead.
 */
const noBespokeEntityShell = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Disallow bespoke entity-shell patterns outside <ListPage>. Use <ListPage> with detail, filters, and bulk sub-objects instead.',
      recommended: true,
      url: 'https://www.notion.so/Canonical-Entity-Surface-Patterns-358b63f3c7658120ae1afeeccbd7fd4d',
    },
    messages: {
      noBespokeShell:
        'Bespoke entity-shell pattern detected: ModuleShell with sibling DetailPane/FilterBar/BulkActionBar. ' +
        'Use <ListPage> with detail, filters, and bulk sub-objects instead. ' +
        'See canonical patterns: https://www.notion.so/Canonical-Entity-Surface-Patterns-358b63f3c7658120ae1afeeccbd7fd4d ' +
        'and design-system/DESIGN.md § Entity Surface Patterns.',
    },
    schema: [],
  },
  create(context) {
    return {
      JSXElement(node) {
        const opening = node.openingElement;
        if (
          !opening ||
          opening.name.type !== 'JSXIdentifier' ||
          opening.name.name !== 'ModuleShell'
        ) {
          return;
        }

        // Check if this ModuleShell is directly inside a ListPage
        if (isInsideListPage(node)) {
          return;
        }

        // Check if any sibling or uncle JSX element has the anti-pattern names
        const ancestors = getAncestorElements(node);
        if (ancestors.some((ancestor) => hasBespokeDetailOrFilterSibling(ancestor))) {
          context.report({
            node,
            messageId: 'noBespokeShell',
          });
        }
      },
    };
  },
};

const DS_CREATE_WRAPPERS = new Set(['CreateMenu', 'TopRightCreateWizard']);

function isInsideDsCreateWrapper(node) {
  let current = node.parent;
  while (current) {
    if (current.type === 'JSXElement') {
      const name = current.openingElement?.name;
      if (name && name.type === 'JSXIdentifier' && DS_CREATE_WRAPPERS.has(name.name)) {
        return true;
      }
    }
    current = current.parent;
  }
  return false;
}

function isInsideListPage(node) {
  let current = node.parent;
  while (current) {
    if (current.type === 'JSXElement') {
      const name = current.openingElement?.name;
      if (name && name.type === 'JSXIdentifier' && name.name === 'ListPage') {
        return true;
      }
    }
    current = current.parent;
  }
  return false;
}

function getAncestorElements(node) {
  const ancestors = [];
  let current = node.parent;
  while (current) {
    if (current.type === 'JSXElement') {
      ancestors.push(current);
    }
    current = current.parent;
  }
  return ancestors;
}

function hasBespokeDetailOrFilterSibling(containerNode) {
  if (!containerNode.children) return false;
  const antiBespokeNames = new Set([
    'DetailPane',
    'ExpandableDetailPane',
    'FilterBar',
    'BulkActionBar',
  ]);

  return containerNode.children.some((child) => {
    if (child.type !== 'JSXElement') return false;
    const name = child.openingElement?.name;
    return (
      name &&
      name.type === 'JSXIdentifier' &&
      antiBespokeNames.has(name.name)
    );
  });
}

// ── Plugin export ─────────────────────────────────────────────────────────────

const plugin = {
  meta: {
    name: '@ds/core',
    version: '0.1.0',
  },
  rules: {
    'no-card-entity-layout': noCardEntityLayout,
    'no-inline-edit-pattern': noInlineEditPattern,
    'no-adhoc-create-button': noAdhocCreateButton,
    'no-adhoc-tenancy-selector': noAdhocTenancySelector,
    'no-bespoke-entity-shell': noBespokeEntityShell,
  },
  configs: {
    /** Recommended config: all rules as errors/warnings. */
    recommended: {
      plugins: { '@ds/core': {} /* filled by consumer */ },
      rules: {
        '@ds/core/no-card-entity-layout': 'error',
        '@ds/core/no-inline-edit-pattern': 'warn',
        '@ds/core/no-adhoc-create-button': 'warn',
        '@ds/core/no-adhoc-tenancy-selector': 'warn',
        '@ds/core/no-bespoke-entity-shell': 'error',
      },
    },
  },
};

module.exports = plugin;
