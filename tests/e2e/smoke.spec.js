import { test, expect } from '@playwright/test';
import { ALL_PUBLIC_UNIQUE } from './routes.js';

/**
 * Routing smoke test — visits every public route and asserts the page is
 * healthy. This is what catches regressions like the 404 page rendering raw
 * i18n keys ("notFound.title"), a route silently 404-ing, or a page that
 * crashes on load.
 *
 * Notes:
 * - We assert on UNCAUGHT exceptions (pageerror), not console.error — console
 *   noise from the optional local API backend (CORS on :5000) and React dev
 *   warnings is environmental and would make the suite flaky.
 * - We wait for network-idle so lazy i18n namespaces finish loading before
 *   checking for raw translation keys.
 */
for (const path of ALL_PUBLIC_UNIQUE) {
  test(`smoke: ${path}`, async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
    expect(response, `no response for ${path}`).toBeTruthy();

    // Wait for hydration; then a short settle for lazy i18n namespaces/data.
    // (networkidle is avoided — live-data pages poll continuously and never idle.)
    await page.waitForFunction(() => document.body.innerText.trim().length > 150, { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(1200);

    const body = await page.locator('body').innerText();

    // No untranslated i18n keys leaking to the UI (e.g. "notFound.title").
    expect(body, `raw i18n keys visible on ${path}`).not.toMatch(/\b(notFound|hero|navbar|quickAccess|common|footer)\.[a-zA-Z.]+\b/);

    // Valid routes should not render the NotFound page.
    expect(body, `unexpected 404 page on ${path}`).not.toContain('Page Not Found');

    // Page rendered meaningful content.
    expect(body.trim().length, `empty page at ${path}`).toBeGreaterThan(150);

    // No uncaught JS exceptions (a real crash), ignoring known benign ones.
    const fatal = pageErrors.filter((e) => !/ResizeObserver loop/i.test(e));
    expect(fatal, `uncaught errors on ${path}: ${fatal.join('; ')}`).toHaveLength(0);
  });
}

test('404 page shows translated copy, not raw keys', async ({ page }) => {
  await page.goto('/this-route-does-not-exist-zzz', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => /not found/i.test(document.body.innerText), { timeout: 15000 }).catch(() => {});
  const body = await page.locator('body').innerText();
  expect(body).not.toMatch(/notFound\./);
  expect(body.toLowerCase()).toContain('not found');
});
