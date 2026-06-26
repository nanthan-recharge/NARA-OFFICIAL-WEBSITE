import { test, expect } from '@playwright/test';
import { VISUAL_PAGES } from './routes.js';

/**
 * Visual regression — full-page screenshot of each key page, compared against a
 * committed baseline. Runs on both the `desktop` and `mobile` projects, so the
 * same test guards layout on phones and large screens.
 *
 * First run (or intentional UI change): regenerate baselines with
 *   npm run test:visual:update
 * Baselines live in tests/e2e/visual.spec.js-snapshots/ — commit them.
 */
for (const { path, name } of VISUAL_PAGES) {
  test(`visual: ${name}`, async ({ page }) => {
    // Reduce motion so framer-motion whileInView elements settle to a stable state.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    // Pre-dismiss the cookie banner deterministically so baselines are stable.
    await page.addInitScript(() => {
      try {
        localStorage.setItem('nara-cookie-consent', JSON.stringify({ necessary: true, analytics: false, ts: 0 }));
      } catch (e) {}
    });
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.body.innerText.trim().length > 150, { timeout: 15000 }).catch(() => {});

    // Scroll through the page to trigger lazy images + whileInView reveals, then
    // return to top — so the full-page shot captures final, settled content.
    await page.evaluate(async () => {
      const step = window.innerHeight;
      for (let y = 0; y <= document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });
}
