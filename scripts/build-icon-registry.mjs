#!/usr/bin/env node
/**
 * Generates src/components/iconRegistry.js — a curated map of ONLY the lucide-react
 * icons the app actually references. AppIcon renders icons by string name; importing
 * all 5,295 lucide icons defeats tree-shaking, so we harvest the used set instead.
 *
 * Harvest sources (a safe superset — extra icons are harmless, missing ones break):
 *   - <Icon name="X" /> literal props
 *   - Icons.X / LucideIcons.X member accesses
 *   - any quoted PascalCase string anywhere in src/ that is a real lucide export
 *
 * Run:  node scripts/build-icon-registry.mjs
 */
import { promises as fs } from 'fs';
import path from 'path';
import * as Lucide from 'lucide-react';

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'src');
const OUT = path.join(SRC, 'components', 'iconRegistry.js');
const SKIP = new Set(['default', 'icons', 'createLucideIcon', 'Icon', 'LucideIcon']);

async function walk(dir, out = []) {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walk(full, out);
    else if (/\.(jsx?|tsx?)$/.test(e.name)) out.push(full);
  }
  return out;
}

const candidates = new Set();
const patterns = [
  /['"]([A-Z][A-Za-z0-9]+)['"]/g,                       // quoted PascalCase
  /\b(?:LucideIcons|Icons|LucideIcon)\.([A-Z][A-Za-z0-9]+)/g, // member access
  /name="([A-Z][A-Za-z0-9]+)"/g,                        // literal name prop
];

for (const file of await walk(SRC)) {
  const text = await fs.readFile(file, 'utf8');
  for (const re of patterns) {
    let m;
    while ((m = re.exec(text)) !== null) candidates.add(m[1]);
  }
}

const used = [...candidates].filter(n => !SKIP.has(n) && typeof Lucide[n] !== 'undefined' && /^[A-Z]/.test(n)).sort();

const body =
`/**
 * Curated Lucide icon registry (AUTO-GENERATED — run: node scripts/build-icon-registry.mjs).
 *
 * AppIcon renders icons by string name. Importing the whole lucide-react library
 * (5,295 icons) defeats tree-shaking. This registry imports ONLY the icons the
 * app actually references, shrinking the icons chunk dramatically.
 */
import {
${used.map(n => '  ' + n).join(',\n')}
} from "lucide-react";

export const ICON_REGISTRY = {
${used.map(n => '  ' + n).join(',\n')}
};

export default ICON_REGISTRY;
`;

await fs.writeFile(OUT, body);
console.log(`Wrote ${path.relative(ROOT, OUT)} with ${used.length} icons (of ${Object.keys(Lucide).length} available).`);
