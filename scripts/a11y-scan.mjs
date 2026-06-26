#!/usr/bin/env node
/**
 * Detailed single-page axe scan for debugging WCAG violations.
 * Usage: node scripts/a11y-scan.mjs <path>   (e.g. /library)
 * Requires the dev server running on :4028.
 * Prints each serious/critical violation with rule id, the failing selector,
 * the contrast colours / reason, and an HTML snippet to locate it in source.
 */
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const path = process.argv[2] || '/';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();
await page.goto('http://localhost:4028' + path, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForFunction(() => document.body.innerText.trim().length > 150, { timeout: 15000 }).catch(() => {});
await page.waitForTimeout(1500);

const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
const blocking = r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');

console.log(`PATH ${path} — ${blocking.length} serious/critical rules, ${blocking.reduce((s, v) => s + v.nodes.length, 0)} nodes`);
for (const v of blocking) {
  console.log(`\n## ${v.id} (${v.impact}) — ${v.nodes.length} nodes — ${v.help}`);
  for (const n of v.nodes) {
    const msg = (n.any[0] && n.any[0].message) || (n.all[0] && n.all[0].message) || '';
    console.log('  selector:', JSON.stringify(n.target));
    console.log('  reason  :', msg.replace(/\s+/g, ' ').slice(0, 200));
    console.log('  html    :', n.html.replace(/\s+/g, ' ').slice(0, 200));
  }
}
console.log(`\nRESULT: ${blocking.length === 0 ? 'CLEAN' : 'HAS_VIOLATIONS'}`);
await browser.close();
