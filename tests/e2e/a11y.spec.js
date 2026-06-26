import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { KEY_PAGES } from './routes.js';

/**
 * Accessibility tests — runs axe-core (WCAG 2.0/2.1 A & AA) on each key page.
 * Fails on `serious` and `critical` violations. `moderate`/`minor` are reported
 * but don't fail the build (tighten over time as the backlog is cleared).
 */
for (const { path, name } of KEY_PAGES) {
  test(`a11y: ${name} (${path})`, async ({ page }, testInfo) => {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => {});

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const blocking = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical'
    );

    // Attach the full report for debugging in the HTML reporter.
    await testInfo.attach('axe-violations.json', {
      body: JSON.stringify(results.violations, null, 2),
      contentType: 'application/json',
    });

    const summary = blocking
      .map((v) => `${v.id} (${v.impact}) x${v.nodes.length}: ${v.help}`)
      .join('\n');

    expect(blocking, `Serious/critical a11y violations on ${name}:\n${summary}`).toEqual([]);
  });
}
