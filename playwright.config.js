import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for NARA — visual regression, accessibility (axe),
 * routing smoke and responsive checks.
 *
 * Run:
 *   npm run test:e2e            # all tests (headless)
 *   npm run test:e2e:ui        # interactive UI mode
 *   npm run test:visual:update # (re)generate visual baselines
 *
 * The dev server (port 4028) is started automatically via `webServer` below.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],
  timeout: 45_000,
  expect: {
    timeout: 10_000,
    // Tolerate tiny anti-aliasing diffs so visual tests aren't flaky.
    toHaveScreenshot: { maxDiffPixelRatio: 0.02, animations: 'disabled' },
  },
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:4028',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'npm start',
    url: 'http://localhost:4028',
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
});
