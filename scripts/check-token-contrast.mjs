import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../tokens/core.css', import.meta.url), 'utf8');

function declarationsFor(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\n\\}`, 'm'));
  if (!match) throw new Error(`Missing block: ${selector}`);
  return parseDecls(match[1]);
}

function parseDecls(block) {
  const tokens = {};
  for (const match of block.matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
    tokens[`--${match[1]}`] = match[2].trim();
  }
  return tokens;
}

const themes = {
  light: declarationsFor(':root'),
  dark: { ...declarationsFor(':root'), ...declarationsFor(':root[data-theme="dark"]') },
};

function resolve(value, tokens, seen = new Set()) {
  let out = value;
  for (let i = 0; i < 10; i += 1) {
    const next = out.replace(/var\((--[a-z0-9-]+)(?:,[^)]+)?\)/gi, (_, name) => {
      if (seen.has(name)) throw new Error(`Circular token reference: ${name}`);
      if (!tokens[name]) throw new Error(`Missing token reference: ${name}`);
      seen.add(name);
      return resolve(tokens[name], tokens, seen);
    });
    if (next === out) return out.trim();
    out = next;
  }
  throw new Error(`Could not resolve: ${value}`);
}

function hexToRgb(hex) {
  const m = hex.trim().match(/^#([0-9a-f]{6})$/i);
  if (!m) throw new Error(`Expected solid hex token, got: ${hex}`);
  const int = Number.parseInt(m[1], 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255].map((n) => n / 255);
}

function linear(c) {
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map(linear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(fg, bg) {
  const l1 = luminance(fg);
  const l2 = luminance(bg);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

const pairs = [
  ['--text-1', '--surface-0', 7],
  ['--text-1', '--surface-1', 7],
  ['--text-2', '--surface-0', 4.5],
  ['--text-2', '--surface-1', 4.5],
  ['--text-muted-strong', '--surface-muted', 4.5],
  ['--inverse-foreground', '--inverse-background', 7],
  ['--error-contrast', '--error', 4.5],
  ['--success-contrast', '--success', 4.5],
  ['--warning-contrast', '--warning', 4.5],
  ['--info-contrast', '--info', 4.5],
];

let failed = false;
for (const [themeName, tokens] of Object.entries(themes)) {
  for (const [fgToken, bgToken, min] of pairs) {
    const fg = resolve(tokens[fgToken], tokens);
    const bg = resolve(tokens[bgToken], tokens);
    const ratio = contrast(fg, bg);
    const ok = ratio >= min;
    console.log(`${ok ? '✓' : '✗'} ${themeName} ${fgToken} on ${bgToken}: ${ratio.toFixed(2)} (min ${min})`);
    if (!ok) failed = true;
  }
}

for (const token of ['--surface-glass', '--surface-glass-subtle']) {
  const light = themes.light[token];
  const dark = themes.dark[token];
  if (!/^rgba\([^,]+,[^,]+,[^,]+,\s*0\.(8[5-9]|9\d)\s*\)$/i.test(light) || !/^rgba\([^,]+,[^,]+,[^,]+,\s*0\.(8[5-9]|9\d)\s*\)$/i.test(dark)) {
    console.error(`✗ ${token} should be high-opacity rgba in both themes`);
    failed = true;
  }
}

if (failed) process.exit(1);
