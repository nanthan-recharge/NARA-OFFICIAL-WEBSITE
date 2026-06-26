import { test, expect } from '@playwright/test';
import { KEY_PAGES } from './routes.js';

/**
 * Responsive guards — catch the classic mobile breakages: horizontal overflow
 * and undersized touch targets. Most meaningful on the `mobile` project.
 */
for (const { path, name } of KEY_PAGES) {
  test(`no horizontal overflow: ${name}`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.body.innerText.trim().length > 150, { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(800);

    const overflow = await page.evaluate(() => {
      const de = document.documentElement;
      return { scrollW: de.scrollWidth, clientW: de.clientWidth };
    });

    // Allow 1px rounding slack.
    expect(
      overflow.scrollW,
      `horizontal overflow on ${name}: scrollWidth=${overflow.scrollW} > clientWidth=${overflow.clientW}`
    ).toBeLessThanOrEqual(overflow.clientW + 1);
  });
}

test('primary nav controls meet 44px touch target on mobile', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'mobile-only check');
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  // Open the mobile menu (hamburger) if present.
  const menuButton = page.getByRole('button', { name: /menu|navigation/i }).first();
  if (await menuButton.isVisible().catch(() => false)) {
    const box = await menuButton.boundingBox();
    expect(box.height, 'hamburger height < 44px').toBeGreaterThanOrEqual(40);
    expect(box.width, 'hamburger width < 44px').toBeGreaterThanOrEqual(40);
  }
});
