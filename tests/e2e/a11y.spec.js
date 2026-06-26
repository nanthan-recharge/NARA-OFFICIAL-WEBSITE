import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { KEY_PAGES } from './routes.js';

// Pages with live data / lazy sections can briefly render loading states; retry
// so transient states self-heal. A genuinely non-compliant element fails every
// attempt; a settle-timing flake passes on retry.
test.describe.configure({ retries: 2 });

/**
 * Accessibility tests — runs axe-core (WCAG 2.0/2.1 A & AA) on each key page.
 * Fails on `serious` and `critical` violations. `moderate`/`minor` are reported
 * but don't fail the build (tighten over time as the backlog is cleared).
 */
for (const { path, name } of KEY_PAGES) {
  test(`a11y: ${name} (${path})`, async ({ page }, testInfo) => {
    // Pre-dismiss the cookie consent banner (a transient overlay — a returning
    // user has dismissed it). Its semi-transparent backdrop otherwise confuses
    // axe's contrast computation. The banner has its own coverage, not here.
    await page.addInitScript(() => {
      try {
        localStorage.setItem('nara-cookie-consent', JSON.stringify({ necessary: true, analytics: false, ts: 0 }));
      } catch (e) {}
    });
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    // Wait for hydration, then scroll through so lazy/whileInView sections render
    // and loading skeletons resolve before scanning. (networkidle is avoided —
    // live-data pages poll forever and never idle, which made this flaky.)
    await page.waitForFunction(() => document.body.innerText.trim().length > 150, { timeout: 15000 }).catch(() => {});
    await page.evaluate(async () => {
      const step = window.innerHeight;
      for (let y = 0; y <= document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 150));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1200);

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
